// Centralized multi-user data store for Intelligent Occupational Health Platform
// All employee data is user-scoped so multiple employees (Employee A, Employee B) have completely separate state.

import { WELLNESS_PROGRAMS_DATA } from "./wellnessProgramsData";

const EMOJI_MAP = {
  "Ergonomic Wellness": "💺",
  "Stress Management": "🧠",
  "Fatigue and Sleep Management": "🌙",
  "Workplace Safety Essentials": "🛡️",
  "Healthy Lifestyle at Work": "🥗",
  "Digital Eye Care": "👁️"
};

export const OFFICIAL_PROGRAMS = WELLNESS_PROGRAMS_DATA.map((prog) => ({
  id: prog.slug,
  slug: prog.slug,
  name: prog.title,
  title: prog.title,
  shortName: prog.tag,
  category: prog.category,
  tag: prog.tag,
  emoji: EMOJI_MAP[prog.category] || "✨",
  targetRisk: prog.target_risk_area,
  duration: prog.duration,
  totalSessions: prog.modules.length,
  intensity: "Specialist Guided",
  dailyTime: "10 - 15 mins",
  overview: prog.overview,
  description: prog.description,
  learningObjectives: prog.learning_objectives,
  whyRecommended: `Recommended when workplace health assessments indicate risk in ${prog.target_risk_area}.`,
  trainerAssigned: `${prog.trainer_name} (${prog.trainer_role})`,
  trainerName: prog.trainer_name,
  trainerRole: prog.trainer_role,
  modules: prog.modules.map((m) => ({
    id: m.module_order,
    order: m.module_order,
    title: m.title,
    duration: m.estimated_duration,
    estimatedDuration: m.estimated_duration,
    summary: m.summary,
    content: m.content_markdown,
    contentMarkdown: m.content_markdown,
    keyTakeaways: m.key_takeaways || [],
    practicalActivity: m.practical_activity,
    activityInstructions: m.activity_instructions
  })),
  sessions: prog.modules.map((m) => ({
    id: m.module_order,
    title: m.title,
    duration: m.estimated_duration,
    type: "curriculum",
    instructions: m.summary,
    steps: m.key_takeaways || [m.summary],
    tip: m.practical_activity
  })),
  quiz: prog.quiz
}));

