import { dataStore, OFFICIAL_PROGRAMS } from "./dataStore";
import { authService } from "./authService";

export const trainerService = {
  // Returns actual registered employees with their risk profile and active course
  getAssignedEmployees: () => {
    return dataStore.getTrainerAssignedEmployees();
  },

  getPendingReviews: () => {
    const reviews = dataStore.getTrainerReviews();
    return reviews.filter((r) => r.status === "pending");
  },

  getAllReviews: () => {
    return dataStore.getTrainerReviews();
  },

  getReviewById: (reviewId) => {
    const reviews = dataStore.getTrainerReviews();
    return reviews.find((r) => r.id === reviewId) || null;
  },

  approveReview: (reviewId, trainerName, feedback) => {
    return dataStore.approveReview(reviewId, trainerName, feedback);
  },

  requestCorrection: (reviewId, trainerName, feedback) => {
    return dataStore.requestReviewCorrection(reviewId, trainerName, feedback);
  },

  getTrainerSessionLogs: () => {
    return dataStore.getTrainerSessionLogs();
  },

  saveTrainerSessionNote: (noteKey, noteText) => {
    return dataStore.saveTrainerSessionNote(noteKey, noteText);
  },

  getTrainerProgressStats: () => {
    return dataStore.getTrainerProgressStats();
  },

  getTrainerData: () => {
    const employees = dataStore.getTrainerAssignedEmployees();
    const reviews = dataStore.getTrainerReviews();
    const pendingReviews = reviews.filter((r) => r.status === "pending");
    const sessionLogs = dataStore.getTrainerSessionLogs();
    const scheduledSessions = dataStore.get("trainer_sessions", []);
    const progressStats = dataStore.getTrainerProgressStats();

    return {
      kpis: {
        assignedEmployeesCount: employees.length,
        activeProgramsCount: OFFICIAL_PROGRAMS.length,
        pendingReviewsCount: pendingReviews.length,
        totalCertificatesIssued: progressStats.totalCertificatesIssued,
        upcomingSessionsCount: scheduledSessions.length,
        activeEnrollments: progressStats.activePrograms
      },
      assignedEmployees: employees,
      pendingReviews: pendingReviews,
      sessions: scheduledSessions,
      sessionLogs: sessionLogs,
      progressStats: progressStats
    };
  },

  scheduleSession: (sessionData) => {
    const sessions = dataStore.get("trainer_sessions", []);
    const newSession = {
      id: "ses-" + Date.now(),
      ...sessionData,
      status: "Confirmed",
      createdAt: new Date().toISOString()
    };
    sessions.unshift(newSession);
    dataStore.set("trainer_sessions", sessions);
    return newSession;
  },

  completeSession: (sessionId) => {
    const sessions = dataStore.get("trainer_sessions", []);
    const updated = sessions.map((s) => (s.id === sessionId ? { ...s, status: "Completed" } : s));
    dataStore.set("trainer_sessions", updated);
    return updated;
  },

  getTrainerProfile: () => {
    const user = authService.getCurrentUser();
    return user || {
      id: "u-tr-1",
      name: "Dr. Sarah Jenkins",
      email: "trainer@company.com",
      role: "trainer",
      department: "Health & Ergonomics",
      jobRole: "Occupational Health Specialist",
      trainerId: "TR-2001",
      credentials: "PT, CPE (Certified Professional Ergonomist), OTR/L",
      bio: "Occupational physiotherapist and ergonomics specialist with 12+ years experience advising corporate ergonomic setups and musculoskeletal injury prevention.",
      certifications: ["ISO 45001 Lead Auditor", "Certified Professional Ergonomist (BCPE)", "Occupational Health Specialist"]
    };
  },

  updateTrainerProfile: (updatedData) => {
    const currentUser = authService.getCurrentUser() || {};
    const updated = {
      ...currentUser,
      ...updatedData
    };
    authService.saveCurrentUser(updated);
    
    // Also update in users registry
    const users = dataStore.getUsers();
    const idx = users.findIndex((u) => u.id === updated.id || u.email === updated.email);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...updated };
      dataStore.set("users", users);
    }
    return updated;
  }
};
