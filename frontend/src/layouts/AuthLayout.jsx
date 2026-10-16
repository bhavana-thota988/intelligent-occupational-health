import React from "react";
import { Outlet, Link } from "react-router-dom";
import { ShieldCheck, Activity, Award, CheckCircle2 } from "lucide-react";

export default function AuthLayout() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "1.05fr 1fr",
        backgroundColor: "var(--bg-main)",
      }}
      className="auth-layout-grid"
    >
      {/* Left Branding Column */}
      <div
        style={{
          background: "linear-gradient(160deg, #183533 0%, #147D75 100%)",
          color: "#FFFFFF",
          padding: "54px 60px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          overflow: "hidden",
        }}
        className="auth-brand-column"
      >
        <div>
          <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "10px",
                background: "#FFFFFF",
                color: "var(--color-primary)",
                display: "grid",
                placeItems: "center",
                fontWeight: 800,
                fontSize: "18px",
              }}
            >
              IO
            </div>
            <div>
              <strong style={{ fontSize: "16px", color: "#FFFFFF", display: "block" }}>
                Intelligent Occupational Health
              </strong>
              <span style={{ fontSize: "12px", color: "#C8E6DF", display: "block" }}>
                Workplace Health & Risk Management
              </span>
            </div>
          </Link>

          <div style={{ marginTop: "70px", maxWidth: "460px" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 12px",
                borderRadius: "20px",
                background: "rgba(255, 255, 255, 0.12)",
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.04em",
                marginBottom: "20px",
              }}
            >
              <ShieldCheck size={14} />
              ENTERPRISE OCCUPATIONAL HEALTH
            </div>

            <h1
              style={{
                fontSize: "36px",
                fontWeight: 800,
                color: "#FFFFFF",
                lineHeight: 1.15,
                marginBottom: "20px",
              }}
            >
              Proactive workplace risk screening & employee wellbeing.
            </h1>

            <p style={{ fontSize: "15px", color: "#D1E7E3", lineHeight: 1.6, marginBottom: "32px" }}>
              A unified corporate platform enabling employees to manage ergonomic, cognitive, and physical risk factors while providing leadership with privacy-preserving workplace health insights.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {[
                "16-Factor dynamic workplace risk assessment",
                "Personalized ergonomics & movement coaching programs",
                "Aggregated organizational analytics without medical exposure",
                "ISO 45001 & enterprise compliance readiness",
              ].map((feat, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      background: "rgba(255, 255, 255, 0.18)",
                      display: "grid",
                      placeItems: "center",
                      color: "#A7F3D0",
                      flexShrink: 0,
                    }}
                  >
                    <CheckCircle2 size={14} />
                  </div>
                  <span style={{ fontSize: "13.5px", color: "#E6F4F1" }}>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ paddingTop: "40px", borderTop: "1px solid rgba(255,255,255,0.15)", fontSize: "12px", color: "#A9C7C2" }}>
          © 2026 Intelligent Occupational Health. B.Tech Final Year Engineering Project.
        </div>
      </div>

      {/* Right Content Column */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 36px",
          background: "var(--bg-main)",
        }}
      >
        <div style={{ width: "100%", maxWidth: "460px" }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
