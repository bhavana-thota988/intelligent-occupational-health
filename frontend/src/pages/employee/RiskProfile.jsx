import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShieldAlert,
  ShieldCheck,
  Activity,
  UserRound,
  Brain,
  Moon,
  Zap,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Info,
  Calendar,
  AlertTriangle
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";
import { employeeService, getRiskTier } from "../../services/employeeService";
import { authService } from "../../services/authService";
import { dataStore } from "../../services/dataStore";
import RiskBadge from "../../components/common/RiskBadge";

export default function RiskProfile() {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(employeeService.getAssessmentScores());

  useEffect(() => {
    setProfileData(employeeService.getAssessmentScores());
    const currentUser = authService.getCurrentUser();
    if (currentUser?.id) {
      dataStore.markRiskProfileViewed(currentUser.id);
    }
  }, []);

  const { overallScore, categoryScores, completedAt } = profileData;
  const overallTier = getRiskTier(overallScore);

  const categories = [
    {
      key: "Posture",
      label: "Posture & Musculoskeletal Risk",
      score: categoryScores.Posture || 45,
      icon: UserRound,
      explanation: "Evaluates cervical spine alignment, seated static loading, and workstation monitor setup.",
      guidance: "High static posture causes spinal disc fatigue and upper back tension. Recommend active ergonomic adjustments.",
    },
    {
      key: "Activity",
      label: "Sedentary & Physical Activity Risk",
      score: categoryScores.Activity || 45,
      icon: Activity,
      explanation: "Measures continuous hours spent seated without physical movement breaks or step volume.",
      guidance: "Protracted sedentary time reduces peripheral circulation. Hourly standing micro-breaks are advised.",
    },
    {
      key: "Stress",
      label: "Psychosocial & Mental Stress Risk",
      score: categoryScores.Stress || 35,
      icon: Brain,
      explanation: "Screens cognitive exhaustion, workplace task intensity, and intrusion into personal hours.",
      guidance: "Elevated mental demands require structured focus blocks and end-of-day loop closure rituals.",
    },
    {
      key: "Recovery",
      label: "Circadian Sleep & Recovery Adequacy",
      score: categoryScores.Recovery || 35,
      icon: Moon,
      explanation: "Examines weekday sleep duration, morning vitality, and restoration before consecutive workdays.",
      guidance: "Restorative sleep is crucial for tissue regeneration and nervous system down-regulation.",
    },
    {
      key: "Workload",
      label: "Workload Pacing & Cadence",
      score: categoryScores.Workload || 40,
      icon: Zap,
      explanation: "Synthesizes workload compression against available restorative pauses.",
      guidance: "Balancing peak concentration periods with brief zero-input rest prevents cumulative burnout.",
    },
  ];

  const chartData = categories.map((c) => ({
    name: c.key,
    score: c.score,
    color: getRiskTier(c.score).color,
  }));

  const radarData = categories.map((c) => ({
    subject: c.key,
    score: c.score,
    fullMark: 100,
  }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: "1200px", margin: "0 auto" }}>
      {/* Top Header & Navigation */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Workplace Risk Screening
            </span>
            {completedAt && (
              <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                • Assessed on {completedAt}
              </span>
            )}
          </div>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "var(--text-heading)", margin: 0 }}>
            Workplace Health & Risk Profile
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", margin: "4px 0 0" }}>
            Comprehensive analysis of your physical ergonomics, sedentary load, and recovery indices.
          </p>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate("/employee/dashboard")}
          >
            <ArrowLeft size={16} />
            <span>Dashboard</span>
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={() => navigate("/employee/recommendations")}
          >
            <span>View Recommendations</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Mandatory Non-Diagnostic Disclaimer Banner */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
          padding: "16px 20px",
          borderRadius: "8px",
          background: "#FFFFFF",
          border: "1px solid var(--border-subtle)",
          borderLeft: "4px solid var(--color-primary)",
        }}
      >
        <Info size={20} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: 2 }} />
        <div>
          <strong style={{ fontSize: "13.5px", color: "var(--text-heading)", display: "block", marginBottom: 2 }}>
            Workplace Risk Screening Notice
          </strong>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: 0, lineHeight: 1.5 }}>
            These results are intended for workplace wellbeing guidance and do not replace professional medical advice. If you experience chronic physical pain or acute medical symptoms, please consult a qualified healthcare provider.
          </p>
        </div>
      </div>

      {/* Primary Overall Risk Score Card */}
      <div
        className="corporate-card"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.4fr",
          gap: 32,
          alignItems: "center",
          padding: "32px",
        }}
        class Name="risk-summary-grid"
      >
        <div style={{ textAlign: "center", borderRight: "1px solid var(--border-subtle)", paddingRight: 24 }}>
          <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 8 }}>
            Composite Risk Score
          </span>
          <div style={{ fontSize: "56px", fontWeight: 800, color: overallTier.color, lineHeight: 1, marginBottom: 12 }}>
            {overallScore}%
          </div>
          <RiskBadge score={overallScore} size="lg" />
          <p style={{ fontSize: "12.5px", color: "var(--text-muted)", marginTop: 14, margin: "14px 0 0" }}>
            Weighted benchmark based on all 16 occupational factors.
          </p>
        </div>

        <div>
          <h3 style={{ fontSize: "17px", fontWeight: 700, color: "var(--text-heading)", marginBottom: 8 }}>
            Workplace Risk Screening Interpretation
          </h3>
          <p style={{ fontSize: "13.5px", color: "var(--text-muted)", lineHeight: 1.6, marginBottom: 18 }}>
            {overallScore >= 60
              ? "Your composite screening reflects elevated strain across multiple workstation postures and sedentary periods. Targeted ergonomic adjustments and recovery intervals are strongly recommended."
              : overallScore >= 30
              ? "Your workplace health signals indicate moderate risk, primarily concentrated in localized static sitting and screen exposure. Structured micro-breaks will significantly enhance your stamina."
              : "Your current workday habits reflect healthy ergonomics and balanced recovery. Continue maintaining regular movement breaks and consistent sleep schedules."}
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link to="/employee/recommendations" className="btn-primary" style={{ padding: "9px 18px", fontSize: "13.5px" }}>
              <span>Explore Targeted Interventions</span>
              <ArrowRight size={15} />
            </Link>
            <Link to="/employee/assessment" className="btn-secondary" style={{ padding: "9px 16px", fontSize: "13.5px" }}>
              <span>Retake Screening</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Visual Analytics Charts Section */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 24 }} className="dashboard-grid-2col">
        {/* Bar Chart Breakdown */}
        <div className="corporate-card">
          <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-heading)", marginBottom: 6 }}>
            Dimension Score Comparison
          </h3>
          <p style={{ fontSize: "12.5px", color: "var(--text-muted)", marginBottom: 16 }}>
            Comparing individual risk scores across the 5 occupational factors
          </p>

          <div style={{ height: 260, width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fill: "#6D817D", fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fill: "#6D817D", fontSize: 12 }} />
                <Tooltip
                  formatter={(val) => [`${val}%`, "Risk Score"]}
                  contentStyle={{ backgroundColor: "#FFFFFF", borderRadius: 8, border: "1px solid var(--border-subtle)" }}
                />
                <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Radar Symmetry Chart */}
        <div className="corporate-card">
          <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-heading)", marginBottom: 6 }}>
            Workplace Balance Radar
          </h3>
          <p style={{ fontSize: "12.5px", color: "var(--text-muted)", marginBottom: 16 }}>
            Multi-axial balance between strain, load, and restorative factors
          </p>

          <div style={{ height: 260, width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius="75%">
                <PolarGrid stroke="#DCEFEB" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "#6D817D", fontSize: 11, fontWeight: 600 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#8FA39F", fontSize: 9 }} />
                <Radar name="Risk Level" dataKey="score" stroke="#147D75" fill="#147D75" fillOpacity={0.25} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Risk Category Cards */}
      <div>
        <h3 style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-heading)", marginBottom: 16 }}>
          Category Risk Diagnostics
        </h3>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 18 }}>
          {categories.map((cat) => {
            const Icon = cat.icon;
            const tier = getRiskTier(cat.score);

            return (
              <div key={cat.key} className="corporate-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 8,
                          background: "var(--color-primary-light)",
                          color: "var(--color-primary)",
                          display: "grid",
                          placeItems: "center",
                        }}
                      >
                        <Icon size={18} />
                      </div>
                      <div>
                        <strong style={{ fontSize: "14.5px", color: "var(--text-heading)", display: "block" }}>
                          {cat.label}
                        </strong>
                        <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                          {cat.key} Dimension
                        </span>
                      </div>
                    </div>
                    <RiskBadge score={cat.score} size="sm" />
                  </div>

                  {/* Progress Indicator */}
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: 4, fontWeight: 600 }}>
                      <span style={{ color: "var(--text-muted)" }}>Screening Intensity</span>
                      <span style={{ color: tier.color }}>{cat.score}%</span>
                    </div>
                    <div style={{ height: 6, background: "#E2ECE9", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${cat.score}%`, backgroundColor: tier.color, borderRadius: 3 }} />
                    </div>
                  </div>

                  <p style={{ fontSize: "13px", color: "var(--text-heading)", lineHeight: 1.5, marginBottom: 8 }}>
                    {cat.explanation}
                  </p>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: 1.5, margin: 0 }}>
                    <strong>Insight: </strong>{cat.guidance}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
