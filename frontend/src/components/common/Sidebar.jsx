import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardCheck,
  ShieldAlert,
  Sparkles,
  BookOpen,
  TrendingUp,
  Award,
  User,
  Users,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  LogOut,
  X,
  BarChart3,
  FolderOpen
} from "lucide-react";
import { authService } from "../../services/authService";

const NAV_ITEMS_BY_ROLE = {
  employee: [
    { label: "Overview", to: "/employee/dashboard", icon: LayoutDashboard },
    { label: "Health Assessment", to: "/employee/assessment", icon: ClipboardCheck },
    { label: "Risk Profile", to: "/employee/risk-profile", icon: ShieldAlert },
    { label: "Recommendations", to: "/employee/recommendations", icon: Sparkles },
    { label: "My Programs", to: "/employee/my-programs", icon: BookOpen },
    { label: "My Progress", to: "/employee/my-progress", icon: TrendingUp },
    { label: "My Certificates", to: "/employee/certificates", icon: Award },
    { label: "My Profile", to: "/employee/profile", icon: User },
  ],
  trainer: [
    { label: "Overview", to: "/trainer/dashboard", icon: LayoutDashboard },
    { label: "Assigned Employees", to: "/trainer/employees", icon: Users },
    { label: "Program Reviews", to: "/trainer/reviews", icon: CheckCircle2 },
    { label: "Active Programs", to: "/trainer/programs", icon: BookOpen },
    { label: "Sessions", to: "/trainer/sessions", icon: Calendar },
    { label: "Progress", to: "/trainer/progress", icon: TrendingUp },
    { label: "Profile", to: "/trainer/profile", icon: User },
  ],
  admin: [
    { label: "Dashboard", to: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Public Health Awareness", to: "/admin/awareness", icon: BookOpen },
    { label: "Community Health Campaigns", to: "/admin/campaigns", icon: Calendar },
    { label: "Health Resource Library", to: "/admin/resources", icon: FolderOpen },
    { label: "Public Health Reports", to: "/admin/reports", icon: BarChart3 },
  ]
};

export default function Sidebar({ role = "employee", isMobileOpen, onCloseMobile }) {
  const navigate = useNavigate();
  const navItems = NAV_ITEMS_BY_ROLE[role] || NAV_ITEMS_BY_ROLE.employee;

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(24, 53, 51, 0.4)",
            zIndex: 90,
          }}
          className="mobile-backdrop"
        />
      )}

      <aside className={`sidebar-fixed ${isMobileOpen ? "mobile-open" : ""}`}>
        <div>
          {/* Platform Identity */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid var(--border-subtle)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "8px",
                  background: "var(--color-primary)",
                  color: "#FFFFFF",
                  display: "grid",
                  placeItems: "center",
                  fontWeight: 800,
                  fontSize: "15px",
                }}
              >
                IO
              </div>
              <div>
                <strong style={{ fontSize: "14px", color: "var(--text-heading)", display: "block", lineHeight: 1.15 }}>
                  Intelligent Health
                </strong>
                <span style={{ fontSize: "11px", color: "var(--text-muted)", display: "block" }}>
                  {role === "employee" ? "Employee Portal" : role === "trainer" ? "Trainer Console" : "Admin Directorate"}
                </span>
              </div>
            </div>

            {isMobileOpen && (
              <button onClick={onCloseMobile} style={{ padding: 4 }}>
                <X size={18} />
              </button>
            )}
          </div>

          <span
            style={{
              fontSize: "11px",
              fontWeight: 700,
              color: "var(--text-muted)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              display: "block",
              marginBottom: 10,
              paddingLeft: "6px",
            }}
          >
            Navigation Menu
          </span>

          <nav style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onCloseMobile}
                  style={({ isActive }) => ({
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    fontSize: "13.5px",
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? "var(--color-primary)" : "var(--text-body)",
                    backgroundColor: isActive ? "var(--color-primary-light)" : "transparent",
                    transition: "all 0.15s ease",
                  })}
                >
                  <Icon size={17} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "16px" }}>
          <div
            style={{
              padding: "10px 12px",
              background: "#F8FAF9",
              borderRadius: "8px",
              marginBottom: "12px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <ShieldCheck size={16} color="var(--color-primary)" />
            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
              <strong>ISO 45001 Protected</strong>
              <div style={{ fontSize: "10px" }}>Confidential Workplace Data</div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 14px",
              borderRadius: "8px",
              fontSize: "13.5px",
              fontWeight: 600,
              color: "#C93B3B",
              background: "transparent",
            }}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
