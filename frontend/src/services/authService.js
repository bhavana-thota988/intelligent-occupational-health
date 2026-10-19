import axios from "axios";
import { dataStore } from "./dataStore";

const API_BASE_URL = "http://127.0.0.1:8000/api";

export const getDashboardPathForRole = (role) => {
  if (role === "admin") {
    return "/admin/dashboard";
  }
  if (role === "trainer") {
    return "/trainer/dashboard";
  }
  return "/employee/dashboard";
};

export const authService = {
  login: async (email, password, requestedPortal = null) => {
    const trimmedEmail = email ? email.trim() : "";
    if (!trimmedEmail) {
      throw new Error("Please enter your registered email address.");
    }
    if (!password) {
      throw new Error("Please enter your account password.");
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: trimmedEmail,
        password: password,
        requested_portal: requestedPortal
      }, { timeout: 8000 });

      const { access_token, user } = response.data;

      // Save real session credentials
      localStorage.setItem("token", access_token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", user.role);

      // Synchronize with local reactive dataStore
      dataStore.setCurrentUser(user);

      return {
        user,
        role: user.role,
        redirectPath: getDashboardPathForRole(user.role),
        accessToken: access_token
      };
    } catch (err) {
      const errorMsg =
        err.response?.data?.detail ||
        (err.code === "ECONNABORTED" ? "Server request timed out. Please verify backend is running." : null) ||
        err.message ||
        "Unable to authenticate. Please check your credentials.";
      throw new Error(errorMsg);
    }
  },

  register: async (formData) => {
    const {
      name,
      email,
      department,
      jobRole,
      employeeId,
      trainerId,
      professionalRole,
      password,
      confirmPassword,
      role = "employee"
    } = formData;

    const trimmedEmail = email ? email.trim() : "";
    const assignedRole = role === "trainer" ? "trainer" : "employee";

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        name: name ? name.trim() : "",
        email: trimmedEmail,
        password,
        confirm_password: confirmPassword,
        department: department || (assignedRole === "trainer" ? "Health & Ergonomics" : "Engineering"),
        job_role: jobRole || (assignedRole === "trainer" ? professionalRole || "Occupational Health Specialist" : "Senior Software Engineer"),
        employee_id: employeeId || undefined,
        trainer_id: trainerId || undefined,
        professional_role: professionalRole || undefined,
        role: assignedRole
      }, { timeout: 8000 });

      // Synchronize local dataStore with newly created user
      dataStore.registerUser({
        name: name ? name.trim() : "Corporate Employee",
        email: trimmedEmail.toLowerCase(),
        role: assignedRole,
        department: department || "Engineering",
        jobRole: jobRole || "Senior Software Engineer",
        employeeId: employeeId || undefined
      });

      return response.data;
    } catch (err) {
      const errorMsg =
        err.response?.data?.detail ||
        (err.code === "ECONNABORTED" ? "Server request timed out. Please verify backend is running." : null) ||
        err.message ||
        "Registration failed. Please try again.";
      throw new Error(errorMsg);
    }
  },

  getCurrentUser: () => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return dataStore.getCurrentUser();
      }
    }
    return dataStore.getCurrentUser();
  },

  getCurrentRole: () => {
    const user = authService.getCurrentUser();
    return user ? user.role : null;
  },

  isAuthenticated: () => {
    const token = localStorage.getItem("token");
    const user = authService.getCurrentUser();
    return !!(token && user);
  },

  logout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    dataStore.setCurrentUser(null);
  }
};
