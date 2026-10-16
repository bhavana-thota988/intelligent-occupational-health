import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  Award,
  BookOpen,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  BarChart3,
  Activity,
  AlertCircle
} from "lucide-react";
import { trainerService } from "../../services/trainerService";
import { OFFICIAL_PROGRAMS } from "../../services/dataStore";
import StatCard from "../../components/common/StatCard";

export default function TrainerProgress() {
  const [stats, setStats] = useState(trainerService.getTrainerProgressStats());
  const [employees, setEmployees] = useState(trainerService.getAssignedEmployees());

  useEffect(() => {
    setStats(trainerService.getTrainerProgressStats());
    setEmployees(trainerService.getAssignedEmployees());
  }, []);

  const enrolledEmployees = employees.filter((e) => e.programId);
  const completionRate = stats.completedPrograms > 0 || stats.activePrograms > 0
    ? Math.round((stats.completedPrograms / (stats.completedPrograms + stats.activePrograms)) * 100)
    : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: "1280px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
        <div>
          <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Curriculum Adherence & Certification Analytics
          </span>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "var(--text-heading)", margin: "4px 0 0" }}>
            Program Progress & Compliance
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", margin: "4px 0 0" }}>
            Track corporate employee curriculum velocity, completion rates, and credential issuance.
          </p>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <Link to="/trainer/reviews" className="btn-secondary">
            Review Queue ({stats.pendingReviews})
          </Link>
          <Link to="/trainer/employees" className="btn-primary">
            <span>Assigned Roster</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 18 }}>
        <StatCard
          title="Active Enrollments"
          value={stats.activePrograms}
          subtitle="Employees currently in curriculum"
          icon={BookOpen}
          badgeText="In Progress"
          badgeType="success"
        />

        <StatCard
          title="Verified Completions"
          value={stats.verifiedPrograms}
          subtitle="Approved by specialist"
          icon={CheckCircle2}
          badgeText="Verified"
          badgeType="success"
        />

        <StatCard
          title="Pending Queue"
          value={stats.pendingReviews}
          subtitle="Curriculums awaiting verification"
          icon={Clock}
          badgeText={stats.pendingReviews > 0 ? "Action Required" : "Up to date"}
          badgeType={stats.pendingReviews > 0 ? "warning" : "success"}
        />

        <StatCard
          title="Issued Credentials"
          value={stats.totalCertificatesIssued}
          subtitle="Official completion certificates"
          icon={Award}
          badgeText="Audited"
          badgeType="success"
        />
      </div>

      {/* Program Tracks Breakdown */}
      <div className="corporate-card" style={{ padding: "26px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <h3 style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-heading)", margin: 0 }}>
              Official Wellbeing Curriculum Tracks
            </h3>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: "4px 0 0" }}>
              5 evidence-based corporate occupational health tracks under supervision
            </p>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {OFFICIAL_PROGRAMS.map((prog) => {
            const trackEmployees = employees.filter((e) => e.programId === prog.id);
            const verifiedCount = trackEmployees.filter((e) => e.programStatus === "verified").length;
            const avgProgress = trackEmployees.length > 0
              ? Math.round(trackEmployees.reduce((acc, curr) => acc + (curr.programProgress || 0), 0) / trackEmployees.length)
              : 0;

            return (
              <div
                key={prog.id}
                style={{
                  padding: "18px 20px",
                  borderRadius: 8,
                  background: "#F8FAF9",
                  border: "1px solid var(--border-subtle)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span className="badge badge-low" style={{ fontSize: "11px" }}>
                        {prog.category}
                      </span>
                      <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                        Target: {prog.targetRisk} Risk
                      </span>
                    </div>
                    <strong style={{ fontSize: "15px", color: "var(--text-heading)", display: "block" }}>
                      {prog.name}
                    </strong>
                    <span style={{ fontSize: "12.5px", color: "var(--text-muted)" }}>
                      {prog.duration} • {prog.totalSessions} Sessions • Assigned: {prog.trainerAssigned}
                    </span>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: 2 }}>
                      Enrolled: <strong>{trackEmployees.length}</strong> • Verified: <strong>{verifiedCount}</strong>
                    </div>
                    <span style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--color-primary)" }}>
                      {avgProgress}% Cohort Avg
                    </span>
                  </div>
                </div>

                <div style={{ height: 6, background: "#E2ECE9", borderRadius: 3, overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${avgProgress}%`,
                      background: "var(--color-primary)",
                      borderRadius: 3,
                      transition: "width 0.3s ease"
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Roster Adherence Table */}
      <div className="corporate-card" style={{ padding: "26px" }}>
        <h3 style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-heading)", margin: "0 0 4px 0" }}>
          Employee Progression Roster
        </h3>
        <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: "0 0 20px 0" }}>
          Individual progress towards milestone verification
        </p>

        {employees.length === 0 ? (
          <div style={{ padding: "32px 0", textAlign: "center", color: "var(--text-muted)", fontSize: "14px" }}>
            No registered employees in coaching cohorts.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="corporate-table" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Track Enrolled</th>
                  <th>Curriculum Status</th>
                  <th>Progress</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp.id}>
                    <td>
                      <strong style={{ color: "var(--text-heading)", display: "block" }}>{emp.name}</strong>
                      <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{emp.email}</span>
                    </td>
                    <td>{emp.department}</td>
                    <td style={{ fontSize: "13px", fontWeight: 600, color: "var(--color-primary)" }}>
                      {emp.activeProgram}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          emp.programStatus === "verified"
                            ? "badge-low"
                            : emp.programStatus === "awaiting_review"
                            ? "badge-mod"
                            : emp.programStatus === "needs_correction"
                            ? "badge-high"
                            : "badge-neutral"
                        }`}
                        style={{ fontSize: "11px" }}
                      >
                        {emp.programStatus === "verified"
                          ? "Verified"
                          : emp.programStatus === "awaiting_review"
                          ? "In Review"
                          : emp.programStatus === "needs_correction"
                          ? "Adjustments Needed"
                          : emp.programId
                          ? "In Progress"
                          : "Not Started"}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: "110px" }}>
                        <span style={{ fontSize: "12px", fontWeight: 700 }}>{emp.programProgress}%</span>
                        <div style={{ flex: 1, height: 5, background: "#E2ECE9", borderRadius: 3, overflow: "hidden" }}>
                          <div
                            style={{
                              height: "100%",
                              width: `${emp.programProgress}%`,
                              background: emp.programStatus === "verified" ? "#147D75" : "var(--color-primary)",
                              borderRadius: 3
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td>
                      <Link
                        to="/trainer/employees"
                        className="btn-secondary"
                        style={{ padding: "5px 10px", fontSize: "11.5px" }}
                      >
                        View Profile
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
