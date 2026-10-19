import api from "./api";
import { dataStore } from "./dataStore";
import { authService } from "./authService";
import { WELLNESS_PROGRAMS_DATA } from "./wellnessProgramsData";

/**
 * Robust Program Service for Employee Wellness Learning Curricula,
 * Module Progression, Quizzes, Specialist Verification, and Certificates.
 * Works seamlessly both with live FastAPI backend and in standalone offline mode.
 */
export const programService = {
  /**
   * Fetch all programs formatted and segregated into:
   * allPrograms, assignedPrograms, recommendedPrograms, inProgressPrograms, completedPrograms
   */
  async getPrograms({ category = "all", status = "all", search = "" } = {}) {
    const currentUser = authService.getCurrentUser() || { id: "u-emp-1", name: "Bhavana Thota" };
    const userId = currentUser.id || "u-emp-1";

    // 1. Try fetching from live backend first (with short timeout)
    try {
      const params = {};
      if (category && category !== "all") params.category = category;
      if (status && status !== "all") params.status = status;
      if (search && search.trim()) params.search = search.trim();

      const response = await api.get("/programs", { params, timeout: 2000 });
      if (response.data && response.data.allPrograms) {
        return response.data;
      }
    } catch (err) {
      // Backend not running or timeout; seamlessly use client dataStore
    }

    // 2. Client-side state derivation from WELLNESS_PROGRAMS_DATA & dataStore
    return this._getLocalProgramsState({ userId, category, status, search });
  },

  /**
   * Fetch full program details with modules, educational markdown, and quiz
   */
  async getProgramDetails(idOrSlug) {
    const currentUser = authService.getCurrentUser() || { id: "u-emp-1", name: "Bhavana Thota" };
    const userId = currentUser.id || "u-emp-1";

    // 1. Try backend
    try {
      const response = await api.get(`/programs/details/${idOrSlug}`, { timeout: 2000 });
      if (response.data && response.data.title) {
        return response.data;
      }
    } catch (err) {
      // Backend unavailable; use local rich data
    }

    // 2. Client-side fallback from WELLNESS_PROGRAMS_DATA
    return this._getLocalProgramDetails(idOrSlug, userId);
  },

  /**
   * Enroll employee into a program
   */
  async enrollProgram(programIdOrSlug) {
    const currentUser = authService.getCurrentUser() || { id: "u-emp-1", name: "Bhavana Thota" };
    const userId = currentUser.id || "u-emp-1";

    // Find the program
    const prog = WELLNESS_PROGRAMS_DATA.find(
      (p) => p.slug === programIdOrSlug || String(p.id) === String(programIdOrSlug)
    ) || WELLNESS_PROGRAMS_DATA[0];

    const slug = prog.slug;

    // Immediately persist enrollment in dataStore
    const progressMap = dataStore.get("wellness_user_programs", {});
    if (!progressMap[userId]) progressMap[userId] = {};

    if (!progressMap[userId][slug]) {
      progressMap[userId][slug] = {
        isEnrolled: true,
        status: "In Progress",
        progress: 0,
        completedModuleIds: [],
        practicalNotes: {},
        quizPassed: false,
        quizScore: null,
        quizAttemptsCount: 0,
        enrolledAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        assignmentSource: slug === "ergonomic-wellness" ? "Assigned" : "Self-Enrolled",
        certificateId: null
      };
      dataStore.set("wellness_user_programs", progressMap);
    }

    // Also trigger backend in background if available
    api.post(`/programs/${prog.id || 1}/enroll`, {}, { timeout: 1500 }).catch(() => {});

    return {
      success: true,
      message: `Enrolled in ${prog.title} successfully!`,
      program: progressMap[userId][slug]
    };
  },

  /**
   * Complete an educational module and save practical exercise notes
   */
  async completeModule(programIdOrSlug, moduleId, practicalNotes = "") {
    const currentUser = authService.getCurrentUser() || { id: "u-emp-1", name: "Bhavana Thota" };
    const userId = currentUser.id || "u-emp-1";

    const prog = WELLNESS_PROGRAMS_DATA.find(
      (p) => p.slug === programIdOrSlug || String(p.id) === String(programIdOrSlug)
    ) || WELLNESS_PROGRAMS_DATA[0];
    const slug = prog.slug;

    const progressMap = dataStore.get("wellness_user_programs", {});
    if (!progressMap[userId]) progressMap[userId] = {};
    if (!progressMap[userId][slug]) {
      progressMap[userId][slug] = {
        isEnrolled: true,
        status: "In Progress",
        progress: 0,
        completedModuleIds: [],
        practicalNotes: {},
        quizPassed: false,
        quizScore: null,
        quizAttemptsCount: 0,
        enrolledAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        assignmentSource: "Self-Enrolled"
      };
    }

    const currentProg = progressMap[userId][slug];
    const completedSet = new Set(currentProg.completedModuleIds || []);
    completedSet.add(moduleId);
    const completedArr = Array.from(completedSet);

    if (!currentProg.practicalNotes) currentProg.practicalNotes = {};
    if (practicalNotes) {
      currentProg.practicalNotes[moduleId] = practicalNotes;
    }

    // Calculate real progress
    const totalMods = prog.modules.length || 4;
    const moduleProgressRatio = completedArr.length / totalMods;
    // Modules account for 80% of total progress, quiz accounts for 20%
    const quizBonus = currentProg.quizPassed ? 20 : 0;
    const calculatedProgress = Math.min(100, Math.round(moduleProgressRatio * 80) + quizBonus);

    currentProg.completedModuleIds = completedArr;
    currentProg.progress = calculatedProgress;
    if (calculatedProgress >= 100 && currentProg.status !== "Awaiting Verification" && currentProg.status !== "Completed") {
      currentProg.status = "In Progress";
    }

    dataStore.set("wellness_user_programs", progressMap);

    // Background sync to backend
    api.post(`/programs/${prog.id || 1}/modules/${moduleId}/complete`, {
      practical_notes: practicalNotes
    }, { timeout: 1500 }).catch(() => {});

    return {
      success: true,
      progress: calculatedProgress,
      completedModuleIds: completedArr
    };
  },

  /**
   * Submit quiz answers, evaluate score on server or against official answer key
   */
  async submitQuiz(programIdOrSlug, answers) {
    const currentUser = authService.getCurrentUser() || { id: "u-emp-1", name: "Bhavana Thota" };
    const userId = currentUser.id || "u-emp-1";

    const prog = WELLNESS_PROGRAMS_DATA.find(
      (p) => p.slug === programIdOrSlug || String(p.id) === String(programIdOrSlug)
    ) || WELLNESS_PROGRAMS_DATA[0];
    const slug = prog.slug;

    // Evaluate answers
    const questions = prog.quiz?.questions || [];
    let correctCount = 0;
    questions.forEach((q, idx) => {
      const targetIdx = q.correct_index !== undefined ? q.correct_index : q.correct_option;
      if (answers[idx] !== undefined && (answers[idx] === targetIdx || answers[idx] === q.correct_option)) {
        correctCount += 1;
      }
    });

    const scorePct = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 100;
    const passingThreshold = prog.passing_threshold || 60;
    const passed = scorePct >= passingThreshold;

    // Update dataStore
    const progressMap = dataStore.get("wellness_user_programs", {});
    if (!progressMap[userId]) progressMap[userId] = {};
    if (!progressMap[userId][slug]) {
      progressMap[userId][slug] = { isEnrolled: true, progress: 0, completedModuleIds: [] };
    }

    const currentProg = progressMap[userId][slug];
    currentProg.quizPassed = passed;
    currentProg.quizScore = scorePct;
    currentProg.quizAttemptsCount = (currentProg.quizAttemptsCount || 0) + 1;

    // Recalculate progress
    const totalMods = prog.modules.length || 4;
    const completedCount = (currentProg.completedModuleIds || []).length;
    const moduleProgress = Math.round((completedCount / totalMods) * 80);
    currentProg.progress = Math.min(100, moduleProgress + (passed ? 20 : 0));

    dataStore.set("wellness_user_programs", progressMap);

    // Background sync
    api.post(`/programs/${prog.id || 1}/quiz/submit`, { answers }, { timeout: 1500 }).catch(() => {});

    return {
      score: scorePct,
      passed,
      passingThreshold,
      totalQuestions: questions.length,
      correctCount
    };
  },

  /**
   * Submit completed program to assigned specialist for verification
   */
  async submitForVerification(programIdOrSlug, reflectionNotes = "") {
    const currentUser = authService.getCurrentUser() || { id: "u-emp-1", name: "Bhavana Thota" };
    const userId = currentUser.id || "u-emp-1";

    const prog = WELLNESS_PROGRAMS_DATA.find(
      (p) => p.slug === programIdOrSlug || String(p.id) === String(programIdOrSlug)
    ) || WELLNESS_PROGRAMS_DATA[0];
    const slug = prog.slug;

    // Update progress state
    const progressMap = dataStore.get("wellness_user_programs", {});
    if (!progressMap[userId]) progressMap[userId] = {};
    if (!progressMap[userId][slug]) {
      progressMap[userId][slug] = { isEnrolled: true, progress: 100 };
    }

    const currentProg = progressMap[userId][slug];
    currentProg.status = "Awaiting Verification";
    currentProg.submittedForVerificationAt = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    currentProg.reflectionNotes = reflectionNotes;
    dataStore.set("wellness_user_programs", progressMap);

    // Push into trainer review queue
    const reviews = dataStore.get("trainer_reviews", []);
    const reviewId = `REV-${Date.now().toString().slice(-6)}`;
    const newReview = {
      id: reviewId,
      enrollmentId: reviewId,
      employeeId: userId,
      employeeName: currentUser.name || "Bhavana Thota",
      employeeEmail: currentUser.email || "employee@company.com",
      department: currentUser.department || "Engineering",
      programId: prog.slug,
      programName: prog.title,
      programDuration: prog.duration,
      sessionsCompleted: prog.modules.length,
      totalSessions: prog.modules.length,
      submittedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      status: "pending",
      reflectionNotes: reflectionNotes || "Workplace posture routines and screen breaks practiced daily.",
      quizScore: currentProg.quizScore || 100
    };

    const existingIdx = reviews.findIndex((r) => r.employeeId === userId && r.programId === prog.slug && r.status === "pending");
    if (existingIdx !== -1) {
      reviews[existingIdx] = newReview;
    } else {
      reviews.unshift(newReview);
    }
    dataStore.set("trainer_reviews", reviews);

    // Background sync
    api.post(`/programs/${prog.id || 1}/submit-verification`, {
      reflection_notes: reflectionNotes
    }, { timeout: 1500 }).catch(() => {});

    return {
      success: true,
      status: "Awaiting Verification",
      message: "Curriculum and practical reflection submitted to specialist for review!"
    };
  },

  /**
   * Trainer: Verify and issue certificate or request corrections
   */
  async trainerVerify({ enrollmentId, action, feedback, observations = "" }) {
    const reviews = dataStore.get("trainer_reviews", []);
    const review = reviews.find((r) => String(r.id) === String(enrollmentId) || String(r.enrollmentId) === String(enrollmentId));

    if (review) {
      review.status = action === "approve" ? "approved" : "needs_correction";
      review.trainerFeedback = feedback;
      review.trainerObservations = observations;
      review.reviewedAt = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      dataStore.set("trainer_reviews", reviews);

      // Update employee program status
      const progressMap = dataStore.get("wellness_user_programs", {});
      const userProg = progressMap[review.employeeId]?.[review.programId];
      if (userProg) {
        if (action === "approve") {
          userProg.status = "Completed";
          const certId = `IOH-2026-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
          userProg.certificateId = certId;
          userProg.verifiedAt = review.reviewedAt;
          userProg.trainerFeedback = feedback;

          // Add to certificates registry
          const certsMap = dataStore.get("user_certificates", {});
          if (!certsMap[review.employeeId]) certsMap[review.employeeId] = [];
          certsMap[review.employeeId].unshift({
            certificateId: certId,
            programName: review.programName,
            programId: review.programId,
            employeeName: review.employeeName,
            trainerName: "Dr. Sarah Jenkins",
            issuedAt: userProg.verifiedAt,
            status: "Valid (ISO 45001 Verified)",
            verificationUrl: `${window.location.origin}/verify/${certId}`
          });
          dataStore.set("user_certificates", certsMap);
        } else {
          userProg.status = "Needs Correction";
          userProg.trainerFeedback = feedback;
        }
        dataStore.set("wellness_user_programs", progressMap);
      }
    }

    // Background sync to backend
    if (Number.isInteger(Number(enrollmentId))) {
      api.post("/programs/trainer/verify", {
        enrollment_id: Number(enrollmentId),
        action,
        feedback,
        observations
      }, { timeout: 1500 }).catch(() => {});
    }

    return {
      success: true,
      action,
      message: action === "approve" ? "Certificate issued successfully!" : "Correction request sent."
    };
  },

  /**
   * Trainer: Fetch pending program submissions
   */
  async getTrainerReviews() {
    try {
      const response = await api.get("/programs/trainer/reviews", { timeout: 2000 });
      if (response.data?.reviews && response.data.reviews.length > 0) {
        return response.data.reviews;
      }
    } catch (err) {}

    return dataStore.get("trainer_reviews", []);
  },

  /**
   * Fetch certificate verification info
   */
  async getCertificate(certificateId) {
    try {
      const response = await api.get(`/programs/certificate/${certificateId}`, { timeout: 2000 });
      if (response.data && response.data.certificateId) {
        return response.data;
      }
    } catch (err) {}

    const certsMap = dataStore.get("user_certificates", {});
    for (const list of Object.values(certsMap)) {
      const found = list.find((c) => c.certificateId?.toUpperCase() === certificateId.toUpperCase());
      if (found) return found;
    }
    return null;
  },

  /**
   * Internal helper: builds the complete client-side programs state
   */
  _getLocalProgramsState({ userId, category, status, search }) {
    const progressMap = dataStore.get("wellness_user_programs", {})[userId] || {};

    // Initial default: Ergonomic Wellness is Assigned with 2 modules completed
    if (Object.keys(progressMap).length === 0) {
      progressMap["ergonomic-wellness"] = {
        isEnrolled: true,
        status: "In Progress",
        progress: 50,
        completedModuleIds: [1, 2],
        practicalNotes: {
          1: "Calibrated sit bones angle and 90-degree knee position.",
          2: "Adjusted chair armrests so elbows rest level with keyboard."
        },
        quizPassed: false,
        quizScore: null,
        quizAttemptsCount: 0,
        enrolledAt: "Oct 10, 2026",
        assignmentSource: "Assigned",
        certificateId: null
      };
      const rootMap = dataStore.get("wellness_user_programs", {});
      rootMap[userId] = progressMap;
      dataStore.set("wellness_user_programs", rootMap);
    }

    // Recommendation slugs based on assessment
    const recSlugs = ["ergonomic-wellness", "stress-management", "fatigue-and-sleep-management", "healthy-lifestyle-at-work"];

    const cards = WELLNESS_PROGRAMS_DATA.map((prog, idx) => {
      const userProg = progressMap[prog.slug] || {
        isEnrolled: false,
        status: "Not Enrolled",
        progress: 0,
        completedModuleIds: [],
        assignmentSource: prog.slug === "ergonomic-wellness" ? "Assigned" : (recSlugs.includes(prog.slug) ? "Recommended" : "Available"),
        quizPassed: false,
        certificateId: null
      };

      const isRecommended = recSlugs.includes(prog.slug);
      const isEnrolled = !!userProg.isEnrolled;
      const completedCount = (userProg.completedModuleIds || []).length;

      return {
        id: idx + 1,
        slug: prog.slug,
        title: prog.title,
        category: prog.category,
        tag: prog.tag || prog.category,
        description: prog.description,
        duration: prog.duration,
        totalModules: prog.modules.length,
        completedModules: completedCount,
        trainerName: prog.trainer_name,
        trainerRole: prog.trainer_role,
        targetRiskArea: prog.target_risk_area,
        isEnrolled,
        status: userProg.status || (isEnrolled ? "In Progress" : "Not Enrolled"),
        progress: userProg.progress || 0,
        assignmentSource: userProg.assignmentSource || (prog.slug === "ergonomic-wellness" ? "Assigned" : (isRecommended ? "Recommended" : "Available")),
        isRecommended,
        quizPassed: userProg.quizPassed,
        certificateId: userProg.certificateId
      };
    });

    // Filtering
    let filtered = cards;
    if (category && category !== "all") {
      filtered = filtered.filter((c) => c.category.toLowerCase().includes(category.toLowerCase()));
    }
    if (search && search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter((c) => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q));
    }
    if (status && status !== "all") {
      if (status === "assigned") filtered = filtered.filter((c) => c.assignmentSource === "Assigned");
      else if (status === "recommended") filtered = filtered.filter((c) => c.isRecommended && c.status !== "Completed");
      else if (status === "in_progress") filtered = filtered.filter((c) => c.isEnrolled && c.status !== "Completed");
      else if (status === "completed") filtered = filtered.filter((c) => c.status === "Completed");
    }

    const assigned = cards.filter((c) => c.assignmentSource === "Assigned");
    const recommended = cards.filter((c) => c.isRecommended && c.status !== "Completed");
    const inProgress = cards.filter((c) => c.isEnrolled && c.status !== "Completed");
    const completed = cards.filter((c) => c.status === "Completed");

    return {
      allPrograms: filtered,
      assignedPrograms: assigned,
      recommendedPrograms: recommended,
      inProgressPrograms: inProgress,
      completedPrograms: completed,
      counts: {
        total: cards.length,
        enrolled: cards.filter((c) => c.isEnrolled).length,
        inProgress: inProgress.length,
        completed: completed.length,
        recommended: recommended.length
      }
    };
  },

  /**
   * Internal helper: retrieves full program details from WELLNESS_PROGRAMS_DATA
   */
  _getLocalProgramDetails(idOrSlug, userId) {
    const prog = WELLNESS_PROGRAMS_DATA.find(
      (p) => p.slug === idOrSlug || String(p.id) === String(idOrSlug)
    ) || WELLNESS_PROGRAMS_DATA[0];

    const progressMap = dataStore.get("wellness_user_programs", {})[userId] || {};
    const userProg = progressMap[prog.slug] || {
      isEnrolled: false,
      status: "Not Enrolled",
      progress: 0,
      completedModuleIds: [],
      quizPassed: false,
      quizScore: null,
      assignmentSource: prog.slug === "ergonomic-wellness" ? "Assigned" : "Available",
      certificateId: null
    };

    const completedIds = userProg.completedModuleIds || [];

    const modules = prog.modules.map((m) => ({
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
      activityInstructions: m.activity_instructions,
      isCompleted: completedIds.includes(m.module_order)
    }));

    const quizQuestions = (prog.quiz?.questions || []).map((q) => ({
      question: q.question,
      options: q.options
    }));

    return {
      id: prog.slug,
      slug: prog.slug,
      title: prog.title,
      category: prog.category,
      tag: prog.tag,
      description: prog.description,
      overview: prog.overview,
      learningObjectives: prog.learning_objectives || [],
      duration: prog.duration,
      totalModules: modules.length,
      trainerName: prog.trainer_name,
      trainerRole: prog.trainer_role,
      targetRiskArea: prog.target_risk_area,
      passingThreshold: prog.passing_threshold || 75,
      requiresTrainerVerification: prog.requires_trainer_verification,
      isEnrolled: !!userProg.isEnrolled,
      status: userProg.status || (userProg.isEnrolled ? "In Progress" : "Not Enrolled"),
      progress: userProg.progress || 0,
      enrolledAt: userProg.enrolledAt,
      modules,
      userProgress: {
        ...userProg,
        completedModuleIds: completedIds
      },
      quiz: {
        title: prog.quiz?.title || "Knowledge Assessment",
        description: prog.quiz?.description || "Verify your understanding.",
        passingThreshold: prog.passing_threshold || 75,
        questions: quizQuestions,
        totalQuestions: quizQuestions.length
      },
      certificate: userProg.certificateId ? {
        certificateId: userProg.certificateId,
        issuedAt: userProg.verifiedAt || "Recently",
        trainerName: prog.trainer_name,
        status: "Valid"
      } : null
    };
  }
};
