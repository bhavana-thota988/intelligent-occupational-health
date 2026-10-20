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
  ChevronLeft,
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
  ExternalLink,
  Play,
  Pause,
  Zap,
  Target,
  ListChecks,
  CheckSquare
} from "lucide-react";
import { authService } from "../../services/authService";
import { programService } from "../../services/programService";

const PROGRAM_DRILL_TAGS = {
  "ergonomic-wellness": [
    "✓ Adjusted chair height for 90° elbow angle",
    "✓ Positioned top 1/3 of monitor at eye level",
    "✓ Planted feet flat on floor / footrest",
    "✓ Practiced 5 cervical chin tucks",
    "✓ Maintained neutral floating wrist alignment"
  ],
  "stress-management": [
    "✓ Completed 4 cycles of Box Breathing (4-4-4-4)",
    "✓ Practiced 4-7-8 parasympathetic reset",
    "✓ Consciously relaxed jaw, neck & shoulder muscles",
    "✓ Set 60-min uninterrupted deep-work focus block",
    "✓ Established clear end-of-day shutdown ritual"
  ],
  "fatigue-and-sleep-management": [
    "✓ 50/10 micro-movement break taken",
    "✓ Drank 300ml cold water for hydration alertness",
    "✓ Adjusted circadian room lighting & screen blue-light",
    "✓ Conducted 3-minute brisk postural stretch walk",
    "✓ Scheduled 10:30 PM digital wind-down curfew"
  ],
  "workplace-safety-essentials": [
    "✓ Checked workstation perimeter for trip hazards",
    "✓ Verified clear access to emergency exit route",
    "✓ Positioned power strips safely off walk paths",
    "✓ Tested safe two-hand lift posture with bent knees",
    "✓ Noted workplace first-aid & emergency contact list"
  ],
  "healthy-lifestyle-at-work": [
    "✓ Logged 500ml water bottle refill",
    "✓ Replaced sugary snack with protein & fresh fruit",
    "✓ Conducted 5-minute standing desk posture interval",
    "✓ Practiced seated spinal rotational twist",
    "✓ Completed 250 postural desk-side steps"
  ],
  "digital-eye-care": [
    "✓ Executed 20-20-20 Rule (Gazed 20ft away for 20s)",
    "✓ Blinked 10 complete cycles to rehydrate tear film",
    "✓ Calibrated screen brightness to match room ambient light",
    "✓ Activated system Night Light / warm display filter",
    "✓ Cleaned monitor glass of dust & fingerprint glare"
  ]
};

function formatInlineText(text) {
  if (!text) return null;
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} style={{ color: "#0f172a", fontWeight: 700 }}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

