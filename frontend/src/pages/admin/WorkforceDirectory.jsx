import React, { useState } from "react";
import {
  Users,
  Search,
  CheckCircle2,
  AlertTriangle,
  Stethoscope,
  Eye,
  X,
  ArrowRight,
  HeartPulse,
  Activity
} from "lucide-react";
import { adminService } from "../../services/adminService";

export default function WorkforceDirectory() {
  const [triageData, setTriageData] = useState(adminService.getHealthTriageData());
  const doctors = adminService.getDoctors();
  const [zoneFilter, setZoneFilter] = useState("all"); // 'all', 'red', 'yellow', 'green'
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  const handleConnectDoctor = (personId, doctorName) => {
    adminService.connectDoctorToPerson(personId, doctorName);
    setTriageData(adminService.getHealthTriageData());
    setToastMessage(`Assigned doctor ${doctorName} to patient.`);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const handleOpenHealthCard = (personId) => {
    const cardData = adminService.getDigitalHealthCard(personId);
    setSelectedPerson(cardData);
  };

  const { all, counts } = triageData;

  const filtered = all.filter((person) => {
    if (zoneFilter !== "all" && person.zone !== zoneFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        person.name.toLowerCase().includes(q) ||
        person.email.toLowerCase().includes(q) ||
        person.department.toLowerCase().includes(q) ||
        person.assignedDoctor.toLowerCase().includes(q) ||
        person.primarySymptom.toLowerCase().includes(q)
      );
    }
    return true;
  });

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
            padding: "12px 22px",
            borderRadius: "8px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.18)",
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: "13.5px",
            fontWeight: 600,
            zIndex: 120
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
            Individual Health Surveillance Desk
          </span>
        </div>
        <h1 style={{ fontSize: "24px", fontWeight: 800, margin: "0 0 6px 0", color: "var(--text-heading)" }}>
          People Health Records & Doctor Coordination
        </h1>
        <p style={{ fontSize: "13.5px", color: "var(--text-muted)", margin: 0, maxWidth: "780px" }}>
          Check each person's physical health scores, review specific pain and fatigue symptoms, and allocate dedicated occupational doctors to provide personalized recovery care.
        </p>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="corporate-card" style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[
            { key: "all", label: `All People (${counts.total})`, color: "var(--color-primary)" },
            { key: "red", label: `🔴 Red Zone (${counts.red})`, color: "#C93B3B" },
            { key: "yellow", label: `🟡 Yellow Zone (${counts.yellow})`, color: "#C97A1C" },
            { key: "green", label: `🟢 Green Zone (${counts.green})`, color: "#147D75" }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setZoneFilter(tab.key)}
              style={{
                padding: "8px 16px",
                borderRadius: "20px",
                fontSize: "12.5px",
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                backgroundColor: zoneFilter === tab.key ? tab.color : "#F2F7F5",
                color: zoneFilter === tab.key ? "#FFFFFF" : "var(--text-body)"
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ position: "relative", minWidth: "260px" }}>
          <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input
            type="text"
            placeholder="Search person, symptom, doctor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 12px 8px 34px",
              borderRadius: "20px",
              border: "1px solid var(--border-subtle)",
              fontSize: "12.5px"
            }}
          />
        </div>
      </div>

      {/* People Health Records Table */}
      <div className="corporate-card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
            <thead>
              <tr style={{ backgroundColor: "#F7FAF9", borderBottom: "1px solid var(--border-subtle)", color: "var(--text-muted)", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                <th style={{ padding: "14px 20px" }}>Person</th>
                <th style={{ padding: "14px 20px" }}>Risk Zone</th>
                <th style={{ padding: "14px 20px" }}>Reported Symptom / Hazard</th>
                <th style={{ padding: "14px 20px" }}>Assigned Doctor</th>
                <th style={{ padding: "14px 20px" }}>Recovery Stage</th>
                <th style={{ padding: "14px 20px", textAlign: "right" }}>Health Card</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((person) => (
                <tr key={person.id} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                  {/* Person Details */}
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: "8px",
                          background: person.zone === "red" ? "#FDEEEE" : person.zone === "yellow" ? "#FDF4E7" : "#EAF5F3",
                          color: person.zone === "red" ? "#C93B3B" : person.zone === "yellow" ? "#C97A1C" : "var(--color-primary)",
                          display: "grid",
                          placeItems: "center",
                          fontWeight: 700,
                          fontSize: "13px"
                        }}
                      >
                        {person.name.split(" ").map((w) => w[0]).join("")}
                      </div>
                      <div>
                        <strong style={{ display: "block", color: "var(--text-heading)" }}>{person.name}</strong>
                        <span style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>
                          {person.jobRole} • {person.department}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Risk Zone Badge */}
                  <td style={{ padding: "14px 20px" }}>
                    <span
                      style={{
                        display: "inline-block",
                        fontSize: "11.5px",
                        fontWeight: 700,
                        padding: "4px 10px",
                        borderRadius: "14px",
                        backgroundColor: person.zone === "red" ? "#FDEEEE" : person.zone === "yellow" ? "#FDF4E7" : "#EAF5F3",
                        color: person.zone === "red" ? "#C93B3B" : person.zone === "yellow" ? "#C97A1C" : "var(--color-primary)"
                      }}
                    >
                      {person.overallScore}% ({person.zone === "red" ? "🔴 Red" : person.zone === "yellow" ? "🟡 Yellow" : "🟢 Green"})
                    </span>
                  </td>

                  {/* Primary Symptom */}
                  <td style={{ padding: "14px 20px", maxWidth: "260px" }}>
                    <span style={{ fontSize: "12.5px", color: "var(--text-body)", display: "block", lineHeight: 1.4 }}>
                      {person.primarySymptom}
                    </span>
                  </td>

                  {/* Assigned Doctor Dropdown */}
                  <td style={{ padding: "14px 20px" }}>
                    <select
                      value={person.assignedDoctor}
                      onChange={(e) => handleConnectDoctor(person.id, e.target.value)}
                      style={{
                        padding: "6px 10px",
                        borderRadius: "6px",
                        border: "1px solid var(--border-subtle)",
                        backgroundColor: "#FAFDFB",
                        fontSize: "12.5px",
                        fontWeight: 600,
                        color: "var(--text-heading)",
                        cursor: "pointer"
                      }}
                    >
                      {doctors.map((doc) => (
                        <option key={doc.id} value={doc.name}>
                          {doc.name} ({doc.title.split(" ")[1] || "Specialist"})
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Recovery Stage */}
                  <td style={{ padding: "14px 20px" }}>
                    <span style={{ fontSize: "12px", fontWeight: 600, color: person.hasCertificate ? "var(--color-primary)" : "var(--text-heading)" }}>
                      {person.recoveryStage}
                    </span>
                  </td>

                  {/* Actions */}
                  <td style={{ padding: "14px 20px", textAlign: "right" }}>
                    <button
                      onClick={() => handleOpenHealthCard(person.id)}
                      className="btn-secondary"
                      style={{ padding: "6px 12px", fontSize: "12px", display: "inline-flex", alignItems: "center", gap: 5 }}
                    >
                      <Eye size={13} />
                      <span>Health Card</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DIGITAL HEALTH CARD MODAL */}
      {selectedPerson && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(24, 53, 51, 0.55)",
            backdropFilter: "blur(4px)",
            display: "grid",
            placeItems: "center",
            padding: "20px",
            zIndex: 130
          }}
        >
          <div className="corporate-card" style={{ width: "100%", maxWidth: "600px", padding: "30px 32px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "12px",
                    background: "var(--color-primary)",
                    color: "#FFFFFF",
                    display: "grid",
                    placeItems: "center",
                    fontWeight: 800,
                    fontSize: "18px"
                  }}
                >
                  {selectedPerson.name.split(" ").map((w) => w[0]).join("")}
                </div>
                <div>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--color-primary)", textTransform: "uppercase" }}>
                    Official Digital Health Card
                  </span>
                  <h2 style={{ fontSize: "20px", fontWeight: 800, margin: "2px 0 0 0", color: "var(--text-heading)" }}>
                    {selectedPerson.name}
                  </h2>
                  <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                    {selectedPerson.jobRole} • {selectedPerson.department} ({selectedPerson.employeeId})
                  </span>
                </div>
              </div>
              <button onClick={() => setSelectedPerson(null)} style={{ padding: 4, cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>

            {/* Health Vitals Breakdown */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 18 }}>
              <div style={{ backgroundColor: "#F7FAF9", padding: "12px", borderRadius: "8px" }}>
                <span style={{ fontSize: "11px", color: "var(--text-muted)", display: "block" }}>Overall Risk Index</span>
                <strong style={{ fontSize: "20px", color: selectedPerson.zone === "red" ? "#C93B3B" : selectedPerson.zone === "yellow" ? "#C97A1C" : "var(--color-primary)" }}>
                  {selectedPerson.overallScore}% ({selectedPerson.zone.toUpperCase()} ZONE)
                </strong>
              </div>

              <div style={{ backgroundColor: "#F7FAF9", padding: "12px", borderRadius: "8px" }}>
                <span style={{ fontSize: "11px", color: "var(--text-muted)", display: "block" }}>Daily Movement Activity</span>
                <strong style={{ fontSize: "15px", color: "var(--text-heading)" }}>
                  {selectedPerson.dailyMovementMinutes}
                </strong>
              </div>
            </div>

            {/* 5 Clinical Scores */}
            <div style={{ marginBottom: 18 }}>
              <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-heading)", display: "block", marginBottom: 8 }}>
                5 Clinical Health Dimensions:
              </span>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6, textAlign: "center" }}>
                {[
                  { label: "Posture", val: selectedPerson.categoryScores.posture },
                  { label: "Activity", val: selectedPerson.categoryScores.activity },
                  { label: "Stress", val: selectedPerson.categoryScores.stress },
                  { label: "Sleep", val: selectedPerson.categoryScores.recovery },
                  { label: "Workload", val: selectedPerson.categoryScores.workload }
                ].map((item) => (
                  <div key={item.label} style={{ background: "#F3F7F5", padding: "8px 4px", borderRadius: "6px" }}>
                    <span style={{ fontSize: "10.5px", color: "var(--text-muted)", display: "block" }}>{item.label}</span>
                    <strong style={{ fontSize: "13px", color: "var(--text-heading)" }}>{item.val}%</strong>
                  </div>
                ))}
              </div>
            </div>

            {/* Doctor Clinical Notes */}
            <div style={{ backgroundColor: "#FAFDFB", border: "1px solid var(--border-subtle)", borderRadius: "8px", padding: "14px", marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <strong style={{ fontSize: "12.5px", color: "var(--text-heading)" }}>Supervising Doctor: {selectedPerson.assignedDoctor}</strong>
                <span style={{ fontSize: "11px", color: "var(--color-primary)", fontWeight: 700 }}>Active Care Protocol</span>
              </div>
              <p style={{ fontSize: "12.5px", color: "var(--text-body)", margin: 0, lineHeight: 1.5 }}>
                {selectedPerson.doctorNotes}
              </p>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={() => setSelectedPerson(null)}
                className="btn-primary"
                style={{ padding: "9px 22px", fontSize: "13px" }}
              >
                Close Health Card
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
