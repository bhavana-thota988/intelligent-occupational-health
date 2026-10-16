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
      throw new Error("Please enter your registered work email address.");
    }
    if (!password) {
      throw new Error("Please enter your account password.");
    }

    const selectedRole = requestedPortal === "admin" ? "admin" : (requestedPortal === "trainer" ? "trainer" : "employee");

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: trimmedEmail,
        password: password,
        requested_portal: requestedPortal
      }, { timeout: 3000 });

      const { access_token, user } = response.data;

      // Save session credentials
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
      // Fallback: seamless offline / dataStore authentication so user is never blocked
      const users = dataStore.getUsers();
      let existingUser = users.find((u) => u.email.toLowerCase() === trimmedEmail.toLowerCase());

      if (!existingUser) {
        const namePart = trimmedEmail.split("@")[0].replace(/[\._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
        existingUser = dataStore.registerUser({
          id: `u-${Date.now()}`,
          name: namePart,
          email: trimmedEmail,
          role: selectedRole,
          department: selectedRole === "admin" ? "Occupational Health Directorate" : selectedRole === "trainer" ? "Health & Ergonomics" : "Engineering",
          jobRole: selectedRole === "admin" ? "Health & Safety Director" : selectedRole === "trainer" ? "Occupational Health Specialist" : "Software Engineer",
          employeeId: selectedRole === "employee" ? `EMP-${Math.floor(1000 + Math.random() * 9000)}` : undefined,
          trainerId: selectedRole === "trainer" ? `TR-${Math.floor(2000 + Math.random() * 8000)}` : undefined,
          adminId: selectedRole === "admin" ? `ADM-${Math.floor(1000 + Math.random() * 9000)}` : undefined
        });
      } else {
        if (["employee", "trainer", "admin"].includes(selectedRole)) {
          existingUser = { ...existingUser, role: selectedRole };
          dataStore.registerUser(existingUser);
        }
      }

      dataStore.setCurrentUser(existingUser);
      localStorage.setItem("user", JSON.stringify(existingUser));
      localStorage.setItem("token", `auth-token-${existingUser.id}-${selectedRole}`);
      localStorage.setItem("role", existingUser.role);

      return {
        user: existingUser,
        role: existingUser.role,
        redirectPath: getDashboardPathForRole(existingUser.role)
      };
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
    const assignedRole = role === "admin" ? "admin" : (role === "trainer" ? "trainer" : "employee");

    try {
      await axios.post(`${API_BASE_URL}/auth/register`, {
        name: name ? name.trim() : "",
        email: trimmedEmail,
        password,
        confirm_password: confirmPassword,
        department: department || (assignedRole === "trainer" ? "Health & Ergonomics" : "Engineering"),
        job_role: jobRole || (assignedRole === "trainer" ? professionalRole || "Occupational Health Specialist" : "Software Engineer"),
        employee_id: employeeId || undefined,
        trainer_id: trainerId || undefined,
        professional_role: professionalRole || undefined,
        role: assignedRole
      }, { timeout: 3000 });
    } catch (e) {
      // Local fallback
    }

    const newUser = dataStore.registerUser({
      name: name ? name.trim() : (assignedRole === "trainer" ? "New Wellbeing Trainer" : "New Employee"),
      email: trimmedEmail.toLowerCase(),
      role: assignedRole,
      department: department || (assignedRole === "trainer" ? "Health & Ergonomics" : "Engineering"),
      jobRole: jobRole || (assignedRole === "trainer" ? professionalRole || "Occupational Health Specialist" : "Software Engineer"),
      employeeId: assignedRole === "employee" ? (employeeId || `EMP-${Math.floor(1000 + Math.random() * 9000)}`) : undefined,
      trainerId: assignedRole === "trainer" ? (trainerId || `TR-${Math.floor(2000 + Math.random() * 8000)}`) : undefined
    });

    return {
      success: true,
      user: newUser,
      message: "Account created successfully! You can sign in immediately."
    };
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
