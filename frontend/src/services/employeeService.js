import { Sun, Watch, Coffee, Moon } from "lucide-react";
import { dataStore, OFFICIAL_PROGRAMS } from "./dataStore";

export const ASSESSMENT_QUESTIONS = [
  {
    id: 1,
    phase: "Morning",
    phaseIcon: Sun,
    category: "Recovery",
    question: "How many hours do you usually sleep on a working day?",
    helper: "Think about your normal weekday routine.",
    options: [
      { label: "Less than 5 hours", score: 4 },
      { label: "5–6 hours", score: 3 },
      { label: "6–7 hours", score: 2 },
      { label: "More than 7 hours", score: 1 },
    ],
  },
  {
    id: 2,
    phase: "Morning",
    phaseIcon: Sun,
    category: "Recovery",
    question: "How do you usually feel when you start your workday?",
    helper: "Choose the feeling that describes most mornings.",
    options: [
      { label: "Very tired", score: 4 },
      { label: "A little tired", score: 3 },
      { label: "Mostly refreshed", score: 2 },
      { label: "Energetic", score: 1 },
    ],
  },
  {
    id: 3,
    phase: "Morning",
    phaseIcon: Sun,
    category: "Recovery",
    question: "How often do you skip breakfast before work?",
    helper: "Consider your usual working days.",
    options: [
      { label: "Almost every day", score: 4 },
      { label: "Often", score: 3 },
      { label: "Sometimes", score: 2 },
      { label: "Rarely or never", score: 1 },
    ],
  },
  {
    id: 4,
    phase: "Work",
    phaseIcon: Watch,
    category: "Activity",
    question: "How many hours do you spend sitting during work?",
    helper: "Include desk work, meetings and other seated activities.",
    options: [
      { label: "More than 9 hours", score: 4 },
      { label: "7–9 hours", score: 3 },
      { label: "4–7 hours", score: 2 },
      { label: "Less than 4 hours", score: 1 },
    ],
  },
  {
    id: 5,
    phase: "Work",
    phaseIcon: Watch,
    category: "Activity",
    question: "How many hours do you spend looking at a screen?",
    helper: "Include laptop, desktop and other work screens.",
    options: [
      { label: "More than 9 hours", score: 4 },
      { label: "7–9 hours", score: 3 },
      { label: "4–7 hours", score: 2 },
      { label: "Less than 4 hours", score: 1 },
    ],
  },
  {
    id: 6,
    phase: "Work",
    phaseIcon: Watch,
    category: "Posture",
    question: "How often do you change your sitting position?",
    helper: "Think about movement while working at your desk.",
    options: [
      { label: "Almost never", score: 4 },
      { label: "Only a few times", score: 3 },
      { label: "Every 1–2 hours", score: 2 },
      { label: "Frequently", score: 1 },
    ],
  },
  {
    id: 7,
    phase: "Work",
    phaseIcon: Watch,
    category: "Posture",
    question: "How would you describe your workstation setup?",
    helper: "Consider your chair, monitor and desk position.",
    options: [
      { label: "Very uncomfortable", score: 4 },
      { label: "Needs improvement", score: 3 },
      { label: "Mostly comfortable", score: 2 },
      { label: "Well arranged", score: 1 },
    ],
  },
  {
    id: 8,
    phase: "Work",
    phaseIcon: Watch,
    category: "Posture",
    question: "How often do you experience neck or shoulder discomfort?",
    helper: "Think about discomfort during or after work.",
    options: [
      { label: "Almost every day", score: 4 },
      { label: "Several times a week", score: 3 },
      { label: "Sometimes", score: 2 },
      { label: "Rarely or never", score: 1 },
    ],
  },
  {
    id: 9,
    phase: "Breaks",
    phaseIcon: Coffee,
    category: "Activity",
    question: "How often do you take movement breaks?",
    helper: "Short walks, stretching or standing breaks count.",
    options: [
      { label: "Almost never", score: 4 },
      { label: "Once or twice", score: 3 },
      { label: "Every 1–2 hours", score: 2 },
      { label: "Frequently", score: 1 },
    ],
  },
  {
    id: 10,
    phase: "Breaks",
    phaseIcon: Coffee,
    category: "Activity",
    question: "How much walking do you usually do during your workday?",
    helper: "Include walking around the workplace.",
    options: [
      { label: "Very little", score: 4 },
      { label: "10–20 minutes", score: 3 },
      { label: "20–40 minutes", score: 2 },
      { label: "More than 40 minutes", score: 1 },
    ],
  },
  {
    id: 11,
    phase: "Breaks",
    phaseIcon: Coffee,
    category: "Recovery",
    question: "How often do you stretch or perform simple exercises?",
    helper: "This can happen at work or outside work.",
    options: [
      { label: "Never", score: 4 },
      { label: "Rarely", score: 3 },
      { label: "A few times a week", score: 2 },
      { label: "Most days", score: 1 },
    ],
  },
  {
    id: 12,
    phase: "Evening",
    phaseIcon: Moon,
    category: "Stress",
    question: "How mentally demanding does your workday feel?",
    helper: "Consider concentration, deadlines and decision-making.",
    options: [
      { label: "Extremely demanding", score: 4 },
      { label: "Quite demanding", score: 3 },
      { label: "Moderately demanding", score: 2 },
      { label: "Comfortably manageable", score: 1 },
    ],
  },
  {
    id: 13,
    phase: "Evening",
    phaseIcon: Moon,
    category: "Stress",
    question: "How often do you feel mentally exhausted after work?",
    helper: "Think about how you feel at the end of a normal day.",
    options: [
      { label: "Almost every day", score: 4 },
      { label: "Often", score: 3 },
      { label: "Sometimes", score: 2 },
      { label: "Rarely", score: 1 },
    ],
  },
  {
    id: 14,
    phase: "Evening",
    phaseIcon: Moon,
    category: "Stress",
    question: "How often does work-related stress affect your personal time?",
    helper: "For example, difficulty switching off after work.",
    options: [
      { label: "Almost every day", score: 4 },
      { label: "Often", score: 3 },
      { label: "Sometimes", score: 2 },
      { label: "Rarely or never", score: 1 },
    ],
  },
  {
    id: 15,
    phase: "Evening",
    phaseIcon: Moon,
    category: "Recovery",
    question: "How well do you recover before the next workday?",
    helper: "Think about sleep, relaxation and mental recovery.",
    options: [
      { label: "I rarely recover", score: 4 },
      { label: "Recovery is difficult", score: 3 },
      { label: "I usually recover", score: 2 },
      { label: "I recover very well", score: 1 },
    ],
  },
  {
    id: 16,
    phase: "Evening",
    phaseIcon: Moon,
    category: "Stress",
    question: "How would you describe your overall workday right now?",
    helper: "Choose the option that best represents your current experience.",
    options: [
      { label: "Overwhelming", score: 4 },
      { label: "Often difficult", score: 3 },
      { label: "Mostly manageable", score: 2 },
      { label: "Comfortable and balanced", score: 1 },
    ],
  },
];

