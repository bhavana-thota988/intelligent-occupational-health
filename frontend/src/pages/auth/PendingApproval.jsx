import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Clock, ShieldAlert, ArrowLeft, Mail, Building, User } from "lucide-react";

export default function PendingApproval() {
  const location = useLocation();
  const user = location.state?.user || {};

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
          maxWidth: "500px",
          padding: "40px 32px",
          background: "#FFFFFF",
          borderRadius: "12px",
          boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.08)",
          border: "1px solid #E2E8F0",
          textAlign: "center"
        }}
      >
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            background: "#FEF3C7",
            color: "#D97706",
            display: "grid",
            placeItems: "center",
            margin: "0 auto 20px",
            boxShadow: "0 4px 12px rgba(217, 119, 6, 0.18)"
          }}
        >
          <Clock size={32} />
        </div>

        <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#0F172A", margin: "0 0 10px 0" }}>
          Registration Awaiting Approval
        </h1>

        <p style={{ fontSize: "14px", color: "#64748B", lineHeight: 1.6, marginBottom: "24px" }}>
          Your email address has been successfully verified. In accordance with organizational occupational health compliance policies, new profiles must be authorized by the Health Directorate Administrator prior to portal access.
        </p>

        {user.email && (
          <div
            style={{
              background: "#F8FAFC",
              border: "1px solid #E2E8F0",
              borderRadius: "8px",
              padding: "16px",
              textAlign: "left",
              marginBottom: "24px",
              fontSize: "13px"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, color: "#334155" }}>
              <User size={15} color="#0D9488" /> <strong>Name:</strong> {user.name || "Employee"}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, color: "#334155" }}>
              <Mail size={15} color="#0D9488" /> <strong>Email:</strong> {user.email}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#334155" }}>
              <ShieldAlert size={15} color="#D97706" /> <strong>Status:</strong> <span style={{ color: "#D97706", fontWeight: 700 }}>Pending Directorate Review</span>
            </div>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Link
            to="/login"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: "11px 20px",
              backgroundColor: "#0F766E",
              color: "#FFFFFF",
              borderRadius: "8px",
              textDecoration: "none",
              fontSize: "13.5px",
              fontWeight: 700
            }}
          >
            <ArrowLeft size={16} /> Return to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
