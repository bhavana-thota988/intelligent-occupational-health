import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { ShieldCheck, LogOut, Menu } from "lucide-react";
import { authService } from "../../services/authService";

export default function Header({ onToggleMobileSidebar }) {
  const navigate = useNavigate();
  const user = authService.getCurrentUser() || {
    name: "Workplace Member",
    email: "employee@company.com",
    role: "employee",
    department: "Enterprise Operations"
  };

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  const portalLabel = {
    employee: "Employee Portal",
    trainer: "Trainer Console",
    admin: "Admin Directorate"
  }[user.role] || "Workplace Portal";

  return (
    <header
      style={{
        height: "72px",
        background: "#FFFFFF",
        borderBottom: "1px solid var(--border-subtle)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 32px",
        position: "sticky",
        top: 0,
        zIndex: 40,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <button
          onClick={onToggleMobileSidebar}
          style={{
            display: "none",
            padding: 8,
            color: "var(--text-heading)",
          }}
          className="mobile-menu-btn"
          aria-label="Toggle Navigation"
        >
          <Menu size={22} />
        </button>

        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "8px",
              background: "var(--color-primary)",
              color: "#FFFFFF",
              display: "grid",
              placeItems: "center",
              fontWeight: 800,
              fontSize: "13px",
            }}
          >
            IO
          </div>
          <div>
            <strong style={{ fontSize: "14px", color: "var(--text-heading)", display: "block", lineHeight: 1.2 }}>
              Intelligent Occupational Health
            </strong>
            <span style={{ fontSize: "11px", color: "var(--text-muted)", display: "block" }}>
              Workplace Risk & Wellbeing Management
            </span>
          </div>
        </Link>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "5px 12px",
            borderRadius: "6px",
            background: "var(--color-primary-light)",
            color: "var(--color-primary)",
            fontSize: "12px",
            fontWeight: 600,
          }}
          className="hide-on-mobile"
        >
          <ShieldCheck size={14} />
          <span>Workplace Risk Screening</span>
        </div>

        {/* User Pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "6px 14px",
            background: "#F8FAF9",
            borderRadius: "8px",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              background: "var(--color-secondary)",
              color: "var(--color-primary)",
              display: "grid",
              placeItems: "center",
              fontWeight: 700,
              fontSize: "12px",
            }}
          >
            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }} className="hide-on-mobile">
            <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-heading)", lineHeight: 1.1 }}>
              {user.name}
            </span>
            <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
              {portalLabel} • {user.department || "Enterprise"}
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          title="Sign Out"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 12px",
            borderRadius: "6px",
            color: "var(--text-muted)",
            fontSize: "13px",
            fontWeight: 600,
          }}
        >
          <LogOut size={16} />
          <span className="hide-on-mobile">Sign Out</span>
        </button>
      </div>
    </header>
  );
}
