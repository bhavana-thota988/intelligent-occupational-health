import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Layouts (Strictly Separated Roles: Employee, Trainer, Admin)
import AuthLayout from "../layouts/AuthLayout";
import EmployeeLayout from "../layouts/EmployeeLayout";
import TrainerLayout from "../layouts/TrainerLayout";
import AdminLayout from "../layouts/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";

// Public & Auth Pages
import LandingPage from "../pages/public/LandingPage";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import VerifyOTP from "../pages/auth/VerifyOTP";
import PendingApproval from "../pages/auth/PendingApproval";
import VerifyCertificate from "../pages/public/VerifyCertificate";

// Employee Pages
import EmployeeDashboard from "../pages/employee/EmployeeDashboard";
import Assessment from "../pages/employee/Assessment";
import RiskProfile from "../pages/employee/RiskProfile";
import Recommendations from "../pages/employee/Recommendations";
import ProgramDetail from "../pages/employee/ProgramDetail";
import MyPrograms from "../pages/employee/MyPrograms";
import Certificates from "../pages/employee/Certificates";
import MyProgress from "../pages/employee/MyProgress";
import Profile from "../pages/employee/Profile";

// Trainer Pages
import TrainerDashboard from "../pages/trainer/TrainerDashboard";
import ProgramReviews from "../pages/trainer/ProgramReviews";
import ReviewDetail from "../pages/trainer/ReviewDetail";
import AssignedEmployees from "../pages/trainer/AssignedEmployees";
import TrainerPrograms from "../pages/trainer/Programs";
import TrainerSessions from "../pages/trainer/Sessions";
import TrainerProgress from "../pages/trainer/TrainerProgress";
import TrainerProfile from "../pages/trainer/TrainerProfile";

// Admin Directorate Pages
import AdminLogin from "../pages/admin/AdminLogin";
import AdminDashboard from "../pages/admin/AdminDashboard";
import PublicHealthAwareness from "../pages/admin/PublicHealthAwareness";
import CommunityCampaigns from "../pages/admin/CommunityCampaigns";
import HealthResourceLibrary from "../pages/admin/HealthResourceLibrary";
import PublicHealthReports from "../pages/admin/PublicHealthReports";
import TrainerManagement from "../pages/admin/TrainerManagement";
import ProgramAssignments from "../pages/admin/ProgramAssignments";
import ClinicalReviewsOversight from "../pages/admin/ClinicalReviewsOversight";
import WorkforceDirectory from "../pages/admin/WorkforceDirectory";
import ComplianceAuditLogs from "../pages/admin/ComplianceAuditLogs";
import AdminProfile from "../pages/admin/AdminProfile";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Public Certificate Verification */}
      <Route path="/verify" element={<VerifyCertificate />} />
      <Route path="/verify/:certificateId" element={<VerifyCertificate />} />

      {/* Authentication Pages inside AuthLayout */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Standalone Security & Verification Pages */}
      <Route path="/verify-otp" element={<VerifyOTP />} />
      <Route path="/pending-approval" element={<PendingApproval />} />

      {/* Employee Protected Routes */}
      <Route
        path="/employee"
        element={
          <ProtectedRoute allowedRoles={["employee"]}>
            <EmployeeLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/employee/dashboard" replace />} />
        <Route path="dashboard" element={<EmployeeDashboard />} />
        <Route path="assessment" element={<Assessment />} />
        <Route path="risk-profile" element={<RiskProfile />} />
        <Route path="recommendations" element={<Recommendations />} />
        <Route path="program/:programId" element={<ProgramDetail />} />
        <Route path="my-programs" element={<MyPrograms />} />
        <Route path="certificates" element={<Certificates />} />
        <Route path="my-progress" element={<MyProgress />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Trainer Protected Routes */}
      <Route
        path="/trainer"
        element={
          <ProtectedRoute allowedRoles={["trainer"]}>
            <TrainerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/trainer/dashboard" replace />} />
        <Route path="dashboard" element={<TrainerDashboard />} />
        <Route path="reviews" element={<ProgramReviews />} />
        <Route path="reviews/:reviewId" element={<ReviewDetail />} />
        <Route path="employees" element={<AssignedEmployees />} />
        <Route path="assigned-employees" element={<Navigate to="/trainer/employees" replace />} />
        <Route path="programs" element={<TrainerPrograms />} />
        <Route path="sessions" element={<TrainerSessions />} />
        <Route path="progress" element={<TrainerProgress />} />
        <Route path="profile" element={<TrainerProfile />} />
      </Route>

      {/* Admin Dedicated Login */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Admin Directorate Protected Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="awareness" element={<PublicHealthAwareness />} />
        <Route path="campaigns" element={<CommunityCampaigns />} />
        <Route path="resources" element={<HealthResourceLibrary />} />
        <Route path="reports" element={<PublicHealthReports />} />
        <Route path="trainers" element={<TrainerManagement />} />
        <Route path="programs" element={<ProgramAssignments />} />
        <Route path="reviews" element={<ClinicalReviewsOversight />} />
        <Route path="outcomes" element={<Navigate to="/admin/reviews" replace />} />
        <Route path="employees" element={<WorkforceDirectory />} />
        <Route path="records" element={<Navigate to="/admin/employees" replace />} />
        <Route path="compliance" element={<ComplianceAuditLogs />} />
        <Route path="profile" element={<AdminProfile />} />
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
