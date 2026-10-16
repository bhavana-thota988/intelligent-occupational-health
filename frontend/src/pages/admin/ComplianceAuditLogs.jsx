import React, { useState } from "react";
import {
  ShieldCheck,
  FileCheck2,
  Lock,
  Search,
  CheckCircle2,
  AlertCircle,
  Database
} from "lucide-react";
import { adminService } from "../../services/adminService";
import StatCard from "../../components/common/StatCard";

export default function ComplianceAuditLogs() {
  const [logs, setLogs] = useState(adminService.getAuditLogs());
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const filtered = logs.filter((log) => {
    if (filterCategory !== "all" && log.category.toLowerCase() !== filterCategory.toLowerCase()) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        log.actor.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q) ||
        log.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: "1280px", margin: "0 auto" }}>
      {/* Header Banner */}
      <div className="corporate-card" style={{ padding: "26px 30px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Occupational Health Regulatory Framework
          </span>
        </div>
        <h1 style={{ fontSize: "24px", fontWeight: 800, margin: "0 0 6px 0", color: "var(--text-heading)" }}>
          ISO 45001 Compliance & System Audit Trail
        </h1>
        <p style={{ fontSize: "13.5px", color: "var(--text-muted)", margin: 0, maxWidth: "780px" }}>
          Immutable logs documenting risk screening submissions, clinical specialist verifications, and platform governance events in full accordance with workplace health standards.
        </p>
      </div>

      {/* Compliance Standard Pillars */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 18 }}>
        <div className="corporate-card" style={{ padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: "8px", background: "var(--color-primary-light)", color: "var(--color-primary)", display: "grid", placeItems: "center" }}>
              <ShieldCheck size={20} />
            </div>
            <div>
              <strong style={{ fontSize: "14px", display: "block", color: "var(--text-heading)" }}>ISO 45001 Alignment</strong>
              <span style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>Occupational Health & Safety</span>
            </div>
          </div>
          <p style={{ fontSize: "12.5px", color: "var(--text-body)", margin: 0, lineHeight: 1.5 }}>
            All 16 screening parameters align with musculoskeletal hazard prevention protocols and ergonomic risk reduction standards.
          </p>
        </div>

        <div className="corporate-card" style={{ padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: "8px", background: "var(--color-primary-light)", color: "var(--color-primary)", display: "grid", placeItems: "center" }}>
              <Lock size={20} />
            </div>
            <div>
              <strong style={{ fontSize: "14px", display: "block", color: "var(--text-heading)" }}>HIPAA & Privacy Shield</strong>
              <span style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>Confidential Health Data</span>
            </div>
          </div>
          <p style={{ fontSize: "12.5px", color: "var(--text-body)", margin: 0, lineHeight: 1.5 }}>
            Screening responses are restricted to dedicated clinical specialists. Administrative governance views anonymized aggregates and allocations.
          </p>
        </div>

        <div className="corporate-card" style={{ padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: "8px", background: "var(--color-primary-light)", color: "var(--color-primary)", display: "grid", placeItems: "center" }}>
              <FileCheck2 size={20} />
            </div>
            <div>
              <strong style={{ fontSize: "14px", display: "block", color: "var(--text-heading)" }}>4-Point Clinical Verification</strong>
              <span style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>Specialist Credentialing</span>
            </div>
          </div>
          <p style={{ fontSize: "12.5px", color: "var(--text-body)", margin: 0, lineHeight: 1.5 }}>
            Certificates are issued only after accredited trainers verify adherence, ergonomic consistency, and reflection quality.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="corporate-card" style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
        <div style={{ display: "flex", gap: 8 }}>
          {["all", "compliance", "clinical", "governance", "workforce"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              style={{
                padding: "6px 14px",
                borderRadius: "16px",
                fontSize: "12px",
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                backgroundColor: filterCategory === cat ? "var(--color-primary)" : "#F2F7F5",
                color: filterCategory === cat ? "#FFFFFF" : "var(--text-body)",
                textTransform: "capitalize"
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ position: "relative", minWidth: "260px" }}>
          <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input
            type="text"
            placeholder="Search audit trail..."
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

      {/* Logs Table */}
      <div className="corporate-card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
            <thead>
              <tr style={{ backgroundColor: "#F7FAF9", borderBottom: "1px solid var(--border-subtle)", color: "var(--text-muted)", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                <th style={{ padding: "14px 20px" }}>Log ID</th>
                <th style={{ padding: "14px 20px" }}>Timestamp</th>
                <th style={{ padding: "14px 20px" }}>Actor</th>
                <th style={{ padding: "14px 20px" }}>Action</th>
                <th style={{ padding: "14px 20px" }}>Details</th>
                <th style={{ padding: "14px 20px" }}>Category</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((log) => (
                <tr key={log.id} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                  <td style={{ padding: "14px 20px", fontWeight: 700, color: "var(--text-heading)" }}>
                    {log.id}
                  </td>
                  <td style={{ padding: "14px 20px", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                    {log.timestamp}
                  </td>
                  <td style={{ padding: "14px 20px", fontWeight: 600 }}>
                    {log.actor}
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <span
                      style={{
                        fontSize: "11.5px",
                        fontWeight: 700,
                        backgroundColor: "#EAF5F3",
                        color: "var(--color-primary)",
                        padding: "3px 8px",
                        borderRadius: "4px"
                      }}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td style={{ padding: "14px 20px", color: "var(--text-body)" }}>
                    {log.details}
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: "10px",
                        backgroundColor: "#F4F6F5",
                        color: "var(--text-muted)"
                      }}
                    >
                      {log.category}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
