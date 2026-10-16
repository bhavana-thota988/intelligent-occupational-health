import React, { useState } from "react";
import {
  BookOpen,
  UserCheck,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
  ShieldCheck,
  Info
} from "lucide-react";
import { adminService } from "../../services/adminService";

export default function ProgramAssignments() {
  const [programs, setPrograms] = useState(adminService.getPrograms());
  const trainers = adminService.getTrainers();
  const [toastMessage, setToastMessage] = useState("");

  const handleTrainerChange = (programId, newTrainerName) => {
    adminService.updateProgramTrainer(programId, newTrainerName);
    setPrograms(adminService.getPrograms());
    setToastMessage(`Assigned ${newTrainerName} as Lead Specialist for program.`);
    setTimeout(() => setToastMessage(""), 3500);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: "1280px", margin: "0 auto" }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            backgroundColor: "#183533",
            color: "#FFFFFF",
            padding: "12px 20px",
            borderRadius: "8px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.18)",
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: "13.5px",
            fontWeight: 600,
            zIndex: 100
          }}
        >
          <CheckCircle2 size={18} color="#2DD4BF" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="corporate-card" style={{ padding: "26px 30px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Curriculum Governance & Clinical Lead Assignment
          </span>
        </div>
        <h1 style={{ fontSize: "24px", fontWeight: 800, margin: "0 0 6px 0", color: "var(--text-heading)" }}>
          Program & Specialist Lead Assignments
        </h1>
        <p style={{ fontSize: "13.5px", color: "var(--text-muted)", margin: 0, maxWidth: "780px" }}>
          Assign designated occupational health specialists to supervise each wellbeing pathway. Reassigning a specialist updates employee coaching prompts and routes session reviews directly to the chosen specialist.
        </p>
      </div>

      {/* Notice Banner */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "14px 18px",
          borderRadius: "8px",
          backgroundColor: "#EAF5F3",
          border: "1px solid #C8E5DF",
          color: "var(--text-heading)",
          fontSize: "13px"
        }}
      >
        <Info size={18} color="var(--color-primary)" />
        <span>
          <strong>Operational Bridge Active:</strong> Changing the lead specialist below instantly synchronizes across the Employee Portal curriculum display and directs review submissions to that specialist's coaching queue.
        </span>
      </div>

      {/* Programs List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {programs.map((p, idx) => (
          <div key={p.id} className="corporate-card" style={{ padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, marginBottom: 16 }}>
              <div style={{ maxWidth: "680px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: "4px",
                      background: "var(--color-primary-light)",
                      color: "var(--color-primary)"
                    }}
                  >
                    Program {idx + 1}
                  </span>
                  <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)" }}>
                    {p.category}
                  </span>
                </div>
                <h2 style={{ fontSize: "18px", fontWeight: 800, margin: "0 0 8px 0", color: "var(--text-heading)" }}>
                  {p.name}
                </h2>
                <p style={{ fontSize: "13px", color: "var(--text-body)", margin: "0 0 10px 0", lineHeight: 1.5 }}>
                  {p.overview}
                </p>
                <div style={{ display: "flex", gap: 16, fontSize: "12px", color: "var(--text-muted)" }}>
                  <span><strong>Duration:</strong> {p.duration}</span>
                  <span><strong>Total Sessions:</strong> {p.totalSessions} Sessions</span>
                  <span><strong>Target Risk:</strong> {p.targetRisk}</span>
                  <span><strong>Active Enrollments:</strong> {p.activeEnrollmentsCount} Employees</span>
                </div>
              </div>

              {/* Lead Specialist Selector */}
              <div
                style={{
                  minWidth: "280px",
                  backgroundColor: "#FAFDFB",
                  border: "1.5px solid var(--border-subtle)",
                  borderRadius: "10px",
                  padding: "16px 18px"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                  <UserCheck size={16} color="var(--color-primary)" />
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-heading)" }}>
                    Designated Lead Specialist
                  </span>
                </div>

                <select
                  value={p.trainerAssigned}
                  onChange={(e) => handleTrainerChange(p.id, e.target.value)}
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: "6px",
                    border: "1px solid var(--border-card)",
                    backgroundColor: "#FFFFFF",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "var(--text-heading)",
                    cursor: "pointer",
                    outline: "none"
                  }}
                >
                  {trainers.map((tr) => (
                    <option key={tr.id} value={`${tr.name} (${tr.jobRole.split(" ")[0]} Specialist)`}>
                      {tr.name} — {tr.specialization}
                    </option>
                  ))}
                </select>

                <span style={{ display: "block", fontSize: "11px", color: "var(--text-muted)", marginTop: 8 }}>
                  Current: <strong style={{ color: "var(--color-primary)" }}>{p.trainerAssigned}</strong>
                </span>
              </div>
            </div>

            {/* Curriculum breakdown summary */}
            <div
              style={{
                backgroundColor: "#F8FAF9",
                borderRadius: "8px",
                padding: "12px 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: "12px",
                color: "var(--text-muted)"
              }}
            >
              <span>
                <strong>Clinical Scope:</strong> {p.whyRecommended}
              </span>
              <span style={{ fontWeight: 600, color: "var(--color-primary)" }}>
                Verified Standard ✓
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