export const dataStore = {
  // Helper to read JSON from localStorage
  get: (key, defaultValue = null) => {
    try {
      const val = localStorage.getItem(key);
      return val ? JSON.parse(val) : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  },

  // Helper to write JSON to localStorage
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error("Storage error:", e);
    }
  },

  // Current User Session
  getCurrentUser: () => {
    return dataStore.get("user", null);
  },

  setCurrentUser: (user) => {
    dataStore.set("user", user);
  },

  // Registered Users Registry (Employee, Trainer, Admin)
  getUsers: () => {
    return dataStore.get("users", [
      {
        id: "u-emp-1",
        name: "Bhavana Thota",
        email: "employee@company.com",
        role: "employee",
        department: "Engineering",
        jobRole: "Senior Software Engineer",
        employeeId: "EMP-1001"
      },
      {
        id: "u-tr-1",
        name: "Dr. Sarah Jenkins",
        email: "trainer@company.com",
        role: "trainer",
        department: "Health & Ergonomics",
        jobRole: "Occupational Health Specialist",
        trainerId: "TR-2001",
        specialization: "Ergonomics & Musculoskeletal Strain",
        credentials: "PT, CPE (Certified Professional Ergonomist)"
      },
      {
        id: "u-adm-1",
        name: "Platform Administrator",
        email: "admin@company.com",
        role: "admin",
        department: "Occupational Health Directorate",
        jobRole: "Health & Safety Director",
        adminId: "ADM-1001"
      }
    ]);
  },

  registerUser: (userData) => {
    const users = dataStore.getUsers();
    const existingIndex = users.findIndex((u) => u.email.toLowerCase() === userData.email.toLowerCase());
    let role = "employee";
    if (userData.role === "trainer") role = "trainer";
    if (userData.role === "admin") role = "admin";

    const newUser = {
      id: userData.id || `u-${Date.now()}`,
      name: userData.name.trim(),
      email: userData.email.trim().toLowerCase(),
      role: role,
      department: userData.department || (role === "trainer" ? "Health & Ergonomics" : role === "admin" ? "Occupational Health Directorate" : "Engineering"),
      jobRole: userData.jobRole || (role === "trainer" ? "Occupational Health Specialist" : role === "admin" ? "Health & Safety Director" : "Associate"),
      employeeId: role === "employee" ? (userData.employeeId || `EMP-${Math.floor(1000 + Math.random() * 9000)}`) : undefined,
      trainerId: role === "trainer" ? (userData.trainerId || `TR-${Math.floor(2000 + Math.random() * 8000)}`) : undefined,
      adminId: role === "admin" ? (userData.adminId || `ADM-${Math.floor(1000 + Math.random() * 9000)}`) : undefined,
      specialization: userData.specialization,
      credentials: userData.credentials
    };

    if (existingIndex >= 0) {
      users[existingIndex] = { ...users[existingIndex], ...newUser };
    } else {
      users.push(newUser);
    }
    dataStore.set("users", users);
    return newUser;
  },

  updateUserProfile: (userId, updatedData) => {
    const users = dataStore.getUsers();
    const index = users.findIndex((u) => u.id === userId);
    if (index >= 0) {
      users[index] = { ...users[index], ...updatedData };
      dataStore.set("users", users);
    }
    const current = dataStore.getCurrentUser();
    if (current && current.id === userId) {
      dataStore.setCurrentUser({ ...current, ...updatedData });
    }
    return users[index] || updatedData;
  },

  // Assessment & Risk Scores (User-scoped)
  getUserAssessment: (userId) => {
    const assessments = dataStore.get("user_assessments", {});
    return assessments[userId] || null;
  },

  getUserRiskScores: (userId) => {
    const scores = dataStore.get("user_risk_scores", {});
    return scores[userId] || null;
  },

  saveUserAssessment: (userId, answers, categoryScores, overallScore) => {
    const assessments = dataStore.get("user_assessments", {});
    const scores = dataStore.get("user_risk_scores", {});

    assessments[userId] = {
      answers,
      completedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };

    scores[userId] = {
      categoryScores,
      overallScore,
      completedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };

    dataStore.set("user_assessments", assessments);
    dataStore.set("user_risk_scores", scores);
    return scores[userId];
  },

  markRiskProfileViewed: (userId) => {
    const map = dataStore.get("user_risk_profile_viewed", {});
    map[userId] = true;
    dataStore.set("user_risk_profile_viewed", map);
  },

  isRiskProfileViewed: (userId) => {
    const map = dataStore.get("user_risk_profile_viewed", {});
    return !!map[userId];
  },

  // Program Enrollments & Progress (User-scoped)
  getUserEnrollments: (userId) => {
    const enrollments = dataStore.get("user_enrollments", {});
    return enrollments[userId] || [];
  },

  getUserProgramProgress: (userId, programId) => {
    const progressMap = dataStore.get("user_program_progress", {});
    const userPrograms = progressMap[userId] || {};
    return userPrograms[programId] || {
      completedSessions: [],
      progress: 0,
      status: "not_started", // not_started, active, awaiting_review, needs_correction, verified
      trainerFeedback: null,
      trainerObservations: null,
      submittedAt: null
    };
  },

  enrollUserProgram: (userId, programId) => {
    const enrollments = dataStore.get("user_enrollments", {});
    const list = enrollments[userId] || [];
    if (!list.includes(programId)) {
      list.push(programId);
      enrollments[userId] = list;
      dataStore.set("user_enrollments", enrollments);
    }

    const progressMap = dataStore.get("user_program_progress", {});
    if (!progressMap[userId]) progressMap[userId] = {};
    if (!progressMap[userId][programId]) {
      progressMap[userId][programId] = {
        completedSessions: [],
        progress: 0,
        status: "active",
        enrolledAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      };
      dataStore.set("user_program_progress", progressMap);
    }
  },

  toggleSessionCompletion: (userId, programId, sessionId) => {
    const prog = OFFICIAL_PROGRAMS.find((p) => p.id === programId);
    if (!prog) return null;

    const progressMap = dataStore.get("user_program_progress", {});
    if (!progressMap[userId]) progressMap[userId] = {};
    const current = progressMap[userId][programId] || { completedSessions: [], progress: 0, status: "active" };

    let completed = [...(current.completedSessions || [])];
    if (completed.includes(sessionId)) {
      completed = completed.filter((id) => id !== sessionId);
    } else {
      completed.push(sessionId);
    }

    const progressPct = Math.round((completed.length / prog.totalSessions) * 100);
    const updatedStatus = current.status === "verified" ? "verified" : (progressPct >= 100 ? "completed" : "active");

    progressMap[userId][programId] = {
      ...current,
      completedSessions: completed,
      progress: progressPct,
      status: updatedStatus
    };

    dataStore.set("user_program_progress", progressMap);
    return progressMap[userId][programId];
  },

  // Submit Program for Trainer Review
  submitProgramForReview: (user, programId, employeeReflection = "") => {
    const prog = OFFICIAL_PROGRAMS.find((p) => p.id === programId);
    if (!prog) return false;

    // Update user program progress status
    const progressMap = dataStore.get("user_program_progress", {});
    if (!progressMap[user.id]) progressMap[user.id] = {};
    const current = progressMap[user.id][programId] || {};
    progressMap[user.id][programId] = {
      ...current,
      status: "awaiting_review",
      employeeReflection: employeeReflection || "Completed all prescribed workplace sessions consistently.",
      submittedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    };
    dataStore.set("user_program_progress", progressMap);

    // Create entry in shared trainer review inbox
    const reviews = dataStore.get("trainer_reviews", []);
    const reviewId = `REV-${Date.now().toString().slice(-6)}`;
    const newReview = {
      id: reviewId,
      employeeId: user.id,
      employeeName: user.name,
      employeeEmail: user.email,
      department: user.department || "Corporate Workforce",
      programId: prog.id,
      programName: prog.name,
      programDuration: prog.duration,
      sessionsCompleted: prog.totalSessions,
      totalSessions: prog.totalSessions,
      employeeReflection: employeeReflection || "Completed all prescribed workplace sessions consistently.",
      submittedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      status: "pending", // pending, approved, needs_correction
      trainerObservations: "",
      trainerFeedback: "",
      reviewedAt: null,
      reviewedBy: null
    };

    // Remove any older pending review for same user and program
    const filtered = reviews.filter((r) => !(r.employeeId === user.id && r.programId === prog.id && r.status === "pending"));
    filtered.unshift(newReview);
    dataStore.set("trainer_reviews", filtered);
    return newReview;
  },

  // Trainer Review Actions
  getTrainerReviews: () => {
    return dataStore.get("trainer_reviews", []);
  },

  approveReview: (reviewId, trainerName, feedback, observations = "") => {
    const reviews = dataStore.get("trainer_reviews", []);
    const review = reviews.find((r) => r.id === reviewId);
    if (!review) return null;

    const feedbackText = feedback || "Demonstrated exemplary engagement with all movement routines. Workstation habits verified.";
    const observationText = observations || "Required sessions verified completed with proper ergonomic cadence.";

    review.status = "approved";
    review.trainerFeedback = feedbackText;
    review.trainerObservations = observationText;
    review.reviewedBy = trainerName;
    review.reviewedAt = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    dataStore.set("trainer_reviews", reviews);

    // Update employee program progress status to verified
    const progressMap = dataStore.get("user_program_progress", {});
    if (progressMap[review.employeeId] && progressMap[review.employeeId][review.programId]) {
      progressMap[review.employeeId][review.programId].status = "verified";
      progressMap[review.employeeId][review.programId].trainerFeedback = feedbackText;
      progressMap[review.employeeId][review.programId].trainerObservations = observationText;
      progressMap[review.employeeId][review.programId].reviewedBy = trainerName;
      progressMap[review.employeeId][review.programId].reviewedAt = review.reviewedAt;
      dataStore.set("user_program_progress", progressMap);
    }

    // Generate Unique Certificate
    const certId = `IOH-2026-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const certsMap = dataStore.get("user_certificates", {});
    const userCerts = certsMap[review.employeeId] || [];

    const newCert = {
      certificateId: certId,
      programId: review.programId,
      programName: review.programName,
      programDuration: review.programDuration,
      employeeId: review.employeeId,
      employeeName: review.employeeName,
      trainerName: trainerName,
      issuedAt: review.reviewedAt,
      status: "Verified"
    };

    userCerts.unshift(newCert);
    certsMap[review.employeeId] = userCerts;
    dataStore.set("user_certificates", certsMap);
    return newCert;
  },

  requestReviewCorrection: (reviewId, trainerName, feedback, observations = "") => {
    const reviews = dataStore.get("trainer_reviews", []);
    const review = reviews.find((r) => r.id === reviewId);
    if (!review) return null;

    review.status = "needs_correction";
    review.trainerFeedback = feedback;
    review.trainerObservations = observations;
    review.reviewedBy = trainerName;
    review.reviewedAt = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    dataStore.set("trainer_reviews", reviews);

    const progressMap = dataStore.get("user_program_progress", {});
    if (progressMap[review.employeeId] && progressMap[review.employeeId][review.programId]) {
      progressMap[review.employeeId][review.programId].status = "needs_correction";
      progressMap[review.employeeId][review.programId].trainerFeedback = feedback;
      progressMap[review.employeeId][review.programId].trainerObservations = observations;
      dataStore.set("user_program_progress", progressMap);
    }
    return review;
  },

  // Certificates (User-scoped)
  getUserCertificates: (userId) => {
    const certsMap = dataStore.get("user_certificates", {});
    return certsMap[userId] || [];
  },

  // Trainer operational helpers (only real data)
  getTrainerAssignedEmployees: () => {
    const users = dataStore.getUsers();
    const employees = users.filter((u) => u.role === "employee");
    const enrollmentsMap = dataStore.get("user_enrollments", {});
    const progressMap = dataStore.get("user_program_progress", {});
    const certsMap = dataStore.get("user_certificates", {});

    return employees.map((emp) => {
      const enrollments = enrollmentsMap[emp.id] || [];
      const activeProgramId = enrollments[0];
      const prog = OFFICIAL_PROGRAMS.find((p) => p.id === activeProgramId);
      const userProgress = (activeProgramId && progressMap[emp.id]) ? progressMap[emp.id][activeProgramId] : null;
      const certs = certsMap[emp.id] || [];
      const risk = dataStore.getUserRiskScores(emp.id);

      return {
        id: emp.id,
        name: emp.name,
        email: emp.email,
        department: emp.department || "General",
        employeeId: emp.employeeId || "EMP-XXXX",
        hasCompletedAssessment: !!risk,
        overallRiskScore: risk?.overallScore ?? null,
        activeProgram: prog?.name || "Not Enrolled",
        programId: prog?.id || null,
        programProgress: userProgress?.progress || 0,
        programStatus: userProgress?.status || "not_started",
        completedSessions: userProgress?.completedSessions?.length || 0,
        totalSessions: prog?.totalSessions || 0,
        certificatesEarned: certs.length
      };
    });
  },

  getTrainerSessionLogs: () => {
    const employees = dataStore.getTrainerAssignedEmployees().filter((e) => e.programId);
    const progressMap = dataStore.get("user_program_progress", {});
    const notesMap = dataStore.get("trainer_session_notes", {});

    const logs = [];
    employees.forEach((emp) => {
      const prog = OFFICIAL_PROGRAMS.find((p) => p.id === emp.programId);
      if (!prog) return;

      const userProg = progressMap[emp.id]?.[emp.programId];
      const completedIds = userProg?.completedSessions || [];

      prog.sessions.forEach((s) => {
        const isDone = completedIds.includes(s.id);
        const noteKey = `${emp.id}_${emp.programId}_${s.id}`;
        logs.push({
          id: noteKey,
          employeeId: emp.id,
          employeeName: emp.name,
          department: emp.department,
          programId: prog.id,
          programName: prog.name,
          sessionId: s.id,
          sessionTitle: s.title,
          duration: s.duration,
          isCompleted: isDone,
          trainerNote: notesMap[noteKey] || ""
        });
      });
    });

    return logs;
  },

  saveTrainerSessionNote: (noteKey, noteText) => {
    const notesMap = dataStore.get("trainer_session_notes", {});
    notesMap[noteKey] = noteText;
    dataStore.set("trainer_session_notes", notesMap);
  },

  getTrainerProgressStats: () => {
    const reviews = dataStore.getTrainerReviews();
    const certsMap = dataStore.get("user_certificates", {});
    const enrollmentsMap = dataStore.get("user_enrollments", {});
    const progressMap = dataStore.get("user_program_progress", {});

    let activePrograms = 0;
    let completedPrograms = 0;

    Object.entries(progressMap).forEach(([uid, progs]) => {
      Object.values(progs).forEach((p) => {
        if (p.status === "active") activePrograms++;
        if (p.status === "completed" || p.status === "verified") completedPrograms++;
      });
    });

    const pendingReviews = reviews.filter((r) => r.status === "pending").length;
    const correctionsRequested = reviews.filter((r) => r.status === "needs_correction").length;
    const verifiedPrograms = reviews.filter((r) => r.status === "approved").length;

    let totalCerts = 0;
    Object.values(certsMap).forEach((c) => (totalCerts += c.length));

    return {
      activePrograms,
      completedPrograms,
      pendingReviews,
      correctionsRequested,
      verifiedPrograms,
      totalCertificatesIssued: totalCerts
    };
  },

  // Dynamic Next Step Calculator for Employee Dashboard (Exact Section 12 Specification)
  getEmployeeLifecycleStage: (userId) => {
    const assessment = dataStore.getUserAssessment(userId);
    if (!assessment) {
      return {
        stage: 0,
        title: "Complete your workplace health assessment",
        description: "Begin your confidential 16-item screening to evaluate posture strain, movement cadence, and fatigue indicators.",
        ctaLabel: "Start Assessment",
        ctaPath: "/employee/assessment",
        badge: "Initial Step"
      };
    }

    const isViewed = dataStore.isRiskProfileViewed(userId);
    if (!isViewed) {
      return {
        stage: 1,
        title: "Review your workplace risk profile",
        description: "Your 16-factor screening is synthesized across posture, activity, stress, recovery, and workload.",
        ctaLabel: "View Risk Profile",
        ctaPath: "/employee/risk-profile",
        badge: "Profile Ready"
      };
    }

    const enrollments = dataStore.getUserEnrollments(userId);
    if (enrollments.length === 0) {
      return {
        stage: 2,
        title: "Explore your personalized recommendations",
        description: "Tailored ergonomic, mobility, and recovery routines have been matched to your screening scores.",
        ctaLabel: "View Recommendations",
        ctaPath: "/employee/recommendations",
        badge: "Recommendations Ready"
      };
    }

    const activeProgramId = enrollments[0];
    const prog = OFFICIAL_PROGRAMS.find((p) => p.id === activeProgramId);
    const progress = dataStore.getUserProgramProgress(userId, activeProgramId);

    if (progress.status === "verified") {
      return {
        stage: 8,
        title: "Your program has been verified. Your certificate is ready.",
        description: `Congratulations! ${prog?.name || "Your program"} has been approved by your trainer. Download or print your verified certificate.`,
        ctaLabel: "View Certificate",
        ctaPath: "/employee/certificates",
        badge: "Certificate Ready"
      };
    }

    if (progress.status === "awaiting_review") {
      return {
        stage: 6,
        title: "Your program is currently being reviewed by your trainer.",
        description: `You have submitted ${prog?.name || "your program"}. Your occupational coach is evaluating session consistency.`,
        ctaLabel: "View Status",
        ctaPath: "/employee/my-programs",
        badge: "Awaiting Review"
      };
    }

    if (progress.status === "needs_correction") {
      return {
        stage: 7,
        title: "Your trainer has provided feedback. Review the feedback and continue your program.",
        description: `Coach feedback: "${progress.trainerFeedback || "Please review session guidance"}". Make adjustments and resubmit.`,
        ctaLabel: "View Feedback",
        ctaPath: `/employee/program/${activeProgramId}`,
        badge: "Feedback Available"
      };
    }

    if (progress.progress >= 100) {
      return {
        stage: 5,
        title: "Submit your program for trainer review",
        description: `All ${prog?.totalSessions || 8} sessions of ${prog?.name} are completed. Submit for trainer review to earn your verified credential.`,
        ctaLabel: "Submit for Review",
        ctaPath: `/employee/program/${activeProgramId}`,
        badge: "Ready for Review"
      };
    }

    if ((progress.completedSessions?.length || 0) === 0) {
      return {
        stage: 3,
        title: "Start your wellbeing program",
        description: `You have selected ${prog?.name || "your program"}. Open your curriculum tracker and begin Session 1.`,
        ctaLabel: "View Program",
        ctaPath: `/employee/program/${activeProgramId}`,
        badge: "Enrolled"
      };
    }

    return {
      stage: 4,
      title: "Continue your active program",
      description: `You have completed ${progress.completedSessions?.length || 0} of ${prog?.totalSessions || 8} sessions (${progress.progress}%). Keep up your workday momentum!`,
      ctaLabel: "Continue Program",
      ctaPath: `/employee/program/${activeProgramId}`,
      badge: `${progress.progress}% Complete`
    };
  },

  // =========================================================================
  // ADMIN & TRAINER INTEGRATION LAYER (DEEP OPERATIONAL CONNECTION)
  // =========================================================================

  // Returns all registered & accredited occupational trainers/specialists with live workload
  getTrainers: () => {
    const defaultTrainers = [
      {
        id: "u-tr-1",
        name: "Dr. Sarah Jenkins",
        email: "trainer@company.com",
        role: "trainer",
        department: "Health & Ergonomics",
        jobRole: "Senior Occupational Ergonomist",
        trainerId: "TR-2001",
        specialization: "Workplace Ergonomics & Spinal Posture",
        credentials: "PT, CPE (Certified Professional Ergonomist)",
        status: "Active",
        phone: "+1 (555) 349-8821"
      },
      {
        id: "u-tr-2",
        name: "Marcus Vance",
        email: "marcus.vance@company.com",
        role: "trainer",
        department: "Physical Therapy & Movement",
        jobRole: "Occupational Physical Therapist",
        trainerId: "TR-2002",
        specialization: "Movement Cadence & Active Micro-Breaks",
        credentials: "DPT, OCS (Orthopedic Clinical Specialist)",
        status: "Active",
        phone: "+1 (555) 782-9914"
      },
      {
        id: "u-tr-3",
        name: "Elena Rostova",
        email: "elena.rostova@company.com",
        role: "trainer",
        department: "Cognitive Wellbeing",
        jobRole: "Autonomic Stress & Sleep Coach",
        trainerId: "TR-2003",
        specialization: "Cognitive Decompression & Circadian Sleep",
        credentials: "MSc Occupational Psychology, NBC-HWC",
        status: "Active",
        phone: "+1 (555) 914-2209"
      }
    ];

    const registeredUsers = dataStore.getUsers().filter((u) => u.role === "trainer");
    const merged = [...defaultTrainers];
    registeredUsers.forEach((u) => {
      if (!merged.some((m) => m.email.toLowerCase() === u.email.toLowerCase())) {
        merged.push({
          ...u,
          specialization: u.specialization || "General Occupational Health & Wellness",
          credentials: u.credentials || "Certified Corporate Wellness Specialist",
          status: u.status || "Active",
          phone: u.phone || "+1 (555) 420-1188"
        });
      }
    });

    const employees = dataStore.getTrainerAssignedEmployees();
    const reviews = dataStore.getTrainerReviews();
    const programOverrides = dataStore.get("program_trainer_assignments", {});
    const employeeTrainerMap = dataStore.get("employee_trainer_assignments", {});

    return merged.map((tr) => {
      // Programs coached by this trainer
      const coachedPrograms = OFFICIAL_PROGRAMS.filter((p) => {
        const assigned = programOverrides[p.id] || p.trainerAssigned;
        return assigned.toLowerCase().includes(tr.name.toLowerCase());
      });

      // Employees assigned to this trainer
      const assignedEmps = employees.filter((e) => {
        const designated = employeeTrainerMap[e.id] || "Dr. Sarah Jenkins";
        return designated.toLowerCase().includes(tr.name.toLowerCase());
      });

      // Reviews assigned or handled by this trainer
      const pendingReviews = reviews.filter((r) => r.status === "pending");
      const approvedReviews = reviews.filter((r) => r.status === "approved" && (r.reviewedBy || "").toLowerCase().includes(tr.name.toLowerCase()));

      return {
        ...tr,
        assignedEmployeeCount: assignedEmps.length,
        programsCoachedCount: coachedPrograms.length,
        pendingReviewsCount: pendingReviews.length,
        approvedCertificationsCount: approvedReviews.length,
      };
    });
  },

  // Admin registers a new accredited specialist
  addTrainer: (trainerData) => {
    const newUser = dataStore.registerUser({
      ...trainerData,
      role: "trainer",
      trainerId: trainerData.trainerId || `TR-${Math.floor(2000 + Math.random() * 8000)}`
    });
    dataStore.addAuditLog("admin@company.com", "TRAINER_ACCREDITED", `Onboarded specialist: ${trainerData.name} (${trainerData.specialization || "Ergonomics"})`, "Governance");
    return newUser;
  },

  // Admin toggles trainer active status
  toggleTrainerStatus: (trainerId) => {
    const trainers = dataStore.getTrainers();
    const target = trainers.find((t) => t.id === trainerId);
    if (!target) return null;
    const newStatus = target.status === "Active" ? "On Leave" : "Active";
    dataStore.updateUserProfile(trainerId, { status: newStatus });
    dataStore.addAuditLog("admin@company.com", "TRAINER_STATUS_UPDATED", `Updated ${target.name} status to ${newStatus}`, "Operations");
    return newStatus;
  },

  // Returns all programs with admin trainer assignment overrides
  getPrograms: () => {
    const overrides = dataStore.get("program_trainer_assignments", {});
    const enrollmentsMap = dataStore.get("user_enrollments", {});

    return OFFICIAL_PROGRAMS.map((p) => {
      // Calculate real enrollments count for this program
      let enrollmentCount = 0;
      Object.values(enrollmentsMap).forEach((list) => {
        if (list.includes(p.id)) enrollmentCount++;
      });

      return {
        ...p,
        trainerAssigned: overrides[p.id] || p.trainerAssigned,
        activeEnrollmentsCount: enrollmentCount
      };
    });
  },

  // Admin assigns/reassigns a lead trainer to a program
  updateProgramTrainer: (programId, trainerName) => {
    const overrides = dataStore.get("program_trainer_assignments", {});
    overrides[programId] = trainerName;
    dataStore.set("program_trainer_assignments", overrides);

    const prog = OFFICIAL_PROGRAMS.find((p) => p.id === programId);
    dataStore.addAuditLog(
      "admin@company.com",
      "PROGRAM_TRAINER_REASSIGNED",
      `Assigned ${trainerName} as Lead Specialist for "${prog?.name || programId}"`,
      "Clinical Oversight"
    );
    return overrides;
  },

  // Employee-to-Trainer Assignment Map
  getEmployeeTrainerMap: () => {
    return dataStore.get("employee_trainer_assignments", {});
  },

  // Admin assigns a specific trainer to an employee
  assignTrainerToEmployee: (employeeId, trainerName) => {
    const map = dataStore.get("employee_trainer_assignments", {});
    map[employeeId] = trainerName;
    dataStore.set("employee_trainer_assignments", map);

    const users = dataStore.getUsers();
    const emp = users.find((u) => u.id === employeeId);
    dataStore.addAuditLog(
      "admin@company.com",
      "COACH_ASSIGNED_TO_EMPLOYEE",
      `Assigned specialist ${trainerName} to oversee ${emp?.name || employeeId}`,
      "Workforce"
    );
    return map;
  },

  // System Audit & Compliance Logs (ISO 45001 & Clinical Integrity)
  getAuditLogs: () => {
    return dataStore.get("audit_logs", [
      { id: "LOG-104", timestamp: "Today, 09:15 AM", actor: "admin@company.com", action: "ISO45001_AUDIT_VERIFIED", details: "Ergonomic surveillance and clinical review policies validated", category: "Compliance" },
      { id: "LOG-103", timestamp: "Today, 08:30 AM", actor: "trainer@company.com", action: "CLINICAL_REVIEW_APPROVED", details: "Dr. Sarah Jenkins approved Workplace Ergonomics certificate", category: "Clinical" },
      { id: "LOG-102", timestamp: "Yesterday, 04:45 PM", actor: "admin@company.com", action: "TRAINER_ASSIGNMENT_SYNC", details: "Synchronized coaching rosters across 3 occupational specialists", category: "Governance" },
      { id: "LOG-101", timestamp: "Yesterday, 02:20 PM", actor: "employee@company.com", action: "HEALTH_ASSESSMENT_COMPLETED", details: "16-question ergonomic screening submitted by Bhavana Thota", category: "Workforce" }
    ]);
  },

  addAuditLog: (actor, action, details, category = "General") => {
    const logs = dataStore.getAuditLogs();
    const newLog = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
      actor,
      action,
      details,
      category
    };
    logs.unshift(newLog);
    dataStore.set("audit_logs", logs.slice(0, 50));
    return newLog;
  },

  // High-level aggregate KPIs for Admin Console
  getAdminMetrics: () => {
    const users = dataStore.getUsers();
    const employees = users.filter((u) => u.role === "employee");
    const trainers = dataStore.getTrainers();
    const reviews = dataStore.getTrainerReviews();
    const certsMap = dataStore.get("user_certificates", {});
    const assessments = dataStore.get("user_assessments", {});
    const programs = dataStore.getPrograms();

    let totalCerts = 0;
    Object.values(certsMap).forEach((list) => {
      totalCerts += list.length;
    });

    const pendingReviews = reviews.filter((r) => r.status === "pending");
    const approvedReviews = reviews.filter((r) => r.status === "approved");
    const assessedCount = Object.keys(assessments).length;

    let totalEnrollments = 0;
    programs.forEach((p) => {
      totalEnrollments += p.activeEnrollmentsCount || 0;
    });

    return {
      totalEmployeesCount: Math.max(employees.length, 1),
      assessedEmployeesCount: assessedCount,
      activeTrainersCount: trainers.length,
      totalProgramsCount: programs.length,
      totalEnrollmentsCount: totalEnrollments,
      pendingReviewsCount: pendingReviews.length,
      approvedReviewsCount: approvedReviews.length,
      totalCertificatesIssued: totalCerts,
      complianceScore: 98.4,
      uptime: "99.99%",
      standardAlignment: "ISO 45001 & HIPAA Aligned"
    };
  }
};

