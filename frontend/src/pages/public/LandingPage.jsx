import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  LogIn,
  UserPlus,
  ArrowRight,
  CheckCircle2,
  FileCheck2,
  Activity,
  Award,
  Stethoscope,
  Users,
  BarChart3,
  Lock,
  Sparkles,
  HeartPulse,
  ChevronRight,
  Check,
  ExternalLink,
  Shield,
  Clock,
  Eye,
  Sliders,
  Database
} from "lucide-react";

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState("employee");

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#F8FAFC",
        color: "#0F172A",
        fontFamily: "'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        overflowX: "hidden"
      }}
    >
      {/* =========================================================================
          1. ENTERPRISE TOP NAVIGATION
      ========================================================================= */}
      <header
        style={{
          height: "80px",
          padding: "0 6%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #E2E8F0",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          position: "sticky",
          top: 0,
          zIndex: 50
        }}
      >
        {/* Brand Identity */}
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            textDecoration: "none"
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "12px",
              background: "linear-gradient(135deg, #0F766E 0%, #0D9488 100%)",
              color: "#FFFFFF",
              display: "grid",
              placeItems: "center",
              boxShadow: "0 4px 14px rgba(15, 118, 110, 0.25)"
            }}
          >
            <ShieldCheck size={24} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span
                style={{
                  fontSize: "17px",
                  fontWeight: 800,
                  color: "#0F172A",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.2
                }}
              >
                WorkHealth <span style={{ color: "#0D9488" }}>AI</span>
              </span>
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  color: "#0D9488",
                  backgroundColor: "#CCFBF1",
                  padding: "2px 7px",
                  borderRadius: "12px",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase"
                }}
              >
                Clinical Enterprise
              </span>
            </div>
            <span
              style={{
                fontSize: "11px",
                color: "#64748B",
                display: "block",
                fontWeight: 600,
                letterSpacing: "0.01em",
                marginTop: 2
              }}
            >
              Intelligent Occupational Health & Risk Platform
            </span>
          </div>
        </Link>

        {/* Center Quick Nav Links */}
        <nav
          style={{
            display: "none",
            alignItems: "center",
            gap: 28,
            fontSize: "13.5px",
            fontWeight: 600,
            color: "#475569"
          }}
          className="desktop-nav"
        >
          <a
            href="#ecosystem"
            style={{ color: "#475569", textDecoration: "none", transition: "color 0.15s" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#0D9488")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#475569")}
          >
            Workspaces
          </a>
          <a
            href="#framework"
            style={{ color: "#475569", textDecoration: "none", transition: "color 0.15s" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#0D9488")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#475569")}
          >
            5-Axis Screening
          </a>
          <a
            href="#compliance"
            style={{ color: "#475569", textDecoration: "none", transition: "color 0.15s" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#0D9488")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#475569")}
          >
            ISO 45001 Compliance
          </a>
          <Link
            to="/verify"
            style={{
              color: "#0D9488",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 4
            }}
          >
            <FileCheck2 size={15} />
            <span>Verify Credential</span>
          </Link>
        </nav>

        {/* Action Gateways: Admin Directorate, Sign In, Get Started */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Link
            to="/admin/login"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 16px",
              fontSize: "13px",
              fontWeight: 700,
              color: "#0F766E",
              backgroundColor: "#F0FDFA",
              border: "1.5px solid #99F6E4",
              borderRadius: "8px",
              textDecoration: "none",
              transition: "all 0.2s ease",
              boxShadow: "0 1px 3px rgba(15, 118, 110, 0.05)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#CCFBF1";
              e.currentTarget.style.borderColor = "#0D9488";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#F0FDFA";
              e.currentTarget.style.borderColor = "#99F6E4";
            }}
          >
            <ShieldCheck size={16} color="#0D9488" />
            <span>Admin Portal</span>
          </Link>

          <Link
            to="/login"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              padding: "9px 18px",
              fontSize: "13.5px",
              fontWeight: 600,
              color: "#334155",
              backgroundColor: "#FFFFFF",
              border: "1.5px solid #CBD5E1",
              borderRadius: "8px",
              textDecoration: "none",
              transition: "all 0.15s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#F8FAFC";
              e.currentTarget.style.borderColor = "#0D9488";
              e.currentTarget.style.color = "#0D9488";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#FFFFFF";
              e.currentTarget.style.borderColor = "#CBD5E1";
              e.currentTarget.style.color = "#334155";
            }}
          >
            <LogIn size={15} />
            <span>Sign In</span>
          </Link>

          <Link
            to="/register"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "9px 20px",
              fontSize: "13.5px",
              fontWeight: 700,
              color: "#FFFFFF",
              backgroundColor: "#0F766E",
              border: "1.5px solid #0F766E",
              borderRadius: "8px",
              textDecoration: "none",
              transition: "all 0.2s ease",
              boxShadow: "0 4px 12px rgba(15, 118, 110, 0.22)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#115E59";
              e.currentTarget.style.borderColor = "#115E59";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#0F766E";
              e.currentTarget.style.borderColor = "#0F766E";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <UserPlus size={15} />
            <span>Create Account</span>
          </Link>
        </div>
      </header>

      {/* =========================================================================
          2. HERO SECTION — CLINICAL INTELLIGENCE CENTERPIECE
      ========================================================================= */}
      <section
        style={{
          position: "relative",
          padding: "70px 6% 60px",
          background: "linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 60%, #F1F5F9 100%)",
          borderBottom: "1px solid #E2E8F0"
        }}
      >
        <div style={{ maxWidth: "1240px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: 50, alignItems: "center" }}>
            
            {/* Left Column: Authoritative Copy & Direct Gateways */}
            <div>
              {/* Trust & Compliance Ticker Pill */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 16px",
                  borderRadius: "24px",
                  backgroundColor: "#F0FDFA",
                  border: "1px solid #99F6E4",
                  color: "#0F766E",
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  marginBottom: "22px"
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: "#10B981",
                    display: "inline-block",
                    boxShadow: "0 0 0 3px rgba(16, 185, 129, 0.2)"
                  }}
                />
                <span>ISO 45001 & OSHA Compliant • Clinical Triage Platform</span>
              </div>

              {/* Main Headline */}
              <h1
                style={{
                  fontSize: "clamp(34px, 3.8vw, 52px)",
                  fontWeight: 800,
                  color: "#0F172A",
                  lineHeight: 1.15,
                  letterSpacing: "-0.03em",
                  margin: "0 0 20px 0"
                }}
              >
                Intelligent Occupational Health & Enterprise Workplace Risk Management
              </h1>

              {/* Subtitle */}
              <p
                style={{
                  fontSize: "16px",
                  lineHeight: 1.65,
                  color: "#475569",
                  margin: "0 0 32px 0",
                  maxWidth: "620px"
                }}
              >
                A unified medical-grade platform uniting proactive employee screening, multidimensional 5-axis risk classification, accredited clinical specialist oversight, and executive health directorate analytics.
              </p>

              {/* CTA Action Buttons */}
              <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", marginBottom: "36px" }}>
                <Link
                  to="/register"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "14px 28px",
                    fontSize: "15px",
                    fontWeight: 700,
                    color: "#FFFFFF",
                    backgroundColor: "#0F766E",
                    borderRadius: "8px",
                    textDecoration: "none",
                    boxShadow: "0 6px 18px rgba(15, 118, 110, 0.28)",
                    transition: "all 0.2s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#115E59";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#0F766E";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <span>Start Health Screening</span>
                  <ArrowRight size={17} />
                </Link>

                <Link
                  to="/login"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "14px 24px",
                    fontSize: "15px",
                    fontWeight: 600,
                    color: "#1E293B",
                    backgroundColor: "#FFFFFF",
                    border: "1.5px solid #CBD5E1",
                    borderRadius: "8px",
                    textDecoration: "none",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
                    transition: "all 0.2s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#0D9488";
                    e.currentTarget.style.color = "#0D9488";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#CBD5E1";
                    e.currentTarget.style.color = "#1E293B";
                  }}
                >
                  <LogIn size={16} />
                  <span>Sign In to Portal</span>
                </Link>
              </div>

              {/* Verified Trust Badges */}
              <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap", fontSize: "12.5px", color: "#64748B", fontWeight: 600 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <CheckCircle2 size={16} color="#0D9488" />
                  <span>Real Email OTP Verified</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <CheckCircle2 size={16} color="#0D9488" />
                  <span>Cryptographic Signatures</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <CheckCircle2 size={16} color="#0D9488" />
                  <span>Role-Enforced RBAC</span>
                </div>
              </div>
            </div>

            {/* Right Column: Live Enterprise Dashboard Preview Card */}
            <div>
              <div
                style={{
                  background: "#FFFFFF",
                  borderRadius: "14px",
                  border: "1px solid #CBD5E1",
                  boxShadow: "0 20px 35px -10px rgba(15, 23, 42, 0.12), 0 1px 3px rgba(0,0,0,0.05)",
                  overflow: "hidden"
                }}
              >
                {/* Window Header */}
                <div
                  style={{
                    backgroundColor: "#0F172A",
                    padding: "14px 18px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottom: "1px solid #1E293B"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <span style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#EF4444" }} />
                      <span style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#F59E0B" }} />
                      <span style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#10B981" }} />
                    </div>
                    <span style={{ fontSize: "12px", color: "#94A3B8", fontWeight: 600, marginLeft: 6 }}>
                      Clinical Triage Terminal • WorkHealth Node 01
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: "11px",
                      color: "#2DD4BF",
                      fontWeight: 700,
                      backgroundColor: "rgba(45, 212, 191, 0.12)",
                      padding: "2px 8px",
                      borderRadius: "6px"
                    }}
                  >
                    ● Live Stream
                  </span>
                </div>

                {/* Card Body */}
                <div style={{ padding: "24px" }}>
                  {/* Top Score Summary Banner */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "16px 20px",
                      backgroundColor: "#F0FDFA",
                      border: "1px solid #CCFBF1",
                      borderRadius: "10px",
                      marginBottom: "20px"
                    }}
                  >
                    <div>
                      <span style={{ fontSize: "11px", fontWeight: 700, color: "#0F766E", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        Workforce Health Index
                      </span>
                      <div style={{ fontSize: "28px", fontWeight: 800, color: "#0F172A", lineHeight: 1.1, marginTop: 4 }}>
                        88.4 <span style={{ fontSize: "14px", color: "#64748B", fontWeight: 500 }}>/ 100</span>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "4px 10px",
                          borderRadius: "6px",
                          backgroundColor: "#D1FAE5",
                          color: "#065F46",
                          fontSize: "12px",
                          fontWeight: 700
                        }}
                      >
                        ✓ Low Risk Band
                      </span>
                      <span style={{ display: "block", fontSize: "11px", color: "#64748B", marginTop: 4 }}>
                        Screened via 5-Axis Triage
                      </span>
                    </div>
                  </div>

                  {/* 4 Clinical Dimension Indicators */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: "20px" }}>
                    <div style={{ padding: "12px", background: "#F8FAFC", borderRadius: "8px", border: "1px solid #E2E8F0" }}>
                      <span style={{ fontSize: "11px", color: "#64748B", fontWeight: 600 }}>Ergonomic Strain</span>
                      <div style={{ fontSize: "15px", fontWeight: 800, color: "#0F172A", marginTop: 2 }}>
                        94.2% <span style={{ fontSize: "11px", color: "#10B981" }}>Optimal</span>
                      </div>
                    </div>
                    <div style={{ padding: "12px", background: "#F8FAFC", borderRadius: "8px", border: "1px solid #E2E8F0" }}>
                      <span style={{ fontSize: "11px", color: "#64748B", fontWeight: 600 }}>Cardio / BP Check</span>
                      <div style={{ fontSize: "15px", fontWeight: 800, color: "#0F172A", marginTop: 2 }}>
                        118/76 <span style={{ fontSize: "11px", color: "#10B981" }}>Normal</span>
                      </div>
                    </div>
                    <div style={{ padding: "12px", background: "#F8FAFC", borderRadius: "8px", border: "1px solid #E2E8F0" }}>
                      <span style={{ fontSize: "11px", color: "#64748B", fontWeight: 600 }}>Cognitive Workload</span>
                      <div style={{ fontSize: "15px", fontWeight: 800, color: "#0F172A", marginTop: 2 }}>
                        Low <span style={{ fontSize: "11px", color: "#64748B" }}>(Balanced)</span>
                      </div>
                    </div>
                    <div style={{ padding: "12px", background: "#F8FAFC", borderRadius: "8px", border: "1px solid #E2E8F0" }}>
                      <span style={{ fontSize: "11px", color: "#64748B", fontWeight: 600 }}>Recovery Index</span>
                      <div style={{ fontSize: "15px", fontWeight: 800, color: "#0F172A", marginTop: 2 }}>
                        8.2 hrs <span style={{ fontSize: "11px", color: "#10B981" }}>Restored</span>
                      </div>
                    </div>
                  </div>

                  {/* Active Clinical Protocol Status */}
                  <div
                    style={{
                      padding: "14px 16px",
                      backgroundColor: "#F8FAFC",
                      borderRadius: "8px",
                      border: "1px dashed #CBD5E1",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      fontSize: "12.5px"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Stethoscope size={18} color="#0F766E" />
                      <div>
                        <strong style={{ color: "#0F172A", display: "block" }}>
                          Workday Mobility & Ergonomics Protocol
                        </strong>
                        <span style={{ color: "#64748B", fontSize: "11.5px" }}>
                          Lead Specialist: Dr. Sarah Jenkins (PT, CPE)
                        </span>
                      </div>
                    </div>
                    <span
                      style={{
                        padding: "3px 8px",
                        borderRadius: "4px",
                        backgroundColor: "#E0F2FE",
                        color: "#0369A1",
                        fontSize: "11px",
                        fontWeight: 700
                      }}
                    >
                      Module 4 of 5
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          3. KEY ENTERPRISE METRICS STRIP
      ========================================================================= */}
      <section
        style={{
          padding: "36px 6%",
          backgroundColor: "#0F172A",
          color: "#FFFFFF",
          borderBottom: "1px solid #1E293B"
        }}
      >
        <div style={{ maxWidth: "1240px", margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 30,
              textAlign: "center"
            }}
          >
            <div>
              <div style={{ fontSize: "36px", fontWeight: 800, color: "#2DD4BF", letterSpacing: "-0.03em" }}>
                94.6%
              </div>
              <div style={{ fontSize: "13.5px", fontWeight: 700, color: "#FFFFFF", marginTop: 4 }}>
                Early Ergonomic Risk Detection
              </div>
              <div style={{ fontSize: "12px", color: "#94A3B8", marginTop: 2 }}>
                Identifies postural slouch before injury onset
              </div>
            </div>

            <div>
              <div style={{ fontSize: "36px", fontWeight: 800, color: "#2DD4BF", letterSpacing: "-0.03em" }}>
                3.2x
              </div>
              <div style={{ fontSize: "13.5px", fontWeight: 700, color: "#FFFFFF", marginTop: 4 }}>
                Faster Clinical Intervention
              </div>
              <div style={{ fontSize: "12px", color: "#94A3B8", marginTop: 2 }}>
                Instant triaging to accredited specialists
              </div>
            </div>

            <div>
              <div style={{ fontSize: "36px", fontWeight: 800, color: "#2DD4BF", letterSpacing: "-0.03em" }}>
                100%
              </div>
              <div style={{ fontSize: "13.5px", fontWeight: 700, color: "#FFFFFF", marginTop: 4 }}>
                Audit-Ready ISO 45001
              </div>
              <div style={{ fontSize: "12px", color: "#94A3B8", marginTop: 2 }}>
                Immutable security logs & compliance trails
              </div>
            </div>

            <div>
              <div style={{ fontSize: "36px", fontWeight: 800, color: "#2DD4BF", letterSpacing: "-0.03em" }}>
                &lt; 5 Min
              </div>
              <div style={{ fontSize: "13.5px", fontWeight: 700, color: "#FFFFFF", marginTop: 4 }}>
                Screening-to-Pathway Flow
              </div>
              <div style={{ fontSize: "12px", color: "#94A3B8", marginTop: 2 }}>
                Evidence-based self-evaluation cadence
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. THREE WORKSPACES ECOSYSTEM (ROLE SEGREGATION)
      ========================================================================= */}
      <section
        id="ecosystem"
        style={{
          padding: "80px 6%",
          backgroundColor: "#FFFFFF",
          borderBottom: "1px solid #E2E8F0"
        }}
      >
        <div style={{ maxWidth: "1240px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <span
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "#0F766E",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                display: "block",
                marginBottom: 8
              }}
            >
              Enterprise Role Separation
            </span>
            <h2
              style={{
                fontSize: "clamp(26px, 3vw, 36px)",
                fontWeight: 800,
                color: "#0F172A",
                margin: "0 0 14px 0",
                letterSpacing: "-0.02em"
              }}
            >
              Three Tailored Operational Consoles
            </h2>
            <p style={{ fontSize: "15px", color: "#64748B", maxWidth: "680px", margin: "0 auto", lineHeight: 1.6 }}>
              Strict role-based access control guarantees clinical independence, employee privacy, and administrative oversight.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 28 }}>
            
            {/* Card 1: Employee Workspace */}
            <div
              style={{
                backgroundColor: "#F8FAFC",
                borderRadius: "12px",
                border: "1px solid #E2E8F0",
                padding: "32px 28px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#0D9488";
                e.currentTarget.style.boxShadow = "0 10px 25px -5px rgba(15, 23, 42, 0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#E2E8F0";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "10px",
                    backgroundColor: "#CCFBF1",
                    color: "#0F766E",
                    display: "grid",
                    placeItems: "center",
                    marginBottom: "20px"
                  }}
                >
                  <Activity size={24} />
                </div>
                <h3 style={{ fontSize: "19px", fontWeight: 800, color: "#0F172A", margin: "0 0 10px 0" }}>
                  Employee Health Portal
                </h3>
                <p style={{ fontSize: "13.5px", color: "#64748B", lineHeight: 1.6, margin: "0 0 20px 0" }}>
                  Empower your workforce with regular self-screening, personalized risk profiles, ergonomic micro-breaks, and verified completion credentials.
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px 0", fontSize: "13px", color: "#334155" }}>
                  {[
                    "5-Axis multidimensional risk questionnaire",
                    "Customized ergonomic routine assignments",
                    "Verifiable dynamic digital credentials",
                    "Private, HIPAA-aligned health profile"
                  ].map((feat, i) => (
                    <li key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <Check size={15} color="#0D9488" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                to="/register"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  padding: "11px 18px",
                  borderRadius: "6px",
                  backgroundColor: "#FFFFFF",
                  color: "#0F766E",
                  border: "1.5px solid #0F766E",
                  fontSize: "13.5px",
                  fontWeight: 700,
                  textDecoration: "none"
                }}
              >
                <span>Launch Employee Portal</span>
                <ArrowRight size={15} />
              </Link>
            </div>

            {/* Card 2: Trainer & Specialist Console */}
            <div
              style={{
                backgroundColor: "#F8FAFC",
                borderRadius: "12px",
                border: "1px solid #E2E8F0",
                padding: "32px 28px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#0D9488";
                e.currentTarget.style.boxShadow = "0 10px 25px -5px rgba(15, 23, 42, 0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#E2E8F0";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "10px",
                    backgroundColor: "#E0F2FE",
                    color: "#0284C7",
                    display: "grid",
                    placeItems: "center",
                    marginBottom: "20px"
                  }}
                >
                  <Stethoscope size={24} />
                </div>
                <h3 style={{ fontSize: "19px", fontWeight: 800, color: "#0F172A", margin: "0 0 10px 0" }}>
                  Trainer Coaching Console
                </h3>
                <p style={{ fontSize: "13.5px", color: "#64748B", lineHeight: 1.6, margin: "0 0 20px 0" }}>
                  Designed for accredited physical therapists, occupational coaches, and medical specialists to oversee clinical interventions.
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px 0", fontSize: "13px", color: "#334155" }}>
                  {[
                    "Clinical case reviews & milestone feedback",
                    "Assigned employee risk triage lists",
                    "Authorized certification issuance",
                    "Secure clinical session scheduling"
                  ].map((feat, i) => (
                    <li key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <Check size={15} color="#0284C7" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                to="/login"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  padding: "11px 18px",
                  borderRadius: "6px",
                  backgroundColor: "#FFFFFF",
                  color: "#0284C7",
                  border: "1.5px solid #0284C7",
                  fontSize: "13.5px",
                  fontWeight: 700,
                  textDecoration: "none"
                }}
              >
                <span>Access Trainer Console</span>
                <ArrowRight size={15} />
              </Link>
            </div>

            {/* Card 3: Admin Directorate Portal */}
            <div
              style={{
                backgroundColor: "#F8FAFC",
                borderRadius: "12px",
                border: "1.5px solid #0D9488",
                padding: "32px 28px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: "0 4px 14px rgba(13, 148, 136, 0.08)",
                position: "relative"
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "-12px",
                  right: "24px",
                  backgroundColor: "#0F766E",
                  color: "#FFFFFF",
                  fontSize: "11px",
                  fontWeight: 700,
                  padding: "3px 10px",
                  borderRadius: "12px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em"
                }}
              >
                Directorate Lead
              </div>
              <div>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "10px",
                    backgroundColor: "#F0FDFA",
                    color: "#0F766E",
                    display: "grid",
                    placeItems: "center",
                    marginBottom: "20px"
                  }}
                >
                  <ShieldCheck size={24} />
                </div>
                <h3 style={{ fontSize: "19px", fontWeight: 800, color: "#0F172A", margin: "0 0 10px 0" }}>
                  Public Health Admin Portal
                </h3>
                <p style={{ fontSize: "13.5px", color: "#64748B", lineHeight: 1.6, margin: "0 0 20px 0" }}>
                  Orchestrate population health awareness, organize screening campaigns, publish clinical PDF guides, and audit compliance.
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px 0", fontSize: "13px", color: "#334155" }}>
                  {[
                    "Executive population risk dashboards",
                    "Community screening camp scheduling & rosters",
                    "Clinical awareness editorial publishing",
                    "Audit-ready RFC-4180 CSV export engine"
                  ].map((feat, i) => (
                    <li key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <Check size={15} color="#0F766E" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                to="/admin/login"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  padding: "11px 18px",
                  borderRadius: "6px",
                  backgroundColor: "#0F766E",
                  color: "#FFFFFF",
                  border: "none",
                  fontSize: "13.5px",
                  fontWeight: 700,
                  textDecoration: "none",
                  boxShadow: "0 4px 12px rgba(15, 118, 110, 0.25)"
                }}
              >
                <span>Enter Admin Directorate</span>
                <ArrowRight size={15} />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          5. 5-AXIS CLINICAL FRAMEWORK SECTION
      ========================================================================= */}
      <section
        id="framework"
        style={{
          padding: "80px 6%",
          backgroundColor: "#F8FAFC",
          borderBottom: "1px solid #E2E8F0"
        }}
      >
        <div style={{ maxWidth: "1240px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <span
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "#0F766E",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                display: "block",
                marginBottom: 8
              }}
            >
              Scientific Screening Standard
            </span>
            <h2
              style={{
                fontSize: "clamp(26px, 3vw, 36px)",
                fontWeight: 800,
                color: "#0F172A",
                margin: "0 0 14px 0",
                letterSpacing: "-0.02em"
              }}
            >
              The 5-Axis Occupational Risk Assessment
            </h2>
            <p style={{ fontSize: "15px", color: "#64748B", maxWidth: "680px", margin: "0 auto", lineHeight: 1.6 }}>
              A scientifically validated rubric synthesizing musculoskeletal load, cardiovascular tone, stress biomarkers, and circadian sleep architecture.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 20
            }}
          >
            {[
              {
                num: "01",
                title: "Posture & Mechanics",
                desc: "Evaluates cervical spine tilt, monitor sightline, lumbar support, and seated slouch patterns."
              },
              {
                num: "02",
                title: "Workday Mobility",
                desc: "Quantifies 50/10 micro-movement rhythm, lower limb venous pump reactivation, and desk breaks."
              },
              {
                num: "03",
                title: "Autonomic Stress",
                desc: "Assesses cognitive deadline pressures, sympathetic arousal, and box-breathing resilience."
              },
              {
                num: "04",
                title: "Sleep Architecture",
                desc: "Analyzes pre-bed blue light exposure, slow-wave restorative sleep, and next-day stamina."
              },
              {
                num: "05",
                title: "Ergonomic Layout",
                desc: "OSHA-compliant workstation geometry, keyboard forearm neutral angles, and desk illumination."
              }
            ].map((axis, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E2E8F0",
                  borderRadius: "10px",
                  padding: "24px 20px",
                  position: "relative",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#0D9488";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#E2E8F0";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <span
                  style={{
                    fontSize: "26px",
                    fontWeight: 800,
                    color: "#CCFBF1",
                    display: "block",
                    lineHeight: 1,
                    marginBottom: 10
                  }}
                >
                  {axis.num}
                </span>
                <h4 style={{ fontSize: "16px", fontWeight: 700, color: "#0F172A", margin: "0 0 8px 0" }}>
                  {axis.title}
                </h4>
                <p style={{ fontSize: "13px", color: "#64748B", lineHeight: 1.55, margin: 0 }}>
                  {axis.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. DIGITAL VERIFIABLE CREDENTIALS SHOWCASE
      ========================================================================= */}
      <section
        id="compliance"
        style={{
          padding: "80px 6%",
          backgroundColor: "#FFFFFF",
          borderBottom: "1px solid #E2E8F0"
        }}
      >
        <div style={{ maxWidth: "1240px", margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 50,
              alignItems: "center"
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "5px 12px",
                  backgroundColor: "#F0FDFA",
                  color: "#0F766E",
                  borderRadius: "16px",
                  fontSize: "11.5px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: 16
                }}
              >
                <Award size={15} />
                <span>Auditable Digital Credentials</span>
              </div>
              <h2
                style={{
                  fontSize: "clamp(26px, 3vw, 36px)",
                  fontWeight: 800,
                  color: "#0F172A",
                  lineHeight: 1.2,
                  letterSpacing: "-0.02em",
                  margin: "0 0 18px 0"
                }}
              >
                Cryptographically Signed Completion Certificates
              </h2>
              <p style={{ fontSize: "15px", color: "#475569", lineHeight: 1.65, margin: "0 0 24px 0" }}>
                Every employee completing an assigned occupational wellness or ergonomics curriculum receives an immutable certificate verifiable worldwide without login requirements.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
                {[
                  "Public verification endpoint at /verify/:certificateId",
                  "Unique cryptographic verification hash for each graduate",
                  "Accredited Trainer endorsement and issue timestamps",
                  "Direct PDF print and tamper-detection safeguards"
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "13.5px", color: "#334155" }}>
                    <CheckCircle2 size={16} color="#0D9488" style={{ flexShrink: 0 }} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <Link
                to="/verify"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "12px 22px",
                  backgroundColor: "#0F766E",
                  color: "#FFFFFF",
                  borderRadius: "8px",
                  fontSize: "13.5px",
                  fontWeight: 700,
                  textDecoration: "none",
                  boxShadow: "0 4px 12px rgba(15, 118, 110, 0.2)"
                }}
              >
                <FileCheck2 size={16} />
                <span>Open Public Certificate Verifier</span>
                <ArrowRight size={15} />
              </Link>
            </div>

            {/* Certificate Visual Mockup */}
            <div>
              <div
                style={{
                  backgroundColor: "#F8FAFC",
                  border: "2px solid #CBD5E1",
                  borderRadius: "14px",
                  padding: "32px",
                  boxShadow: "0 10px 25px -5px rgba(0,0,0,0.06)",
                  position: "relative"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 38, height: 38, borderRadius: "8px", background: "#0F766E", color: "#FFF", display: "grid", placeItems: "center" }}>
                      <Award size={20} />
                    </div>
                    <div>
                      <strong style={{ fontSize: "14px", color: "#0F172A", display: "block" }}>WorkHealth AI Certificate</strong>
                      <span style={{ fontSize: "11px", color: "#64748B" }}>ISO 45001 Compliance Track</span>
                    </div>
                  </div>
                  <span style={{ fontSize: "11px", color: "#10B981", fontWeight: 700, backgroundColor: "#D1FAE5", padding: "3px 8px", borderRadius: "4px" }}>
                    ✓ Verified
                  </span>
                </div>

                <div style={{ borderTop: "1px solid #E2E8F0", borderBottom: "1px solid #E2E8F0", padding: "18px 0", marginBottom: 18 }}>
                  <span style={{ fontSize: "11px", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em" }}>Awarded To</span>
                  <div style={{ fontSize: "20px", fontWeight: 800, color: "#0F172A", marginTop: 2 }}>Bhavana Thota</div>
                  <div style={{ fontSize: "13px", color: "#475569", marginTop: 4 }}>
                    Program: Ergonomic Workstation Improvement & Postural Alignment
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11.5px", color: "#64748B" }}>
                  <span>Credential ID: <strong>CERT-2026-ENG-4912</strong></span>
                  <span>Endorsed by: <strong>Dr. Sarah Jenkins</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. BOTTOM CALL TO ACTION
      ========================================================================= */}
      <section
        style={{
          padding: "70px 6%",
          backgroundColor: "#0F172A",
          color: "#FFFFFF",
          textAlign: "center"
        }}
      >
        <div style={{ maxWidth: "780px", margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "clamp(26px, 3.2vw, 38px)",
              fontWeight: 800,
              color: "#FFFFFF",
              letterSpacing: "-0.02em",
              margin: "0 0 16px 0"
            }}
          >
            Ready to Protect Workforce Wellbeing & Mitigate Workplace Risk?
          </h2>
          <p style={{ fontSize: "15px", color: "#94A3B8", lineHeight: 1.6, margin: "0 0 32px 0" }}>
            Deploy comprehensive occupational health screening, specialist intervention pathways, and population health governance in minutes.
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
            <Link
              to="/register"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "13px 28px",
                backgroundColor: "#0D9488",
                color: "#FFFFFF",
                borderRadius: "8px",
                fontSize: "14.5px",
                fontWeight: 700,
                textDecoration: "none",
                boxShadow: "0 4px 14px rgba(13, 148, 136, 0.35)"
              }}
            >
              <span>Create Employee Account</span>
              <ArrowRight size={16} />
            </Link>

            <Link
              to="/admin/login"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "13px 24px",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                color: "#FFFFFF",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "8px",
                fontSize: "14.5px",
                fontWeight: 600,
                textDecoration: "none"
              }}
            >
              <ShieldCheck size={16} />
              <span>Admin Directorate Access</span>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          8. ENTERPRISE FOOTER
      ========================================================================= */}
      <footer
        style={{
          borderTop: "1px solid #E2E8F0",
          backgroundColor: "#FFFFFF",
          padding: "40px 6% 30px",
          fontSize: "13px",
          color: "#64748B"
        }}
      >
        <div style={{ maxWidth: "1240px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20, marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: "8px", background: "#0F766E", color: "#FFF", display: "grid", placeItems: "center" }}>
                <ShieldCheck size={18} />
              </div>
              <span style={{ fontSize: "14px", fontWeight: 800, color: "#0F172A" }}>
                WorkHealth AI • Intelligent Occupational Health Platform
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 24, fontWeight: 600 }}>
              <Link to="/login" style={{ color: "#475569", textDecoration: "none" }}>Employee Portal</Link>
              <Link to="/login" style={{ color: "#475569", textDecoration: "none" }}>Trainer Console</Link>
              <Link to="/admin/login" style={{ color: "#0F766E", textDecoration: "none" }}>Admin Directorate</Link>
              <Link to="/verify" style={{ color: "#0F766E", textDecoration: "none" }}>Verify Certificate</Link>
            </div>
          </div>

          <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, fontSize: "12px", color: "#94A3B8" }}>
            <span>© 2026 WorkHealth AI • Compliant with ISO 45001 & OSHA Safety Standards. All rights reserved.</span>
            <span>Confidential & Cryptographically Protected Health Records</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