function renderFormattedMarkdown(markdown) {
  if (!markdown) return null;
  const lines = markdown.split("\n");
  const elements = [];
  let currentList = [];

  const flushList = () => {
    if (currentList.length > 0) {
      elements.push(
        <div key={`list-${elements.length}`} style={{ display: "flex", flexDirection: "column", gap: 8, margin: "14px 0" }}>
          {currentList}
        </div>
      );
      currentList = [];
    }
  };

  lines.forEach((rawLine, idx) => {
    const line = rawLine.trim();
    if (!line) {
      flushList();
      return;
    }

    if (line.startsWith("### ")) {
      flushList();
      elements.push(
        <div
          key={`h3-${idx}`}
          style={{
            background: "linear-gradient(135deg, #f0fdfa 0%, #f8fafc 100%)",
            borderLeft: "4px solid #0f766e",
            padding: "12px 16px",
            borderRadius: "0 8px 8px 0",
            margin: "20px 0 12px"
          }}
        >
          <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0f766e", margin: 0 }}>
            {formatInlineText(line.replace("### ", ""))}
          </h3>
        </div>
      );
    } else if (line.startsWith("#### ")) {
      flushList();
      elements.push(
        <h4
          key={`h4-${idx}`}
          style={{
            fontSize: 14.5,
            fontWeight: 700,
            color: "#1e293b",
            margin: "18px 0 10px",
            display: "flex",
            alignItems: "center",
            gap: 8
          }}
        >
          <span style={{ width: 6, height: 16, background: "#0d9488", borderRadius: 3, display: "inline-block" }} />
          {formatInlineText(line.replace("#### ", ""))}
        </h4>
      );
    } else if (/^\d+\.\s/.test(line)) {
      const stepNumber = line.match(/^(\d+)\.\s/)[1];
      const stepText = line.replace(/^\d+\.\s/, "");
      currentList.push(
        <div
          key={`step-${idx}`}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: 10,
            padding: "12px 16px",
            boxShadow: "0 1px 2px rgba(0,0,0,0.02)"
          }}
        >
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              background: "#0f766e",
              color: "#ffffff",
              display: "grid",
              placeItems: "center",
              fontSize: 12,
              fontWeight: 800,
              flexShrink: 0,
              marginTop: 2
            }}
          >
            {stepNumber}
          </div>
          <div style={{ fontSize: 13.5, color: "#334155", lineHeight: 1.6, flex: 1 }}>
            {formatInlineText(stepText)}
          </div>
        </div>
      );
    } else if (line.startsWith("- [x]") || line.startsWith("- [ ]")) {
      const isChecked = line.startsWith("- [x]");
      const itemText = line.replace(/^-\s*\[(x| )\]\s*/, "");
      currentList.push(
        <div
          key={`check-${idx}`}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: isChecked ? "#f0fdf4" : "#f8fafc",
            border: isChecked ? "1px solid #bbf7d0" : "1px solid #e2e8f0",
            borderRadius: 8,
            padding: "9px 14px",
            fontSize: 13.5,
            color: "#334155"
          }}
        >
          <div style={{ color: isChecked ? "#16a34a" : "#94a3b8", display: "flex" }}>
            <CheckCircle2 size={16} />
          </div>
          <span>{formatInlineText(itemText)}</span>
        </div>
      );
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      const bulletText = line.replace(/^[-*]\s+/, "");
      currentList.push(
        <div
          key={`bullet-${idx}`}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
            fontSize: 13.5,
            color: "#334155",
            lineHeight: 1.55,
            paddingLeft: 4
          }}
        >
          <span style={{ color: "#0d9488", fontWeight: "bold", fontSize: 16, lineHeight: 1, marginTop: 3 }}>•</span>
          <div>{formatInlineText(bulletText)}</div>
        </div>
      );
    } else {
      flushList();
      elements.push(
        <p key={`p-${idx}`} style={{ fontSize: 14, color: "#334155", lineHeight: 1.65, margin: "10px 0" }}>
          {formatInlineText(line)}
        </p>
      );
    }
  });

  flushList();
  return elements;
}

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

  // Active Desk Drill Stopwatch / Timer
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [timerActive, setTimerActive] = useState(false);
  const [timerFinished, setTimerFinished] = useState(false);

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

  // Sync module notes and reset exercise timer when selected module changes
  useEffect(() => {
    if (program?.modules && program.modules[selectedModuleIndex]) {
      const currentMod = program.modules[selectedModuleIndex];
      const savedNotes = program.userProgress?.practicalNotes?.[currentMod.id] ||
                         program.userProgress?.practicalNotes?.[currentMod.order] || "";
      setPracticalNotes(savedNotes);
      setTimerSeconds(60);
      setTimerActive(false);
      setTimerFinished(false);
    }
  }, [selectedModuleIndex, program]);

  // Exercise countdown timer tick
  useEffect(() => {
    let interval = null;
    if (timerActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerActive && timerSeconds === 0) {
      setTimerActive(false);
      setTimerFinished(true);
    }
    return () => clearInterval(interval);
  }, [timerActive, timerSeconds]);

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
          passingScore: data.passingThreshold || 60,
          correctCount: data.userProgress.quizCorrectCount !== undefined ? data.userProgress.quizCorrectCount : (data.userProgress.quizPassed ? (data.quiz?.questions?.length || 5) : 0),
          totalQuestions: data.userProgress.quizTotalQuestions || data.quiz?.questions?.length || 5,
          detailedResults: data.userProgress.quizDetailedResults || null
        });
      }
      if (data?.userProgress?.quizSubmittedAnswers) {
        setQuizAnswers(data.userProgress.quizSubmittedAnswers);
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
      await programService.enrollProgram(program.slug || program.id);
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
      const res = await programService.completeModule(program.slug || program.id, currentMod.id || currentMod.order, practicalNotes);
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

  const handleAddQuickTag = (tag) => {
    setPracticalNotes((prev) => {
      if (!prev || !prev.trim()) return tag;
      if (prev.includes(tag)) return prev;
      return `${prev}\n${tag}`;
    });
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
      const res = await programService.submitQuiz(program.slug || program.id, answersArray);
      setQuizResult(res);
      await loadProgram();
      if (res.passed) {
        setActionSuccessMessage(`Assessment Passed! You answered ${res.correctCount !== undefined ? res.correctCount : 5} of ${res.totalQuestions || 5} questions correctly (${res.score}%). Review details below.`);
      } else {
        setActionSuccessMessage(`You scored ${res.correctCount !== undefined ? res.correctCount : 0} of ${res.totalQuestions || 5} (${res.score}%). Please review the questions below and retake.`);
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
      const res = await programService.submitForVerification(program.slug || program.id, reflectionNotes);
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
          {/* Left: Interactive Curriculum Stepper Sidebar */}
          <div style={{ background: "#ffffff", borderRadius: 14, border: "1px solid #e2e8f0", padding: "18px 16px", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
            <div style={{ marginBottom: 14, paddingBottom: 12, borderBottom: "1px solid #f1f5f9" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Curriculum Progress
                </span>
                <span style={{ fontSize: 12, fontWeight: 800, color: "#0f766e" }}>
                  {completedIds.length} / {program.modules?.length || 4} Completed
                </span>
              </div>
              {/* Progress Bar */}
              <div style={{ width: "100%", height: 6, background: "#e2e8f0", borderRadius: 4, overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    width: `${Math.round((completedIds.length / (program.modules?.length || 1)) * 100)}%`,
                    background: "linear-gradient(90deg, #0d9488 0%, #10b981 100%)",
                    transition: "width 0.3s ease"
                  }}
                />
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
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
                      borderRadius: 10,
                      border: isSelected ? "1.5px solid #0f766e" : "1px solid #f1f5f9",
                      background: isSelected ? "#f0fdfa" : isDone ? "#f8fafc" : "#ffffff",
                      cursor: "pointer",
                      boxShadow: isSelected ? "0 2px 4px rgba(15, 118, 110, 0.08)" : "none",
                      transition: "all 0.15s ease"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                      <div
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: 7,
                          background: isDone ? "#10b981" : isSelected ? "#0f766e" : "#e2e8f0",
                          color: "#ffffff",
                          display: "grid",
                          placeItems: "center",
                          fontSize: 12,
                          fontWeight: 700,
                          flexShrink: 0
                        }}
                      >
                        {isDone ? <Check size={15} /> : idx + 1}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: isSelected ? 800 : 600, color: isSelected ? "#0f766e" : "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {mod.title}
                        </div>
                        <div style={{ fontSize: 11.5, color: "#64748b", marginTop: 2 }}>
                          {mod.estimatedDuration} · {isDone ? "Completed ✓" : "In Progress"}
                        </div>
                      </div>
                    </div>
                    {isDone && <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0 }} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Selected Module Content Reader */}
          {currentModule ? (
            <div style={{ background: "#ffffff", borderRadius: 14, border: "1px solid #e2e8f0", padding: "30px 32px", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
              {/* Module Header Bar */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 16 }}>
                <div>
                  <span style={{ fontSize: 11.5, fontWeight: 800, color: "#0f766e", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Module {selectedModuleIndex + 1} of {program.modules.length} · Practical Curriculum
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
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <ShieldCheck size={14} color="#059669" />
                      Clinical Standard Protocol
                    </span>
                  </div>
                </div>

                {isCurrentModuleCompleted ? (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      padding: "4px 12px",
                      borderRadius: 20,
                      background: "#ecfdf5",
                      color: "#059669",
                      fontSize: 12,
                      fontWeight: 700,
                      border: "1px solid #a7f3d0"
                    }}
                  >
                    <CheckCircle2 size={14} /> Completed
                  </span>
                ) : (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      padding: "4px 12px",
                      borderRadius: 20,
                      background: "#f1f5f9",
                      color: "#64748b",
                      fontSize: 12,
                      fontWeight: 700
                    }}
                  >
                    In Progress
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
                <strong style={{ color: "#0f766e" }}>Module Core Concept: </strong>
                {currentModule.summary}
              </div>

              {/* Comprehensive Formatted Educational Content */}
              <div style={{ marginBottom: 28 }}>
                {renderFormattedMarkdown(currentModule.contentMarkdown)}
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

              {/* UNIQUE: Interactive Desk Drill & Exercise Timer Widget */}
              <div
                style={{
                  background: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
                  border: "1.5px solid #fde68a",
                  borderRadius: 12,
                  padding: "20px 24px",
                  marginBottom: 28,
                  boxShadow: "0 2px 4px rgba(217, 119, 6, 0.06)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: "#f59e0b", color: "#ffffff", display: "grid", placeItems: "center" }}>
                      <Zap size={18} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: 14.5, fontWeight: 800, color: "#92400e", margin: 0 }}>
                        Interactive Desk Drill: {currentModule.practicalActivity?.split(":")[0] || "Workstation Calibration"}
                      </h4>
                      <span style={{ fontSize: 12, color: "#b45309" }}>Active micro-movement drill (60-second guided interval)</span>
                    </div>
                  </div>

                  {/* Timer Controls */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#ffffff", padding: "6px 14px", borderRadius: 30, border: "1px solid #fde68a" }}>
                    <Clock size={16} color="#d97706" />
                    <span style={{ fontSize: 16, fontWeight: 800, color: "#78350f", fontFamily: "monospace" }}>
                      {String(Math.floor(timerSeconds / 60)).padStart(2, "0")}:{String(timerSeconds % 60).padStart(2, "0")}
                    </span>
                    <button
                      type="button"
                      onClick={() => setTimerActive(!timerActive)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        padding: "4px 10px",
                        borderRadius: 20,
                        background: timerActive ? "#fef2f2" : "#ecfdf5",
                        color: timerActive ? "#dc2626" : "#059669",
                        border: timerActive ? "1px solid #fca5a5" : "1px solid #a7f3d0",
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: "pointer"
                      }}
                    >
                      {timerActive ? <Pause size={12} /> : <Play size={12} />}
                      <span>{timerActive ? "Pause" : timerSeconds === 60 ? "Start Drill" : "Resume"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => { setTimerActive(false); setTimerSeconds(60); setTimerFinished(false); }}
                      title="Reset Timer"
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#94a3b8",
                        display: "flex",
                        padding: 2
                      }}
                    >
                      <RotateCcw size={14} />
                    </button>
                  </div>
                </div>

                <p style={{ fontSize: 13.5, color: "#78350f", lineHeight: 1.6, margin: "0 0 14px" }}>
                  {currentModule.activityInstructions || currentModule.practicalActivity}
                </p>

                {timerFinished && (
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#ecfdf5", color: "#065f46", border: "1px solid #a7f3d0", padding: "6px 12px", borderRadius: 8, fontSize: 12.5, fontWeight: 700, marginBottom: 12 }}>
                    <CheckCircle2 size={15} color="#059669" />
                    <span>60-Second Drill Completed! Click the quick-select tags below to log your workstation adjustment.</span>
                  </div>
                )}

                {/* Quick-Select Action Tags */}
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#92400e", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Quick-Select Action Tags (Click to Add):
                  </label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                    {(PROGRAM_DRILL_TAGS[program.slug] || [
                      "✓ Completed recommended desk exercise",
                      "✓ Posture calibrated for neutral alignment",
                      "✓ Adjusted screen and lighting parameters",
                      "✓ Practiced 5-minute movement break"
                    ]).map((tag, tagIdx) => (
                      <button
                        key={tagIdx}
                        type="button"
                        onClick={() => handleAddQuickTag(tag)}
                        style={{
                          background: practicalNotes.includes(tag) ? "#fef3c7" : "#ffffff",
                          border: practicalNotes.includes(tag) ? "1.5px solid #d97706" : "1px solid #e2e8f0",
                          color: practicalNotes.includes(tag) ? "#92400e" : "#475569",
                          padding: "5px 11px",
                          borderRadius: 20,
                          fontSize: 12,
                          fontWeight: practicalNotes.includes(tag) ? 700 : 500,
                          cursor: "pointer",
                          transition: "all 0.15s ease"
                        }}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>

                  <label style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: "#78350f", marginBottom: 6 }}>
                    Practical Reflection Notes (Saved for Specialist Review):
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe how you performed this activity at your workstation..."
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

              {/* Module Navigation & Complete Footer */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 20, borderTop: "1px solid #f1f5f9", flexWrap: "wrap", gap: 12 }}>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => setSelectedModuleIndex((prev) => Math.max(0, prev - 1))}
                    disabled={selectedModuleIndex === 0}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "9px 16px",
                      borderRadius: 8,
                      background: "#ffffff",
                      border: "1px solid #cbd5e1",
                      color: selectedModuleIndex === 0 ? "#94a3b8" : "#334155",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: selectedModuleIndex === 0 ? "not-allowed" : "pointer"
                    }}
                  >
                    <ChevronLeft size={16} />
                    <span>Previous Module</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (selectedModuleIndex < program.modules.length - 1) {
                        setSelectedModuleIndex((prev) => prev + 1);
                      } else {
                        setActiveTab("quiz");
                      }
                    }}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "9px 16px",
                      borderRadius: 8,
                      background: "#ffffff",
                      border: "1px solid #cbd5e1",
                      color: "#334155",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer"
                    }}
                  >
                    <span>{selectedModuleIndex < program.modules.length - 1 ? "Next Module" : "Go to Assessment"}</span>
                    <ChevronRight size={16} />
                  </button>
                </div>

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
                    cursor: completingModule ? "wait" : "pointer",
                    boxShadow: "0 1px 3px rgba(15, 118, 110, 0.2)"
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

      {/* TAB 2: KNOWLEDGE QUIZ & REVIEW WITH CORRECT/WRONG INDICATORS */}
      {activeTab === "quiz" && (
        <div style={{ background: "#ffffff", borderRadius: 14, border: "1px solid #e2e8f0", padding: "32px 36px", maxWidth: 860, margin: "0 auto", width: "100%", boxSizing: "border-box", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
          <div style={{ marginBottom: 24, borderBottom: "1px solid #f1f5f9", paddingBottom: 16 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#0f766e", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Assessment & Validation
            </span>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", margin: "4px 0" }}>
              {program.quiz?.title || `${program.title} Knowledge Assessment`}
            </h2>
            <p style={{ fontSize: 14, color: "#64748b", margin: 0, lineHeight: 1.5 }}>
              {program.quiz?.description || `Verify your understanding of ${program.title}. Complete all 5 questions below.`}
            </p>
          </div>

          {/* Assessment Result Summary Banner */}
          {quizResult && (
            <div
              style={{
                background: quizResult.passed ? "#f0fdf4" : "#fef2f2",
                border: quizResult.passed ? "1.5px solid #86efac" : "1.5px solid #fca5a5",
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
                  {quizResult.passed ? (
                    <CheckCircle2 size={22} color="#16a34a" />
                  ) : (
                    <AlertCircle size={22} color="#dc2626" />
                  )}
                  <h3
                    style={{
                      fontSize: 17,
                      fontWeight: 800,
                      color: quizResult.passed ? "#15803d" : "#991b1b",
                      margin: 0
                    }}
                  >
                    {quizResult.passed ? "Assessment Passed!" : "Assessment Needs Review"}
                  </h3>
                </div>
                <p
                  style={{
                    fontSize: 14,
                    color: quizResult.passed ? "#166534" : "#7f1d1d",
                    margin: "6px 0 0",
                    fontWeight: 500
                  }}
                >
                  You answered <strong>{quizResult.correctCount !== undefined ? quizResult.correctCount : (quizResult.passed ? 5 : 0)} of {quizResult.totalQuestions || 5}</strong> questions correctly ({quizResult.score}%). Passing threshold is {program.passingThreshold || 60}%.
                </p>

                <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "#ffffff", padding: "4px 10px", borderRadius: 20, border: "1px solid #86efac", fontSize: 12, fontWeight: 700, color: "#16a34a" }}>
                    <Check size={14} /> {quizResult.correctCount !== undefined ? quizResult.correctCount : 5} Correct
                  </span>
                  {((quizResult.totalQuestions || 5) - (quizResult.correctCount !== undefined ? quizResult.correctCount : 5)) > 0 && (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "#ffffff", padding: "4px 10px", borderRadius: 20, border: "1px solid #fca5a5", fontSize: 12, fontWeight: 700, color: "#dc2626" }}>
                      <X size={14} /> {(quizResult.totalQuestions || 5) - (quizResult.correctCount !== undefined ? quizResult.correctCount : 0)} Incorrect
                    </span>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={handleRetakeQuiz}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "9px 18px",
                  borderRadius: 8,
                  background: "#ffffff",
                  color: "#334155",
                  border: "1.5px solid #cbd5e1",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
                }}
              >
                <RotateCcw size={15} />
                <span>Retake Assessment</span>
              </button>
            </div>
          )}

          {/* Mode 1: Review Mode (when quizResult is present) */}
          {quizResult ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {program.quiz?.questions?.map((q, qIndex) => {
                const userChoice = quizAnswers[qIndex];
                const correctIdx = q.correct_index !== undefined ? q.correct_index : (q.correct_option !== undefined ? q.correct_option : 0);
                const isUserCorrect = userChoice === correctIdx;

                return (
                  <div
                    key={qIndex}
                    style={{
                      background: "#ffffff",
                      borderRadius: 12,
                      padding: "20px 22px",
                      border: isUserCorrect ? "1.5px solid #86efac" : "1.5px solid #fca5a5",
                      boxShadow: isUserCorrect ? "0 1px 3px rgba(22, 163, 74, 0.08)" : "0 1px 3px rgba(239, 68, 68, 0.08)"
                    }}
                  >
                    {/* Question Header */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 14 }}>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                        <span style={{ fontSize: 13, fontWeight: 800, color: isUserCorrect ? "#16a34a" : "#dc2626" }}>
                          Q{qIndex + 1}.
                        </span>
                        <h4 style={{ fontSize: 15, fontWeight: 700, color: "#1e293b", margin: 0, lineHeight: 1.5 }}>
                          {q.question}
                        </h4>
                      </div>

                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          padding: "3px 10px",
                          borderRadius: 20,
                          background: isUserCorrect ? "#ecfdf5" : "#fef2f2",
                          color: isUserCorrect ? "#059669" : "#dc2626",
                          border: isUserCorrect ? "1px solid #a7f3d0" : "1px solid #fecaca",
                          fontSize: 12,
                          fontWeight: 700,
                          flexShrink: 0
                        }}
                      >
                        {isUserCorrect ? <CheckCircle2 size={13} /> : <X size={13} />}
                        <span>{isUserCorrect ? "Correct (+20 pts)" : "Incorrect"}</span>
                      </span>
                    </div>

                    {/* Options with Exact Right and Wrong Highlighting */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {q.options?.map((opt, optIndex) => {
                        const isUserPick = userChoice === optIndex;
                        const isTarget = optIndex === correctIdx;

                        let optBg = "#ffffff";
                        let optBorder = "1px solid #e2e8f0";
                        let optColor = "#475569";
                        let optBadge = null;

                        if (isUserPick && isTarget) {
                          // User picked correctly
                          optBg = "#f0fdf4";
                          optBorder = "2px solid #22c55e";
                          optColor = "#15803d";
                          optBadge = (
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "#dcfce7", color: "#15803d", padding: "3px 8px", borderRadius: 6, fontSize: 11.5, fontWeight: 700 }}>
                              <Check size={12} /> Your Answer (Correct)
                            </span>
                          );
                        } else if (isUserPick && !isTarget) {
                          // User picked wrong
                          optBg = "#fef2f2";
                          optBorder = "2px solid #ef4444";
                          optColor = "#b91c1c";
                          optBadge = (
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "#fee2e2", color: "#b91c1c", padding: "3px 8px", borderRadius: 6, fontSize: 11.5, fontWeight: 700 }}>
                              <X size={12} /> Your Answer (Incorrect)
                            </span>
                          );
                        } else if (!isUserPick && isTarget) {
                          // The correct answer that user missed
                          optBg = "#f0fdf4";
                          optBorder = "2px solid #22c55e";
                          optColor = "#15803d";
                          optBadge = (
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "#dcfce7", color: "#15803d", padding: "3px 8px", borderRadius: 6, fontSize: 11.5, fontWeight: 700 }}>
                              <Check size={12} /> Correct Answer
                            </span>
                          );
                        }

                        return (
                          <div
                            key={optIndex}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              padding: "11px 16px",
                              borderRadius: 8,
                              background: optBg,
                              border: optBorder,
                              fontSize: 13.5,
                              color: optColor,
                              fontWeight: (isUserPick || isTarget) ? 600 : 400
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              {isTarget ? (
                                <CheckCircle2 size={17} color="#16a34a" />
                              ) : isUserPick ? (
                                <X size={17} color="#ef4444" />
                              ) : (
                                <div style={{ width: 16, height: 16, borderRadius: "50%", border: "1.5px solid #cbd5e1" }} />
                              )}
                              <span>{opt}</span>
                            </div>
                            {optBadge}
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation Callout */}
                    {q.explanation && (
                      <div
                        style={{
                          marginTop: 12,
                          background: "#f8fafc",
                          borderLeft: "4px solid #0f766e",
                          padding: "10px 14px",
                          borderRadius: "0 8px 8px 0",
                          fontSize: 13,
                          color: "#334155",
                          lineHeight: 1.5
                        }}
                      >
                        <strong style={{ color: "#0f766e" }}>💡 Clinical Explanation: </strong>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}

              <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                <button
                  type="button"
                  onClick={handleRetakeQuiz}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "10px 20px",
                    borderRadius: 8,
                    background: "#ffffff",
                    color: "#334155",
                    border: "1.5px solid #cbd5e1",
                    fontWeight: 700,
                    fontSize: 13.5,
                    cursor: "pointer"
                  }}
                >
                  <RotateCcw size={15} />
                  <span>Retake Assessment</span>
                </button>

                {canSubmitVerification && (
                  <button
                    type="button"
                    onClick={() => setActiveTab("certificate")}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "11px 24px",
                      borderRadius: 8,
                      background: "#0f766e",
                      color: "#ffffff",
                      border: "none",
                      fontWeight: 700,
                      fontSize: 14,
                      cursor: "pointer"
                    }}
                  >
                    <span>Proceed to Specialist Verification</span>
                    <ChevronRight size={16} />
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Mode 2: Taking Quiz Mode */
            <form onSubmit={handleSubmitQuiz}>
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                {program.quiz?.questions?.map((q, qIndex) => {
                  const selectedOption = quizAnswers[qIndex];
                  const isAnswered = selectedOption !== undefined;
                  return (
                    <div
                      key={qIndex}
                      style={{
                        background: "#ffffff",
                        borderRadius: 12,
                        padding: "20px 22px",
                        border: isAnswered ? "1.5px solid #0f766e" : "1px solid #e2e8f0",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.03)"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 14 }}>
                        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                          <span style={{ fontSize: 13, fontWeight: 800, color: "#0f766e" }}>
                            Q{qIndex + 1}.
                          </span>
                          <h4 style={{ fontSize: 15, fontWeight: 700, color: "#1e293b", margin: 0, lineHeight: 1.5 }}>
                            {q.question}
                          </h4>
                        </div>
                        {isAnswered && (
                          <span style={{ background: "#f0fdfa", color: "#0f766e", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 12, border: "1px solid #ccfbf1" }}>
                            Answered
                          </span>
                        )}
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
                                padding: "12px 16px",
                                borderRadius: 8,
                                background: isChecked ? "#f0fdfa" : "#f8fafc",
                                border: isChecked ? "2px solid #0f766e" : "1px solid #e2e8f0",
                                cursor: "pointer",
                                fontSize: 13.5,
                                color: isChecked ? "#0f766e" : "#334155",
                                fontWeight: isChecked ? 700 : 500,
                                transition: "all 0.15s ease"
                              }}
                            >
                              <input
                                type="radio"
                                name={`question-${qIndex}`}
                                checked={isChecked}
                                onChange={() => handleSelectQuizAnswer(qIndex, optIndex)}
                                style={{ accentColor: "#0f766e", width: 16, height: 16 }}
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

              <div style={{ marginTop: 28, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                <span style={{ fontSize: 13, color: "#64748b" }}>
                  {Object.keys(quizAnswers).length} of {program.quiz?.questions?.length || 5} questions answered
                </span>

                <button
                  type="submit"
                  disabled={quizSubmitting || Object.keys(quizAnswers).length < (program.quiz?.questions?.length || 5)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "12px 28px",
                    borderRadius: 8,
                    background: Object.keys(quizAnswers).length < (program.quiz?.questions?.length || 5) ? "#94a3b8" : "#0f766e",
                    color: "#ffffff",
                    border: "none",
                    fontWeight: 800,
                    fontSize: 14,
                    cursor: quizSubmitting || Object.keys(quizAnswers).length < (program.quiz?.questions?.length || 5) ? "not-allowed" : "pointer"
                  }}
                >
                  <span>{quizSubmitting ? "Evaluating Assessment..." : "Submit 5 Answers for Grading"}</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </form>
          )}
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
              Under corporate occupational health standards, certificates are awarded only after all modules are finished, assessment is passed (≥60%), and workplace practice is verified by an assigned Specialist.
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
                  2. Pass Knowledge Assessment {quizPassed ? "(Completed)" : "(5 Questions)"}
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
