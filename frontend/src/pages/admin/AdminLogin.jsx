import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ShieldCheck, Lock, Mail, AlertCircle, ArrowRight, CheckCircle2 } from "lucide-react";
import { authService } from "../../services/authService";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@company.com");
  const [password, setPassword] = useState("Corporate2026!");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid administrator email address.");
      return;
    }
    if (!password || password.trim() === "") {
      setError("Password cannot be blank.");
      return;
    }

    setLoading(true);
    try {
      const result = await authService.login(email, password, "admin");
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message || "Invalid administrator credentials.");
    } finally {
      setLoading(false);
    }
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
          maxWidth: "440px",
          padding: "36px 32px",
          background: "#FFFFFF",
          borderRadius: "12px",
          boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)",
          border: "1px solid #E2E8F0"
        }}
      >
        {/* Header Icon & Title */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
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
            Public Health Admin Portal
          </h1>
          <p style={{ fontSize: "13.5px", color: "#64748B", margin: 0 }}>
            Enterprise public health awareness, campaigns & resource administration
          </p>
        </div>

        {error && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 14px",
              borderRadius: "8px",
              backgroundColor: "#FEF2F2",
              border: "1px solid #FECACA",
              color: "#B91C1C",
              fontSize: "13px",
              marginBottom: 18
            }}
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "#1E293B", marginBottom: 6 }}>
              Administrator Email
            </label>
            <div style={{ position: "relative" }}>
              <Mail size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@company.com"
                required
                style={{
                  width: "100%",
                  padding: "10px 14px 10px 38px",
                  borderRadius: "8px",
                  border: "1px solid #CBD5E1",
                  fontSize: "13.5px",
                  color: "#0F172A",
                  outline: "none",
                  backgroundColor: "#FFFFFF"
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "#1E293B", marginBottom: 6 }}>
              Security Password
            </label>
            <div style={{ position: "relative" }}>
              <Lock size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                style={{
                  width: "100%",
                  padding: "10px 14px 10px 38px",
                  borderRadius: "8px",
                  border: "1px solid #CBD5E1",
                  fontSize: "13.5px",
                  color: "#0F172A",
                  outline: "none",
                  backgroundColor: "#FFFFFF"
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 6,
              padding: "11px 20px",
              borderRadius: "8px",
              backgroundColor: "#0F766E",
              color: "#FFFFFF",
              border: "none",
              fontSize: "14px",
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              boxShadow: "0 4px 12px rgba(15, 118, 110, 0.2)",
              transition: "all 0.15s ease"
            }}
          >
            <span>{loading ? "Authenticating..." : "Sign In to Admin Portal"}</span>
            <ArrowRight size={16} />
          </button>

          {/* Instant 1-Click Demo Admin Login */}
          <button
            type="button"
            onClick={async () => {
              setLoading(true);
              try {
                await authService.login("admin@company.com", "Corporate2026!", "admin");
                navigate("/admin/dashboard");
              } catch (e) {
                setError(e.message);
              } finally {
                setLoading(false);
              }
            }}
            disabled={loading}
            style={{
              padding: "10px 18px",
              borderRadius: "8px",
              backgroundColor: "#F0FDFA",
              color: "#0F766E",
              border: "1.5px dashed #14B8A6",
              fontSize: "13px",
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              transition: "all 0.15s ease"
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#CCFBF1")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#F0FDFA")}
          >
            <span>⚡ Instant 1-Click Access as Public Health Admin</span>
          </button>
        </form>

        <div style={{ marginTop: 20, padding: "10px 14px", backgroundColor: "#F8FAFC", borderRadius: "8px", border: "1px solid #E2E8F0", textAlign: "center", fontSize: "11px", color: "#64748B" }}>
          <div style={{ fontWeight: 600, color: "#334155", marginBottom: 2 }}>National Public Health & Occupational Directorate</div>
          <div>Secured with RSA 4096-bit Encryption • Role-Enforced Gateway</div>
        </div>

        <div style={{ marginTop: 18, paddingTop: 14, borderTop: "1px solid #E2E8F0", textAlign: "center", fontSize: "12.5px", color: "#64748B" }}>
          <span>Switch to Workplace Portals? </span>
          <Link to="/login" style={{ color: "#0F766E", fontWeight: 700 }}>
            Employee & Trainer Login
          </Link>
        </div>
      </div>
    </div>
  );
}
