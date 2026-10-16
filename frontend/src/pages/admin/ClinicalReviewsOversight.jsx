import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Award,
  CheckCircle2,
  FileCheck2,
  Stethoscope,
  Eye,
  X,
  Search,
  ExternalLink
} from "lucide-react";
import { adminService } from "../../services/adminService";

export default function ClinicalReviewsOversight() {
  const triageData = adminService.getHealthTriageData();
  const [selectedReview, setSelectedReview] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Sample verified graduates + real reviews from dataStore
  const outcomes = [
    {
      id: "IOH-2026-B81E29",
      personName: "Bhavana Thota",
      employeeId: "EMP-1001",
      department: "Software Engineering",
      programName: "Workplace Ergonomics & Posture",
      doctorName: "Dr. Sarah Jenkins",
      initialZone: "🔴 Red Zone (68%)",
      currentZone: "🟢 Green Zone (18%)",
      verifiedDate: "October 2026",
      status: "Fully Recovered ✓",
      observations: "Completed all 6 ergonomic workstation sessions. Lumbar alignment calibrated, monitor eye height verified."
    },
    {
      id: "IOH-2026-K92A41",
      personName: "Sneha Reddy",
      employeeId: "EMP-1090",
      department: "Quality Assurance",
      programName: "Daily Movement & Stretch Breaks",
      doctorName: "Marcus Vance",
      initialZone: "🟡 Yellow Zone (48%)",
      currentZone: "🟢 Green Zone (15%)",
      verifiedDate: "October 2026",
      status: "Fully Recovered ✓",
      observations: "Integrated 50/10 active workday micro-breaks consistently. Joint mobility restored."
    },
    {
      id: "IOH-2026-R34C11",
      personName: "Rahul Sharma",
      employeeId: "EMP-1114",
      department: "DevOps Infrastructure",
      programName: "Guided Meditation & Stress Reset",
      doctorName: "Elena Rostova",
      initialZone: "🔴 Red Zone (62%)",
      currentZone: "🟢 Green Zone (20%)",
      verifiedDate: "September 2026",
      status: "Fully Recovered ✓",
      observations: "Autonomic nervous regulation breathing practiced daily. Sleep latency reduced from 45m to 15m."
    }
  ];

  const filtered = outcomes.filter((item) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.personName.toLowerCase().includes(q) ||
      item.programName.toLowerCase().includes(q) ||
      item.doctorName.toLowerCase().includes(q) ||
      item.id.toLowerCase().includes(q)
    );
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: "1280px", margin: "0 auto" }}>
      {/* Header Banner */}
      <div className="corporate-card" style={{ padding: "26px 30px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Clinical Validation & Recovery Records
          </span>
        </div>
        <h1 style={{ fontSize: "24px", fontWeight: 800, margin: "0 0 6px 0", color: "var(--text-heading)" }}>
          Verified Health Outcomes & Doctor Endorsements
        </h1>
        <p style={{ fontSize: "13.5px", color: "var(--text-muted)", margin: 0, maxWidth: "780px" }}>
          Inspect clinical outcomes verified by specialist doctors. These workforce members successfully recovered from Red/Yellow risk zones to certified Green Zone health.
        </p>
      </div>

      {/* Search and Summary */}
      <div className="corporate-card" style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
        <div style={{ position: "relative", minWidth: "280px" }}>
          <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input
            type="text"
            placeholder="Search credential ID, person, doctor..."
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

        <div style={{ fontSize: "13px", color: "var(--color-primary)", fontWeight: 700 }}>
          {filtered.length} Verified Recovery Credentials Minted ✓
        </div>
      </div>

      {/* Verified Outcomes Table */}
      <div className="corporate-card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
            <thead>
              <tr style={{ backgroundColor: "#F7FAF9", borderBottom: "1px solid var(--border-subtle)", color: "var(--text-muted)", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                <th style={{ padding: "14px 20px" }}>Certificate ID</th>
                <th style={{ padding: "14px 20px" }}>Recovered Person</th>
                <th style={{ padding: "14px 20px" }}>Prescribed Program</th>
                <th style={{ padding: "14px 20px" }}>Attending Doctor</th>
                <th style={{ padding: "14px 20px" }}>Health Transformation</th>
                <th style={{ padding: "14px 20px", textAlign: "right" }}>Inspect</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                  <td style={{ padding: "14px 20px", fontWeight: 700, color: "var(--text-heading)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Award size={15} color="var(--color-primary)" />
                      <span>{item.id}</span>
                    </div>
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <strong style={{ color: "var(--text-heading)", display: "block" }}>{item.personName}</strong>
                    <span style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>{item.department}</span>
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <strong style={{ color: "var(--color-primary)" }}>{item.programName}</strong>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)", display: "block" }}>
                      Verified: {item.verifiedDate}
                    </span>
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <span style={{ fontWeight: 600, color: "var(--text-heading)" }}>{item.doctorName}</span>
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "12px" }}>
                      <span style={{ color: "#C93B3B", fontWeight: 600 }}>{item.initialZone.split(" ")[0]}</span>
                      <span>→</span>
                      <span style={{ color: "var(--color-primary)", fontWeight: 700 }}>{item.currentZone}</span>
                    </div>
                  </td>
                  <td style={{ padding: "14px 20px", textAlign: "right" }}>
                    <button
                      onClick={() => setSelectedReview(item)}
                      className="btn-secondary"
                      style={{ padding: "6px 12px", fontSize: "12px", display: "inline-flex", alignItems: "center", gap: 5 }}
                    >
                      <Eye size={13} />
                      <span>Certificate</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Certificate Modal */}
      {selectedReview && (
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
          <div className="corporate-card" style={{ width: "100%", maxWidth: "560px", padding: "30px 32px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 44, height: 44, borderRadius: "10px", background: "#EAF5F3", color: "var(--color-primary)", display: "grid", placeItems: "center" }}>
                  <Award size={24} />
                </div>
                <div>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--color-primary)", textTransform: "uppercase" }}>
                    Verified Health Credential
                  </span>
                  <h2 style={{ fontSize: "19px", fontWeight: 800, margin: "2px 0 0 0", color: "var(--text-heading)" }}>
                    {selectedReview.id}
                  </h2>
                </div>
              </div>
              <button onClick={() => setSelectedReview(null)} style={{ padding: 4, cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: "13px", marginBottom: 20 }}>
              <div style={{ backgroundColor: "#F7FAF9", padding: "12px", borderRadius: "8px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <span style={{ color: "var(--text-muted)", fontSize: "11px" }}>Patient / Employee:</span>
                  <strong style={{ display: "block" }}>{selectedReview.personName}</strong>
                </div>
                <div>
                  <span style={{ color: "var(--text-muted)", fontSize: "11px" }}>Supervising Doctor:</span>
                  <strong style={{ display: "block", color: "var(--color-primary)" }}>{selectedReview.doctorName}</strong>
                </div>
                <div>
                  <span style={{ color: "var(--text-muted)", fontSize: "11px" }}>Program Completed:</span>
                  <span>{selectedReview.programName}</span>
                </div>
                <div>
                  <span style={{ color: "var(--text-muted)", fontSize: "11px" }}>Health Transformation:</span>
                  <strong style={{ color: "var(--color-primary)" }}>Recovered to Green Zone</strong>
                </div>
              </div>

              <div>
                <span style={{ fontWeight: 700, color: "var(--text-heading)", display: "block", marginBottom: 4 }}>
                  Doctor's Certified Observations:
                </span>
                <p style={{ backgroundColor: "#FAFDFB", border: "1px solid var(--border-subtle)", borderRadius: "6px", padding: "10px 12px", margin: 0, fontStyle: "italic" }}>
                  "{selectedReview.observations}"
                </p>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <Link
                to={`/verify/${selectedReview.id}`}
                target="_blank"
                className="btn-secondary"
                style={{ padding: "8px 14px", fontSize: "12.5px", display: "inline-flex", alignItems: "center", gap: 5 }}
              >
                <ExternalLink size={14} />
                <span>Public Verification URL</span>
              </Link>
              <button
                onClick={() => setSelectedReview(null)}
                className="btn-primary"
                style={{ padding: "8px 18px", fontSize: "12.5px" }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
