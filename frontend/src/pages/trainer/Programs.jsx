import React, { useState } from "react";
import { BookOpen, Users, Clock, CheckCircle2, User, ChevronRight } from "lucide-react";
import { employeeService } from "../../services/employeeService";
import Toast from "../../components/common/Toast";

export default function TrainerPrograms() {
  const [programs] = useState(employeeService.getAllOfficialPrograms());
  const [toastMessage, setToastMessage] = useState("");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: "1280px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
        <div>
          <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Curriculum Authoring & Supervision
          </span>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "var(--text-heading)", margin: "4px 0 0" }}>
            Official Corporate Wellbeing Programs
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", margin: "4px 0 0" }}>
            Review program curricula, examine individual session drills, and oversee employee clinical progression.
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 22 }}>
        {programs.map((p) => (
          <div key={p.id} className="corporate-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "24px" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span className="badge badge-low">{p.category}</span>
                <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 600 }}>{p.duration}</span>
              </div>

              <h3 style={{ fontSize: "17px", fontWeight: 700, color: "var(--text-heading)", marginBottom: 8 }}>
                {p.name}
              </h3>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.5, marginBottom: 16 }}>
                {p.overview}
              </p>

              <div style={{ marginBottom: 16, background: "#F8FAF9", padding: "12px 14px", borderRadius: 6, border: "1px solid var(--border-subtle)" }}>
                <strong style={{ fontSize: "12px", color: "var(--text-heading)", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Curriculum Drill Breakdown ({p.totalSessions} Sessions)
                </strong>
                <ul style={{ paddingLeft: 16, fontSize: "12px", color: "var(--text-body)", lineHeight: 1.6, margin: 0 }}>
                  {p.sessions.slice(0, 3).map((ses) => (
                    <li key={ses.id}>
                      <strong>{ses.title}</strong> ({ses.duration})
                    </li>
                  ))}
                  {p.sessions.length > 3 && (
                    <li style={{ color: "var(--color-primary)", fontWeight: 600 }}>
                      + {p.sessions.length - 3} more structured workstation drills
                    </li>
                  )}
                </ul>
              </div>
            </div>

            <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "12px", color: "var(--text-muted)" }}>
                <User size={13} />
                <span>{p.trainerAssigned.split("(")[0]}</span>
              </div>
              <button
                type="button"
                onClick={() => setToastMessage(`Curriculum specifications reviewed for ${p.name}.`)}
                className="btn-secondary"
                style={{ padding: "6px 14px", fontSize: "12.5px" }}
              >
                Inspect Syllabus
              </button>
            </div>
          </div>
        ))}
      </div>

      <Toast message={toastMessage} onClose={() => setToastMessage("")} />
    </div>
  );
}
