import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  User,
  ShieldCheck,
  Award,
  Mail,
  Building,
  Save,
  CheckCircle2,
  FileCheck2,
  BookOpen
} from "lucide-react";
import { trainerService } from "../../services/trainerService";
import Toast from "../../components/common/Toast";

export default function TrainerProfile() {
  const [profile, setProfile] = useState(trainerService.getTrainerProfile());
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    jobRole: "",
    trainerId: "",
    credentials: "",
    bio: ""
  });
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const prof = trainerService.getTrainerProfile();
    setProfile(prof);
    setFormData({
      name: prof.name || "",
      email: prof.email || "",
      department: prof.department || "Health & Ergonomics",
      jobRole: prof.jobRole || "Occupational Health Specialist",
      trainerId: prof.trainerId || "TR-2001",
      credentials: prof.credentials || "PT, CPE, OTR/L",
      bio: prof.bio || "Occupational physiotherapist and ergonomics specialist advising corporate ergonomic setups and injury prevention."
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    const updated = trainerService.updateTrainerProfile(formData);
    setProfile(updated);
    setIsEditing(false);
    setToastMessage("Specialist profile updated successfully.");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: "1000px", margin: "0 auto" }}>
      {/* Top Banner */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
        <div>
          <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Specialist Accreditation & Identity
          </span>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "var(--text-heading)", margin: "4px 0 0" }}>
            Occupational Health Specialist Profile
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", margin: "4px 0 0" }}>
            Your credentials and signatures are affixed to all verified workplace health certificates.
          </p>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="btn-primary"
            >
              Edit Profile
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Main Profile Card */}
      <div className="corporate-card" style={{ padding: "32px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 24, flexWrap: "wrap", marginBottom: 28, paddingBottom: 24, borderBottom: "1px solid var(--border-subtle)" }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "var(--color-primary)",
              color: "#FFFFFF",
              display: "grid",
              placeItems: "center",
              fontSize: "26px",
              fontWeight: 800,
              flexShrink: 0
            }}
          >
            {formData.name.charAt(0).toUpperCase() || "T"}
          </div>

          <div style={{ flex: 1, minWidth: "260px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <h2 style={{ fontSize: "22px", fontWeight: 800, color: "var(--text-heading)", margin: 0 }}>
                {profile.name}
              </h2>
              <span className="badge badge-low" style={{ fontSize: "11px" }}>
                Accredited Trainer
              </span>
            </div>
            <p style={{ fontSize: "14px", color: "var(--color-primary)", fontWeight: 600, margin: "0 0 6px 0" }}>
              {profile.jobRole} • {profile.department}
            </p>
            <span style={{ fontSize: "12.5px", color: "var(--text-muted)" }}>
              Specialist ID: <strong>{profile.trainerId || "TR-2001"}</strong> • {profile.email}
            </span>
          </div>
        </div>

        {/* View / Edit Mode */}
        {!isEditing ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                Professional Credentials & Clinical Licenses
              </span>
              <p style={{ fontSize: "14.5px", color: "var(--text-heading)", margin: 0, fontWeight: 600 }}>
                {profile.credentials || "PT, CPE (Certified Professional Ergonomist), OTR/L"}
              </p>
            </div>

            <div>
              <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                Specialist Philosophy & Bio
              </span>
              <p style={{ fontSize: "14px", color: "var(--text-body)", lineHeight: 1.6, margin: 0 }}>
                {profile.bio || "Specializing in corporate ergonomics, repetitive strain prevention, and evidence-based workplace wellbeing intervention pathways."}
              </p>
            </div>

            <div>
              <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", display: "block", marginBottom: 12 }}>
                Active Compliance Accreditations
              </span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                {[
                  "ISO 45001 Workplace Safety Certified",
                  "Board of Certification in Professional Ergonomics (BCPE)",
                  "American Physical Therapy Association (APTA)",
                  "OSHA Ergonomic Guidelines Specialist"
                ].map((cert, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "8px 14px",
                      borderRadius: 6,
                      background: "#F8FAF9",
                      border: "1px solid var(--border-subtle)",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "var(--text-heading)"
                    }}
                  >
                    <ShieldCheck size={16} color="var(--color-primary)" />
                    <span>{cert}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Official Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Department</label>
                <input
                  type="text"
                  name="department"
                  className="form-input"
                  value={formData.department}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Job Title / Role</label>
                <input
                  type="text"
                  name="jobRole"
                  className="form-input"
                  value={formData.jobRole}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Specialist / Trainer ID</label>
                <input
                  type="text"
                  name="trainerId"
                  className="form-input"
                  value={formData.trainerId}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Licenses & Credentials</label>
                <input
                  type="text"
                  name="credentials"
                  className="form-input"
                  value={formData.credentials}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Professional Bio / Approach</label>
              <textarea
                name="bio"
                className="form-input"
                rows={4}
                value={formData.bio}
                onChange={handleChange}
                style={{ resize: "vertical", fontSize: "13.5px" }}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 12 }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                <Save size={15} />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        )}
      </div>

      <Toast message={toastMessage} onClose={() => setToastMessage("")} />
    </div>
  );
}