export const calculateScoresFromAnswers = (answers = {}) => {
  const totals = {
    Posture: [],
    Activity: [],
    Stress: [],
    Recovery: [],
  };

  ASSESSMENT_QUESTIONS.forEach((q) => {
    const score = answers[q.id];
    if (score !== undefined) {
      totals[q.category].push(score);
    }
  });

  const categoryScores = {};
  Object.entries(totals).forEach(([category, values]) => {
    if (!values.length) {
      categoryScores[category] = 30;
      return;
    }
    const avg = values.reduce((s, v) => s + v, 0) / values.length;
    const scaled = Math.round(((avg - 1) / 3) * 100);
    categoryScores[category] = scaled;
  });

  // Calculate Workload as weighted blend of Stress and Recovery
  const workloadScore = Math.round(((categoryScores.Stress || 35) + (categoryScores.Recovery || 35)) / 2);
  categoryScores.Workload = workloadScore;

  const overallScore = Math.round(
    (categoryScores.Posture * 0.25) +
    (categoryScores.Activity * 0.25) +
    (categoryScores.Stress * 0.25) +
    (categoryScores.Recovery * 0.25)
  );

  return {
    categoryScores,
    overallScore: isNaN(overallScore) ? 38 : overallScore
  };
};

export const getRiskTier = (score) => {
  if (score >= 60) return { label: "High", className: "badge-high", color: "#C93B3B" };
  if (score >= 30) return { label: "Moderate", className: "badge-mod", color: "#C97A1C" };
  return { label: "Low", className: "badge-low", color: "#147D75" };
};

