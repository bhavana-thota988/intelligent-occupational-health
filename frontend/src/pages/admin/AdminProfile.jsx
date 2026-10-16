import React, { useState } from "react";
import {
  User,
  ShieldCheck,
  Mail,
  Building,
  Key,
  Download,
  CheckCircle2,
  Database,
  Lock
} from "lucide-react";
import { adminService } from "../../services/adminService";
import { authService } from "../../services/authService";

export default function AdminProfile() {
  const profile = adminService.getAdminProfile();
  const [toastMessage, setToastMessage] = useState("");

  const handleExportData = () => {
    const jsonStr = adminService.exportDatabaseJSON();
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `IOH_Platform_Backup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setToastMessage("Platform data exported successfully as JSON!");
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
            Platform Directorate Account
          </span>
        </div>
        <h1 style={{ fontSize: "24px", fontWeight: 800, margin: "0 0 6px 0", color: "var(--text-heading)" }}>
          Administrator Profile & System Controls
        </h1>
        <p style={{ fontSize: "13.5px", color: "var(--text-muted)", margin: 0, maxWidth: "780px" }}>
          Manage administrative governance credentials, review system security keys, and perform full platform database backups.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 24 }}>
        {/* Profile Card */}
        <div className="corporate-card" style={{ padding: "28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: "14px",
                background: "linear-gradient(135deg, #183533 0%, #0E625B 100%)",
                color: "#FFFFFF",
                display: "grid",
                placeItems: "center",
                fontWeight: 800,
                fontSize: "22px"
              }}
            >
              PA
            </div>
            <div>
              <h2 style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-heading)", margin: "0 0 3px 0" }}>
                {profile.name}
              </h2>
              <span style={{ fontSize: "13px", color: "var(--color-primary)", fontWeight: 700 }}>
                {profile.jobRole}
              </span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14, fontSize: "13.5px", borderTop: "1px solid var(--border-subtle)", paddingTop: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Mail size={16} color="var(--text-muted)" />
              <span><strong>Work Email:</strong> {profile.email}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Building size={16} color="var(--text-muted)" />
              <span><strong>Department:</strong> {profile.department}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <ShieldCheck size={16} color="var(--text-muted)" />
              <span><strong>Authorization:</strong> Platform Administrator (Full Access)</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Lock size={16} color="var(--text-muted)" />
              <span><strong>Admin Identifier:</strong> {profile.adminId || "ADM-1001"}</span>
            </div>
          </div>

          <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid var(--border-subtle)" }}>
            <span style={{ fontSize: "12px", color: "var(--text-muted)", display: "block", marginBottom: 6 }}>
              Governance Scope:
            </span>
            <p style={{ fontSize: "12.5px", color: "var(--text-body)", margin: 0, lineHeight: 1.5 }}>
              {profile.bio}
            </p>
          </div>
        </div>

        {/* Database Backup & Platform Controls */}
        <div className="corporate-card" style={{ padding: "28px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: "8px", background: "var(--color-primary-light)", color: "var(--color-primary)", display: "grid", placeItems: "center" }}>
                <Database size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: 700, margin: 0, color: "var(--text-heading)" }}>
                  Platform Database & Audit Export
                </h3>
                <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  JSON snapshots of users, assignments, and verified certificates
                </span>
              </div>
            </div>

            <p style={{ fontSize: "13px", color: "var(--text-body)", lineHeight: 1.6, marginBottom: 20 }}>
              Export an encrypted, complete backup snapshot of all system state. Includes registered employee screenings, accredited trainer profiles, program lead assignments, review logs, and minted certificates.
            </p>

            <div style={{ backgroundColor: "#F7FAF9", borderRadius: "8px", padding: "14px 16px", marginBottom: 24, fontSize: "12.5px", display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Storage Protocol:</span>
                <strong style={{ color: "var(--text-heading)" }}>Synchronized Web Storage / SQLite ORM</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Data Portability:</span>
                <strong style={{ color: "var(--color-primary)" }}>ISO 45001 Compliant JSON</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Security Status:</span>
                <strong style={{ color: "var(--color-primary)" }}>Active Session Authenticated</strong>
              </div>
            </div>
          </div>

          <button
            onClick={handleExportData}
            className="btn-primary"
            style={{ padding: "12px 20px", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10, width: "100%" }}
          >
            <Download size={16} />
            <span>Export Database JSON Snapshot</span>
          </button>
        </div>
      </div>
    </div>
  );
}
