import React from "react";

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  badgeText,
  badgeType = "neutral",
  onClick,
}) {
  return (
    <div
      className="corporate-card"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        cursor: onClick ? "pointer" : "default",
      }}
      onClick={onClick}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
          {title}
        </span>
        {Icon && (
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "8px",
              background: "var(--color-primary-light)",
              color: "var(--color-primary)",
              display: "grid",
              placeItems: "center",
            }}
          >
            <Icon size={18} />
          </div>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 8 }}>
        <h3 style={{ fontSize: "28px", fontWeight: 800, color: "var(--text-heading)", lineHeight: 1.1 }}>
          {value}
        </h3>
        {badgeText && (
          <span className={`badge ${badgeType === "success" ? "badge-low" : badgeType === "warning" ? "badge-mod" : badgeType === "danger" ? "badge-high" : "badge-neutral"}`}>
            {badgeText}
          </span>
        )}
      </div>

      {subtitle && (
        <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0 }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
