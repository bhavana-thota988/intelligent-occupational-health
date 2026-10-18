import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock,
  User,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  Award,
  ChevronRight,
  Info,
  Check,
  X,
  FileText,
  Send,
  HelpCircle,
  RotateCcw,
  CheckCircle,
  ShieldAlert,
  Download,
  ExternalLink
} from "lucide-react";
import { authService } from "../../services/authService";
import { programService } from "../../services/programService";

export default function ProgramDetail() {
  const { programId } = useParams();
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  const [loading, setLoading] = useState(true);
  const [program, setProgram] = useState(null);
  const [activeTab, setActiveTab] = useState("modules"); // 'modules', 'quiz', 'overview', 'certificate'
  const [selectedModuleIndex, setSelectedModuleIndex] = useState(0);

  // Module practical notes state
  const [practicalNotes, setPracticalNotes] = useState("");
  const [completingModule, setCompletingModule] = useState(false);

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitting, setQuizSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState(null);

  // Verification submission state
  const [reflectionNotes, setReflectionNotes] = useState("");
  const [submittingVerification, setSubmittingVerification] = useState(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadProgram();
  }, [programId]);

  const loadProgram = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const data = await programService.getProgramDetails(programId);
      setProgram(data);
      if (data?.userProgress?.quizScore !== null && data?.userProgress?.quizScore !== undefined) {
        setQuizResult({
          score: data.userProgress.quizScore,
          passed: data.userProgress.quizPassed,
          passingScore: data.passingThreshold || 75
        });
      }
    } catch (err) {
      console.error("Failed to load program details:", err);
      setErrorMessage("Could not load program details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    try {
      setLoading(true);
      await programService.enrollProgram(program.id);
      await loadProgram();
    } catch (err) {
      console.error("Enroll failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteCurrentModule = async () => {
    if (!program || !program.modules || !program.modules[selectedModuleIndex]) return;
    const currentMod = program.modules[selectedModuleIndex];

    setCompletingModule(true);
    setErrorMessage("");
    setActionSuccessMessage("");
    try {
      const res = await programService.completeModule(program.id, currentMod.id, practicalNotes);
      setActionSuccessMessage(`Module "${currentMod.title}" completed successfully! Progress: ${res.progress}%`);
      setPracticalNotes("");
      await loadProgram();

      // Automatically advance to next incomplete module if available
      if (selectedModuleIndex < program.modules.length - 1) {
        setSelectedModuleIndex(selectedModuleIndex + 1);
      }
    } catch (err) {
      console.error("Failed to complete module:", err);
      setErrorMessage(err.response?.data?.detail || "Failed to mark module as complete.");
    } finally {
      setCompletingModule(false);
    }
  };

  const handleSelectQuizAnswer = (questionIndex, optionIndex) => {
    setQuizAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex
    }));
  };

  const handleSubmitQuiz = async (e) => {
    e.preventDefault();
    if (!program?.quiz?.questions) return;

    const totalQuestions = program.quiz.questions.length;
    const answeredKeys = Object.keys(quizAnswers);
    if (answeredKeys.length < totalQuestions) {
      setErrorMessage(`Please answer all ${totalQuestions} questions before submitting.`);
      return;
    }

    // Prepare array of answer indices
    const answersArray = [];
    for (let i = 0; i < totalQuestions; i++) {
      answersArray.push(quizAnswers[i] !== undefined ? quizAnswers[i] : -1);
    }

    setQuizSubmitting(true);
    setErrorMessage("");
    setActionSuccessMessage("");
    try {
      const res = await programService.submitQuiz(program.id, answersArray);
      setQuizResult(res);
      await loadProgram();
      if (res.passed) {
        setActionSuccessMessage(`Congratulations! You passed the assessment with a score of ${res.score}%!`);
      } else {
        setErrorMessage(`Assessment score: ${res.score}%. Passing threshold is ${res.passingThreshold}%. You may retake the quiz.`);
      }
    } catch (err) {
      console.error("Quiz submission error:", err);
      setErrorMessage(err.response?.data?.detail || "Failed to evaluate quiz.");
    } finally {
      setQuizSubmitting(false);
    }
  };

  const handleRetakeQuiz = () => {
    setQuizAnswers({});
    setQuizResult(null);
    setErrorMessage("");
    setActionSuccessMessage("");
  };

  const handleSubmitVerification = async (e) => {
    e.preventDefault();
    if (!reflectionNotes.trim()) {
      setErrorMessage("Please enter practical notes or observations describing your workplace implementation.");
      return;
    }

    setSubmittingVerification(true);
    setErrorMessage("");
    setActionSuccessMessage("");
    try {
      const res = await programService.submitForVerification(program.id, reflectionNotes);
      setActionSuccessMessage(res.message || "Submitted to specialist for review!");
      await loadProgram();
    } catch (err) {
      console.error("Verification submit error:", err);
      setErrorMessage(err.response?.data?.detail || "Failed to submit for specialist verification.");
    } finally {
      setSubmittingVerification(false);
    }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: 1100, margin: "40px auto", textAlign: "center", color: "#64748b" }}>
        <p style={{ fontSize: 16, fontWeight: 600 }}>Loading Program Curricula...</p>
      </div>
    );
  }

  if (!program) {
    return (
      <div style={{ maxWidth: 800, margin: "40px auto", textAlign: "center", padding: 32, background: "#fff", borderRadius: 12 }}>
        <AlertCircle size={44} color="#ef4444" style={{ margin: "0 auto 12px" }} />
        <h2>Program Not Found</h2>
        <p style={{ color: "#64748b" }}>The requested workplace program could not be located in the corporate registry.</p>
        <Link to="/employee/programs" className="btn-primary" style={{ display: "inline-block", marginTop: 16 }}>
          Return to My Programs
        </Link>
      </div>
    );
  }

  const userProg = program.userProgress || {};
  const isEnrolled = userProg.isEnrolled;
  const completedIds = userProg.completedModuleIds || [];
  const progressPct = userProg.progress || 0;
  const progStatus = userProg.status || "Not Enrolled";
  const quizPassed = userProg.quizPassed;
  const certificateId = userProg.certificateId;
  const isAwaitingVerification = progStatus === "Awaiting Verification";
  const isCompleted = progStatus === "Completed";
  const allModulesDone = program.modules && program.modules.length > 0 && completedIds.length === program.modules.length;
  const canSubmitVerification = allModulesDone && quizPassed && !isAwaitingVerification && !isCompleted;

  const currentModule = program.modules && program.modules[selectedModuleIndex] ? program.modules[selectedModuleIndex] : null;
  const isCurrentModuleCompleted = currentModule && completedIds.includes(currentModule.id);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: "1240px", margin: "0 auto", paddingBottom: 60 }}>
      {/* Back Bar */}
      <div>
        <Link
          to="/employee/programs"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            color: "#0f766e",
            fontSize: 13.5,
            fontWeight: 700,
            textDecoration: "none"
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to My Programs</span>
        </Link>
      </div>

      {/* Program Hero Header */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: 16,
          padding: "28px 32px",
          border: isCompleted
            ? "1.5px solid #a7f3d0"
            : isAwaitingVerification
            ? "1.5px solid #fed7aa"
            : "1px solid #e2e8f0",
          boxShadow: "0 2px 10px rgba(15, 23, 42, 0.04)"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#0f766e",
                  background: "#f0fdfa",
                  padding: "4px 10px",
                  borderRadius: 6,
                  border: "1px solid #ccfbf1"
                }}
              >
                {program.category}
              </span>
              <span
                style={{
                  fontSize: 11.5,
                  fontWeight: 700,
                  color: "#475569",
                  background: "#f1f5f9",
                  padding: "4px 8px",
                  borderRadius: 6
                }}
              >
                Target: {program.targetRiskArea}
              </span>
              {userProg.assignmentSource === "Assigned" && (
                <span
                  style={{
                    fontSize: 11.5,
                    fontWeight: 700,
                    color: "#15803d",
                    background: "#f0fdf4",
                    padding: "4px 8px",
                    borderRadius: 6,
                    border: "1px solid #bbf7d0"
                  }}
                >
                  Mandatory Employer Assignment
                </span>
              )}
            </div>

            <h1 style={{ fontSize: 28, fontWeight: 800, color: "#0f172a", margin: "4px 0 8px" }}>
              {program.title}
            </h1>
            <p style={{ fontSize: 14.5, color: "#64748b", margin: 0, maxWidth: 800, lineHeight: 1.55 }}>
              {program.description}
            </p>
          </div>

          {/* Status and Action Header Box */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
            {isCompleted ? (
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 14px",
                  borderRadius: 20,
                  background: "#ecfdf5",
                  color: "#059669",
                  border: "1px solid #a7f3d0",
                  fontWeight: 700,
                  fontSize: 13
                }}
              >
                <CheckCircle2 size={16} />
                <span>Verified & Certified</span>
              </div>
            ) : isAwaitingVerification ? (
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 14px",
                  borderRadius: 20,
                  background: "#fffbeb",
                  color: "#b45309",
                  border: "1px solid #fde68a",
                  fontWeight: 700,
                  fontSize: 13
                }}
              >
                <Clock size={16} />
                <span>Awaiting Specialist Approval</span>
              </div>
            ) : isEnrolled ? (
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 14px",
                  borderRadius: 20,
                  background: "#f0f9ff",
                  color: "#0284c7",
                  border: "1px solid #bae6fd",
                  fontWeight: 700,
                  fontSize: 13
                }}
              >
                <Clock size={16} />
                <span>In Progress ({progressPct}%)</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleEnroll}
                style={{
                  padding: "10px 22px",
                  borderRadius: 8,
                  background: "#0f766e",
                  color: "#ffffff",
                  border: "none",
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: "pointer"
                }}
              >
                Enroll in Program
              </button>
            )}

            <div style={{ fontSize: 12, color: "#64748b" }}>
              Supervised by: <strong>{program.trainerName}</strong> ({program.trainerRole})
            </div>
          </div>
        </div>

        {/* Progress Metrics Strip */}
        {isEnrolled && (
          <div
            style={{
              marginTop: 22,
              paddingTop: 18,
              borderTop: "1px solid #f1f5f9",
              display: "flex",
              flexDirection: "column",
              gap: 8
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13 }}>
              <span style={{ color: "#475569", fontWeight: 600 }}>
                Completion Criteria: {completedIds.length} of {program.totalModules || program.modules?.length} modules completed
                {quizPassed ? " · Quiz Passed (≥75%)" : " · Quiz Pending"}
              </span>
              <span style={{ color: "#0f766e", fontWeight: 800, fontSize: 15 }}>
                {progressPct}% Completed
              </span>
            </div>
            <div style={{ width: "100%", height: 8, background: "#e2e8f0", borderRadius: 10, overflow: "hidden" }}>
              <div
                style={{
                  width: `${progressPct}%`,
                  height: "100%",
                  background: isCompleted ? "#10b981" : "#0d9488",
                  borderRadius: 10,
                  transition: "width 0.3s ease"
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Action Messages */}
      {actionSuccessMessage && (
        <div
          style={{
            background: "#ecfdf5",
            border: "1px solid #a7f3d0",
            color: "#065f46",
            padding: "12px 16px",
            borderRadius: 8,
            fontSize: 13.5,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 8
          }}
        >
          <CheckCircle2 size={18} />
          <span>{actionSuccessMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div
          style={{
            background: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#991b1b",
            padding: "12px 16px",
            borderRadius: 8,
            fontSize: 13.5,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 8
          }}
        >
          <AlertCircle size={18} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Tabs Navigation */}
      <div style={{ display: "flex", gap: 8, borderBottom: "1px solid #e2e8f0", paddingBottom: 4 }}>
        {[
          { key: "modules", label: `Learning Modules (${completedIds.length}/${program.modules?.length || 4})`, icon: BookOpen },
          { key: "quiz", label: `Knowledge Assessment ${quizPassed ? "✓" : ""}`, icon: HelpCircle },
          { key: "overview", label: "Program Objectives", icon: Info },
          { key: "certificate", label: "Specialist Verification & Certificate", icon: Award }
        ].map((tab) => {
          const isActive = activeTab === tab.key;
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 18px",
                borderRadius: 8,
                fontSize: 13.5,
                fontWeight: isActive ? 700 : 500,
                color: isActive ? "#0f766e" : "#64748b",
                background: isActive ? "#f0fdfa" : "transparent",
                border: isActive ? "1px solid #ccfbf1" : "1px solid transparent",
                cursor: "pointer",
                transition: "all 0.15s ease"
              }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: MODULES LEARNING STUDIO */}
      {activeTab === "modules" && (
        <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 24, alignItems: "start" }}>
          {/* Left: Module List Navigation */}
          <div style={{ background: "#ffffff", borderRadius: 12, border: "1px solid #e2e8f0", padding: 14 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: "#64748b", textTransform: "uppercase", padding: "8px 10px", margin: 0 }}>
              Curriculum Modules
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
              {program.modules && program.modules.map((mod, idx) => {
                const isSelected = selectedModuleIndex === idx;
                const isDone = completedIds.includes(mod.id);
                return (
                  <button
                    key={mod.id}
                    type="button"
                    onClick={() => setSelectedModuleIndex(idx)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      textAlign: "left",
                      padding: "12px 14px",
                      borderRadius: 8,
                      border: isSelected ? "1.5px solid #0f766e" : "1px solid #f1f5f9",
                      background: isSelected ? "#f0fdfa" : isDone ? "#f8fafc" : "#ffffff",
                      cursor: "pointer"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                      <div
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 6,
                          background: isDone ? "#10b981" : isSelected ? "#0f766e" : "#e2e8f0",
                          color: "#ffffff",
                          display: "grid",
                          placeItems: "center",
                          fontSize: 11,
                          fontWeight: 700,
                          flexShrink: 0
                        }}
                      >
                        {isDone ? <Check size={14} /> : idx + 1}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: isSelected ? 700 : 600, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {mod.title}
                        </div>
                        <div style={{ fontSize: 11.5, color: "#64748b" }}>
                          {mod.estimatedDuration} · {isDone ? "Completed" : "Incomplete"}
                        </div>
                      </div>
                    </div>
                    {isDone && <CheckCircle2 size={16} color="#10b981" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Selected Module Content Reader */}
          {currentModule ? (
            <div style={{ background: "#ffffff", borderRadius: 14, border: "1px solid #e2e8f0", padding: "30px 32px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 16 }}>
                <div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#0f766e", textTransform: "uppercase" }}>
                    Module {selectedModuleIndex + 1} of {program.modules.length}
                  </span>
                  <h2 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", margin: "4px 0" }}>
                    {currentModule.title}
                  </h2>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 12.5, color: "#64748b", marginTop: 4 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <Clock size={14} color="#0d9488" />
                      Estimated Duration: <strong>{currentModule.estimatedDuration}</strong>
                    </span>
                    <span>·</span>
                    <span>Status: <strong>{isCurrentModuleCompleted ? "Completed" : "Not yet completed"}</strong></span>
                  </div>
                </div>

                {isCurrentModuleCompleted && (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      padding: "4px 10px",
                      borderRadius: 20,
                      background: "#ecfdf5",
                      color: "#059669",
                      fontSize: 12,
                      fontWeight: 700
                    }}
                  >
                    <CheckCircle2 size={14} /> Completed
                  </span>
                )}
              </div>

              {/* Summary Callout */}
              <div
                style={{
                  background: "#f8fafc",
                  borderLeft: "4px solid #0d9488",
                  padding: "14px 18px",
                  borderRadius: "0 8px 8px 0",
                  fontSize: 14,
                  color: "#334155",
                  lineHeight: 1.6,
                  marginBottom: 24
                }}
              >
                <strong>Module Overview: </strong>{currentModule.summary}
              </div>

              {/* Comprehensive Written Educational Content */}
              <div style={{ fontSize: 14.5, color: "#334155", lineHeight: 1.7, marginBottom: 28 }}>
                <div style={{ whiteSpace: "pre-line" }}>
                  {currentModule.contentMarkdown}
                </div>
              </div>

              {/* Clinical Key Takeaways */}
              {currentModule.keyTakeaways && currentModule.keyTakeaways.length > 0 && (
                <div
                  style={{
                    background: "#f0fdfa",
                    border: "1px solid #ccfbf1",
                    borderRadius: 10,
                    padding: "20px 22px",
                    marginBottom: 28
                  }}
                >
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: "#0f766e", margin: "0 0 12px", display: "flex", alignItems: "center", gap: 6 }}>
                    <Sparkles size={16} />
                    Clinical Key Takeaways
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8, fontSize: 13.5, color: "#134e4a" }}>
                    {currentModule.keyTakeaways.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Practical Activity Drill */}
              <div
                style={{
                  background: "#fffbeb",
                  border: "1px solid #fde68a",
                  borderRadius: 10,
                  padding: "20px 22px",
                  marginBottom: 28
                }}
              >
                <h4 style={{ fontSize: 14, fontWeight: 700, color: "#b45309", margin: "0 0 8px" }}>
                  Mandatory Practical Exercise: {currentModule.practicalActivity}
                </h4>
                <p style={{ fontSize: 13.5, color: "#78350f", lineHeight: 1.55, margin: "0 0 16px" }}>
                  {currentModule.activityInstructions}
                </p>

                <div>
                  <label style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: "#78350f", marginBottom: 6 }}>
                    Log Your Practical Application Notes (Saved for Specialist Review):
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe how you performed this activity at your workstation (e.g., adjusted monitor height, practiced 4 cycles of box breathing, took a 50/10 break)..."
                    value={practicalNotes}
                    onChange={(e) => setPracticalNotes(e.target.value)}
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      padding: "10px 12px",
                      borderRadius: 8,
                      border: "1px solid #cbd5e1",
                      fontSize: 13,
                      fontFamily: "inherit",
                      background: "#ffffff"
                    }}
                  />
                </div>
              </div>

              {/* Module Complete Action Button */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 16, borderTop: "1px solid #f1f5f9" }}>
                <span style={{ fontSize: 12.5, color: "#64748b" }}>
                  {isCurrentModuleCompleted ? "You have already completed this module. You can update your notes anytime." : "Practice the exercise above and mark module complete."}
                </span>

                <button
                  type="button"
                  onClick={handleCompleteCurrentModule}
                  disabled={completingModule}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 22px",
                    borderRadius: 8,
                    background: isCurrentModuleCompleted ? "#047857" : "#0f766e",
                    color: "#ffffff",
                    border: "none",
                    fontWeight: 700,
                    fontSize: 13.5,
                    cursor: completingModule ? "wait" : "pointer"
                  }}
                >
                  <CheckCircle size={16} />
                  <span>{completingModule ? "Saving Progress..." : isCurrentModuleCompleted ? "Update Module Notes" : "Complete Module"}</span>
                </button>
              </div>
            </div>
          ) : (
            <div>Please select a module to view its educational lessons.</div>
          )}
        </div>
      )}

      {/* TAB 2: KNOWLEDGE QUIZ */}
      {activeTab === "quiz" && (
        <div style={{ background: "#ffffff", borderRadius: 14, border: "1px solid #e2e8f0", padding: "32px 36px", maxWidth: 860, margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
          <div style={{ marginBottom: 24, borderBottom: "1px solid #f1f5f9", paddingBottom: 16 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#0f766e", textTransform: "uppercase" }}>
              Assessment & Validation
            </span>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", margin: "4px 0" }}>
              {program.quiz?.title || `${program.title} Knowledge Assessment`}
            </h2>
            <p style={{ fontSize: 14, color: "#64748b", margin: 0, lineHeight: 1.5 }}>
              {program.quiz?.description || `Verify your understanding of ${program.title}. Minimum passing threshold is ${program.passingThreshold || 75}%. Answers are validated on the backend.`}
            </p>
          </div>

          {/* Quiz Result Display */}
          {quizResult && (
            <div
              style={{
                background: quizResult.passed ? "#ecfdf5" : "#fff1f2",
                border: quizResult.passed ? "1.5px solid #a7f3d0" : "1.5px solid #fecdd3",
                borderRadius: 12,
                padding: "20px 24px",
                marginBottom: 28,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 16
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {quizResult.passed ? <CheckCircle2 size={22} color="#059669" /> : <AlertCircle size={22} color="#e11d48" />}
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: quizResult.passed ? "#065f46" : "#9f1239", margin: 0 }}>
                    {quizResult.passed ? "Knowledge Assessment Passed!" : "Passing Score Not Met"}
                  </h3>
                </div>
                <p style={{ fontSize: 13.5, color: quizResult.passed ? "#047857" : "#be123c", margin: "6px 0 0" }}>
                  Your evaluated score: <strong>{quizResult.score}%</strong> (Required threshold: {quizResult.passingThreshold || 75}%).
                  {quizResult.passed ? " You have satisfied the knowledge requirement for certification." : " You may retake the assessment to improve your score."}
                </p>
              </div>

              {!quizResult.passed && (
                <button
                  type="button"
                  onClick={handleRetakeQuiz}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 16px",
                    borderRadius: 8,
                    background: "#ffffff",
                    color: "#be123c",
                    border: "1px solid #fecdd3",
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: "pointer"
                  }}
                >
                  <RotateCcw size={15} />
                  <span>Retake Assessment</span>
                </button>
              )}
            </div>
          )}

          {/* Quiz Form */}
          <form onSubmit={handleSubmitQuiz}>
            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              {program.quiz?.questions?.map((q, qIndex) => {
                const selectedOption = quizAnswers[qIndex];
                return (
                  <div
                    key={qIndex}
                    style={{
                      background: "#f8fafc",
                      borderRadius: 10,
                      padding: "20px 22px",
                      border: "1px solid #e2e8f0"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 14 }}>
                      <span style={{ fontSize: 13, fontWeight: 800, color: "#0f766e" }}>
                        Q{qIndex + 1}.
                      </span>
                      <h4 style={{ fontSize: 15, fontWeight: 700, color: "#1e293b", margin: 0, lineHeight: 1.5 }}>
                        {q.question}
                      </h4>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {q.options?.map((opt, optIndex) => {
                        const isChecked = selectedOption === optIndex;
                        return (
                          <label
                            key={optIndex}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 12,
                              padding: "10px 14px",
                              borderRadius: 8,
                              background: isChecked ? "#f0fdfa" : "#ffffff",
                              border: isChecked ? "1.5px solid #0f766e" : "1px solid #e2e8f0",
                              cursor: "pointer",
                              fontSize: 13.5,
                              color: isChecked ? "#0f766e" : "#334155",
                              fontWeight: isChecked ? 600 : 500
                            }}
                          >
                            <input
                              type="radio"
                              name={`question-${qIndex}`}
                              checked={isChecked}
                              onChange={() => handleSelectQuizAnswer(qIndex, optIndex)}
                              style={{ accentColor: "#0f766e" }}
                            />
                            <span>{opt}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: 28, display: "flex", justifyContent: "flex-end", gap: 12 }}>
              <button
                type="submit"
                disabled={quizSubmitting}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "12px 28px",
                  borderRadius: 8,
                  background: "#0f766e",
                  color: "#ffffff",
                  border: "none",
                  fontWeight: 800,
                  fontSize: 14,
                  cursor: quizSubmitting ? "wait" : "pointer"
                }}
              >
                <span>{quizSubmitting ? "Grading on Server..." : "Submit Answers for Evaluation"}</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: OBJECTIVES & OVERVIEW */}
      {activeTab === "overview" && (
        <div style={{ background: "#ffffff", borderRadius: 14, border: "1px solid #e2e8f0", padding: "32px 36px" }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", margin: "0 0 12px" }}>
            Program Overview & Clinical Objectives
          </h2>
          <p style={{ fontSize: 14.5, color: "#475569", lineHeight: 1.65, margin: "0 0 24px" }}>
            {program.overview || program.description}
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0f766e", margin: "0 0 12px" }}>
            Key Learning Objectives
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 14 }}>
            {program.learningObjectives?.map((obj, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  background: "#f8fafc",
                  padding: "14px 16px",
                  borderRadius: 8,
                  border: "1px solid #e2e8f0",
                  fontSize: 13.5,
                  color: "#334155"
                }}
              >
                <CheckCircle2 size={18} color="#0d9488" style={{ flexShrink: 0, marginTop: 2 }} />
                <span>{obj}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: VERIFICATION & CERTIFICATE */}
      {activeTab === "certificate" && (
        <div style={{ background: "#ffffff", borderRadius: 14, border: "1px solid #e2e8f0", padding: "32px 36px", maxWidth: 860, margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
          <div style={{ marginBottom: 24, borderBottom: "1px solid #f1f5f9", paddingBottom: 16 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#0f766e", textTransform: "uppercase" }}>
              Occupational Governance
            </span>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", margin: "4px 0" }}>
              Certification & Specialist Verification
            </h2>
            <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>
              Under corporate occupational health standards, certificates are awarded only after all modules are finished, assessment is passed (≥75%), and workplace practice is verified by an assigned Specialist.
            </p>
          </div>

          {/* Checklist Step Visualizer */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 18px",
                borderRadius: 8,
                background: allModulesDone ? "#f0fdf4" : "#f8fafc",
                border: allModulesDone ? "1px solid #bbf7d0" : "1px solid #e2e8f0"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {allModulesDone ? <CheckCircle2 size={20} color="#15803d" /> : <Clock size={20} color="#94a3b8" />}
                <span style={{ fontSize: 14, fontWeight: 600, color: allModulesDone ? "#15803d" : "#334155" }}>
                  1. Complete All 4 Learning Modules ({completedIds.length}/4 Done)
                </span>
              </div>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: allModulesDone ? "#15803d" : "#64748b" }}>
                {allModulesDone ? "Requirement Met" : "Incomplete"}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 18px",
                borderRadius: 8,
                background: quizPassed ? "#f0fdf4" : "#f8fafc",
                border: quizPassed ? "1px solid #bbf7d0" : "1px solid #e2e8f0"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {quizPassed ? <CheckCircle2 size={20} color="#15803d" /> : <Clock size={20} color="#94a3b8" />}
                <span style={{ fontSize: 14, fontWeight: 600, color: quizPassed ? "#15803d" : "#334155" }}>
                  2. Pass Knowledge Assessment (Score: {userProg.quizScore || 0}%, Required: ≥75%)
                </span>
              </div>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: quizPassed ? "#15803d" : "#64748b" }}>
                {quizPassed ? "Requirement Met" : "Incomplete"}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 18px",
                borderRadius: 8,
                background: isCompleted ? "#f0fdf4" : isAwaitingVerification ? "#fffbeb" : "#f8fafc",
                border: isCompleted ? "1px solid #bbf7d0" : isAwaitingVerification ? "1px solid #fde68a" : "1px solid #e2e8f0"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {isCompleted ? (
                  <CheckCircle2 size={20} color="#15803d" />
                ) : isAwaitingVerification ? (
                  <Clock size={20} color="#b45309" />
                ) : (
                  <Clock size={20} color="#94a3b8" />
                )}
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: isCompleted ? "#15803d" : isAwaitingVerification ? "#b45309" : "#334155"
                  }}
                >
                  3. Specialist Clinical Verification ({program.trainerName})
                </span>
              </div>
              <span
                style={{
                  fontSize: 12.5,
                  fontWeight: 700,
                  color: isCompleted ? "#15803d" : isAwaitingVerification ? "#b45309" : "#64748b"
                }}
              >
                {isCompleted ? "Approved & Issued" : isAwaitingVerification ? "Under Review" : "Pending Submission"}
              </span>
            </div>
          </div>

          {/* Conditional Outcomes */}
          {isCompleted ? (
            <div
              style={{
                background: "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)",
                border: "2px solid #a7f3d0",
                borderRadius: 12,
                padding: "24px 28px",
                textAlign: "center"
              }}
            >
              <Award size={48} color="#059669" style={{ margin: "0 auto 12px" }} />
              <h3 style={{ fontSize: 20, fontWeight: 800, color: "#065f46", margin: "0 0 6px" }}>
                Official Certificate Awarded!
              </h3>
              <p style={{ fontSize: 13.5, color: "#047857", margin: "0 0 16px" }}>
                Verified by <strong>{program.trainerName}</strong>. Unique Certificate Registry ID:
                {" "}<code style={{ background: "#ffffff", padding: "2px 8px", borderRadius: 4, fontWeight: 800, border: "1px solid #a7f3d0" }}>{certificateId || "IOH-2026-VERIFIED"}</code>
              </p>
              <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
                {certificateId && (
                  <Link
                    to={`/verify/${certificateId}`}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "10px 20px",
                      borderRadius: 8,
                      background: "#059669",
                      color: "#ffffff",
                      fontWeight: 700,
                      fontSize: 13.5,
                      textDecoration: "none"
                    }}
                  >
                    <ExternalLink size={15} />
                    <span>View Public Certificate & QR</span>
                  </Link>
                )}
                <Link
                  to="/employee/certificates"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "10px 20px",
                    borderRadius: 8,
                    background: "#ffffff",
                    color: "#059669",
                    border: "1px solid #a7f3d0",
                    fontWeight: 700,
                    fontSize: 13.5,
                    textDecoration: "none"
                  }}
                >
                  <Award size={15} />
                  <span>My Certificates Wallet</span>
                </Link>
              </div>
            </div>
          ) : isAwaitingVerification ? (
            <div
              style={{
                background: "#fffbeb",
                border: "1.5px solid #fde68a",
                borderRadius: 12,
                padding: "22px 26px"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <Clock size={22} color="#b45309" />
                <h3 style={{ fontSize: 17, fontWeight: 800, color: "#92400e", margin: 0 }}>
                  Submission In Specialist Review Queue
                </h3>
              </div>
              <p style={{ fontSize: 13.5, color: "#78350f", lineHeight: 1.55, margin: 0 }}>
                Your practical activity notes and completed assessment have been submitted to <strong>{program.trainerName}</strong>.
                You will be notified once the specialist conducts the ISO 45001 review and issues your official credential.
              </p>
            </div>
          ) : canSubmitVerification ? (
            <form onSubmit={handleSubmitVerification} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: 13.5, fontWeight: 700, color: "#1e293b", marginBottom: 6 }}>
                  Workplace Implementation Reflection (Required for Specialist Review):
                </label>
                <textarea
                  rows={4}
                  placeholder="Summarize how you applied these program protocols during your daily work (e.g. ergonomic monitor placement, eye rest intervals, posture corrections, stress management breathing)..."
                  value={reflectionNotes}
                  onChange={(e) => setReflectionNotes(e.target.value)}
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "12px 14px",
                    borderRadius: 8,
                    border: "1px solid #cbd5e1",
                    fontSize: 13.5,
                    fontFamily: "inherit"
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={submittingVerification}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  padding: "12px 24px",
                  borderRadius: 8,
                  background: "#0f766e",
                  color: "#ffffff",
                  border: "none",
                  fontWeight: 800,
                  fontSize: 14,
                  cursor: submittingVerification ? "wait" : "pointer"
                }}
              >
                <Send size={16} />
                <span>{submittingVerification ? "Submitting to Specialist..." : "Submit to Specialist for Verification"}</span>
              </button>
            </form>
          ) : (
            <div
              style={{
                background: "#f8fafc",
                borderRadius: 10,
                padding: "20px 24px",
                border: "1px solid #e2e8f0",
                fontSize: 13.5,
                color: "#64748b",
                lineHeight: 1.55
              }}
            >
              Please finish all 4 learning modules and pass the knowledge assessment (≥75%) to unlock specialist verification and certificate generation.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
