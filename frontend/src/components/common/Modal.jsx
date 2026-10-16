import React, { useEffect } from "react";
import { X } from "lucide-react";

export default function Modal({ isOpen, onClose, title, subtitle, children, maxWidth = 640 }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content animate-fade"
        style={{ maxWidth }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-heading)" }}>{title}</h3>
            {subtitle && <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: 4 }}>{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            style={{
              padding: 6,
              borderRadius: "6px",
              color: "var(--text-muted)",
              display: "grid",
              placeItems: "center",
            }}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ maxHeight: "calc(80vh - 120px)", overflowY: "auto", paddingRight: 4 }}>
          {children}
        </div>
      </div>
    </div>
  );
}
