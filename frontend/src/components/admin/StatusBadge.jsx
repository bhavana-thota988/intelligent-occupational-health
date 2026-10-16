import React from "react";

export default function StatusBadge({ status }) {
  const norm = (status || "").toLowerCase();

  const styles = {
    published: {
      bg: "#ECFDF5",
      color: "#047857",
      border: "#A7F3D0",
      dot: "#10B981"
    },
    upcoming: {
      bg: "#EFF6FF",
      color: "#1D4ED8",
      border: "#BFDBFE",
      dot: "#3B82F6"
    },
    ongoing: {
      bg: "#F0FDFA",
      color: "#0F766E",
      border: "#99F6E4",
      dot: "#14B8A6"
    },
    completed: {
      bg: "#F1F5F9",
      color: "#334155",
      border: "#CBD5E1",
      dot: "#64748B"
    },
    draft: {
      bg: "#FFFBEB",
      color: "#B45309",
      border: "#FDE68A",
      dot: "#F59E0B"
    },
    archived: {
      bg: "#F8FAFC",
      color: "#64748B",
      border: "#E2E8F0",
      dot: "#94A3B8"
    },
    cancelled: {
      bg: "#FEF2F2",
      color: "#B91C1C",
      border: "#FECACA",
      dot: "#EF4444"
    }
  }[norm] || {
    bg: "#F8FAFC",
    color: "#475569",
    border: "#E2E8F0",
    dot: "#94A3B8"
  };

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "3px 9px",
        borderRadius: "14px",
        fontSize: "12px",
        fontWeight: 600,
        backgroundColor: styles.bg,
        color: styles.color,
        border: `1px solid ${styles.border}`
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          backgroundColor: styles.dot
        }}
      />
      <span>{status}</span>
    </span>
  );
}
