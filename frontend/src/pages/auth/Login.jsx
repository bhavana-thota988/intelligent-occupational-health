import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LogIn,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  User,
  Activity,
  HelpCircle,
  X
} from "lucide-react";
import { authService } from "../../services/authService";

export default function Login() {
  const navigate = useNavigate();
  const [selectedPortal, setSelectedPortal] = useState("employee"); // 'employee', 'trainer', 'admin'
  const [email, setEmail] = useState("employee@company.com");
  const [password, setPassword] = useState("Corporate2026!");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const portalConfigs = {
    employee: {
      title: "Employee Health Portal",
      description: "Sign in to screen workplace risks, track wellbeing sessions, and access your verified certificates.",
      demoEmail: "employee@company.com",
      demoRole: "Employee Workspace",
      icon: User
    },
    trainer: {
      title: "Trainer Coaching Console",
      description: "Sign in to review completed employee programs, provide structured feedback, and issue verified completion credentials.",
      demoEmail: "trainer@company.com",
      demoRole: "Trainer Workspace",
      icon: Activity
    },
    admin: {
      title: "Health Directorate Console",
      description: "Manage accredited occupational specialists, assign clinical pathways, oversee verifications, and audit workforce compliance.",
      demoEmail: "admin@company.com",
      demoRole: "Admin Directorate",
      icon: ShieldCheck
    }
  };

  const handlePortalSwitch = (portalKey) => {
    setSelectedPortal(portalKey);
    setEmail(portalConfigs[portalKey].demoEmail);
    setPassword("Corporate2026!");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !email.includes("@")) {
      setError("Please provide a valid corporate work email address.");
      return;
    }
    if (!password || password.trim() === "") {
      setError("Please enter your account password.");
      return;
    }

    setLoading(true);
    try {
      const result = await authService.login(email, password, selectedPortal);
      navigate(result.redirectPath);
    } catch (err) {
      setError(err.message || "Unable to authenticate. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const currentConfig = portalConfigs[selectedPortal];

  return (
    <div className="corporate-card" style={{ padding: "36px 32px" }}>
      {/* 3-Portal Selection Tabs (Employee, Trainer, Admin) */}
      <div style={{ marginBottom: "22px" }}>
        <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 8 }}>
          Select Operational Workspace
        </span>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, background: "#F3F8F6", padding: 4, borderRadius: 8 }}>
          {[
            { key: "employee", label: "Employee", icon: User },
            { key: "trainer", label: "Trainer", icon: Activity },
            { key: "admin", label: "Admin", icon: ShieldCheck }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = selectedPortal === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => handlePortalSwitch(tab.key)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  padding: "9px 8px",
                  borderRadius: 6,
                  border: "none",
                  background: isActive ? "#FFFFFF" : "transparent",
                  color: isActive ? "var(--color-primary)" : "var(--text-muted)",
                  fontWeight: isActive ? 700 : 500,
                  fontSize: "12.5px",
                  cursor: "pointer",
                  boxShadow: isActive ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                  transition: "all 0.15s ease"
                }}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ fontSize: "23px", fontWeight: 800, color: "var(--text-heading)", marginBottom: "4px" }}>
          {currentConfig.title}
        </h2>
        <p style={{ fontSize: "13.5px", color: "var(--text-muted)", margin: 0, lineHeight: 1.45 }}>
          {currentConfig.description}
        </p>
      </div>

      {error && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 14px",
            borderRadius: "8px",
            background: "#FDEEEE",
            border: "1px solid #F5C6C6",
            color: "#C93B3B",
            fontSize: "13px",
            marginBottom: "20px",
          }}
        >
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="email">
            Work Email Address
          </label>
          <input
            id="email"
            type="email"
            className="form-input"
            placeholder="e.g. name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <div className="form-group">
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <label className="form-label" htmlFor="password" style={{ margin: 0 }}>
              Password
            </label>
            <button
              type="button"
              onClick={() => setShowForgotModal(true)}
              style={{
                background: "none",
                border: "none",
                padding: 0,
                fontSize: "12px",
                color: "var(--color-primary)",
                cursor: "pointer",
                fontWeight: 600
              }}
            >
              Forgot password?
            </button>
          </div>
          <input
            id="password"
            type="password"
            className="form-input"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "22px" }}>
          <input
            id="rememberMe"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            style={{ width: "16px", height: "16px", accentColor: "var(--color-primary)", cursor: "pointer" }}
          />
          <label htmlFor="rememberMe" style={{ fontSize: "13px", color: "var(--text-body)", cursor: "pointer" }}>
            Keep me authenticated on this device
          </label>
        </div>

        <button
          type="submit"
          className="btn-primary"
          style={{ width: "100%", padding: "12px", fontSize: "14.5px" }}
          disabled={loading}
        >
          {loading ? "Authenticating..." : `Sign In to ${selectedPortal === "trainer" ? "Trainer Console" : selectedPortal === "admin" ? "Directorate Console" : "Employee Portal"}`}
          <ArrowRight size={16} />
        </button>
      </form>

      {/* Quick Role Fillers */}
      <div
        style={{
          marginTop: "22px",
          padding: "14px",
          borderRadius: "8px",
          background: "#F8FAF9",
          border: "1px dashed var(--border-subtle)",
        }}
      >
        <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 8, textTransform: "uppercase" }}>
          Sample Workspace Accounts
        </span>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {[
            { label: "Employee Account", role: "employee", email: "employee@company.com" },
            { label: "Trainer Account", role: "trainer", email: "trainer@company.com" },
            { label: "Admin Directorate", role: "admin", email: "admin@company.com" },
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => {
                setSelectedPortal(item.role);
                setEmail(item.email);
                setPassword("Corporate2026!");
                setError("");
              }}
              style={{
                fontSize: "12px",
                padding: "6px 12px",
                borderRadius: "5px",
                background: selectedPortal === item.role ? "var(--color-primary-light)" : "#FFFFFF",
                border: selectedPortal === item.role ? "1px solid var(--color-primary)" : "1px solid var(--border-subtle)",
                color: selectedPortal === item.role ? "var(--color-primary)" : "var(--text-body)",
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginTop: "22px", textAlign: "center", fontSize: "13px", color: "var(--text-muted)" }}>
        Need to register a new account?{" "}
        <Link to="/register" style={{ color: "var(--color-primary)", fontWeight: 700 }}>
          Register Account
        </Link>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(24, 53, 51, 0.5)",
            backdropFilter: "blur(2px)",
            display: "grid",
            placeItems: "center",
            zIndex: 999,
            padding: 16
          }}
          onClick={() => setShowForgotModal(false)}
        >
          <div
            className="corporate-card"
            style={{ maxWidth: 440, width: "100%", padding: 28 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <HelpCircle size={20} color="var(--color-primary)" />
                <h3 style={{ fontSize: "17px", fontWeight: 700, margin: 0 }}>Password Recovery</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}
              >
                <X size={18} />
              </button>
            </div>
            <p style={{ fontSize: "13.5px", color: "var(--text-body)", lineHeight: 1.6, marginBottom: 16 }}>
              Enterprise credentials can be reset through corporate IT authentication. For this demonstration environment, enter any non-empty password to log in.
            </p>
            <button
              type="button"
              className="btn-primary"
              style={{ width: "100%", padding: 10 }}
              onClick={() => setShowForgotModal(false)}
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
