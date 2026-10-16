import React, { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Brain,
  Check,
  ChevronRight,
  Coffee,
  Moon,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Sun,
  Target,
  UserRound,
  Watch,
  Zap
} from "lucide-react";
import {
  ASSESSMENT_QUESTIONS,
  calculateScoresFromAnswers,
  employeeService
} from "../../services/employeeService";
import { authService } from "../../services/authService";

const CATEGORY_META = {
  Posture: { icon: UserRound, label: "Posture" },
  Activity: { icon: Activity, label: "Activity" },
  Stress: { icon: Brain, label: "Stress" },
  Recovery: { icon: Moon, label: "Recovery" },
};

const PHASE_ITEMS = [
  { name: "Morning", icon: Sun },
  { name: "Work", icon: Watch },
  { name: "Breaks", icon: Coffee },
  { name: "Evening", icon: Moon },
];

export default function Assessment() {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState(() => {
    try {
      const stored = localStorage.getItem("assessmentAnswers");
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      return {};
    }
  });
  const [completed, setCompleted] = useState(false);

  const currentQuestion = ASSESSMENT_QUESTIONS[currentIndex];
  const selectedAnswer = answers[currentQuestion?.id];

  const completion = Math.round(
    (Object.keys(answers).length / ASSESSMENT_QUESTIONS.length) * 100
  );

  const liveCalculated = useMemo(() => {
    return calculateScoresFromAnswers(answers);
  }, [answers]);

  const handleAnswer = (score) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: score,
    }));
  };

  const handleNext = async () => {
    if (!selectedAnswer) return;

    if (currentIndex === ASSESSMENT_QUESTIONS.length - 1) {
      // Completed all 16 questions!
      const finalScores = calculateScoresFromAnswers(answers);
      const userId = currentUser?.id || "u-emp-1";
      await employeeService.saveAssessment(
        answers,
        finalScores.categoryScores,
        finalScores.overallScore,
        userId
      );
      setCompleted(true);
      return;
    }

    setCurrentIndex((prev) => prev + 1);
  };

  const handleBack = () => {
    if (currentIndex === 0) return;
    setCurrentIndex((prev) => prev - 1);
  };

  const restartAssessment = () => {
    setAnswers({});
    setCurrentIndex(0);
    setCompleted(false);
  };

  // Completion Screen View
  if (completed) {
    const finalScores = liveCalculated.categoryScores;
    const finalOverall = liveCalculated.overallScore;

    return (
      <div style={{ maxWidth: "1080px", margin: "0 auto", padding: "10px 0" }}>
        <div
          className="corporate-card animate-fade"
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 0.9fr",
            gap: "36px",
            padding: "40px",
            backgroundColor: "#FFFFFF",
          }}
        >
          {/* Left Column: Completion Statement */}
          <div>
            <div
              style={{
                width: 54,
                height: 54,
                borderRadius: "50%",
                background: "var(--color-primary-light)",
                color: "var(--color-primary)",
                display: "grid",
                placeItems: "center",
                marginBottom: "20px",
              }}
            >
              <Check size={28} />
            </div>

            <span
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "var(--color-primary)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                display: "block",
                marginBottom: "10px",
              }}
            >
              HEALTH ASSESSMENT COMPLETE
            </span>

            <h1
              style={{
                fontSize: "32px",
                fontWeight: 800,
                color: "var(--text-heading)",
                lineHeight: 1.2,
                marginBottom: "16px",
              }}
            >
              Your workplace health profile is ready.
            </h1>

            <p style={{ fontSize: "15px", color: "var(--text-muted)", lineHeight: 1.6, marginBottom: "28px" }}>
              All 16 assessment questions have been successfully analyzed. Your responses have been synthesized across five workplace health dimensions to build your personalized risk mitigation plan.
            </p>

            <div style={{ marginBottom: "28px", padding: "16px", background: "#F8FAF9", borderRadius: "8px", border: "1px solid var(--border-subtle)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "13px", fontWeight: 700 }}>
                <span>Assessment Completion</span>
                <span style={{ color: "var(--color-primary)" }}>100%</span>
              </div>
              <div style={{ height: "8px", background: "#E2ECE9", borderRadius: "4px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: "100%", background: "var(--color-primary)", borderRadius: "4px" }} />
              </div>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "32px" }}>
              {["Posture", "Activity", "Workload", "Stress", "Recovery"].map((item) => (
                <div
                  key={item}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    background: "var(--color-primary-light)",
                    color: "var(--color-primary)",
                    fontSize: "12.5px",
                    fontWeight: 600,
                  }}
                >
                  <Check size={14} />
                  <span>{item} Evaluated</span>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <button
                type="button"
                className="btn-primary"
                onClick={() => navigate("/employee/risk-profile")}
                style={{ padding: "13px 24px", fontSize: "14.5px" }}
              >
                <span>View My Risk Profile</span>
                <ArrowRight size={17} />
              </button>

              <button
                type="button"
                className="btn-secondary"
                onClick={() => navigate("/employee/recommendations")}
                style={{ padding: "12px 24px", fontSize: "14px" }}
              >
                <span>Continue to Recommendations</span>
                <ChevronRight size={16} />
              </button>

              <button
                type="button"
                onClick={restartAssessment}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  color: "var(--text-muted)",
                  fontSize: "13px",
                  padding: "8px",
                  marginTop: "8px",
                }}
              >
                <RotateCcw size={14} />
                <span>Retake assessment</span>
              </button>
            </div>
          </div>

          {/* Right Column: Live Dimensions Summary */}
          <div
            style={{
              background: "#F8FAF9",
              borderRadius: "12px",
              border: "1px solid var(--border-subtle)",
              padding: "28px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-heading)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                Workplace Profile Scores
              </span>
              <Sparkles size={17} color="var(--color-primary)" />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "28px" }}>
              {Object.entries(CATEGORY_META).map(([category, meta]) => {
                const Icon = meta.icon;
                const score = finalScores[category] || 0;
                return (
                  <div key={category} style={{ background: "#FFFFFF", padding: "12px 14px", borderRadius: "8px", border: "1px solid var(--border-subtle)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <Icon size={15} color="var(--color-primary)" />
                        <strong style={{ fontSize: "13.5px", color: "var(--text-heading)" }}>{meta.label}</strong>
                      </div>
                      <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-heading)" }}>{score}%</span>
                    </div>
                    <div style={{ height: "6px", background: "#E2ECE9", borderRadius: "3px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${score}%`, background: "var(--color-primary)", borderRadius: "3px" }} />
                    </div>
                  </div>
                );
              })}

              <div style={{ background: "#FFFFFF", padding: "12px 14px", borderRadius: "8px", border: "1px solid var(--border-subtle)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Zap size={15} color="var(--color-primary)" />
                    <strong style={{ fontSize: "13.5px", color: "var(--text-heading)" }}>Workload</strong>
                  </div>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-heading)" }}>{finalScores.Workload || 40}%</span>
                </div>
                <div style={{ height: "6px", background: "#E2ECE9", borderRadius: "3px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${finalScores.Workload || 40}%`, background: "var(--color-primary)", borderRadius: "3px" }} />
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: "12px",
                padding: "14px",
                borderRadius: "8px",
                background: "var(--color-primary-light)",
                border: "1px solid #C4E4DD",
                color: "var(--color-primary)",
              }}
            >
              <Target size={20} style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <strong style={{ fontSize: "13px", display: "block", marginBottom: 2 }}>Next Action Steps</strong>
                <p style={{ fontSize: "12px", margin: 0, lineHeight: 1.5 }}>
                  Your calculated scores are now mapped directly to ergonomic guidelines and accredited workplace coaching programs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Active Question View
  const PhaseIcon = currentQuestion.phaseIcon;

  return (
    <div style={{ maxWidth: "1120px", margin: "0 auto" }}>
      {/* Top Eyebrow & Counter */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "20px" }}>
        <div>
          <span
            style={{
              fontSize: "12px",
              fontWeight: 700,
              color: "var(--color-primary)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              display: "block",
              marginBottom: "4px",
            }}
          >
            PERSONAL WORKDAY ASSESSMENT
          </span>
          <h1 style={{ fontSize: "26px", fontWeight: 800, color: "var(--text-heading)", margin: 0 }}>
            Let's understand your workday routine.
          </h1>
          <p style={{ fontSize: "13.5px", color: "var(--text-muted)", margin: "4px 0 0" }}>
            Your answers build a confidential profile to identify musculoskeletal strain and fatigue factors.
          </p>
        </div>

        <div
          style={{
            padding: "8px 16px",
            borderRadius: "8px",
            background: "#FFFFFF",
            border: "1px solid var(--border-subtle)",
            textAlign: "right",
          }}
        >
          <strong style={{ fontSize: "20px", color: "var(--color-primary)", fontWeight: 800 }}>
            {String(currentIndex + 1).padStart(2, "0")}
          </strong>
          <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>
            {" "}/ {String(ASSESSMENT_QUESTIONS.length).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Workday Phase Stepper */}
      <div
        className="corporate-card"
        style={{
          padding: "16px 24px",
          marginBottom: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: "11.5px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Workday Flow:
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 20, flex: 1, justifyContent: "center" }}>
          {PHASE_ITEMS.map((phase, idx) => {
            const Icon = phase.icon;
            const isActive = phase.name === currentQuestion.phase;
            const isPassed =
              PHASE_ITEMS.findIndex((p) => p.name === currentQuestion.phase) > idx;

            return (
              <div
                key={phase.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  color: isActive
                    ? "var(--color-primary)"
                    : isPassed
                    ? "var(--text-heading)"
                    : "var(--text-muted)",
                  fontWeight: isActive ? 700 : 500,
                  fontSize: "13px",
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: isActive
                      ? "var(--color-primary)"
                      : isPassed
                      ? "var(--color-primary-light)"
                      : "#F0F4F3",
                    color: isActive ? "#FFFFFF" : isPassed ? "var(--color-primary)" : "var(--text-muted)",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <Icon size={14} />
                </div>
                <span>{phase.name}</span>
                {idx < PHASE_ITEMS.length - 1 && (
                  <div style={{ width: 30, height: 1, background: "var(--border-subtle)", margin: "0 4px" }} />
                )}
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "12px", color: "var(--text-muted)" }}>
          <ShieldCheck size={14} color="var(--color-primary)" />
          <span>Confidential Screening</span>
        </div>
      </div>

      {/* Main Two-Column Assessment Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 0.9fr", gap: 24 }} className="dashboard-grid-2col">
        {/* Left Question Panel */}
        <div className="corporate-card" style={{ padding: "32px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 14 }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "4px 10px",
                  borderRadius: 6,
                  background: "var(--color-primary-light)",
                  color: "var(--color-primary)",
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              >
                <PhaseIcon size={13} />
                {currentQuestion.phase} Phase
              </span>

              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "4px 10px",
                  borderRadius: 6,
                  background: "#F0F4F3",
                  color: "var(--text-muted)",
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              >
                {currentQuestion.category}
              </span>
            </div>

            <h2 style={{ fontSize: "20px", fontWeight: 700, color: "var(--text-heading)", marginBottom: 8, lineHeight: 1.3 }}>
              {currentQuestion.question}
            </h2>
            <p style={{ fontSize: "13.5px", color: "var(--text-muted)", margin: "0 0 24px" }}>
              {currentQuestion.helper}
            </p>

            {/* Answer Options */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
              {currentQuestion.options.map((opt, idx) => {
                const isSelected = selectedAnswer === opt.score;
                return (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => handleAnswer(opt.score)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      padding: "14px 16px",
                      borderRadius: "8px",
                      border: isSelected ? "2px solid var(--color-primary)" : "1px solid var(--border-subtle)",
                      background: isSelected ? "var(--color-primary-light)" : "#FFFFFF",
                      textAlign: "left",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <span
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: "50%",
                        background: isSelected ? "var(--color-primary)" : "#F0F4F3",
                        color: isSelected ? "#FFFFFF" : "var(--text-muted)",
                        display: "grid",
                        placeItems: "center",
                        fontSize: "12px",
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>

                    <span
                      style={{
                        flex: 1,
                        fontSize: "14px",
                        fontWeight: isSelected ? 700 : 500,
                        color: isSelected ? "var(--color-primary)" : "var(--text-heading)",
                      }}
                    >
                      {opt.label}
                    </span>

                    {isSelected && <Check size={18} color="var(--color-primary)" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Navigation */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 18, borderTop: "1px solid var(--border-subtle)" }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={handleBack}
              disabled={currentIndex === 0}
              style={{ opacity: currentIndex === 0 ? 0.4 : 1, cursor: currentIndex === 0 ? "not-allowed" : "pointer" }}
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>

            <button
              type="button"
              className="btn-primary"
              onClick={handleNext}
              disabled={!selectedAnswer}
              style={{ opacity: !selectedAnswer ? 0.4 : 1, cursor: !selectedAnswer ? "not-allowed" : "pointer", padding: "10px 24px" }}
            >
              <span>{currentIndex === ASSESSMENT_QUESTIONS.length - 1 ? "Complete Assessment" : "Continue"}</span>
              {currentIndex === ASSESSMENT_QUESTIONS.length - 1 ? <Check size={16} /> : <ArrowRight size={16} />}
            </button>
          </div>
        </div>

        {/* Right Live Health Profile Panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="corporate-card" style={{ padding: "26px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--color-primary)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  LIVE HEALTH SIGNALS
                </span>
                <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-heading)", margin: "2px 0 0" }}>
                  Your Workday Indicators
                </h3>
              </div>
              <Activity size={18} color="var(--color-primary)" />
            </div>

            <p style={{ fontSize: "12.5px", color: "var(--text-muted)", margin: "0 0 18px", lineHeight: 1.5 }}>
              Scores dynamically calibrate in real time as your responses are registered.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 22 }}>
              {Object.entries(CATEGORY_META).map(([category, meta]) => {
                const Icon = meta.icon;
                const score = liveCalculated.categoryScores[category] || 0;
                return (
                  <div key={category} style={{ background: "#F8FAF9", padding: "10px 12px", borderRadius: 8, border: "1px solid var(--border-subtle)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                        <Icon size={14} color="var(--color-primary)" />
                        <span style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--text-heading)" }}>{meta.label}</span>
                      </div>
                      <b style={{ fontSize: "12.5px", color: "var(--text-heading)" }}>{score}%</b>
                    </div>
                    <div style={{ height: 5, background: "#E2ECE9", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${score}%`, background: "var(--color-primary)", borderRadius: 3 }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Progress counter */}
            <div style={{ padding: "12px", background: "var(--color-primary-light)", borderRadius: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: 700, color: "var(--color-primary)", marginBottom: 4 }}>
                <span>Assessment Progress</span>
                <span>{completion}%</span>
              </div>
              <div style={{ height: 6, background: "rgba(20,125,117,0.15)", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${completion}%`, background: "var(--color-primary)", borderRadius: 3 }} />
              </div>
              <small style={{ fontSize: "11px", color: "var(--text-muted)", display: "block", marginTop: 6 }}>
                {ASSESSMENT_QUESTIONS.length - Object.keys(answers).length} questions remaining
              </small>
            </div>
          </div>

          <div className="corporate-card" style={{ padding: "18px 20px", display: "flex", gap: 12, alignItems: "flex-start" }}>
            <Sparkles size={18} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <strong style={{ fontSize: "13px", color: "var(--text-heading)", display: "block", marginBottom: 2 }}>
                Evidence-Based Standard
              </strong>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0, lineHeight: 1.5 }}>
                Questions target ergonomic postures, musculoskeletal load cycles, and cognitive pacing for knowledge workers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
