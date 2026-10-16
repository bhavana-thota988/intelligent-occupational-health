import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Stethoscope,
  Plus,
  Mail,
  Phone,
  CheckCircle2,
  Users,
  Award,
  ShieldCheck,
  X,
  AlertCircle
} from "lucide-react";
import { adminService } from "../../services/adminService";

export default function TrainerManagement() {
  const doctors = adminService.getDoctors();
  const triageData = adminService.getHealthTriageData();
  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    title: "Occupational Health Specialist",
    specialty: "Musculoskeletal Ergonomics & Posture",
    degrees: "PT, CPE",
    email: "",
    phone: ""
  });
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!formData.name.trim() || !formData.email.trim()) {
      setFormError("Please fill in doctor's full name and email.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await adminService.inviteTrainer({
        name: formData.name.trim(),
        email: formData.email.trim(),
        title: formData.title,
        specialty: formData.specialty,
        degrees: formData.degrees,
        phone: formData.phone
      });

      const deliveryMsg = res.warning ? ` (${res.warning})` : " Invitation OTP dispatched to inbox.";
      setToastMessage(`Accredited specialist ${formData.name} invited!${deliveryMsg}`);
      setShowAddModal(false);
      setFormData({
        name: "",
        title: "Occupational Health Specialist",
        specialty: "Musculoskeletal Ergonomics & Posture",
        degrees: "PT, CPE",
        email: "",
        phone: ""
      });
      setTimeout(() => setToastMessage(""), 5000);
    } catch (err) {
      setFormError(err.message || "Failed to invite trainer. Please check email address.");
    } finally {
      setSubmitting(false);
    }
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
      <div className="corporate-card" style={{ padding: "26px 30px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Clinical Faculty & Specialists
            </span>
          </div>
          <h1 style={{ fontSize: "24px", fontWeight: 800, margin: "0 0 6px 0", color: "var(--text-heading)" }}>
            Specialist Doctors & Clinical Trainers
          </h1>
          <p style={{ fontSize: "13.5px", color: "var(--text-muted)", margin: 0, maxWidth: "780px" }}>
            The dedicated team of occupational physiotherapists, ergonomists, and wellness coaches caring for workforce health. Admin coordinates patient assignments and tracks doctor caseloads.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary"
          style={{ padding: "10px 20px", display: "inline-flex", alignItems: "center", gap: 8 }}
        >
          <Plus size={16} />
          <span>Onboard New Doctor</span>
        </button>
      </div>

      {/* Doctors Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 20 }}>
        {doctors.map((doc) => {
          // Calculate how many people in triage are assigned to this doctor
          const assignedCount = triageData.all.filter((p) => p.assignedDoctor.toLowerCase().includes(doc.name.toLowerCase())).length;

          return (
            <div key={doc.id} className="corporate-card" style={{ padding: "24px" }}>
              {/* Doctor Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div style={{ display: "flex", gap: 12 }}>
                  <div
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: "12px",
                      background: doc.color,
                      color: "#FFFFFF",
                      display: "grid",
                      placeItems: "center",
                      fontWeight: 800,
                      fontSize: "17px"
                    }}
                  >
                    {doc.avatar}
                  </div>
                  <div>
                    <h3 style={{ fontSize: "17px", fontWeight: 800, margin: "0 0 2px 0", color: "var(--text-heading)" }}>
                      {doc.name}
                    </h3>
                    <span style={{ fontSize: "12.5px", color: "var(--color-primary)", fontWeight: 700 }}>
                      {doc.title}
                    </span>
                    <span style={{ fontSize: "11.5px", color: "var(--text-muted)", display: "block" }}>
                      {doc.degrees}
                    </span>
                  </div>
                </div>

                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    padding: "3px 8px",
                    borderRadius: "10px",
                    backgroundColor: "#EAF5F3",
                    color: "var(--color-primary)"
                  }}
                >
                  On Duty ✓
                </span>
              </div>

              {/* Specialty Box */}
              <div
                style={{
                  backgroundColor: "#F7FAF9",
                  borderRadius: "8px",
                  padding: "12px 14px",
                  marginBottom: 16,
                  fontSize: "12.5px"
                }}
              >
                <span style={{ color: "var(--text-muted)", fontSize: "11px", fontWeight: 700, display: "block", textTransform: "uppercase" }}>
                  Clinical Specialty Focus:
                </span>
                <strong style={{ color: "var(--text-heading)", display: "block", marginTop: 2 }}>
                  {doc.specialty}
                </strong>
              </div>

              {/* Caseload Metrics */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 8,
                  textAlign: "center",
                  padding: "10px",
                  backgroundColor: "#FFFFFF",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "8px",
                  marginBottom: 16
                }}
              >
                <div>
                  <span style={{ fontSize: "11px", color: "var(--text-muted)", display: "block" }}>Under Care</span>
                  <strong style={{ fontSize: "16px", color: "var(--text-heading)" }}>{assignedCount} People</strong>
                </div>
                <div>
                  <span style={{ fontSize: "11px", color: "var(--text-muted)", display: "block" }}>Recovered</span>
                  <strong style={{ fontSize: "16px", color: "var(--color-primary)" }}>{doc.recoveredCases} Cases</strong>
                </div>
                <div>
                  <span style={{ fontSize: "11px", color: "var(--text-muted)", display: "block" }}>Rating</span>
                  <strong style={{ fontSize: "16px", color: "#C97A1C" }}>{doc.satisfaction}</strong>
                </div>
              </div>

              {/* Contact row */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", color: "var(--text-muted)", paddingTop: 10, borderTop: "1px solid var(--border-subtle)" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                  <Mail size={13} />
                  {doc.email}
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                  <Phone size={13} />
                  {doc.phone}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Onboard New Doctor Modal */}
      {showAddModal && (
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
          <div className="corporate-card" style={{ width: "100%", maxWidth: "520px", padding: "28px 32px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <div>
                <h2 style={{ fontSize: "18px", fontWeight: 800, margin: "0 0 4px 0", color: "var(--text-heading)" }}>
                  Onboard Specialist Doctor / Trainer
                </h2>
                <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  Add a licensed occupational physician, physical therapist, or ergonomist.
                </span>
              </div>
              <button onClick={() => setShowAddModal(false)} style={{ padding: 4, cursor: "pointer" }}>
                <X size={18} />
              </button>
            </div>

            {formError && (
              <div style={{ padding: "8px 12px", backgroundColor: "#FDEEEE", color: "#C93B3B", borderRadius: "6px", fontSize: "12.5px", marginBottom: 14 }}>
                {formError}
              </div>
            )}

            <form onSubmit={handleAddSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: 4 }}>Doctor Name & Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Ramesh Kumar, PT"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid var(--border-subtle)", fontSize: "13px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: 4 }}>Work Email *</label>
                <input
                  type="email"
                  placeholder="doctor@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid var(--border-subtle)", fontSize: "13px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: 4 }}>Clinical Specialty</label>
                <input
                  type="text"
                  value={formData.specialty}
                  onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid var(--border-subtle)", fontSize: "13px" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary"
                  style={{ padding: "8px 16px", fontSize: "12.5px" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ padding: "8px 18px", fontSize: "12.5px" }}
                >
                  Save Doctor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
