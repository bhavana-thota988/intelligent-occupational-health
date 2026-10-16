import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Layers,
  ArrowUpRight,
  Info,
  Calendar,
  UserCheck
} from "lucide-react";
import { authService } from "../../services/authService";
import { employeeService, getRiskTier } from "../../services/employeeService";
import Modal from "../../components/common/Modal";
import Toast from "../../components/common/Toast";

export default function Recommendations() {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();
  const [assessmentScores, setAssessmentScores] = useState(employeeService.getAssessmentScores(currentUser?.id));
  const [recommendations, setRecommendations] = useState([]);
  const [selectedRec, setSelectedRec] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const userId = currentUser?.id || "u-emp-1";
    const scores = employeeService.getAssessmentScores(userId);
    setAssessmentScores(scores);
    const recs = employeeService.getRecommendations(userId);
    setRecommendations(recs);
  }, []);

  const handleStartProgram = (programId, title) => {
    const userId = currentUser?.id || "u-emp-1";
    employeeService.enrollProgram(programId, userId);
    setToastMessage(`Enrolled in "${title}". Opening program sessions...`);
    setTimeout(() => {
      navigate(`/employee/program/${programId}`);
    }, 400);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Intelligent Recommendation Engine
            </span>
          </div>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "var(--text-heading)", margin: 0 }}>
            Personalized Workplace Recommendations
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", margin: "4px 0 0" }}>
            Tailored physical ergonomics, movement protocols, and cognitive reset strategies mapped from your screening profile.
          </p>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <Link to="/employee/risk-profile" className="btn-secondary">
            View Risk Profile
          </Link>
          <Link to="/employee/my-programs" className="btn-primary">
            <span>My Enrolled Programs</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Notice Banner */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "14px 20px",
          borderRadius: 8,
          background: "var(--color-primary-light)",
          border: "1px solid #C4E4DD",
          color: "var(--color-primary)",
        }}
      >
        <Sparkles size={18} style={{ flexShrink: 0 }} />
        <span style={{ fontSize: "13px", fontWeight: 600 }}>
          Recommendations adapt automatically whenever you update your 16-factor workplace health screening.
        </span>
      </div>

      {/* Recommendations Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 20 }}>
        {recommendations.map((rec) => {
          const priorityClass =
            rec.priority === "High"
              ? "badge-high"
              : rec.priority === "Moderate"
              ? "badge-mod"
              : "badge-low";

          return (
            <div
              key={rec.id}
              className="corporate-card"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: "24px",
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <span className={`badge ${priorityClass}`}>{rec.priority} Priority</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "12px", color: "var(--text-muted)" }}>
                    <Clock size={14} />
                    <span>{rec.estimatedEffort}</span>
                  </div>
                </div>

                <div style={{ marginBottom: 6 }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    {rec.riskArea}
                  </span>
                  <h3 style={{ fontSize: "16.5px", fontWeight: 700, color: "var(--text-heading)", marginTop: 2 }}>
                    {rec.title}
                  </h3>
                </div>

                <div style={{ marginBottom: 14 }}>
                  <strong style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", display: "block", marginBottom: 3 }}>
                    Why It Matters
                  </strong>
                  <p style={{ fontSize: "13px", color: "var(--text-body)", lineHeight: 1.5, margin: 0 }}>
                    {rec.whyRecommended || rec.whyItMatters}
                  </p>
                </div>

                <div style={{ padding: "12px 14px", background: "#F8FAF9", borderRadius: 8, border: "1px solid var(--border-subtle)", marginBottom: 20 }}>
                  <strong style={{ fontSize: "12px", color: "var(--text-heading)", display: "block", marginBottom: 3 }}>
                    Recommended Action
                  </strong>
                  <p style={{ fontSize: "12.5px", color: "var(--text-muted)", lineHeight: 1.5, margin: 0 }}>
                    {rec.recommendedAction}
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", gap: 10, borderTop: "1px solid var(--border-subtle)", paddingTop: 16 }}>
                <button
                  type="button"
                  onClick={() => handleStartProgram(rec.programId, rec.programName)}
                  className="btn-primary"
                  style={{ flex: 1, padding: "9px 14px", fontSize: "13px" }}
                >
                  <span>Start Program</span>
                  <ArrowRight size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRec(rec)}
                  className="btn-secondary"
                  style={{ padding: "9px 14px", fontSize: "13px" }}
                >
                  View Details
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Details Modal */}
      <Modal
        isOpen={!!selectedRec}
        onClose={() => setSelectedRec(null)}
        title={selectedRec?.title || "Intervention Details"}
        subtitle={`Targeting ${selectedRec?.riskArea} • ${selectedRec?.priority} Priority`}
      >
        {selectedRec && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ padding: "14px", borderRadius: 8, background: "#F8FAF9", border: "1px solid var(--border-subtle)" }}>
              <strong style={{ fontSize: "13px", color: "var(--text-heading)", display: "block", marginBottom: 4 }}>
                Occupational Health Impact
              </strong>
              <p style={{ fontSize: "13.5px", color: "var(--text-muted)", lineHeight: 1.5, margin: 0 }}>
                {selectedRec.whyRecommended || selectedRec.whyItMatters}
              </p>
            </div>

            <div style={{ padding: "14px", borderRadius: 8, background: "var(--color-primary-light)", border: "1px solid #C4E4DD" }}>
              <strong style={{ fontSize: "13px", color: "var(--color-primary)", display: "block", marginBottom: 4 }}>
                Step-by-Step Workplace Execution
              </strong>
              <p style={{ fontSize: "13.5px", color: "var(--text-heading)", lineHeight: 1.5, margin: 0 }}>
                {selectedRec.recommendedAction}
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ padding: "10px 14px", borderRadius: 6, background: "#F8FAF9", border: "1px solid var(--border-subtle)" }}>
                <span style={{ fontSize: "11px", color: "var(--text-muted)", display: "block" }}>Estimated Effort</span>
                <strong style={{ fontSize: "13.5px", color: "var(--text-heading)" }}>{selectedRec.estimatedEffort}</strong>
              </div>
              <div style={{ padding: "10px 14px", borderRadius: 6, background: "#F8FAF9", border: "1px solid var(--border-subtle)" }}>
                <span style={{ fontSize: "11px", color: "var(--text-muted)", display: "block" }}>Associated Course</span>
                <strong style={{ fontSize: "13.5px", color: "var(--text-heading)" }}>{selectedRec.programName}</strong>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setSelectedRec(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  handleStartProgram(selectedRec.programId, selectedRec.programName);
                  setSelectedRec(null);
                }}
              >
                <span>Enroll & Launch Program</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Toast Notification */}
      <Toast message={toastMessage} onClose={() => setToastMessage("")} />
    </div>
  );
}
