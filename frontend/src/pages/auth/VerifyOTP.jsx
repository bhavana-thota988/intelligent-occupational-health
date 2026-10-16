import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  RotateCcw,
  ArrowRight,
  Mail,
  Info
} from "lucide-react";
import { authService, getDashboardPathForRole } from "../../services/authService";

export default function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract email & purpose from URL query or navigation state
  const queryParams = new URLSearchParams(location.search);
  const initialEmail = location.state?.email || queryParams.get("email") || "";
  const initialPurpose = location.state?.purpose || queryParams.get("purpose") || "email_verification";
  const initialWarning = location.state?.warning || "";

  const [email, setEmail] = useState(initialEmail);
  const [purpose, setPurpose] = useState(initialPurpose);
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [notice, setNotice] = useState(initialWarning);

  // 5-minute expiry countdown (300 seconds)
  const [expirySeconds, setExpirySeconds] = useState(300);
  // 60-second resend cooldown
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  const inputRefs = useRef([]);

  // Expiry timer
  useEffect(() => {
    if (expirySeconds <= 0) return;
    const timer = setInterval(() => {
      setExpirySeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [expirySeconds]);

  // Resend cooldown timer
  useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const cooldownTimer = setInterval(() => {
      setCooldownSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(cooldownTimer);
  }, [cooldownSeconds]);

  // Handle individual digit input
  const handleDigitChange = (index, value) => {
    const cleanVal = value.replace(/\D/g, "");
    if (!cleanVal) {
      const newDigits = [...otpDigits];
      newDigits[index] = "";
      setOtpDigits(newDigits);
      return;
    }

    const lastChar = cleanVal.slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = lastChar;
    setOtpDigits(newDigits);

    // Auto-advance to next input
    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle keyboard navigation (Backspace & Arrows)
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle clipboard paste of full 6-digit code
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pastedData) {
      const newDigits = [...otpDigits];
      for (let i = 0; i < pastedData.length; i++) {
        newDigits[i] = pastedData[i];
      }
      setOtpDigits(newDigits);
      const nextFocus = Math.min(pastedData.length, 5);
      inputRefs.current[nextFocus]?.focus();
    }
  };

  const fullOtpCode = otpDigits.join("");

  const handleVerify = async (e) => {
    e?.preventDefault();
    setError("");

    if (!email || !email.includes("@")) {
      setError("Please provide a valid email address.");
      return;
    }

    if (fullOtpCode.length !== 6) {
      setError("Please enter the complete 6-digit verification code.");
      return;
    }

    if (expirySeconds <= 0) {
      setError("This verification code has expired. Please request a new code.");
      return;
    }

    setLoading(true);
    try {
      const result = await authService.verifyOtp(email, fullOtpCode, purpose);
      setSuccess(true);

      setTimeout(() => {
        if (result.status === "pending_approval") {
          navigate("/pending-approval", { state: { user: result.user } });
        } else if (result.user?.role) {
          navigate(getDashboardPathForRole(result.user.role));
        } else {
          navigate("/login");
        }
      }, 1600);
    } catch (err) {
      setError(err.message || "Invalid verification code. Please check your inbox and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldownSeconds > 0) return;
    setError("");
    setNotice("");
    setLoading(true);

    try {
      const res = await authService.resendOtp(email, purpose);
      setCooldownSeconds(60);
      setExpirySeconds(300);
      setOtpDigits(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();

      if (res.warning) {
        setNotice(res.warning);
      } else {
        setNotice(`A fresh verification code has been dispatched to ${email}.`);
      }
    } catch (err) {
      setError(err.message || "Failed to resend verification code.");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${rem.toString().padStart(2, "0")}`;
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F8FAFC",
        padding: "24px",
        fontFamily: "'Manrope', -apple-system, BlinkMacSystemFont, sans-serif"
      }}
    >
      <div
        className="corporate-card animate-scale-in"
        style={{
          width: "100%",
          maxWidth: "480px",
          padding: "36px 32px",
          background: "#FFFFFF",
          borderRadius: "12px",
          boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)",
          border: "1px solid #E2E8F0"
        }}
      >
        {success ? (
          <div style={{ textAlign: "center", padding: "16px 8px" }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "#CCFBF1",
                color: "#0F766E",
                display: "grid",
                placeItems: "center",
                margin: "0 auto 20px",
                boxShadow: "0 4px 12px rgba(15, 118, 110, 0.2)"
              }}
            >
              <CheckCircle2 size={36} />
            </div>
            <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#0F172A", marginBottom: "8px" }}>
              Email Verified Successfully
            </h2>
            <p style={{ fontSize: "14px", color: "#64748B", lineHeight: 1.6, marginBottom: "24px" }}>
              Your email ownership has been cryptographically confirmed. Redirecting to your secure operational workspace...
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: 6, alignItems: "center", color: "#0D9488", fontSize: "13px", fontWeight: 600 }}>
              <Clock size={16} className="animate-spin" /> Finalizing session credentials...
            </div>
          </div>
        ) : (
          <div>
            {/* Header Icon & Title */}
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "12px",
                  background: "#0F766E",
                  color: "#FFFFFF",
                  display: "grid",
                  placeItems: "center",
                  margin: "0 auto 16px",
                  boxShadow: "0 4px 12px rgba(15, 118, 110, 0.25)"
                }}
              >
                <ShieldCheck size={26} />
              </div>
              <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#0F172A", margin: "0 0 6px 0", letterSpacing: "-0.02em" }}>
                Verify Your Email
              </h1>
              <p style={{ fontSize: "13.5px", color: "#64748B", margin: 0, lineHeight: 1.5 }}>
                Enter the 6-digit verification code dispatched to your inbox:
              </p>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  marginTop: 10,
                  padding: "4px 12px",
                  background: "#F1F5F9",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#0F172A"
                }}
              >
                <Mail size={14} color="#0F766E" /> {email || "your-email@domain.com"}
              </div>
            </div>

            {/* Notice / Warning banner if SMTP unconfigured */}
            {notice && (
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  padding: "12px 14px",
                  backgroundColor: "#FEF3C7",
                  border: "1px solid #FCD34D",
                  borderRadius: "8px",
                  fontSize: "12.5px",
                  color: "#92400E",
                  lineHeight: 1.5,
                  marginBottom: 20
                }}
              >
                <Info size={16} style={{ flexShrink: 0, marginTop: 2, color: "#D97706" }} />
                <span>{notice}</span>
              </div>
            )}

            {/* Error Banner */}
            {error && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "12px 14px",
                  backgroundColor: "#FEF2F2",
                  border: "1px solid #FECACA",
                  borderRadius: "8px",
                  fontSize: "13px",
                  color: "#991B1B",
                  marginBottom: 20
                }}
              >
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            {/* 6-Digit Code Inputs */}
            <form onSubmit={handleVerify}>
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12, textAlign: "center" }}>
                  Six-Digit Verification Code
                </label>
                <div style={{ display: "flex", justifyContent: "center", gap: "10px" }} onPaste={handlePaste}>
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => (inputRefs.current[idx] = el)}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      autoFocus={idx === 0}
                      style={{
                        width: "48px",
                        height: "56px",
                        fontSize: "24px",
                        fontWeight: 700,
                        textAlign: "center",
                        borderRadius: "8px",
                        border: digit ? "2px solid #0F766E" : "1.5px solid #CBD5E1",
                        background: digit ? "#F0FDFA" : "#FFFFFF",
                        color: "#0F172A",
                        outline: "none",
                        transition: "all 0.15s ease",
                        boxShadow: digit ? "0 0 0 3px rgba(15, 118, 110, 0.1)" : "none"
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Expiry Timer & Resend Controls */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 14px",
                  backgroundColor: "#F8FAFC",
                  borderRadius: "8px",
                  border: "1px solid #E2E8F0",
                  marginBottom: "24px",
                  fontSize: "12.5px"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: expirySeconds < 60 ? "#DC2626" : "#475569" }}>
                  <Clock size={15} />
                  <span>
                    Expires in: <strong>{formatTime(expirySeconds)}</strong>
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleResend}
                  disabled={cooldownSeconds > 0 || loading}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    border: "none",
                    background: "none",
                    color: cooldownSeconds > 0 ? "#94A3B8" : "#0F766E",
                    fontWeight: 700,
                    cursor: cooldownSeconds > 0 ? "not-allowed" : "pointer",
                    fontSize: "12.5px",
                    padding: 0
                  }}
                >
                  <RotateCcw size={13} className={loading ? "animate-spin" : ""} />
                  {cooldownSeconds > 0 ? `Resend (${cooldownSeconds}s)` : "Resend Code"}
                </button>
              </div>

              {/* Verify Button */}
              <button
                type="submit"
                disabled={loading || fullOtpCode.length !== 6 || expirySeconds <= 0}
                style={{
                  width: "100%",
                  padding: "12px",
                  backgroundColor: fullOtpCode.length === 6 && expirySeconds > 0 ? "#0F766E" : "#94A3B8",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: 700,
                  cursor: fullOtpCode.length === 6 && expirySeconds > 0 ? "pointer" : "not-allowed",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  transition: "background-color 0.2s ease"
                }}
              >
                {loading ? "Verifying Token..." : "Verify & Activate Account"}
                <ArrowRight size={16} />
              </button>
            </form>

            {/* Back link */}
            <div style={{ marginTop: "24px", textAlign: "center" }}>
              <Link
                to="/login"
                style={{
                  fontSize: "13px",
                  color: "#64748B",
                  textDecoration: "none",
                  fontWeight: 600
                }}
              >
                ← Return to Sign In
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
