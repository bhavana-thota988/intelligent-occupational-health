import React from "react";
import { AlertTriangle, X } from "lucide-react";

export default function ConfirmDialog({
  isOpen,
  title = "Confirm Action",
  message = "Are you sure you want to proceed with this action?",
  confirmText = "Confirm",
  confirmVariant = "danger", // 'danger' | 'warning' | 'primary'
  onConfirm,
  onCancel,
  loading = false
}) {
  if (!isOpen) return null;

  const buttonStyle = {
    danger: {
      background: "#DC2626",
      color: "#FFFFFF",
      borderColor: "#DC2626"
    },
    warning: {
      background: "#D97706",
      color: "#FFFFFF",
      borderColor: "#D97706"
    },
    primary: {
      background: "#0D9488",
      color: "#FFFFFF",
      borderColor: "#0D9488"
    }
  }[confirmVariant] || { background: "#DC2626", color: "#FFFFFF" };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15, 23, 42, 0.6)",
        backdropFilter: "blur(4px)",
        display: "grid",
        placeItems: "center",
        zIndex: 999,
        padding: "16px"
      }}
      onClick={onCancel}
    >
      <div
        className="corporate-card animate-scale-in"
        style={{
          width: "100%",
          maxWidth: "460px",
          padding: "24px",
          background: "#FFFFFF",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 16 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: confirmVariant === "danger" ? "#FEE2E2" : "#FEF3C7",
              color: confirmVariant === "danger" ? "#DC2626" : "#D97706",
              display: "grid",
              placeItems: "center",
              flexShrink: 0
            }}
          >
            <AlertTriangle size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#0F172A", margin: "0 0 4px 0" }}>
              {title}
            </h3>
            <p style={{ fontSize: "13.5px", color: "#475569", margin: 0, lineHeight: 1.5 }}>
              {message}
            </p>
          </div>
          <button
            onClick={onCancel}
            style={{ padding: 4, color: "#94A3B8", background: "none", border: "none", cursor: "pointer" }}
            disabled={loading}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="btn-secondary"
            style={{
              padding: "8px 16px",
              fontSize: "13px",
              fontWeight: 600,
              color: "#475569",
              background: "#F1F5F9",
              border: "1px solid #CBD5E1",
              borderRadius: "6px"
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            style={{
              padding: "8px 18px",
              fontSize: "13px",
              fontWeight: 600,
              borderRadius: "6px",
              border: "1px solid",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              ...buttonStyle
            }}
          >
            {loading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
