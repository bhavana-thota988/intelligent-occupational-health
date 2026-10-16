import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Calendar,
  Search,
  ArrowRight,
  CheckCircle2,
  Clock,
  ShieldCheck,
  User,
  Activity,
  FileText,
  AlertCircle
} from "lucide-react";
import { trainerService } from "../../services/trainerService";
import RiskBadge from "../../components/common/RiskBadge";
import Modal from "../../components/common/Modal";
import Toast from "../../components/common/Toast";

export default function AssignedEmployees() {
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [scheduleEmployee, setScheduleEmployee] = useState(null);
  const [sessionTopic, setSessionTopic] = useState("Workstation Ergonomic Review");
  const [sessionDate, setSessionDate] = useState("2026-10-05");
  const [sessionTime, setSessionTime] = useState("10:00 AM");
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = () => {
    const list = trainerService.getAssignedEmployees();
    setEmployees(list);
  };

  const filtered = employees.filter((emp) =>
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (emp.department && emp.department.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (emp.jobRole && emp.jobRole.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleScheduleSubmit = (e) => {
    e.preventDefault();
    if (!scheduleEmployee) return;

    trainerService.scheduleSession({
      employeeId: scheduleEmployee.id,
      employeeName: scheduleEmployee.name,
      employeeEmail: scheduleEmployee.email,
      department: scheduleEmployee.department,
      topic: sessionTopic,
      date: sessionDate,
      time: sessionTime,
      type: "Ergonomic Consultation",
      notes: `Targeting workplace posture and session guidance for ${scheduleEmployee.activeProgram}.`
    });

    setToastMessage(`1-on-1 coaching session scheduled with ${scheduleEmployee.name}.`);
    setScheduleEmployee(null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: "1280px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
        <div>
          <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Corporate Workforce Supervision
          </span>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "var(--text-heading)", margin: "4px 0 0" }}>
            Assigned Employees
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", margin: "4px 0 0" }}>
            Real-time roster of registered corporate employees undergoing health screening and active wellbeing programs.
          </p>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <Link to="/trainer/reviews" className="btn-secondary">
            Review Queue
          </Link>
          <Link to="/trainer/sessions" className="btn-primary">
            <Calendar size={16} />
            <span>Coaching Sessions</span>
          </Link>
        </div>
      </div>

      {/* Search and Table Card */}
      <div className="corporate-card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border-card)", display: "flex", alignItems: "center", gap: 12 }}>
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search by employee name, department, or job role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: "100%", border: "none", outline: "none", fontSize: "13.5px" }}
          />
        </div>

        {filtered.length === 0 ? (
          <div style={{ padding: "48px 24px", textAlign: "center" }}>
            <Users size={40} color="var(--text-muted)" style={{ margin: "0 auto 12px", opacity: 0.6 }} />
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-heading)", margin: "0 0 4px 0" }}>
              No Employees Found
            </h3>
            <p style={{ fontSize: "13.5px", color: "var(--text-muted)", margin: 0 }}>
              {searchQuery ? "No registered employees match your search query." : "No employees currently registered in the platform."}
            </p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="corporate-table" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Department / Role</th>
                  <th>Screening Status</th>
                  <th>Risk Score</th>
                  <th>Enrolled Program</th>
                  <th>Curriculum Progress</th>
                  <th>Certificates</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((emp) => (
                  <tr key={emp.id}>
                    <td>
                      <strong style={{ color: "var(--text-heading)", display: "block", fontSize: "14px" }}>{emp.name}</strong>
                      <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{emp.email} • {emp.employeeId}</span>
                    </td>
                    <td>
                      <span style={{ display: "block", fontSize: "13px", fontWeight: 600 }}>{emp.department}</span>
                      <span style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>{emp.jobRole}</span>
                    </td>
                    <td>
                      {emp.hasCompletedAssessment ? (
                        <span className="badge badge-low" style={{ fontSize: "11px" }}>Screened</span>
                      ) : (
                        <span className="badge badge-neutral" style={{ fontSize: "11px" }}>Pending Screening</span>
                      )}
                    </td>
                    <td>
                      {emp.overallRiskScore !== null ? (
                        <RiskBadge score={emp.overallRiskScore} size="sm" />
                      ) : (
                        <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>—</span>
                      )}
                    </td>
                    <td style={{ fontSize: "13px", fontWeight: 600, color: "var(--color-primary)" }}>
                      {emp.activeProgram}
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: "120px" }}>
                        <span style={{ fontSize: "12px", fontWeight: 700 }}>{emp.programProgress}%</span>
                        <div style={{ flex: 1, height: 6, background: "#E2ECE9", borderRadius: 3, overflow: "hidden" }}>
                          <div
                            style={{
                              height: "100%",
                              width: `${emp.programProgress}%`,
                              background: emp.programStatus === "verified" ? "#147D75" : "var(--color-primary)",
                              borderRadius: 3
                            }}
                          />
                        </div>
                      </div>
                      <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                        {emp.completedSessions} of {emp.totalSessions} sessions
                      </span>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <span className="badge badge-low" style={{ fontSize: "11px" }}>
                        {emp.certificatesEarned} Issued
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          type="button"
                          onClick={() => setSelectedEmployee(emp)}
                          className="btn-secondary"
                          style={{ padding: "5px 10px", fontSize: "11.5px" }}
                          title="View Employee Wellbeing Overview"
                        >
                          Overview
                        </button>
                        <button
                          type="button"
                          onClick={() => setScheduleEmployee(emp)}
                          className="btn-primary"
                          style={{ padding: "5px 10px", fontSize: "11.5px" }}
                          title="Schedule 1-on-1 Consultation"
                        >
                          <Calendar size={12} />
                          <span>Schedule</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Employee Program Overview Modal */}
      <Modal
        isOpen={!!selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
        title={selectedEmployee ? `${selectedEmployee.name} — Wellbeing Profile` : ""}
        subtitle={selectedEmployee ? `${selectedEmployee.department} • ${selectedEmployee.jobRole} (${selectedEmployee.employeeId})` : ""}
      >
        {selectedEmployee && (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div style={{ padding: "14px", background: "#F8FAF9", borderRadius: 8, border: "1px solid var(--border-subtle)" }}>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", display: "block", marginBottom: 4 }}>
                  Health Assessment Status
                </span>
                <strong style={{ fontSize: "14px", color: "var(--text-heading)", display: "block" }}>
                  {selectedEmployee.hasCompletedAssessment ? "16-Question Screening Completed" : "Not yet screened"}
                </strong>
                {selectedEmployee.overallRiskScore !== null && (
                  <div style={{ marginTop: 8 }}>
                    <RiskBadge score={selectedEmployee.overallRiskScore} size="sm" />
                  </div>
                )}
              </div>

              <div style={{ padding: "14px", background: "#F8FAF9", borderRadius: 8, border: "1px solid var(--border-subtle)" }}>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", display: "block", marginBottom: 4 }}>
                  Current Active Program
                </span>
                <strong style={{ fontSize: "14px", color: "var(--color-primary)", display: "block" }}>
                  {selectedEmployee.activeProgram}
                </strong>
                <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  Progress: {selectedEmployee.programProgress}% ({selectedEmployee.completedSessions} of {selectedEmployee.totalSessions} sessions logged)
                </span>
              </div>
            </div>

            <div style={{ padding: "14px", background: "#FFFFFF", borderRadius: 8, border: "1px solid var(--border-subtle)" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                Compliance & Certification
              </span>
              <p style={{ fontSize: "13px", color: "var(--text-body)", margin: "0 0 10px 0" }}>
                Status: <strong>{selectedEmployee.programStatus.toUpperCase()}</strong> • Total verified credentials: <strong>{selectedEmployee.certificatesEarned}</strong>
              </p>
              {selectedEmployee.programStatus === "awaiting_review" && (
                <div style={{ padding: "10px 12px", background: "#FEF2DC", borderRadius: 6, color: "#C97A1C", fontSize: "12.5px", fontWeight: 600 }}>
                  Submission ready in Review Queue for occupational approval.
                </div>
              )}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setSelectedEmployee(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  const emp = selectedEmployee;
                  setSelectedEmployee(null);
                  setScheduleEmployee(emp);
                }}
              >
                <Calendar size={14} />
                <span>Schedule 1-on-1 Session</span>
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Schedule Consultation Modal */}
      <Modal
        isOpen={!!scheduleEmployee}
        onClose={() => setScheduleEmployee(null)}
        title={scheduleEmployee ? `Schedule 1-on-1: ${scheduleEmployee.name}` : ""}
        subtitle={scheduleEmployee ? `Target: ${scheduleEmployee.activeProgram}` : ""}
      >
        {scheduleEmployee && (
          <form onSubmit={handleScheduleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Consultation Topic</label>
              <input
                type="text"
                className="form-input"
                value={sessionTopic}
                onChange={(e) => setSessionTopic(e.target.value)}
                required
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={sessionDate}
                  onChange={(e) => setSessionDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Time</label>
                <input
                  type="text"
                  className="form-input"
                  value={sessionTime}
                  onChange={(e) => setSessionTime(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 10 }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setScheduleEmployee(null)}
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Confirm Appointment
              </button>
            </div>
          </form>
        )}
      </Modal>

      <Toast message={toastMessage} onClose={() => setToastMessage("")} />
    </div>
  );
}

