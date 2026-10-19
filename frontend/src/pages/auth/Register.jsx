import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle2, AlertCircle, ArrowRight, User } from "lucide-react";
import { authService } from "../../services/authService";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    employeeId: "",
    department: "Engineering",
    jobRole: "Software Engineer",
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
      setError("Please enter a valid email address.");
      return;
    }
    if (!formData.password || formData.password.length < 6) {
      setError("Password must be at least 6 characters in length.");
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
        role: "employee"
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
          Employee Account Created Successfully
        </h2>
        <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.6, marginBottom: 24 }}>
          Your employee account has been saved in the database. Redirecting you to the sign-in page...
        </p>
        <button
          onClick={() => navigate("/login")}
          className="btn-primary"
          style={{ width: "100%", padding: "11px" }}
        >
          Proceed to Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="corporate-card" style={{ padding: "36px 32px" }}>
      <div style={{ marginBottom: "20px" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "5px 12px",
            background: "#EAF5F3",
            color: "var(--color-primary)",
            borderRadius: 16,
            fontSize: "12px",
            fontWeight: 700,
            marginBottom: 10
          }}
        >
          <User size={13} />
          <span>Employee Portal Registration</span>
        </div>
        <h2 style={{ fontSize: "24px", fontWeight: 800, color: "var(--text-heading)", marginBottom: "6px" }}>
          Create Employee Account
        </h2>
        <p style={{ fontSize: "14px", color: "var(--text-muted)", margin: 0, lineHeight: 1.45 }}>
          Register with your authentic personal or corporate email to access your health programs and assessments.
        </p>
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
              placeholder="e.g. Your Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="e.g. yourname@gmail.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div className="form-group">
            <label className="form-label">Employee ID (Optional)</label>
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
              <option value="Human Resources">Human Resources</option>
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

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="Enter password (min 6 chars)"
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
          {loading ? "Registering..." : "Create Employee Account"}
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
