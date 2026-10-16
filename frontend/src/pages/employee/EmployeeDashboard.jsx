import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Activity,
  ClipboardCheck,
  TrendingDown,
  Sparkles,
  ArrowRight,
  UserRound,
  Brain,
  Moon,
  Zap,
  BookOpen,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Award,
  Clock,
  ChevronRight
} from "lucide-react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";
import { authService } from "../../services/authService";
import { employeeService, getRiskTier } from "../../services/employeeService";
import { dataStore } from "../../services/dataStore";
import StatCard from "../../components/common/StatCard";
import RiskBadge from "../../components/common/RiskBadge";

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(authService.getCurrentUser());
  const [assessmentData, setAssessmentData] = useState(employeeService.getAssessmentScores());
  const [programs, setPrograms] = useState(employeeService.getPrograms());
  const [lifecycleStage, setLifecycleStage] = useState(null);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    const userId = currentUser?.id || "u-emp-1";

    const scores = employeeService.getAssessmentScores(userId);
    setAssessmentData(scores);

    const userProgs = employeeService.getPrograms(userId);
    setPrograms(userProgs);

    const stage = dataStore.getEmployeeLifecycleStage(userId);
    setLifecycleStage(stage);
  }, []);

  const { overallScore, categoryScores, hasCompleted } = assessmentData;
  const riskTier = overallScore !== null ? getRiskTier(overallScore) : { label: "Pending", className: "badge-neutral", color: "#6D817D" };

  const radarData = [
    { dimension: "Posture", score: categoryScores?.Posture || 45, fullMark: 100 },
    { dimension: "Activity", score: categoryScores?.Activity || 45, fullMark: 100 },
    { dimension: "Stress", score: categoryScores?.Stress || 35, fullMark: 100 },
    { dimension: "Recovery", score: categoryScores?.Recovery || 35, fullMark: 100 },
    { dimension: "Workload", score: categoryScores?.Workload || 40, fullMark: 100 },
  ];

  // Identify active or first program
  const enrolledPrograms = programs.filter((p) => p.isEnrolled);
  const primaryProgram = enrolledPrograms.length > 0 ? enrolledPrograms[0] : programs[0];

  const userCertificates = user?.id ? dataStore.getUserCertificates(user.id) : [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: "1280px", margin: "0 auto" }}>
      {/* Top Welcome Banner */}
      <div
        className="corporate-card"
        style={{
          background: "linear-gradient(135deg, #183533 0%, #147D75 100%)",
          color: "#FFFFFF",
          padding: "28px 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 20,
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: "12px", letterSpacing: "0.06em", fontWeight: 700, color: "#C8E6DF", textTransform: "uppercase" }}>
              Workplace Occupational Health Platform
            </span>
            <span style={{ background: "rgba(255,255,255,0.2)", padding: "2px 8px", borderRadius: 4, fontSize: "11px", fontWeight: 600 }}>
              {user?.department || "Corporate Workforce"}
            </span>
            <span style={{ background: "rgba(255,255,255,0.2)", padding: "2px 8px", borderRadius: 4, fontSize: "11px", fontWeight: 600 }}>
              {user?.employeeId || "EMP-1001"}
            </span>
          </div>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#FFFFFF", marginBottom: 6 }}>
            Good day, {user?.name || "Team Member"}
          </h1>
          <p style={{ fontSize: "14px", color: "#D1E7E3", margin: 0, maxWidth: "620px", lineHeight: 1.5 }}>
            {hasCompleted
              ? "Your confidential ergonomic and lifestyle risk screening is active. Follow your next scheduled wellbeing action below."
              : "Welcome to your corporate health portal. Complete your 16-item screening to evaluate workstation strain and sleep restoration."}
          </p>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <Link
            to="/employee/assessment"
            className="btn-primary"
            style={{
              backgroundColor: "#FFFFFF",
              color: "var(--color-primary)",
              fontWeight: 700,
              padding: "10px 22px",
            }}
          >
            <ClipboardCheck size={16} />
            <span>{hasCompleted ? "Retake Assessment" : "Start Screening"}</span>
          </Link>
          <Link
            to="/employee/recommendations"
            className="btn-secondary"
            style={{
              backgroundColor: "rgba(255,255,255,0.15)",
              color: "#FFFFFF",
              border: "1px solid rgba(255,255,255,0.3)",
              padding: "10px 18px",
            }}
          >
            <span>Recommendations</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* DYNAMIC NEXT STEP BANNER (Guided Workflow Navigator) */}
      {lifecycleStage && (
        <div
          className="corporate-card"
          style={{
            background: "linear-gradient(90deg, #FFFFFF 0%, #F5FAF8 100%)",
            borderLeft: "6px solid var(--color-primary)",
            padding: "20px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
            boxShadow: "0 2px 8px rgba(20, 125, 117, 0.08)"
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "10px",
                background: "var(--color-primary-light)",
                color: "var(--color-primary)",
                display: "grid",
                placeItems: "center",
                flexShrink: 0
              }}
            >
              <Sparkles size={22} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--color-primary)" }}>
                  YOUR NEXT RECOMMENDED ACTION
                </span>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    padding: "2px 8px",
                    borderRadius: 4,
                    background: "#E3F3EF",
                    color: "var(--color-primary-dark)"
                  }}
                >
                  {lifecycleStage.badge}
                </span>
              </div>
              <h3 style={{ fontSize: "17px", fontWeight: 800, color: "var(--text-heading)", margin: "0 0 4px 0" }}>
                {lifecycleStage.title}
              </h3>
              <p style={{ fontSize: "13.5px", color: "var(--text-muted)", margin: 0, maxWidth: "720px", lineHeight: 1.45 }}>
                {lifecycleStage.description}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate(lifecycleStage.ctaPath)}
            className="btn-primary"
            style={{ padding: "11px 22px", fontSize: "13.5px", fontWeight: 700, whiteSpace: "nowrap" }}
          >
            <span>{lifecycleStage.ctaLabel}</span>
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 18 }}>
        <StatCard
          title="Overall Workplace Risk"
          value={overallScore !== null ? `${overallScore}%` : "Pending"}
          subtitle="Composite 16-factor screening index"
          icon={ShieldCheck}
          badgeText={overallScore !== null ? `${riskTier.label} Risk` : "Awaiting Input"}
          badgeType={riskTier.label === "Low" ? "success" : riskTier.label === "Moderate" ? "warning" : overallScore !== null ? "danger" : "neutral"}
          onClick={() => navigate("/employee/risk-profile")}
        />

        <StatCard
          title="Screening Status"
          value={hasCompleted ? "Complete" : "Needs Action"}
          subtitle={hasCompleted ? "16 of 16 factors analyzed" : "16 questions awaiting response"}
          icon={Activity}
          badgeText={hasCompleted ? "Screened" : "Action Needed"}
          badgeType={hasCompleted ? "success" : "warning"}
          onClick={() => navigate("/employee/assessment")}
        />

        <StatCard
          title="Enrolled Wellbeing Program"
          value={primaryProgram?.isEnrolled ? `${primaryProgram.progress}%` : "Not Enrolled"}
          subtitle={primaryProgram?.isEnrolled ? primaryProgram.name : "Select a recommended program"}
          icon={BookOpen}
          badgeText={primaryProgram?.isEnrolled ? (primaryProgram.status === "verified" ? "Verified" : primaryProgram.status === "awaiting_review" ? "Under Review" : `${primaryProgram.progress}% Done`) : "Available"}
          badgeType="success"
          onClick={() => navigate(primaryProgram?.isEnrolled ? `/employee/program/${primaryProgram.id}` : "/employee/recommendations")}
        />

        <StatCard
          title="Verified Certificates"
          value={`${userCertificates.length}`}
          subtitle={userCertificates.length > 0 ? "Trainer approved & downloadable" : "Complete a program to qualify"}
          icon={Award}
          badgeText={userCertificates.length > 0 ? "Issued" : "Pending"}
          badgeType={userCertificates.length > 0 ? "success" : "neutral"}
          onClick={() => navigate("/employee/certificates")}
        />
      </div>

      {/* Two Column Layout: Radar Chart & Category Scores */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 24 }} className="dashboard-grid-2col">
        {/* Left Column: Five Health Risk Dimensions Breakdown */}
        <div className="corporate-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: "17px", fontWeight: 700, color: "var(--text-heading)", margin: 0 }}>
                Workplace Risk Dimensions
              </h3>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: "4px 0 0" }}>
                Screening intensity across primary physical and psychosocial factors
              </p>
            </div>
            <Link to="/employee/risk-profile" style={{ fontSize: "13px", color: "var(--color-primary)", fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
              Details <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { label: "Posture Risk", score: categoryScores?.Posture ?? 45, icon: UserRound, desc: "Cervical spine alignment & workstation ergonomics" },
              { label: "Sedentary / Activity Risk", score: categoryScores?.Activity ?? 45, icon: Activity, desc: "Seated work intervals & physical movement frequency" },
              { label: "Cognitive Stress Risk", score: categoryScores?.Stress ?? 40, icon: Brain, desc: "Mental intensity, deadline pressure & cognitive load" },
              { label: "Restorative Recovery Risk", score: categoryScores?.Recovery ?? 35, icon: Moon, desc: "Circadian sleep duration & workday detachment" },
              { label: "Workload Pacing", score: categoryScores?.Workload ?? 40, icon: Zap, desc: "Balance between high-focus blocks and pauses" },
            ].map((cat) => {
              const Icon = cat.icon;
              const tier = getRiskTier(cat.score);
              return (
                <div key={cat.label} style={{ padding: "12px 14px", borderRadius: 8, background: "#F8FAF9", border: "1px solid var(--border-subtle)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 6, background: "var(--color-primary-light)", color: "var(--color-primary)", display: "grid", placeItems: "center" }}>
                        <Icon size={15} />
                      </div>
                      <div>
                        <strong style={{ fontSize: "13.5px", color: "var(--text-heading)", display: "block" }}>{cat.label}</strong>
                        <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{cat.desc}</span>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <RiskBadge score={cat.score} size="sm" />
                    </div>
                  </div>

                  {/* Progress track */}
                  <div style={{ height: 6, width: "100%", background: "#E2ECE9", borderRadius: 3, overflow: "hidden" }}>
                    <div
                      style={{
                        height: "100%",
                        width: `${cat.score}%`,
                        backgroundColor: tier.color,
                        borderRadius: 3,
                        transition: "width 0.4s ease",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Visual Radar & Active Coaching Program */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Radar Chart Card */}
          <div className="corporate-card" style={{ display: "flex", flexDirection: "column" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-heading)", marginBottom: 4 }}>
              Risk Profile Radar
            </h3>
            <span style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: 12 }}>
              Multi-axial representation of workday ergonomic and stress signals
            </span>

            <div style={{ height: 220, width: "100%" }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} outerRadius="75%">
                  <PolarGrid stroke="#DCEFEB" />
                  <PolarAngleAxis dataKey="dimension" tick={{ fill: "#6D817D", fontSize: 11, fontWeight: 600 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#8FA39F", fontSize: 9 }} />
                  <Radar
                    name="Risk"
                    dataKey="score"
                    stroke="#147D75"
                    fill="#147D75"
                    fillOpacity={0.25}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Active Program Card */}
          <div className="corporate-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <span className="badge badge-low">
                {primaryProgram?.isEnrolled ? "Enrolled Curriculum" : "Featured Program"}
              </span>
              <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 600 }}>
                {primaryProgram?.completedSessions?.length || 0} of {primaryProgram?.totalSessions || 8} Sessions
              </span>
            </div>

            <h4 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-heading)", marginBottom: 6 }}>
              {primaryProgram?.name}
            </h4>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.5, marginBottom: 14 }}>
              {primaryProgram?.overview?.slice(0, 120)}...
            </p>

            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: 6, fontWeight: 600 }}>
                <span>Program Completion</span>
                <span style={{ color: "var(--color-primary)" }}>{primaryProgram?.progress || 0}%</span>
              </div>
              <div style={{ height: 7, background: "#E2ECE9", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${primaryProgram?.progress || 0}%`, background: "var(--color-primary)", borderRadius: 4 }} />
              </div>
            </div>

            <button
              onClick={() => navigate(`/employee/program/${primaryProgram.id}`)}
              className="btn-primary"
              style={{ width: "100%", padding: "10px", fontWeight: 700 }}
            >
              <span>{primaryProgram?.isEnrolled ? "Resume Guided Sessions" : "View Program Curriculum"}</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Recommended Action Items Banner */}
      <div className="corporate-card" style={{ background: "#FFFFFF" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--color-primary-light)", color: "var(--color-primary)", display: "grid", placeItems: "center" }}>
              <Sparkles size={17} />
            </div>
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-heading)", margin: 0 }}>
                Targeted Workplace Interventions
              </h3>
              <p style={{ fontSize: "12.5px", color: "var(--text-muted)", margin: 0 }}>
                Ergonomic and recovery adjustments tailored to your latest screening
              </p>
            </div>
          </div>
          <Link to="/employee/recommendations" className="btn-secondary" style={{ padding: "7px 14px", fontSize: "13px" }}>
            View All ({employeeService.getRecommendations(user?.id).length})
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 14 }}>
          {employeeService.getRecommendations(user?.id).slice(0, 2).map((rec) => (
            <div key={rec.id} style={{ padding: "16px", borderRadius: 8, background: "#F8FAF9", border: "1px solid var(--border-subtle)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span className="badge badge-low">{rec.riskArea}</span>
                <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)" }}>{rec.estimatedEffort}</span>
              </div>
              <strong style={{ fontSize: "14px", color: "var(--text-heading)", display: "block", marginBottom: 4 }}>
                {rec.title}
              </strong>
              <p style={{ fontSize: "12.5px", color: "var(--text-muted)", lineHeight: 1.5, margin: "0 0 12px 0" }}>
                {rec.recommendedAction}
              </p>
              <Link
                to={`/employee/program/${rec.programId}`}
                style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--color-primary)", display: "inline-flex", alignItems: "center", gap: 4 }}
              >
                <span>View Program</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}