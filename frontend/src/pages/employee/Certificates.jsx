import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Award,
  CheckCircle2,
  Calendar,
  User,
  Printer,
  Download,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  Lock,
  Clock,
  X
} from "lucide-react";
import { authService } from "../../services/authService";
import { dataStore, OFFICIAL_PROGRAMS } from "../../services/dataStore";

export default function Certificates() {
  const currentUser = authService.getCurrentUser();
  const userId = currentUser?.id || "u-emp-1";

  const [certificates, setCertificates] = useState([]);
  const [pendingReviews, setPendingReviews] = useState([]);
  const [selectedCert, setSelectedCert] = useState(null);

  useEffect(() => {
    loadData();
  }, [userId]);

  const loadData = () => {
    const list = dataStore.getUserCertificates(userId);
    setCertificates(list);

    const progressMap = dataStore.get("user_program_progress", {})[userId] || {};
    const awaiting = [];
    Object.keys(progressMap).forEach((progId) => {
      const p = progressMap[progId];
      if (p.status === "awaiting_review") {
        const found = OFFICIAL_PROGRAMS.find((op) => op.id === progId);
        if (found) {
          awaiting.push({
            programId: found.id,
            programName: found.name,
            trainerAssigned: found.trainerAssigned,
            submittedAt: p.submittedAt || "Recently",
            progress: p.progress || 100
          });
        }
      }
    });
    setPendingReviews(awaiting);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: "1100px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
        <div>
          <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Credentialing & Compliance
          </span>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "var(--text-heading)", margin: "4px 0 0" }}>
            Verified Wellbeing Certificates
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", margin: "4px 0 0" }}>
            Official corporate certificates issued upon complete session logging and occupational trainer verification.
          </p>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <Link to="/employee/my-programs" className="btn-secondary">
            View My Programs
          </Link>
        </div>
      </div>

      {/* Under Review / Locked Certificates Section */}
      {pendingReviews.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Clock size={18} color="#D97706" />
              <h2 style={{ fontSize: "17px", fontWeight: 800, color: "var(--text-heading)", margin: 0 }}>
                Curriculums Under Specialist Review ({pendingReviews.length})
              </h2>
            </div>
            <span style={{ fontSize: "12px", color: "#92400E", background: "#FEF3C7", padding: "3px 10px", borderRadius: 4, fontWeight: 700 }}>
              🔒 Certificates Generate Upon Specialist Acceptance
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 16 }}>
            {pendingReviews.map((item) => (
              <div
                key={item.programId}
                className="corporate-card"
                style={{
                  padding: "20px 22px",
                  borderLeft: "4px solid #F59E0B",
                  background: "#FFFDF7",
                  borderTop: "1px solid #FEF3C7",
                  borderRight: "1px solid #FEF3C7",
                  borderBottom: "1px solid #FEF3C7",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: 14
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span className="badge badge-mod" style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: "11px" }}>
                      <Lock size={12} />
                      Certificate Locked
                    </span>
                    <span style={{ fontSize: "12px", color: "#92400E", fontWeight: 700 }}>
                      Submitted: {item.submittedAt}
                    </span>
                  </div>

                  <h3 style={{ fontSize: "16px", fontWeight: 800, color: "var(--text-heading)", margin: "0 0 6px 0" }}>
                    {item.programName}
                  </h3>

                  <p style={{ fontSize: "12.5px", color: "var(--text-muted)", margin: "0 0 12px 0", lineHeight: 1.5 }}>
                    All sessions completed. Your submission is in the specialist queue for clinical review by <strong>{item.trainerAssigned?.split("(")[0]}</strong>.
                  </p>

                  <div style={{ background: "#FEF3C7", padding: "10px 12px", borderRadius: 6, fontSize: "12px", color: "#92400E", display: "flex", alignItems: "center", gap: 6 }}>
                    <ShieldCheck size={14} color="#D97706" style={{ flexShrink: 0 }} />
                    <span>Certificate will generate and unlock automatically once approved by your trainer.</span>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <Link
                    to={`/employee/program/${item.programId}`}
                    className="btn-secondary"
                    style={{ padding: "7px 14px", fontSize: "12px", fontWeight: 600, color: "#92400E", borderColor: "#FCD34D" }}
                  >
                    View Program Progress
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Zero State / Certificates Grid */}
      {certificates.length === 0 ? (
        <div className="corporate-card" style={{ padding: "48px 32px", textAlign: "center", maxWidth: "680px", margin: "20px auto 0" }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "#E8F5F1",
              color: "var(--color-primary)",
              display: "grid",
              placeItems: "center",
              margin: "0 auto 18px",
            }}
          >
            <Award size={32} />
          </div>

          <h2 style={{ fontSize: "21px", fontWeight: 800, color: "var(--text-heading)", marginBottom: 8 }}>
            {pendingReviews.length > 0 ? "No Approved Certificates Yet" : "No Certificates Issued Yet"}
          </h2>

          <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.6, marginBottom: 24 }}>
            {pendingReviews.length > 0
              ? `You have ${pendingReviews.length} program submission(s) in the review queue. As soon as your assigned trainer accepts your routine, the verified certificate will appear here.`
              : "Wellbeing certificates are awarded after you complete 100% of an enrolled program's sessions and submit them for review to your assigned occupational coach."}
          </p>

          {/* Workflow Guide */}
          <div style={{ background: "#F8FAF9", padding: "18px 20px", borderRadius: 8, border: "1px solid var(--border-subtle)", textAlign: "left", marginBottom: 28 }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", display: "block", marginBottom: 12 }}>
              How to Earn Your Verified Certificate:
            </span>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: "13px", color: "var(--text-body)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 22, height: 22, borderRadius: "50%", background: "var(--color-primary)", color: "#FFF", display: "grid", placeItems: "center", fontSize: "11px", fontWeight: 700, flexShrink: 0 }}>1</span>
                <span>Enroll in an official workplace health program.</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 22, height: 22, borderRadius: "50%", background: "var(--color-primary)", color: "#FFF", display: "grid", placeItems: "center", fontSize: "11px", fontWeight: 700, flexShrink: 0 }}>2</span>
                <span>Check off all sessions in your interactive curriculum tracker.</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 22, height: 22, borderRadius: "50%", background: "var(--color-primary)", color: "#FFF", display: "grid", placeItems: "center", fontSize: "11px", fontWeight: 700, flexShrink: 0 }}>3</span>
                <span>Click <strong>"Submit for Trainer Review"</strong> on the program page.</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 22, height: 22, borderRadius: "50%", background: "var(--color-primary)", color: "#FFF", display: "grid", placeItems: "center", fontSize: "11px", fontWeight: 700, flexShrink: 0 }}>4</span>
                <span>Upon trainer approval, your unique certificate generates here automatically.</span>
              </div>
            </div>
          </div>

          <Link to="/employee/my-programs" className="btn-primary" style={{ display: "inline-flex", padding: "11px 24px" }}>
            <span>Go to My Programs</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 20 }}>
          {certificates.map((cert) => (
            <div
              key={cert.certificateId}
              className="corporate-card"
              style={{
                padding: "24px",
                borderTop: "5px solid var(--color-primary)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <span className="badge badge-low" style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <ShieldCheck size={12} />
                    Verified & Active
                  </span>
                  <span style={{ fontSize: "11px", fontWeight: 700, fontFamily: "monospace", color: "var(--color-primary)" }}>
                    {cert.certificateId}
                  </span>
                </div>

                <h3 style={{ fontSize: "17px", fontWeight: 800, color: "var(--text-heading)", marginBottom: 8 }}>
                  {cert.programName}
                </h3>

                <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: "0 0 16px 0" }}>
                  Verified completion of {cert.programDuration} occupational wellbeing and ergonomic routines.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: "12.5px", color: "var(--text-body)", marginBottom: 20, background: "#F8FAF9", padding: "12px 14px", borderRadius: 6 }}>
                  <div>
                    <span style={{ color: "var(--text-muted)" }}>Recipient: </span>
                    <strong>{cert.employeeName}</strong>
                  </div>
                  <div>
                    <span style={{ color: "var(--text-muted)" }}>Verified By: </span>
                    <strong>{cert.trainerName}</strong>
                  </div>
                  <div>
                    <span style={{ color: "var(--text-muted)" }}>Date Awarded: </span>
                    <span>{cert.issuedAt}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCert(cert)}
                className="btn-primary"
                style={{ width: "100%", padding: "10px", fontSize: "13.5px" }}
              >
                <Award size={15} />
                <span>View & Print Certificate</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Formal Certificate Modal */}
      {selectedCert && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(24, 53, 51, 0.65)",
            backdropFilter: "blur(4px)",
            display: "grid",
            placeItems: "center",
            zIndex: 9999,
            padding: 16
          }}
          onClick={() => setSelectedCert(null)}
        >
          <div
            style={{
              maxWidth: "840px",
              width: "100%",
              background: "#FFFFFF",
              borderRadius: 12,
              padding: "40px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
              position: "relative"
            }}
            onClick={(e) => e.stopPropagation()}
            id="printable-certificate"
          >
            {/* Modal Controls (Hidden during print) */}
            <div className="no-print" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid var(--border-subtle)" }}>
              <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-muted)" }}>
                Verified Official Certificate
              </span>
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="btn-primary"
                  style={{ padding: "8px 16px", fontSize: "13px" }}
                >
                  <Printer size={15} />
                  <span>Print / Save PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCert(null)}
                  className="btn-secondary"
                  style={{ padding: "8px 12px" }}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Formal Certificate Document Body */}
            <div
              style={{
                border: "4px double #147D75",
                padding: "36px 32px",
                borderRadius: 8,
                textAlign: "center",
                background: "#FCFDFD",
                position: "relative"
              }}
            >
              {/* Header */}
              <div style={{ marginBottom: 16 }}>
                <span style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-primary)" }}>
                  INTELLIGENT OCCUPATIONAL HEALTH AND WORKPLACE RISK MANAGEMENT PLATFORM
                </span>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: 2 }}>
                  Workplace Health, Risk Assessment & Employee Wellbeing Management
                </div>
              </div>

              <h2 style={{ fontSize: "26px", fontWeight: 800, color: "var(--text-heading)", textTransform: "uppercase", letterSpacing: "0.04em", margin: "16px 0 6px 0" }}>
                Certificate of Workplace Wellbeing Completion
              </h2>

              <p style={{ fontSize: "13.5px", color: "var(--text-muted)", fontStyle: "italic", margin: "0 0 20px 0" }}>
                This credential officially verifies that
              </p>

              {/* Awarded Recipient */}
              <div style={{ fontSize: "28px", fontWeight: 800, color: "var(--color-primary)", textDecoration: "underline", textUnderlineOffset: 6, margin: "0 0 16px 0" }}>
                {selectedCert.employeeName}
              </div>

              <p style={{ fontSize: "14px", color: "var(--text-body)", maxWidth: "580px", margin: "0 auto 24px", lineHeight: 1.6 }}>
                has successfully fulfilled all ergonomic, mobility, and stress regulation modules prescribed under the certified corporate program:
              </p>

              <div style={{ fontSize: "20px", fontWeight: 800, color: "var(--text-heading)", margin: "0 0 28px 0" }}>
                "{selectedCert.programName}" ({selectedCert.programDuration})
              </div>

              {/* Signatures & Seal Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, alignItems: "flex-end", marginTop: 32, paddingTop: 20, borderTop: "1px solid #DCEFEB" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "cursive", fontSize: "19px", color: "var(--color-primary-dark)", marginBottom: 4 }}>
                    {selectedCert.trainerName}
                  </div>
                  <div style={{ borderTop: "1px solid #6D817D", paddingTop: 4, fontSize: "11.5px", fontWeight: 700, color: "var(--text-heading)" }}>
                    Occupational Health Specialist
                  </div>
                  <span style={{ fontSize: "10.5px", color: "var(--text-muted)" }}>Verification Authority</span>
                </div>

                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      width: 58,
                      height: 58,
                      borderRadius: "50%",
                      border: "2px dashed var(--color-primary)",
                      display: "grid",
                      placeItems: "center",
                      margin: "0 auto 6px",
                      color: "var(--color-primary)",
                      background: "#E8F5F1"
                    }}
                  >
                    <ShieldCheck size={28} />
                  </div>
                  <span style={{ fontSize: "10.5px", fontWeight: 700, color: "var(--color-primary)", textTransform: "uppercase" }}>
                    Verified Seal
                  </span>
                </div>

                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-heading)", marginBottom: 4 }}>
                    {selectedCert.issuedAt}
                  </div>
                  <div style={{ borderTop: "1px solid #6D817D", paddingTop: 4, fontSize: "11.5px", fontWeight: 700, color: "var(--text-heading)" }}>
                    Date of Issue
                  </div>
                  <span style={{ fontSize: "10.5px", color: "var(--text-muted)", fontFamily: "monospace" }}>
                    ID: {selectedCert.certificateId}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
