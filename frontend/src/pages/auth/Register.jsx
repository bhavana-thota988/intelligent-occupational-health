import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, CheckCircle2, AlertCircle, ArrowRight, User, Activity } from "lucide-react";
import { authService } from "../../services/authService";

export default function Register() {
  const navigate = useNavigate();
  const [role, setRole] = useState("employee"); // 'employee' or 'trainer'
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    employeeId: "",
    trainerId: "",
    department: "Engineering",
    jobRole: "Software Engineer",
    professionalRole: "Occupational Health Specialist",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      setError("Please enter a valid work email address.");
      return;
    }
    if (!formData.password) {
      setError("Password cannot be blank.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    setLoading(true);
    try {
      await authService.register({
        ...formData,
        role: role
      });
      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 1800);
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="corporate-card" style={{ padding: "40px 32px", textAlign: "center" }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "#EAF5F3",
            color: "var(--color-primary)",
            display: "grid",
            placeItems: "center",
            margin: "0 auto 20px",
          }}
        >
          <CheckCircle2 size={32} />
        </div>
        <h2 style={{ fontSize: "22px", fontWeight: 800, color: "var(--text-heading)", marginBottom: 8 }}>
          Account Created Successfully
        </h2>
        <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.6, marginBottom: 24 }}>
          Your {role === "trainer" ? "Trainer" : "Employee"} profile has been registered. Redirecting you to the secure login page...
        </p>
        <button
          onClick={() => navigate("/login")}
          className="btn-primary"
          style={{ width: "100%", padding: "11px" }}
        >
          Proceed to Login
        </button>
      </div>
    );
  }

  return (
    <div className="corporate-card" style={{ padding: "36px 32px" }}>
      <div style={{ marginBottom: "22px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: 800, color: "var(--text-heading)", marginBottom: "6px" }}>
          Register Account
        </h2>
        <p style={{ fontSize: "14px", color: "var(--text-muted)", margin: 0 }}>
          Create an enterprise profile for workplace risk assessment and wellbeing management.
        </p>
      </div>

      {/* Role Picker (Employee / Trainer Only) */}
      <div style={{ marginBottom: "20px" }}>
        <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 8 }}>
          Account Type
        </span>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, background: "#F3F8F6", padding: 4, borderRadius: 8 }}>
          <button
            type="button"
            onClick={() => setRole("employee")}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: "9px 12px",
              borderRadius: 6,
              border: "none",
              background: role === "employee" ? "#FFFFFF" : "transparent",
              color: role === "employee" ? "var(--color-primary)" : "var(--text-muted)",
              fontWeight: role === "employee" ? 700 : 500,
              fontSize: "13px",
              cursor: "pointer",
              boxShadow: role === "employee" ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
              transition: "all 0.15s ease"
            }}
          >
            <User size={15} />
            <span>Corporate Employee</span>
          </button>

          <button
            type="button"
            onClick={() => setRole("trainer")}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: "9px 12px",
              borderRadius: 6,
              border: "none",
              background: role === "trainer" ? "#FFFFFF" : "transparent",
              color: role === "trainer" ? "var(--color-primary)" : "var(--text-muted)",
              fontWeight: role === "trainer" ? 700 : 500,
              fontSize: "13px",
              cursor: "pointer",
              boxShadow: role === "trainer" ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
              transition: "all 0.15s ease"
            }}
          >
            <Activity size={15} />
            <span>Wellbeing Trainer</span>
          </button>
        </div>
      </div>

      {error && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 14px",
            borderRadius: "8px",
            background: "#FDEEEE",
            border: "1px solid #F5C6C6",
            color: "#C93B3B",
            fontSize: "13px",
            marginBottom: "18px",
          }}
        >
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              className="form-input"
              placeholder={role === "trainer" ? "e.g. Dr. Sarah Jenkins" : "e.g. Bhavana Thota"}
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Work Email</label>
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="name@company.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {role === "employee" ? (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Employee ID</label>
                <input
                  type="text"
                  name="employeeId"
                  className="form-input"
                  placeholder="e.g. EMP-1048"
                  value={formData.employeeId}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Department</label>
                <select
                  name="department"
                  className="form-input"
                  value={formData.department}
                  onChange={handleChange}
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Operations">Operations</option>
                  <option value="Sales & Marketing">Sales & Marketing</option>
                  <option value="Finance & Legal">Finance & Legal</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Job Role / Title</label>
              <input
                type="text"
                name="jobRole"
                className="form-input"
                placeholder="e.g. Senior Software Engineer"
                value={formData.jobRole}
                onChange={handleChange}
              />
            </div>
          </>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Trainer ID</label>
              <input
                type="text"
                name="trainerId"
                className="form-input"
                placeholder="e.g. TR-2045"
                value={formData.trainerId}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Professional Role</label>
              <input
                type="text"
                name="professionalRole"
                className="form-input"
                placeholder="e.g. Occupational Health Specialist"
                value={formData.professionalRole}
                onChange={handleChange}
              />
            </div>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              className="form-input"
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn-primary"
          style={{ width: "100%", padding: "12px", fontSize: "14.5px", marginTop: "8px" }}
          disabled={loading}
        >
          {loading ? "Registering..." : `Create ${role === "trainer" ? "Trainer" : "Employee"} Account`}
          <ArrowRight size={16} />
        </button>
      </form>

      <div style={{ marginTop: "22px", textAlign: "center", fontSize: "13px", color: "var(--text-muted)" }}>
        Already have an account?{" "}
        <Link to="/login" style={{ color: "var(--color-primary)", fontWeight: 700 }}>
          Sign In
        </Link>
      </div>
    </div>
  );
}