export const employeeService = {
  getAssessmentScores: (userId) => {
    const id = typeof userId === "string" ? userId : (dataStore.getCurrentUser()?.id || "u-emp-1");
    const scores = dataStore.getUserRiskScores(id);
    if (scores && scores.overallScore !== null && scores.overallScore !== undefined) {
      return {
        ...scores,
        hasCompleted: true
      };
    }
    return {
      overallScore: null,
      categoryScores: {
        Posture: 45,
        Activity: 45,
        Stress: 40,
        Recovery: 35,
        Workload: 40
      },
      hasCompleted: false
    };
  },

  saveAssessment: (arg1, arg2, arg3, arg4) => {
    // Handle both saveAssessment(userId, answers) and saveAssessment(answers, catScores, overallScore, email/userId)
    let userId;
    let answers;
    if (typeof arg1 === "string") {
      userId = arg1;
      answers = arg2 || {};
    } else {
      answers = arg1 || {};
      userId = typeof arg4 === "string" ? arg4 : (dataStore.getCurrentUser()?.id || "u-emp-1");
    }

    const { categoryScores, overallScore } = calculateScoresFromAnswers(answers);
    return dataStore.saveUserAssessment(userId, answers, categoryScores, overallScore);
  },

  getRecommendations: (userId) => {
    const id = typeof userId === "string" ? userId : (dataStore.getCurrentUser()?.id || "u-emp-1");
    const scores = dataStore.getUserRiskScores(id)?.categoryScores || {
      Posture: 50,
      Activity: 45,
      Stress: 40,
      Recovery: 35,
      Workload: 40
    };

    const recs = [];

    // Rule 1: High/Moderate Posture Risk -> Posture & Ergonomics OR Workplace Yoga
    if ((scores.Posture || 0) >= 30) {
      recs.push({
        id: "rec-ergonomics",
        programId: "workplace-ergonomics-posture",
        programName: "Posture & Ergonomics",
        title: "Workstation Ergonomic Calibration",
        riskArea: "Posture Risk",
        whyRecommended: "Your assessment indicates physical discomfort and static desk loading during work hours.",
        recommendedAction: "Calibrate chair elevation, monitor eye level, and implement seated spinal extension pauses.",
        priority: (scores.Posture || 0) >= 60 ? "High" : "Moderate",
        estimatedEffort: "3 Weeks • 6 Sessions",
        duration: "3 Weeks"
      });
      recs.push({
        id: "rec-yoga-mobility",
        programId: "workplace-yoga-mobility",
        programName: "Workplace Yoga",
        title: "Desk Yoga & Spine Flexibility",
        riskArea: "Posture & Joint Mobility",
        whyRecommended: "Forward cervical posture and tight hip flexors benefit from progressive restorative mobility.",
        recommendedAction: "Follow structured 10-15 minute desk mobility sequences guided by an occupational therapist.",
        priority: (scores.Posture || 0) >= 60 ? "High" : "Moderate",
        estimatedEffort: "4 Weeks • 8 Sessions",
        duration: "4 Weeks"
      });
    }

    // Rule 2: High/Moderate Stress Risk -> Stress Relief OR Guided Meditation
    if ((scores.Stress || 0) >= 30 || recs.length < 2) {
      recs.push({
        id: "rec-stress-reset",
        programId: "stress-relief-burnout-reset",
        programName: "Stress Relief",
        title: "Workday Stress & Cortisol Reset",
        riskArea: "Stress & Cognitive Fatigue",
        whyRecommended: "Your assessment scores reflect elevated task pacing, deadline pressure, and mental exhaustion.",
        recommendedAction: "Practice 4-7-8 breathing and vagus nerve resets to quickly calm sympathetic nervous arousal.",
        priority: (scores.Stress || 0) >= 60 ? "High" : "Moderate",
        estimatedEffort: "4 Weeks • 8 Sessions",
        duration: "4 Weeks"
      });
      recs.push({
        id: "rec-meditation",
        programId: "guided-meditation-stress-reset",
        programName: "Guided Meditation",
        title: "Daily Meditation & Focus Centering",
        riskArea: "Mindfulness & Mental Calm",
        whyRecommended: "Calms racing thoughts, sharpens cognitive focus, and prevents mental burnout.",
        recommendedAction: "Practice 10-minute daily mindfulness pauses and box breathing.",
        priority: (scores.Stress || 0) >= 60 ? "High" : "Moderate",
        estimatedEffort: "4 Weeks • 8 Sessions",
        duration: "4 Weeks"
      });
    }

    // Rule 3: High/Moderate Activity Risk -> Daily Walking
    if ((scores.Activity || 0) >= 30 || recs.length < 3) {
      recs.push({
        id: "rec-movement-breaks",
        programId: "daily-movement-stretch-breaks",
        programName: "Daily Walking",
        title: "Desk-Side Active Movement Protocols",
        riskArea: "Sedentary Duration",
        whyRecommended: "Prolonged uninterrupted chair time identified (over 7+ hours seated per workday).",
        recommendedAction: "Adopt the 50/10 workday cadence: 50 minutes desk work, 2-minute dynamic standing break.",
        priority: (scores.Activity || 0) >= 60 ? "High" : "Moderate",
        estimatedEffort: "3 Weeks • 6 Sessions",
        duration: "3 Weeks"
      });
    }

    // Rule 4: Recovery Risk -> Sleep & Recovery
    if ((scores.Recovery || 0) >= 30 || recs.length < 4) {
      recs.push({
        id: "rec-sleep-recovery",
        programId: "healthy-recovery-sleep-habits",
        programName: "Sleep & Recovery",
        title: "Nocturnal Recovery & Sleep Architecture",
        riskArea: "Circadian Recovery Deficit",
        whyRecommended: "Suboptimal morning vitality and screen exposure prior to sleep impact daytime energy.",
        recommendedAction: "Establish a 45-minute digital curfew and light-anchoring morning protocol.",
        priority: (scores.Recovery || 0) >= 60 ? "High" : "Moderate",
        estimatedEffort: "2 Weeks • 4 Sessions",
        duration: "2 Weeks"
      });
    }

    return recs;
  },

  getAllOfficialPrograms: () => {
    return OFFICIAL_PROGRAMS;
  },

  getProgramById: (programId) => {
    return OFFICIAL_PROGRAMS.find((p) => p.id === programId || p.slug === programId || p.tag?.toLowerCase() === programId?.toLowerCase()) || null;
  },

  enrollProgram: (programId, userId) => {
    const id = typeof userId === "string" ? userId : (dataStore.getCurrentUser()?.id || "u-emp-1");
    return dataStore.enrollUserProgram(id, programId);
  },

  getUserEnrollments: (userId) => {
    const id = typeof userId === "string" ? userId : (dataStore.getCurrentUser()?.id || "u-emp-1");
    return dataStore.getUserEnrollments(id);
  },

  getUserProgramProgress: (programId, userId) => {
    const id = typeof userId === "string" ? userId : (dataStore.getCurrentUser()?.id || "u-emp-1");
    return dataStore.getUserProgramProgress(id, programId);
  },

  toggleSessionCompletion: (programId, sessionId, userId) => {
    const id = typeof userId === "string" ? userId : (dataStore.getCurrentUser()?.id || "u-emp-1");
    return dataStore.toggleSessionCompletion(id, programId, sessionId);
  },

  submitProgramForReview: (programId, user, reflection) => {
    const currentUser = user || dataStore.getCurrentUser();
    return dataStore.submitProgramForReview(currentUser, programId, reflection);
  },

  getUserCertificates: (userId) => {
    const id = typeof userId === "string" ? userId : (dataStore.getCurrentUser()?.id || "u-emp-1");
    return dataStore.getUserCertificates(id);
  },

  getProgressData: (userId) => {
    const id = typeof userId === "string" ? userId : (dataStore.getCurrentUser()?.id || "u-emp-1");
    const risk = dataStore.getUserRiskScores(id);
    const score = risk?.overallScore ?? 42;
    const enrollments = dataStore.getUserEnrollments(id);
    const certs = dataStore.getUserCertificates(id);

    const history = [
      { date: "Week 1", score: 63, posture: 68, stress: 58, recovery: 55 },
      { date: "Week 2", score: 55, posture: 58, stress: 52, recovery: 48 },
      { date: "Week 3", score: 46, posture: 48, stress: 44, recovery: 40 },
      { date: "Current", score: score, posture: Math.max(20, (risk?.categoryScores?.Posture ?? score) - 5), stress: Math.max(15, (risk?.categoryScores?.Stress ?? score) - 8), recovery: Math.max(15, (risk?.categoryScores?.Recovery ?? score) - 6) }
    ];

    return {
      kpis: {
        currentRisk: score,
        improvementPct: Math.max(8, Math.round(63 - score)),
        programsActive: enrollments.length || 0,
        habitStreak: "14 Days",
        streakDays: 14
      },
      scoreHistory: history,
      trajectory: history,
      weeklyHabits: [
        { id: 1, name: "Desk Micro-Breaks (50/10 Cadence)", title: "Desk Micro-Breaks (50/10 Cadence)", days: [true, true, true, false, true] },
        { id: 2, name: "Spinal Lumbar Relief Drill", title: "Spinal Lumbar Relief Drill", days: [true, true, true, true, false] },
        { id: 3, name: "Midday Box Breathing (4-4-4)", title: "Midday Box Breathing (4-4-4)", days: [true, false, true, true, true] },
        { id: 4, name: "5,000 Workday Movement Steps", title: "5,000 Workday Movement Steps", days: [false, true, true, true, true] }
      ],
      journeyMilestones: [
        { step: 1, title: "Initial 16-Item Screening", status: risk ? "completed" : "pending", date: risk?.completedAt || "Pending" },
        { step: 2, title: "Personalized Action Plan", status: risk ? "completed" : "pending", date: "Auto-Generated" },
        { step: 3, title: "Wellbeing Program Enrollment", status: enrollments.length > 0 ? "completed" : "in_progress", date: enrollments.length > 0 ? "Enrolled" : "In Progress" },
        { step: 4, title: "Occupational Trainer Review", status: certs.length > 0 ? "completed" : (enrollments.length > 0 ? "in_progress" : "pending"), date: certs.length > 0 ? "Approved" : "Pending" },
        { step: 5, title: "Verified Certificate Credential", status: certs.length > 0 ? "completed" : "pending", date: certs.length > 0 ? certs[0].certificateId : "Pending" }
      ]
    };
  },

  getPrograms: (userId) => {
    const id = typeof userId === "string" ? userId : (dataStore.getCurrentUser()?.id || "u-emp-1");
    const enrollments = dataStore.getUserEnrollments(id);

    return OFFICIAL_PROGRAMS.map((prog) => {
      const isEnrolled = enrollments.includes(prog.id);
      const progProgress = dataStore.getUserProgramProgress(id, prog.id);

      return {
        ...prog,
        isEnrolled,
        progress: progProgress.progress || 0,
        status: progProgress.status || (isEnrolled ? "active" : "not_enrolled"),
        completedSessions: progProgress.completedSessions || [],
        trainerFeedback: progProgress.trainerFeedback || null
      };
    });
  }
};
