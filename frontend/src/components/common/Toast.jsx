import React from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export default function Toast({ message, type = "success", onClose }) {
  if (!message) return null;

  const config = {
    success: { icon: CheckCircle2, bg: "#EAF5F3", border: "#C4E4DD", text: "#147D75" },
    error: { icon: AlertCircle, bg: "#FDEEEE", border: "#F5C6C6", text: "#C93B3B" },
    info: { icon: Info, bg: "#EEF4FC", border: "#CBE0F8", text: "#2468B3" },
  }[type] || { icon: Info, bg: "#EEF4FC", border: "#CBE0F8", text: "#2468B3" };

  const Icon = config.icon;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 9999,
        background: config.bg,
        border: `1px solid ${config.border}`,
        color: config.text,
        borderRadius: "8px",
        padding: "12px 16px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
        fontSize: "13.5px",
        fontWeight: 600,
        maxWidth: "400px",
      }}
      className="animate-fade"
    >
      <Icon size={18} />
      <span style={{ flex: 1 }}>{message}</span>
      {onClose && (
        <button onClick={onClose} style={{ color: config.text, padding: 2 }}>
          <X size={15} />
        </button>
      )}
    </div>
  );
}
