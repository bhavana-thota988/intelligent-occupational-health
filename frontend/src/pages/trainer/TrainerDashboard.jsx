import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Users,
  BookOpen,
  Calendar,
  Award,
  ArrowRight,
  TrendingDown,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck
} from "lucide-react";
import { authService } from "../../services/authService";
import { trainerService } from "../../services/trainerService";
import StatCard from "../../components/common/StatCard";
import RiskBadge from "../../components/common/RiskBadge";

export default function TrainerDashboard() {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();
  const [data, setData] = useState(trainerService.getTrainerData());

  useEffect(() => {
    setData(trainerService.getTrainerData());
  }, []);

  const { kpis, assignedEmployees, pendingReviews, sessions } = data;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: "1280px", margin: "0 auto" }}>
      {/* Top Banner */}
      <div
        className="corporate-card"
        style={{
          background: "linear-gradient(135deg, #183533 0%, #0E625B 100%)",
          color: "#FFFFFF",
          padding: "28px 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 20
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: "12px", letterSpacing: "0.06em", fontWeight: 700, color: "#C8E6DF", textTransform: "uppercase" }}>
              Occupational Health Specialist Console
            </span>
            <span style={{ background: "rgba(255,255,255,0.2)", padding: "2px 8px", borderRadius: 4, fontSize: "11px", fontWeight: 600 }}>
              {currentUser?.department || "Health & Ergonomics"}
            </span>
          </div>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#FFFFFF", margin: "0 0 6px 0" }}>
            Welcome back, {currentUser?.name || "Dr. Sarah Jenkins"}
          </h1>
          <p style={{ fontSize: "14px", color: "#D1E7E3", margin: 0, maxWidth: "640px", lineHeight: 1.5 }}>
            Supervise corporate employee wellbeing pathways, evaluate completed movement curricula, and issue verified ergonomic compliance credentials.
          </p>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <Link
            to="/trainer/reviews"
            className="btn-primary"
            style={{
              backgroundColor: "#FFFFFF",
              color: "var(--color-primary)",
              fontWeight: 800,
              padding: "10px 22px"
            }}
          >
            <FileCheck size={16} />
            <span>Review Queue ({pendingReviews.length})</span>
          </Link>
          <Link
            to="/trainer/assigned-employees"
            className="btn-secondary"
            style={{
              backgroundColor: "rgba(255,255,255,0.15)",
              color: "#FFFFFF",
              border: "1px solid rgba(255,255,255,0.3)",
              padding: "10px 18px"
            }}
          >
            <span>Assigned Roster</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* PENDING REVIEWS ALERT (High Priority Workflow Prompt) */}
      {pendingReviews.length > 0 && (
        <div
          className="corporate-card"
          style={{
            background: "linear-gradient(90deg, #FEFBF6 0%, #FFFFFF 100%)",
            borderLeft: "6px solid #C97A1C",
            padding: "20px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "10px",
                background: "#FEF2DC",
                color: "#C97A1C",
                display: "grid",
                placeItems: "center",
                flexShrink: 0
              }}
            >
              <Clock size={22} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", color: "#C97A1C" }}>
                  ACTION REQUIRED • SUBMISSION QUEUE
                </span>
                <span className="badge badge-mod" style={{ fontSize: "11px" }}>
                  {pendingReviews.length} Pending
                </span>
              </div>
              <h3 style={{ fontSize: "16.5px", fontWeight: 800, color: "var(--text-heading)", margin: "0 0 4px 0" }}>
                Employee Program Completion Logs Awaiting Verification
              </h3>
              <p style={{ fontSize: "13.5px", color: "var(--text-muted)", margin: 0, maxWidth: "680px" }}>
                Employees have completed all required curriculum sessions and requested your review. Inspect logs to issue certificates.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/trainer/reviews")}
            className="btn-primary"
            style={{ padding: "10px 22px", fontSize: "13.5px", fontWeight: 700 }}
          >
            <span>Open Review Queue</span>
            <ArrowRight size={16} />
          </button>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 18 }}>
        <StatCard
          title="Assigned Cohort"
          value={kpis.assignedEmployeesCount}
          subtitle="Registered corporate workforce"
          icon={Users}
          badgeText="Active"
          badgeType="success"
          onClick={() => navigate("/trainer/assigned-employees")}
        />

        <StatCard
          title="Supervised Programs"
          value={kpis.activeProgramsCount}
          subtitle="Ergonomics, mobility & resilience"
          icon={BookOpen}
          badgeText="5 Tracks"
          badgeType="success"
          onClick={() => navigate("/trainer/programs")}
        />

        <StatCard
          title="Pending Submissions"
          value={kpis.pendingReviewsCount}
          subtitle="Curriculum logs awaiting review"
          icon={FileCheck}
          badgeText={kpis.pendingReviewsCount > 0 ? "Action Required" : "Up to date"}
          badgeType={kpis.pendingReviewsCount > 0 ? "warning" : "success"}
          onClick={() => navigate("/trainer/reviews")}
        />

        <StatCard
          title="Issued Credentials"
          value={kpis.totalCertificatesIssued}
          subtitle="Verified completion certificates"
          icon={Award}
          badgeText="Verified"
          badgeType="success"
        />
      </div>

      {/* Two Column Section: Assigned Cohort Preview & Upcoming Sessions */}
      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 24 }} className="dashboard-grid-2col">
        {/* Left: Assigned Employees Preview */}
        <div className="corporate-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <div>
              <h3 style={{ fontSize: "17px", fontWeight: 700, color: "var(--text-heading)", margin: 0 }}>
                Corporate Employees in Coaching
              </h3>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: "4px 0 0" }}>
                Staff participating in ergonomic programs
              </p>
            </div>
            <Link to="/trainer/assigned-employees" style={{ fontSize: "13px", color: "var(--color-primary)", fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
              Full Roster ({assignedEmployees.length}) <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {assignedEmployees.slice(0, 4).map((emp) => (
              <div
                key={emp.id}
                style={{
                  padding: "14px 16px",
                  borderRadius: 8,
                  background: "#F8FAF9",
                  border: "1px solid var(--border-subtle)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 12,
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <strong style={{ fontSize: "14px", color: "var(--text-heading)" }}>{emp.name}</strong>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>• {emp.department}</span>
                  </div>
                  <span style={{ fontSize: "12.5px", color: "var(--color-primary)", fontWeight: 600 }}>
                    {emp.activeProgram}
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)", display: "block" }}>Progress</span>
                    <strong style={{ fontSize: "13px", color: "var(--text-heading)" }}>{emp.programProgress}%</strong>
                  </div>
                  {emp.overallRiskScore !== null ? (
                    <RiskBadge score={emp.overallRiskScore} size="sm" />
                  ) : (
                    <span className="badge badge-neutral" style={{ fontSize: "11px" }}>Unscreened</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Upcoming Sessions */}
        <div className="corporate-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <div>
              <h3 style={{ fontSize: "17px", fontWeight: 700, color: "var(--text-heading)", margin: 0 }}>
                1-on-1 Ergonomic Check-ins
              </h3>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: "4px 0 0" }}>
                Scheduled consultations
              </p>
            </div>
            <Link to="/trainer/sessions" style={{ fontSize: "13px", color: "var(--color-primary)", fontWeight: 700 }}>
              Schedule
            </Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {sessions.map((ses) => (
              <div
                key={ses.id}
                style={{
                  padding: "14px",
                  borderRadius: 8,
                  background: "#FFFFFF",
                  border: "1px solid var(--border-subtle)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className="badge badge-low" style={{ fontSize: "11px" }}>{ses.time}</span>
                  <span style={{ fontSize: "11.5px", fontWeight: 700, color: "var(--color-primary)" }}>{ses.status}</span>
                </div>
                <strong style={{ fontSize: "13.5px", color: "var(--text-heading)", marginTop: 2 }}>
                  {ses.employeeName} ({ses.department})
                </strong>
                <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0 }}>
                  {ses.type}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
