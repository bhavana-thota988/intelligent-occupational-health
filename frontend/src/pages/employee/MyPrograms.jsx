import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  User,
  ArrowRight,
  Sparkles,
  Award,
  AlertCircle,
  Filter,
  Play,
  Flame,
  ShieldCheck,
  Zap
} from "lucide-react";
import { authService } from "../../services/authService";
import { employeeService } from "../../services/employeeService";

export default function MyPrograms() {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();
  const userId = currentUser?.id || "u-emp-1";

  const [programs, setPrograms] = useState([]);
  const [activeStatusTab, setActiveStatusTab] = useState("all"); // 'all', 'recommended', 'active', 'verified'
  const [selectedCategory, setSelectedCategory] = useState("all"); // 'all', 'Stress', 'Yoga', 'Meditation', 'Posture', 'Movement', 'Sleep'

  useEffect(() => {
    loadPrograms();
  }, []);

  const loadPrograms = () => {
    const list = employeeService.getPrograms(userId);
    setPrograms(list);
  };

  const recs = employeeService.getRecommendations(userId);
  const recProgramIds = recs.map((r) => r.programId);

  // Categories list
  const categoryFilters = [
    { key: "all", label: "All Programs", emoji: "✨" },
    { key: "Stress", label: "Stress Relief", emoji: "🧠" },
    { key: "Yoga", label: "Workplace Yoga", emoji: "🧘" },
    { key: "Meditation", label: "Meditation", emoji: "🕊️" },
    { key: "Posture", label: "Posture & Ergonomics", emoji: "💺" },
    { key: "Walking", label: "Daily Walking", emoji: "🚶" },
    { key: "Sleep", label: "Sleep & Recovery", emoji: "🌙" }
  ];

  const filteredPrograms = programs.filter((p) => {
    // Category filter
    if (selectedCategory !== "all" && p.tag !== selectedCategory) {
      return false;
    }

    // Status tab filter
    if (activeStatusTab === "recommended") return recProgramIds.includes(p.id);
    if (activeStatusTab === "active") return p.isEnrolled && p.status !== "verified" && p.status !== "awaiting_review";
    if (activeStatusTab === "awaiting_review") return p.status === "awaiting_review";
    if (activeStatusTab === "verified") return p.status === "verified";
    return true; // 'all'
  });

  // Calculate enrolled count
  const enrolledCount = programs.filter((p) => p.isEnrolled).length;
  const verifiedCount = programs.filter((p) => p.status === "verified").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: "1240px", margin: "0 auto" }}>
      {/* Top Banner */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Workplace Wellbeing & Ergonomics
            </span>
            <span style={{ fontSize: "11px", background: "var(--color-primary-light)", color: "var(--color-primary)", padding: "2px 8px", borderRadius: 4, fontWeight: 700 }}>
              ISO 45001 Supervised
            </span>
          </div>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "var(--text-heading)", margin: "4px 0 0" }}>
            Workplace Health Programs
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", margin: "4px 0 0" }}>
            Evidence-based daily routines in Stress Relief, Desk Yoga, Meditation, Ergonomics, and Movement supervised by certified specialists.
          </p>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <Link to="/employee/recommendations" className="btn-secondary">
            <Sparkles size={16} />
            <span>AI Recommendations</span>
          </Link>
          <Link to="/employee/certificates" className="btn-primary">
            <Award size={16} />
            <span>My Certificates ({verifiedCount})</span>
          </Link>
        </div>
      </div>

      {/* Quick Category Filter Pills */}
      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
        {categoryFilters.map((cat) => {
          const isSelected = selectedCategory === cat.key;
          return (
            <button
              key={cat.key}
              type="button"
              onClick={() => setSelectedCategory(cat.key)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 14px",
                borderRadius: "20px",
                border: isSelected ? "1.5px solid var(--color-primary)" : "1px solid var(--border-subtle)",
                background: isSelected ? "var(--color-primary-light)" : "#FFFFFF",
                color: isSelected ? "var(--color-primary)" : "var(--text-body)",
                fontSize: "13px",
                fontWeight: isSelected ? 700 : 500,
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.15s ease"
              }}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Status Filter Tabs */}
      <div style={{ display: "flex", gap: 8, borderBottom: "1px solid var(--border-subtle)", paddingBottom: 8, flexWrap: "wrap" }}>
        {[
          { key: "all", label: `All Routines (${programs.length})` },
          { key: "recommended", label: `Recommended (${programs.filter((p) => recProgramIds.includes(p.id)).length})` },
          { key: "active", label: `In Progress (${programs.filter((p) => p.isEnrolled && p.status !== "verified" && p.status !== "awaiting_review").length})` },
          { key: "awaiting_review", label: `Under Review (${programs.filter((p) => p.status === "awaiting_review").length})` },
          { key: "verified", label: `Verified (${verifiedCount})` },
        ].map((tab) => {
          const isActive = activeStatusTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveStatusTab(tab.key)}
              style={{
                background: isActive ? "var(--color-primary-light)" : "transparent",
                border: "none",
                borderRadius: 6,
                padding: "8px 16px",
                color: isActive ? "var(--color-primary)" : "var(--text-muted)",
                fontWeight: isActive ? 700 : 500,
                fontSize: "13.5px",
                cursor: "pointer",
                transition: "all 0.15s ease"
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Programs Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 22 }}>
        {filteredPrograms.map((prog) => {
          const isVerified = prog.status === "verified";
          const isAwaitingReview = prog.status === "awaiting_review";
          const isCorrection = prog.status === "needs_correction";
          const completedCount = prog.completedSessions?.length || 0;
          const isRecommended = recProgramIds.includes(prog.id);

          return (
            <div
              key={prog.id}
              className="corporate-card"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: "24px",
                borderTop: prog.isEnrolled ? "4px solid var(--color-primary)" : "1px solid var(--border-subtle)",
                boxShadow: prog.isEnrolled ? "0 4px 14px rgba(15, 118, 110, 0.08)" : "none",
                transition: "transform 0.15s ease, box-shadow 0.15s ease"
              }}
            >
              <div>
                {/* Header Row: Category Badge & Status Badge */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: "16px" }}>{prog.emoji || "✨"}</span>
                    <span className="badge badge-low" style={{ fontWeight: 700 }}>
                      {prog.shortName || prog.category}
                    </span>
                    {isRecommended && (
                      <span style={{ fontSize: "10.5px", background: "#FEF3C7", color: "#92400E", padding: "2px 7px", borderRadius: 4, fontWeight: 700 }}>
                        ★ Recommended
                      </span>
                    )}
                  </div>

                  <span
                    className={`badge ${
                      isVerified
                        ? "badge-low"
                        : isAwaitingReview
                        ? "badge-mod"
                        : isCorrection
                        ? "badge-high"
                        : prog.isEnrolled
                        ? "badge-low"
                        : "badge-neutral"
                    }`}
                  >
                    {isVerified
                      ? "✓ Verified"
                      : isAwaitingReview
                      ? "⏳ Under Review"
                      : isCorrection
                      ? "⚠️ Needs Adjustment"
                      : prog.isEnrolled
                      ? "In Progress"
                      : "Not Enrolled"}
                  </span>
                </div>

                {/* Program Title */}
                <h3 style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-heading)", margin: "0 0 8px 0" }}>
                  {prog.name}
                </h3>

                {/* Program Overview */}
                <p style={{ fontSize: "13px", color: "var(--text-body)", lineHeight: 1.55, margin: "0 0 16px 0" }}>
                  {prog.overview}
                </p>

                {/* Meta details: duration, effort, coach */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 12, fontSize: "12px", color: "var(--text-muted)", marginBottom: 16 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 5, background: "#F1F5F9", padding: "4px 8px", borderRadius: 4 }}>
                    <Clock size={13} color="var(--color-primary)" />
                    <strong>{prog.duration}</strong> ({prog.totalSessions} Sessions)
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: 5, background: "#F1F5F9", padding: "4px 8px", borderRadius: 4 }}>
                    <Zap size={13} color="#D97706" />
                    <span>{prog.dailyTime || "10 mins/day"}</span>
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: 5, background: "#F1F5F9", padding: "4px 8px", borderRadius: 4 }}>
                    <User size={13} color="var(--color-primary)" />
                    <span>{prog.trainerAssigned.split("(")[0].trim()}</span>
                  </span>
                </div>

                {/* Progress bar if enrolled */}
                {prog.isEnrolled && (
                  <div style={{ marginBottom: 18, background: "#F8FAF9", padding: "12px", borderRadius: 8, border: "1px solid var(--border-subtle)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: 6, fontWeight: 700 }}>
                      <span style={{ color: "var(--text-heading)" }}>Your Progress</span>
                      <span style={{ color: "var(--color-primary)" }}>
                        {completedCount} of {prog.totalSessions} sessions ({prog.progress}%)
                      </span>
                    </div>
                    <div style={{ height: 7, background: "#E2ECE9", borderRadius: 4, overflow: "hidden" }}>
                      <div
                        style={{
                          height: "100%",
                          width: `${prog.progress}%`,
                          background: isVerified ? "#147D75" : "var(--color-primary)",
                          borderRadius: 4,
                          transition: "width 0.3s ease"
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div style={{ display: "flex", gap: 10, borderTop: "1px solid var(--border-subtle)", paddingTop: 16 }}>
                <button
                  type="button"
                  onClick={() => navigate(`/employee/program/${prog.id}`)}
                  className="btn-primary"
                  style={{ flex: 1, padding: "10px 14px", fontSize: "13.5px", fontWeight: 700 }}
                >
                  <Play size={14} />
                  <span>{prog.isEnrolled ? "Resume Guided Sessions" : "View Curriculum & Enroll"}</span>
                  <ArrowRight size={14} />
                </button>

                {isVerified && (
                  <button
                    type="button"
                    onClick={() => navigate("/employee/certificates")}
                    className="btn-secondary"
                    style={{ padding: "10px 14px", fontSize: "13px", fontWeight: 700 }}
                    title="View verified credential certificate"
                  >
                    <Award size={15} color="var(--color-primary)" />
                    <span>Certificate</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
