import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { authService, getDashboardPathForRole } from "../services/authService";

export default function ProtectedRoute({ allowedRoles = [], children }) {
  const location = useLocation();
  const user = authService.getCurrentUser();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    const redirectPath = getDashboardPathForRole(user.role);
    return <Navigate to={redirectPath} replace />;
  }

  return children;
}
