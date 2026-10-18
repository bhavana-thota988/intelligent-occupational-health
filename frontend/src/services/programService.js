import api from "./api";
import { dataStore } from "./dataStore";

/**
 * Service for Employee Wellness Programs, Learning Modules, Quizzes,
 * Trainer Verification, and QR-verifiable Corporate Certificates.
 */
export const programService = {
  /**
   * Fetch all wellness programs with categorized lists:
   * (allPrograms, assignedPrograms, recommendedPrograms, inProgressPrograms, completedPrograms)
   */
  async getPrograms({ category = "all", status = "all", search = "" } = {}) {
    try {
      const params = {};
      if (category && category !== "all") params.category = category;
      if (status && status !== "all") params.status = status;
      if (search && search.trim()) params.search = search.trim();

      const response = await api.get("/programs", { params });
      return response.data;
    } catch (err) {
      console.warn("API /programs fetch failed, falling back to local store:", err.message);
      return this._fallbackGetPrograms({ category, status, search });
    }
  },

  /**
   * Fetch full details for a program including educational modules and quiz
   */
  async getProgramDetails(idOrSlug) {
    try {
      const response = await api.get(`/programs/details/${idOrSlug}`);
      return response.data;
    } catch (err) {
      console.warn("API /programs/details fetch failed, falling back to local store:", err.message);
      return this._fallbackGetProgramDetails(idOrSlug);
    }
  },

  /**
   * Enroll employee into a program
   */
  async enrollProgram(programId) {
    try {
      const response = await api.post(`/programs/${programId}/enroll`);
      return response.data;
    } catch (err) {
      console.warn("API /programs/enroll failed:", err.message);
      throw err;
    }
  },

  /**
   * Complete an educational module and save practical exercise notes
   */
  async completeModule(programId, moduleId, practicalNotes = "") {
    try {
      const response = await api.post(`/programs/${programId}/modules/${moduleId}/complete`, {
        practical_notes: practicalNotes,
      });
      return response.data;
    } catch (err) {
      console.warn("API /completeModule failed:", err.message);
      throw err;
    }
  },

  /**
   * Submit knowledge quiz answers (validated server-side)
   */
  async submitQuiz(programId, answers) {
    try {
      const response = await api.post(`/programs/${programId}/quiz/submit`, {
        answers,
      });
      return response.data;
    } catch (err) {
      console.warn("API /submitQuiz failed:", err.message);
      throw err;
    }
  },

  /**
   * Submit completed program to assigned occupational specialist for verification
   */
  async submitForVerification(programId, reflectionNotes = "") {
    try {
      const response = await api.post(`/programs/${programId}/submit-verification`, {
        reflection_notes: reflectionNotes,
      });
      return response.data;
    } catch (err) {
      console.warn("API /submit-verification failed:", err.message);
      throw err;
    }
  },

  /**
   * Trainer: Fetch pending program submissions queue
   */
  async getTrainerReviews() {
    try {
      const response = await api.get("/programs/trainer/reviews");
      return response.data?.reviews || [];
    } catch (err) {
      console.warn("API /trainer/reviews failed, falling back to local dataStore:", err.message);
      return dataStore.getTrainerReviews() || [];
    }
  },

  /**
   * Trainer: Verify or request corrections on employee submission
   */
  async trainerVerify({ enrollmentId, action, feedback, observations = "" }) {
    try {
      const response = await api.post("/programs/trainer/verify", {
        enrollment_id: enrollmentId,
        action,
        feedback,
        observations,
      });
      return response.data;
    } catch (err) {
      console.warn("API /trainer/verify failed:", err.message);
      throw err;
    }
  },

  /**
   * Fetch public verification info for a corporate certificate (via QR code)
   */
  async getCertificate(certificateId) {
    try {
      const response = await api.get(`/programs/certificate/${certificateId}`);
      return response.data;
    } catch (err) {
      console.warn("API /certificate failed:", err.message);
      throw err;
    }
  },

  /**
   * Fetch all certificates issued to the current user
   */
  async getMyCertificates() {
    try {
      const response = await api.get("/programs/my-certificates");
      return response.data?.certificates || [];
    } catch (err) {
      console.warn("API /my-certificates failed:", err.message);
      return [];
    }
  },

  // Fallback helper in case backend server is temporarily uncontactable
  _fallbackGetPrograms({ category, status, search }) {
    const rawList = [
      {
        id: 1,
        slug: "ergonomic-wellness",
        title: "Ergonomic Wellness",
        category: "Ergonomic Wellness",
        tag: "Ergonomics",
        description: "Evidence-based biomechanical training covering posture alignment, workstation geometry, and repetitive strain injury prevention.",
        duration: "4 Weeks",
        totalModules: 4,
        completedModules: 2,
        trainerName: "Dr. Elena Rostova",
        trainerRole: "Senior Ergonomist & Physical Therapist",
        targetRiskArea: "Musculoskeletal & Posture",
        isEnrolled: true,
        status: "In Progress",
        progress: 50,
        assignmentSource: "Assigned",
        isRecommended: true,
        quizPassed: false,
        certificateId: null
      },
      {
        id: 2,
        slug: "stress-management",
        title: "Stress Management",
        category: "Stress Management",
        tag: "Stress Relief",
        description: "Neurobiological stress management protocols, autonomic nervous system down-regulation, cognitive reframing, and time boundary architecture.",
        duration: "4 Weeks",
        totalModules: 4,
        completedModules: 0,
        trainerName: "Marcus Vance",
        trainerRole: "Occupational Wellbeing Specialist",
        targetRiskArea: "Autonomic Stress & Burnout",
        isEnrolled: false,
        status: "Not Enrolled",
        progress: 0,
        assignmentSource: "Recommended",
        isRecommended: true,
        quizPassed: false,
        certificateId: null
      },
      {
        id: 3,
        slug: "fatigue-and-sleep-management",
        title: "Fatigue and Sleep Management",
        category: "Fatigue and Sleep Management",
        tag: "Sleep & Recovery",
        description: "Circadian rhythm alignment, sleep hygiene protocols, micro-break cadence, and chronic occupational fatigue mitigation.",
        duration: "3 Weeks",
        totalModules: 4,
        completedModules: 0,
        trainerName: "Dr. Elena Rostova",
        trainerRole: "Senior Ergonomist & Physical Therapist",
        targetRiskArea: "Recovery & Sleep Debt",
        isEnrolled: false,
        status: "Not Enrolled",
        progress: 0,
        assignmentSource: "Recommended",
        isRecommended: true,
        quizPassed: false,
        certificateId: null
      },
      {
        id: 4,
        slug: "workplace-safety-essentials",
        title: "Workplace Safety Essentials",
        category: "Workplace Safety Essentials",
        tag: "Safety Essentials",
        description: "ISO 45001 workplace hazard identification, electrical and slip prevention, emergency evacuation procedures, and near-miss reporting.",
        duration: "2 Weeks",
        totalModules: 4,
        completedModules: 0,
        trainerName: "Marcus Vance",
        trainerRole: "Occupational Wellbeing Specialist",
        targetRiskArea: "Workplace Physical Safety",
        isEnrolled: false,
        status: "Not Enrolled",
        progress: 0,
        assignmentSource: "Available",
        isRecommended: false,
        quizPassed: false,
        certificateId: null
      },
      {
        id: 5,
        slug: "healthy-lifestyle-at-work",
        title: "Healthy Lifestyle at Work",
        category: "Healthy Lifestyle at Work",
        tag: "Healthy Lifestyle",
        description: "Workplace nutrition, sustained glucose regulation, optimal cellular hydration, desk mobility sequences, and routine habit building.",
        duration: "3 Weeks",
        totalModules: 4,
        completedModules: 0,
        trainerName: "Dr. Elena Rostova",
        trainerRole: "Senior Ergonomist & Physical Therapist",
        targetRiskArea: "Metabolic Health & Movement",
        isEnrolled: false,
        status: "Not Enrolled",
        progress: 0,
        assignmentSource: "Recommended",
        isRecommended: true,
        quizPassed: false,
        certificateId: null
      },
      {
        id: 6,
        slug: "digital-eye-care",
        title: "Digital Eye Care",
        category: "Digital Eye Care",
        tag: "Digital Eye Care",
        description: "Computer Vision Syndrome (CVS) mitigation, 20-20-20 visual cadence, optic nerve relaxation drills, and workstation display lighting calibration.",
        duration: "2 Weeks",
        totalModules: 4,
        completedModules: 0,
        trainerName: "Marcus Vance",
        trainerRole: "Occupational Wellbeing Specialist",
        targetRiskArea: "Visual Strain & Asthenopia",
        isEnrolled: false,
        status: "Not Enrolled",
        progress: 0,
        assignmentSource: "Available",
        isRecommended: false,
        quizPassed: false,
        certificateId: null
      }
    ];

    let filtered = rawList;
    if (category && category !== "all") {
      filtered = filtered.filter((p) => p.category.toLowerCase().includes(category.toLowerCase()));
    }
    if (search && search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter((p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }

    return {
      allPrograms: filtered,
      assignedPrograms: rawList.filter((p) => p.assignmentSource === "Assigned"),
      recommendedPrograms: rawList.filter((p) => p.isRecommended && p.status !== "Completed"),
      inProgressPrograms: rawList.filter((p) => p.isEnrolled && p.status !== "Completed"),
      completedPrograms: rawList.filter((p) => p.status === "Completed"),
      counts: {
        total: rawList.length,
        enrolled: rawList.filter((p) => p.isEnrolled).length,
        inProgress: rawList.filter((p) => p.isEnrolled && p.status !== "Completed").length,
        completed: rawList.filter((p) => p.status === "Completed").length,
        recommended: rawList.filter((p) => p.isRecommended).length
      }
    };
  },

  _fallbackGetProgramDetails(idOrSlug) {
    const list = this._fallbackGetPrograms({}).allPrograms;
    return list.find((p) => p.slug === idOrSlug || String(p.id) === String(idOrSlug)) || list[0];
  }
};
