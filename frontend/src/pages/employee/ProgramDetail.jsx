import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  User,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  Send,
  Award,
  ChevronRight,
  Info,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Smile,
  Zap,
  Flame,
  Check,
  X
} from "lucide-react";
import { authService } from "../../services/authService";
import { employeeService } from "../../services/employeeService";
import Toast from "../../components/common/Toast";

// Synthetic gentle bell chime using Web Audio API (zero external assets needed)
const playChimeSound = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    // 528Hz Solfeggio frequency (frequency associated with relaxation and stress reduction)
    osc.frequency.setValueAtTime(528, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(396, ctx.currentTime + 1.2);

    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.4);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 1.4);
  } catch (e) {
    // Audio context may require initial user gesture; ignore if blocked
  }
};

export default function ProgramDetail() {
  const { programId } = useParams();
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();
  const userId = currentUser?.id || "u-emp-1";

  const [program, setProgram] = useState(null);
  const [progressData, setProgressData] = useState({
    completedSessions: [],
    progress: 0,
    status: "not_started",
    trainerFeedback: null
  });
  const [toastMessage, setToastMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submissionNote, setSubmissionNote] = useState("");

  // Active Interactive Studio Modal State
  const [activeSessionModal, setActiveSessionModal] = useState(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [postFeeling, setPostFeeling] = useState("Relaxed & Calm");
  const [reflectionNote, setReflectionNote] = useState("");

  // Breathing Visualizer State
  const [breathingPhase, setBreathingPhase] = useState("inhale"); // 'inhale', 'hold1', 'exhale', 'hold2'
  const [breathingCycle, setBreathingCycle] = useState(1);
  const [phaseSeconds, setPhaseSeconds] = useState(4);

  // Timer Ref
  const timerRef = useRef(null);
  const breathingRef = useRef(null);

  useEffect(() => {
    loadProgramData();
  }, [programId]);

  const loadProgramData = () => {
    const prog = employeeService.getProgramById(programId);
    if (!prog) {
      const all = employeeService.getAllOfficialPrograms();
      setProgram(all[0]);
    } else {
      setProgram(prog);
    }

    const progProg = employeeService.getUserProgramProgress(programId, userId);
    setProgressData(progProg);
  };

  // Toggle session checkbox
  const handleToggleSession = (sessionId) => {
    const updated = employeeService.toggleSessionCompletion(program?.id, sessionId, userId);
    if (updated) {
      setProgressData(updated);
      const isNowCompleted = updated.completedSessions.includes(sessionId);
      if (isNowCompleted && soundEnabled) playChimeSound();
      setToastMessage(
        isNowCompleted
          ? `Session ${sessionId} marked as completed!`
          : `Session ${sessionId} unmarked.`
      );
    }
  };

  // Enroll in program
  const handleEnroll = () => {
    employeeService.enrollProgram(program?.id, userId);
    loadProgramData();
    if (soundEnabled) playChimeSound();
    setToastMessage(`Enrolled in ${program?.name}! Opening routine...`);
  };

  // Submit for Trainer Review & Certification
  const handleSubmitForReview = () => {
    setSubmitting(true);
    setTimeout(() => {
      const note = submissionNote.trim() || "Completed all prescribed workplace sessions consistently with verified habit adherence.";
      employeeService.submitProgramForReview(program?.id, currentUser, note);
      loadProgramData();
      setSubmitting(false);
      if (soundEnabled) playChimeSound();
      setToastMessage(`Submitted to ${program?.trainerAssigned?.split("(")[0] || "specialist"} for clinical verification!`);
    }, 600);
  };

  // Open Interactive Studio for a specific session
  const openSessionStudio = (session) => {
    setActiveSessionModal(session);
    setTimeLeft(session.timerSeconds || 180);
    setTimerRunning(false);
    setBreathingPhase("inhale");
    setBreathingCycle(1);
    setPhaseSeconds(4);
    setPostFeeling("Relaxed & Calm");
    setReflectionNote("");
  };

  // Close Studio
  const closeSessionStudio = () => {
    setActiveSessionModal(null);
    setTimerRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (breathingRef.current) clearInterval(breathingRef.current);
  };

  // Handle countdown timer for exercises & routines
  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setTimerRunning(false);
            if (soundEnabled) playChimeSound();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerRunning, soundEnabled]);

  // Handle Breathing Cycles (Box Breathing 4-4-4-4 or 4-7-8)
  useEffect(() => {
    if (!activeSessionModal || activeSessionModal.type !== "breathing" || !timerRunning) {
      if (breathingRef.current) clearInterval(breathingRef.current);
      return;
    }

    const is478 = activeSessionModal.title?.includes("4-7-8");
    const inhaleTime = 4;
    const hold1Time = is478 ? 7 : 4;
    const exhaleTime = is478 ? 8 : 4;
    const hold2Time = is478 ? 1 : 4;

    breathingRef.current = setInterval(() => {
      setPhaseSeconds((prevSec) => {
        if (prevSec > 1) {
          return prevSec - 1;
        }

        // Switch to next phase
        setBreathingPhase((prevPhase) => {
          if (prevPhase === "inhale") {
            if (soundEnabled) playChimeSound();
            return "hold1";
          }
          if (prevPhase === "hold1") {
            return "exhale";
          }
          if (prevPhase === "exhale") {
            if (is478) {
              setBreathingCycle((c) => c + 1);
              if (soundEnabled) playChimeSound();
              return "inhale";
            }
            return "hold2";
          }
          if (prevPhase === "hold2") {
            setBreathingCycle((c) => c + 1);
            if (soundEnabled) playChimeSound();
            return "inhale";
          }
          return "inhale";
        });

        // Set duration for new phase
        if (breathingPhase === "inhale") return hold1Time;
        if (breathingPhase === "hold1") return exhaleTime;
        if (breathingPhase === "exhale") return is478 ? inhaleTime : hold2Time;
        if (breathingPhase === "hold2") return inhaleTime;
        return 4;
      });
    }, 1000);

    return () => {
      if (breathingRef.current) clearInterval(breathingRef.current);
    };
  }, [activeSessionModal, timerRunning, breathingPhase, soundEnabled]);

  // Complete and Log Session from Studio
  const handleCompleteStudioSession = () => {
    if (!activeSessionModal) return;
    const sessionId = activeSessionModal.id;

    // Check if already completed; if not, toggle it
    if (!progressData.completedSessions.includes(sessionId)) {
      const updated = employeeService.toggleSessionCompletion(program?.id, sessionId, userId);
      if (updated) {
        setProgressData(updated);
      }
    }

    if (soundEnabled) playChimeSound();
    setToastMessage(`Session ${sessionId} completed and logged to your health record!`);
    closeSessionStudio();
  };

  if (!program) {
    return (
      <div className="corporate-card" style={{ padding: 40, textAlign: "center" }}>
        <p>Loading workplace health program...</p>
      </div>
    );
  }

  const isEnrolled = employeeService.getUserEnrollments(userId).includes(program.id);
  const completedCount = progressData.completedSessions?.length || 0;
  const isAllCompleted = completedCount >= program.totalSessions;

  // Format seconds to mm:ss
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? "0" : ""}${remainder}`;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: "1120px", margin: "0 auto" }}>
      {/* Back Link */}
      <div>
        <Link
          to="/employee/my-programs"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: "13.5px",
            fontWeight: 600,
            color: "var(--text-muted)",
            textDecoration: "none"
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to All Health Programs</span>
        </Link>
      </div>

      {/* Program Hero Banner */}
      <div
        className="corporate-card"
        style={{
          background: "linear-gradient(135deg, #0F766E 0%, #115E59 100%)",
          color: "#FFFFFF",
          padding: "34px 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 22,
          boxShadow: "0 10px 25px -5px rgba(15, 118, 110, 0.25)"
        }}
      >
        <div style={{ maxWidth: "700px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: "18px" }}>{program.emoji || "✨"}</span>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                background: "rgba(255,255,255,0.2)",
                padding: "4px 10px",
                borderRadius: 4,
                color: "#E0F2EE"
              }}
            >
              {program.shortName || program.category}
            </span>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                background: "rgba(255,255,255,0.15)",
                padding: "4px 10px",
                borderRadius: 4,
                color: "#CCFBF1"
              }}
            >
              Target: {program.targetRisk}
            </span>
          </div>

          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#FFFFFF", margin: "0 0 10px 0", lineHeight: 1.25 }}>
            {program.name}
          </h1>

          <p style={{ fontSize: "14.5px", color: "#E0F2EE", margin: "0 0 20px 0", lineHeight: 1.6 }}>
            {program.overview}
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 18, fontSize: "13px", color: "#CCFBF1" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Clock size={16} />
              <span>Duration: <strong>{program.duration}</strong> ({program.totalSessions} Sessions)</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Zap size={16} />
              <span>Effort: <strong>{program.dailyTime || "10 mins/day"}</strong></span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <User size={16} />
              <span>Specialist: <strong>{program.trainerAssigned.split("(")[0]}</strong></span>
            </div>
          </div>
        </div>

        <div>
          {!isEnrolled ? (
            <button
              type="button"
              onClick={handleEnroll}
              className="btn-primary"
              style={{
                backgroundColor: "#FFFFFF",
                color: "#0F766E",
                fontWeight: 800,
                padding: "13px 26px",
                fontSize: "14.5px",
                boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
                display: "flex",
                alignItems: "center",
                gap: 8
              }}
            >
              <span>Enroll in Program</span>
              <Sparkles size={16} />
            </button>
          ) : (
            <div
              style={{
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(6px)",
                padding: "18px 24px",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.3)",
                minWidth: "220px",
                textAlign: "center"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 4 }}>
                <Flame size={16} color="#FEF08A" />
                <span style={{ fontSize: "11px", fontWeight: 800, color: "#FEF08A", textTransform: "uppercase" }}>
                  Active Streak
                </span>
              </div>
              <div style={{ fontSize: "32px", fontWeight: 900, color: "#FFFFFF", marginBottom: 2 }}>
                {progressData.progress}%
              </div>
              <span style={{ fontSize: "12.5px", color: "#CCFBF1" }}>
                {completedCount} of {program.totalSessions} sessions logged
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Why Recommended Notice */}
      <div
        className="corporate-card"
        style={{
          background: "#F0FDFA",
          border: "1px solid #CCFBF1",
          padding: "18px 22px",
          display: "flex",
          alignItems: "flex-start",
          gap: 14
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: "#CCFBF1",
            color: "#0F766E",
            display: "grid",
            placeItems: "center",
            flexShrink: 0
          }}
        >
          <Info size={18} />
        </div>
        <div>
          <strong style={{ fontSize: "13.5px", color: "#0F766E", display: "block", marginBottom: 3 }}>
            Clinical & Workplace Health Rationale
          </strong>
          <p style={{ fontSize: "13px", color: "var(--text-body)", margin: 0, lineHeight: 1.5 }}>
            {program.whyRecommended}
          </p>
        </div>
      </div>

      {/* Progress & Milestone Action Card */}
      {isEnrolled && (
        <div className="corporate-card" style={{ padding: "24px 28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 10 }}>
            <div>
              <h3 style={{ fontSize: "17px", fontWeight: 800, color: "var(--text-heading)", margin: "0 0 4px 0" }}>
                Curriculum Progression & Milestone
              </h3>
              <p style={{ fontSize: "12.5px", color: "var(--text-muted)", margin: 0 }}>
                Click <strong>"Start Guided Session"</strong> on any session to launch the interactive timer and audio player.
              </p>
            </div>
            <div>
              <span
                className={`badge ${
                  progressData.status === "verified"
                    ? "badge-low"
                    : progressData.status === "awaiting_review"
                    ? "badge-mod"
                    : progressData.status === "needs_correction"
                    ? "badge-high"
                    : "badge-low"
                }`}
                style={{ fontSize: "12px", padding: "5px 12px", fontWeight: 700 }}
              >
                {progressData.status === "verified"
                  ? "✓ Verified & Certificate Issued"
                  : progressData.status === "awaiting_review"
                  ? "⏳ Awaiting Trainer Verification"
                  : progressData.status === "needs_correction"
                  ? "⚠️ Adjustments Requested"
                  : isAllCompleted
                  ? "★ Ready for Verification"
                  : "Active In Progress"}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div style={{ height: 10, background: "#E2ECE9", borderRadius: 5, overflow: "hidden", marginBottom: 18 }}>
            <div
              style={{
                height: "100%",
                width: `${progressData.progress}%`,
                background: progressData.status === "verified" ? "#0F766E" : "#14B8A6",
                borderRadius: 5,
                transition: "width 0.4s ease"
              }}
            />
          </div>

          {/* State: Verified */}
          {progressData.status === "verified" && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "#F0FDF4",
                padding: "16px 20px",
                borderRadius: 10,
                border: "1px solid #BBF7D0",
                color: "#166534",
                flexWrap: "wrap",
                gap: 12
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <CheckCircle2 size={24} color="#166534" />
                <div>
                  <strong style={{ fontSize: "14px", display: "block" }}>
                    Verified by {program.trainerAssigned}
                  </strong>
                  <span style={{ fontSize: "12.5px", color: "#15803D" }}>
                    Specialist Feedback: "{progressData.trainerFeedback || "Exemplary session consistency."}"
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigate("/employee/certificates")}
                className="btn-primary"
                style={{ padding: "9px 20px", fontSize: "13.5px", fontWeight: 700 }}
              >
                <Award size={16} />
                <span>View & Print Official Certificate</span>
              </button>
            </div>
          )}

          {/* State: Awaiting Review */}
          {progressData.status === "awaiting_review" && (
            <div
              style={{
                background: "#FEF8EC",
                padding: "22px 26px",
                borderRadius: 12,
                border: "1.5px solid #F59E0B",
                color: "#92400E"
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 10,
                      background: "#FEF3C7",
                      color: "#D97706",
                      display: "grid",
                      placeItems: "center",
                      flexShrink: 0,
                      border: "1px solid #FDE68A"
                    }}
                  >
                    <Clock size={22} />
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <strong style={{ fontSize: "16px", color: "#92400E" }}>
                        Submitted to Specialist — Review in Progress
                      </strong>
                      <span className="badge badge-mod" style={{ fontSize: "11px", padding: "2px 8px" }}>
                        In Trainer Queue
                      </span>
                    </div>
                    <p style={{ fontSize: "13.5px", color: "#78350F", margin: "0 0 10px 0", lineHeight: 1.5 }}>
                      Your curriculum has been submitted to <strong>{program.trainerAssigned}</strong>.
                      Your specialist is currently reviewing your session log and routine adherence.
                    </p>
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        background: "#FFFBEB",
                        padding: "8px 14px",
                        borderRadius: 8,
                        border: "1px dashed #D97706",
                        fontSize: "12.5px",
                        color: "#92400E",
                        fontWeight: 600
                      }}
                    >
                      <ShieldCheck size={16} color="#D97706" />
                      <span>🔒 Certificate Locked: Automatically unlocked and issued once your trainer accepts the program.</span>
                    </div>
                  </div>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => navigate("/employee/certificates")}
                    className="btn-secondary"
                    style={{ padding: "10px 18px", fontSize: "13px", color: "#92400E", borderColor: "#FCD34D", background: "#FFFFFF", fontWeight: 700 }}
                  >
                    <Award size={15} />
                    <span>Check Certificates Vault</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* State: 100% Completed, Ready for Verification */}
          {isAllCompleted && progressData.status !== "awaiting_review" && progressData.status !== "verified" && (
            <div
              style={{
                background: "linear-gradient(135deg, #ECFDF5 0%, #F0FDF4 100%)",
                border: "2px solid #059669",
                padding: "24px 28px",
                borderRadius: 12,
                display: "flex",
                flexDirection: "column",
                gap: 16
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 10,
                      background: "#D1FAE5",
                      color: "#059669",
                      display: "grid",
                      placeItems: "center",
                      flexShrink: 0,
                      border: "1px solid #A7F3D0"
                    }}
                  >
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: "17px", fontWeight: 800, color: "#065F46", margin: "0 0 4px 0" }}>
                      Curriculum Completed (100%) — Action Required: Submit for Trainer Evaluation
                    </h3>
                    <p style={{ fontSize: "13.5px", color: "#047857", margin: 0, lineHeight: 1.5 }}>
                      Congratulations! You have logged all {program.totalSessions} sessions of <strong>{program.name}</strong>.
                      To earn your official verified certificate, submit your routine to your assigned specialist: <strong>{program.trainerAssigned}</strong>.
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    background: "#FEF3C7",
                    border: "1px solid #FDE68A",
                    padding: "6px 12px",
                    borderRadius: 6,
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "#92400E",
                    display: "flex",
                    alignItems: "center",
                    gap: 6
                  }}
                >
                  <span>🔒 Certificate requires Trainer Approval</span>
                </div>
              </div>

              {/* Reflection Notes for Specialist */}
              <div style={{ background: "#FFFFFF", padding: "16px 18px", borderRadius: 8, border: "1px solid #A7F3D0" }}>
                <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "#065F46", marginBottom: 6 }}>
                  Workplace Routine Reflection & Feedback for Specialist (Optional):
                </label>
                <textarea
                  rows={2}
                  value={submissionNote}
                  onChange={(e) => setSubmissionNote(e.target.value)}
                  placeholder="e.g. Completed all daily sessions at my desk; noticed major tension relief in my neck and shoulders and improved afternoon concentration..."
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 6,
                    border: "1px solid #CBD5E1",
                    fontSize: "13px",
                    color: "var(--text-heading)",
                    resize: "vertical",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              {/* Action Button & Clinical Notice */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
                <div style={{ fontSize: "12px", color: "#047857", maxWidth: "600px", lineHeight: 1.5 }}>
                  <strong>Compliance Guarantee:</strong> Official certified certificates are granted exclusively when reviewed and approved by an authorized occupational therapist or ergonomics specialist.
                </div>

                <button
                  type="button"
                  onClick={handleSubmitForReview}
                  className="btn-primary"
                  style={{
                    padding: "12px 28px",
                    fontSize: "14px",
                    fontWeight: 800,
                    backgroundColor: "#059669",
                    color: "#FFFFFF",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    boxShadow: "0 4px 12px rgba(5, 150, 105, 0.25)"
                  }}
                  disabled={submitting}
                >
                  <Send size={16} />
                  <span>{submitting ? "Submitting to Specialist..." : "Submit to Trainer for Review & Certification"}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Curriculum Sessions List */}
      <div className="corporate-card" style={{ padding: "28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
          <div>
            <h2 style={{ fontSize: "19px", fontWeight: 800, color: "var(--text-heading)", margin: "0 0 4px 0" }}>
              Guided Curriculum Sessions ({completedCount}/{program.totalSessions} Completed)
            </h2>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: 0 }}>
              Launch each session during your scheduled work intervals. Check off or complete in studio to log progress.
            </p>
          </div>
          <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 600 }}>
            Supervised by {program.trainerAssigned.split("(")[0]}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {program.sessions.map((session, idx) => {
            const isCompleted = progressData.completedSessions?.includes(session.id);

            return (
              <div
                key={session.id}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 16,
                  padding: "18px 20px",
                  borderRadius: 10,
                  background: isCompleted ? "#F8FAF9" : "#FFFFFF",
                  border: isCompleted ? "1.5px solid #99F6E4" : "1px solid var(--border-subtle)",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                  transition: "all 0.15s ease"
                }}
              >
                {/* Fast Checkbox Toggle Button */}
                <button
                  type="button"
                  onClick={() => isEnrolled && handleToggleSession(session.id)}
                  disabled={!isEnrolled}
                  title={isEnrolled ? (isCompleted ? "Mark pending" : "Mark completed") : "Enroll to check off sessions"}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 7,
                    border: isCompleted ? "none" : "2px solid #94A3B8",
                    background: isCompleted ? "#0F766E" : "transparent",
                    color: "#FFFFFF",
                    display: "grid",
                    placeItems: "center",
                    cursor: isEnrolled ? "pointer" : "not-allowed",
                    marginTop: 2,
                    flexShrink: 0,
                    transition: "all 0.15s ease"
                  }}
                >
                  {isCompleted && <CheckCircle2 size={18} />}
                </button>

                {/* Session Content */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6, flexWrap: "wrap", gap: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: "11px", fontWeight: 800, color: "#0F766E", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                        Session {idx + 1}
                      </span>
                      <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>•</span>
                      <span style={{ fontSize: "12px", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
                        <Clock size={13} />
                        {session.duration}
                      </span>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: 4,
                          background: session.type === "breathing" ? "#EEF2FF" : session.type === "movement" ? "#F0FDF4" : "#F8FAFC",
                          color: session.type === "breathing" ? "#4338CA" : session.type === "movement" ? "#15803D" : "#475569"
                        }}
                      >
                        {session.type === "breathing" ? "🌬️ Breathing Protocol" : session.type === "movement" ? "🧘 Guided Movement" : "📋 Ergonomics Check"}
                      </span>
                    </div>

                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: 700,
                        color: isCompleted ? "#0F766E" : "#94A3B8"
                      }}
                    >
                      {isCompleted ? "✓ Completed" : "Pending Routine"}
                    </span>
                  </div>

                  <h4 style={{ fontSize: "15.5px", fontWeight: 700, color: "var(--text-heading)", margin: "0 0 6px 0" }}>
                    {session.title}
                  </h4>

                  <p style={{ fontSize: "13.5px", color: "var(--text-body)", margin: "0 0 12px 0", lineHeight: 1.5 }}>
                    {session.instructions}
                  </p>

                  {/* Step highlights preview */}
                  {session.steps && session.steps.length > 0 && (
                    <div style={{ background: "#F8FAFC", padding: "10px 14px", borderRadius: 6, marginBottom: 14, fontSize: "12.5px", color: "#334155" }}>
                      <strong style={{ display: "block", fontSize: "11px", textTransform: "uppercase", color: "#64748B", marginBottom: 4 }}>
                        Session Routine Summary:
                      </strong>
                      <ol style={{ margin: 0, paddingLeft: 18, lineHeight: 1.5 }}>
                        {session.steps.slice(0, 2).map((step, sIdx) => (
                          <li key={sIdx}>{step}</li>
                        ))}
                        {session.steps.length > 2 && (
                          <li style={{ color: "#0F766E", fontWeight: 600 }}>
                            + {session.steps.length - 2} more guided steps in player
                          </li>
                        )}
                      </ol>
                    </div>
                  )}

                  {/* Interactive Session Studio Button */}
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <button
                      type="button"
                      onClick={() => openSessionStudio(session)}
                      className="btn-secondary"
                      style={{
                        padding: "7px 16px",
                        fontSize: "12.5px",
                        fontWeight: 700,
                        color: "#0F766E",
                        borderColor: "#99F6E4",
                        background: "#F0FDFA",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6
                      }}
                    >
                      <Play size={13} color="#0F766E" />
                      <span>{isCompleted ? "Repeat Guided Session" : "Start Guided Routine"}</span>
                    </button>
                    {session.tip && (
                      <span style={{ fontSize: "11.5px", color: "#64748B", fontStyle: "italic" }}>
                        💡 {session.tip}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          INTERACTIVE GUIDED SESSION STUDIO (MODAL PLAYER)
      ========================================================================= */}
      {activeSessionModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.75)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: 16
          }}
          onClick={closeSessionStudio}
        >
          <div
            className="corporate-card animate-scale-in"
            style={{
              width: "100%",
              maxWidth: "640px",
              maxHeight: "90vh",
              overflowY: "auto",
              background: "#FFFFFF",
              borderRadius: "16px",
              padding: "28px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #E2E8F0", paddingBottom: 16, marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: "22px" }}>{program.emoji || "✨"}</span>
                <div>
                  <span style={{ fontSize: "11px", fontWeight: 800, color: "#0F766E", textTransform: "uppercase" }}>
                    Workplace Health Studio • {program.shortName || program.name}
                  </span>
                  <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#0F172A", margin: "2px 0 0" }}>
                    {activeSessionModal.title}
                  </h3>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button
                  type="button"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  title={soundEnabled ? "Mute audio cues" : "Enable audio bell chimes"}
                  style={{
                    background: soundEnabled ? "#F0FDFA" : "#F1F5F9",
                    border: "1px solid #CBD5E1",
                    borderRadius: "6px",
                    padding: "6px 10px",
                    cursor: "pointer",
                    color: soundEnabled ? "#0F766E" : "#64748B",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    fontSize: "12px",
                    fontWeight: 600
                  }}
                >
                  {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                  <span>{soundEnabled ? "Chime On" : "Muted"}</span>
                </button>

                <button
                  type="button"
                  onClick={closeSessionStudio}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#64748B", padding: 4 }}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Studio Core: Breathing Visualizer vs Routine Timer */}
            {activeSessionModal.type === "breathing" ? (
              <div
                style={{
                  background: "linear-gradient(180deg, #F0FDFA 0%, #E6FFFA 100%)",
                  borderRadius: 12,
                  padding: "32px 24px",
                  textAlign: "center",
                  border: "1px solid #99F6E4",
                  marginBottom: 20
                }}
              >
                <div style={{ fontSize: "12px", fontWeight: 700, color: "#0F766E", textTransform: "uppercase", marginBottom: 12 }}>
                  Live Breath Regulation • Cycle {breathingCycle}
                </div>

                {/* Animated Breathing Sphere */}
                <div
                  style={{
                    width: 140,
                    height: 140,
                    borderRadius: "50%",
                    background: "radial-gradient(circle, #2DD4BF 0%, #0F766E 100%)",
                    margin: "0 auto 16px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#FFFFFF",
                    boxShadow: "0 0 35px rgba(45, 212, 191, 0.45)",
                    transform:
                      breathingPhase === "inhale"
                        ? "scale(1.25)"
                        : breathingPhase === "hold1"
                        ? "scale(1.25)"
                        : breathingPhase === "exhale"
                        ? "scale(0.85)"
                        : "scale(0.85)",
                    transition: "transform 4s cubic-bezier(0.4, 0, 0.2, 1)"
                  }}
                >
                  <span style={{ fontSize: "16px", fontWeight: 800, textTransform: "uppercase" }}>
                    {breathingPhase === "inhale"
                      ? "Inhale"
                      : breathingPhase === "hold1"
                      ? "Hold"
                      : breathingPhase === "exhale"
                      ? "Exhale"
                      : "Hold"}
                  </span>
                  <span style={{ fontSize: "28px", fontWeight: 900 }}>
                    {phaseSeconds}s
                  </span>
                </div>

                <p style={{ fontSize: "13.5px", color: "#134E4A", margin: "0 0 16px 0", fontWeight: 600 }}>
                  {breathingPhase === "inhale"
                    ? "Fill your lungs steadily through your nose..."
                    : breathingPhase === "hold1"
                    ? "Gently hold your breath, relaxing facial muscles..."
                    : breathingPhase === "exhale"
                    ? "Release air slowly through your mouth..."
                    : "Pause calmly in the stillness before next breath..."}
                </p>

                {/* Breathing Controls */}
                <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
                  <button
                    type="button"
                    onClick={() => {
                      setTimerRunning(!timerRunning);
                      if (!timerRunning && soundEnabled) playChimeSound();
                    }}
                    style={{
                      background: timerRunning ? "#D97706" : "#0F766E",
                      color: "#FFFFFF",
                      border: "none",
                      borderRadius: 8,
                      padding: "10px 22px",
                      fontSize: "13.5px",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 6
                    }}
                  >
                    {timerRunning ? <Pause size={15} /> : <Play size={15} />}
                    <span>{timerRunning ? "Pause Breathwork" : "Start Guided Breathing"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setTimerRunning(false);
                      setBreathingPhase("inhale");
                      setBreathingCycle(1);
                      setPhaseSeconds(4);
                    }}
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid #CBD5E1",
                      borderRadius: 8,
                      padding: "10px 14px",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#475569",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 4
                    }}
                  >
                    <RotateCcw size={14} />
                    <span>Reset</span>
                  </button>
                </div>
              </div>
            ) : (
              <div
                style={{
                  background: "#F8FAFC",
                  borderRadius: 12,
                  padding: "24px",
                  textAlign: "center",
                  border: "1px solid #E2E8F0",
                  marginBottom: 20
                }}
              >
                <div style={{ fontSize: "12px", fontWeight: 700, color: "#64748B", textTransform: "uppercase", marginBottom: 6 }}>
                  Workday Routine Countdown Timer
                </div>

                <div style={{ fontSize: "44px", fontWeight: 900, color: "#0F766E", letterSpacing: "1px", marginBottom: 12 }}>
                  {formatTime(timeLeft)}
                </div>

                <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
                  <button
                    type="button"
                    onClick={() => {
                      setTimerRunning(!timerRunning);
                      if (!timerRunning && soundEnabled) playChimeSound();
                    }}
                    style={{
                      background: timerRunning ? "#D97706" : "#0F766E",
                      color: "#FFFFFF",
                      border: "none",
                      borderRadius: 8,
                      padding: "10px 22px",
                      fontSize: "13.5px",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 6
                    }}
                  >
                    {timerRunning ? <Pause size={15} /> : <Play size={15} />}
                    <span>{timerRunning ? "Pause Timer" : "Start Timer"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTimeLeft((t) => t + 60)}
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid #CBD5E1",
                      borderRadius: 8,
                      padding: "10px 14px",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#475569",
                      cursor: "pointer"
                    }}
                  >
                    +1 Min
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setTimerRunning(false);
                      setTimeLeft(activeSessionModal.timerSeconds || 180);
                    }}
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid #CBD5E1",
                      borderRadius: 8,
                      padding: "10px 14px",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#475569",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 4
                    }}
                  >
                    <RotateCcw size={14} />
                    <span>Reset</span>
                  </button>
                </div>
              </div>
            )}

            {/* Step-by-Step Instructions */}
            <div style={{ marginBottom: 20 }}>
              <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#0F172A", margin: "0 0 10px 0", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                Step-by-Step Protocol Instructions:
              </h4>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {(activeSessionModal.steps || [activeSessionModal.instructions]).map((step, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 12,
                      background: "#F8FAFC",
                      padding: "10px 14px",
                      borderRadius: 8,
                      border: "1px solid #E2E8F0"
                    }}
                  >
                    <span
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        background: "#0F766E",
                        color: "#FFFFFF",
                        display: "grid",
                        placeItems: "center",
                        fontSize: "11px",
                        fontWeight: 800,
                        flexShrink: 0,
                        marginTop: 1
                      }}
                    >
                      {idx + 1}
                    </span>
                    <span style={{ fontSize: "13px", color: "#1E293B", lineHeight: 1.5 }}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>

              {activeSessionModal.tip && (
                <div style={{ marginTop: 12, padding: "10px 14px", background: "#FEF9C3", borderRadius: 8, border: "1px solid #FEF08A", color: "#854D0E", fontSize: "12.5px" }}>
                  <strong>Specialist Clinical Form Tip: </strong> {activeSessionModal.tip}
                </div>
              )}
            </div>

            {/* Post-Session Energy Check-in */}
            <div style={{ background: "#F1F5F9", padding: "16px", borderRadius: 10, marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "#334155", marginBottom: 8 }}>
                Post-Routine Energy & Sensation:
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
                {[
                  "😌 Relaxed & Calm",
                  "⚡ Re-energized & Alert",
                  "🧘 Neck/Back Relieved",
                  "👍 Feeling Better"
                ].map((feel) => (
                  <button
                    key={feel}
                    type="button"
                    onClick={() => setPostFeeling(feel)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: 6,
                      border: postFeeling === feel ? "1.5px solid #0F766E" : "1px solid #CBD5E1",
                      background: postFeeling === feel ? "#CCFBF1" : "#FFFFFF",
                      color: postFeeling === feel ? "#0F766E" : "#475569",
                      fontSize: "12.5px",
                      fontWeight: postFeeling === feel ? 700 : 500,
                      cursor: "pointer"
                    }}
                  >
                    {feel}
                  </button>
                ))}
              </div>

              <input
                type="text"
                placeholder="Optional personal note or workstation reflection (e.g., lower back stiffness subsided)..."
                value={reflectionNote}
                onChange={(e) => setReflectionNote(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: 6,
                  border: "1px solid #CBD5E1",
                  fontSize: "12.5px",
                  backgroundColor: "#FFFFFF"
                }}
              />
            </div>

            {/* Modal Footer Actions */}
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={closeSessionStudio}
                className="btn-secondary"
                style={{ padding: "10px 18px", fontSize: "13px" }}
              >
                Close Studio
              </button>

              <button
                type="button"
                onClick={handleCompleteStudioSession}
                className="btn-primary"
                style={{
                  padding: "10px 24px",
                  fontSize: "13.5px",
                  fontWeight: 800,
                  backgroundColor: "#0F766E",
                  color: "#FFFFFF",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 6
                }}
              >
                <Check size={16} />
                <span>Complete & Log Session to Record</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast message={toastMessage} onClose={() => setToastMessage("")} />
    </div>
  );
}
