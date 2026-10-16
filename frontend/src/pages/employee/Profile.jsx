import React, { useState } from "react";
import { User, Building2, Mail, ShieldCheck, Save, CheckCircle2 } from "lucide-react";
import { authService } from "../../services/authService";
import Toast from "../../components/common/Toast";

export default function Profile() {
  const [user, setUser] = useState(authService.getCurrentUser() || {
    name: "Bhavana Thota",
    email: "employee@company.com",
    employeeId: "EMP-1048",
    department: "Engineering",
    jobRole: "Senior Software Engineer"
  });

  const [workstation, setWorkstation] = useState({
    monitorCount: "2 Screens",
    deskType: "Sit-Stand Adjustable",
    chairType: "Ergonomic Lumbar Support",
    primaryWorkStyle: "Hybrid (3 days in-office)",
  });

  const [toastMessage, setToastMessage] = useState("");

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem("user", JSON.stringify(user));
    setToastMessage("Employee profile and workstation settings saved successfully.");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: "900px", margin: "0 auto" }}>
      <div>
        <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Enterprise Account
        </span>
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "var(--text-heading)", margin: "4px 0 0" }}>
          Employee Profile & Workstation Settings
        </h1>
        <p style={{ fontSize: "14px", color: "var(--text-muted)", margin: "4px 0 0" }}>
          Manage your organizational details, department assignment, and physical workstation attributes.
        </p>
      </div>

      <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {/* Core Employee Info Card */}
        <div className="corporate-card" style={{ padding: "28px" }}>
          <h3 style={{ fontSize: "17px", fontWeight: 700, color: "var(--text-heading)", marginBottom: 18 }}>
            Organizational Information
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Corporate Email</label>
              <input
                type="email"
                className="form-input"
                value={user.email}
                disabled
                style={{ backgroundColor: "#F8FAF9", cursor: "not-allowed" }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Employee ID</label>
              <input
                type="text"
                className="form-input"
                value={user.employeeId || "EMP-1048"}
                onChange={(e) => setUser({ ...user, employeeId: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Department</label>
              <select
                className="form-input"
                value={user.department}
                onChange={(e) => setUser({ ...user, department: e.target.value })}
              >
                <option value="Engineering">Engineering</option>
                <option value="Operations">Operations</option>
                <option value="Sales & Marketing">Sales & Marketing</option>
                <option value="Finance & Legal">Finance & Legal</option>
                <option value="Human Resources">Human Resources</option>
              </select>
            </div>

            <div className="form-group" style={{ gridColumn: "1 / -1" }}>
              <label className="form-label">Job Role / Professional Title</label>
              <input
                type="text"
                className="form-input"
                value={user.jobRole}
                onChange={(e) => setUser({ ...user, jobRole: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Workstation Environment Card */}
        <div className="corporate-card" style={{ padding: "28px" }}>
          <h3 style={{ fontSize: "17px", fontWeight: 700, color: "var(--text-heading)", marginBottom: 18 }}>
            Workstation & Physical Setup Parameters
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Display Hardware</label>
              <select
                className="form-input"
                value={workstation.monitorCount}
                onChange={(e) => setWorkstation({ ...workstation, monitorCount: e.target.value })}
              >
                <option value="Single Laptop Screen">Single Laptop Screen</option>
                <option value="1 External Monitor">1 External Monitor</option>
                <option value="2 Screens">2 Screens (Dual Setup)</option>
                <option value="Ultrawide Monitor">Ultrawide Curved Monitor</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Desk Hardware</label>
              <select
                className="form-input"
                value={workstation.deskType}
                onChange={(e) => setWorkstation({ ...workstation, deskType: e.target.value })}
              >
                <option value="Standard Fixed Desk">Standard Fixed Height Desk</option>
                <option value="Sit-Stand Adjustable">Motorized Sit-Stand Adjustable</option>
                <option value="Desktop Converter">Manual Desktop Converter</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Task Chair</label>
              <select
                className="form-input"
                value={workstation.chairType}
                onChange={(e) => setWorkstation({ ...workstation, chairType: e.target.value })}
              >
                <option value="Ergonomic Lumbar Support">Ergonomic Task Chair with Lumbar</option>
                <option value="Standard Office Chair">Standard Office Chair</option>
                <option value="Active Stool">Active / Saddle Stool</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Working Style</label>
              <select
                className="form-input"
                value={workstation.primaryWorkStyle}
                onChange={(e) => setWorkstation({ ...workstation, primaryWorkStyle: e.target.value })}
              >
                <option value="Full Remote">Full Remote (Home Office)</option>
                <option value="Hybrid (3 days in-office)">Hybrid (3 Days In-Office)</option>
                <option value="100% On-site">100% On-site Corporate Office</option>
              </select>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
          <button type="submit" className="btn-primary" style={{ padding: "11px 24px" }}>
            <Save size={16} />
            <span>Save Profile & Workstation Settings</span>
          </button>
        </div>
      </form>

      <Toast message={toastMessage} onClose={() => setToastMessage("")} />
    </div>
  );
}
