import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  CheckCircle2,
  User,
  Plus,
  FileText,
  BookOpen,
  Save,
  MessageSquare,
  ShieldCheck
} from "lucide-react";
import { trainerService } from "../../services/trainerService";
import Modal from "../../components/common/Modal";
import Toast from "../../components/common/Toast";

export default function TrainerSessions() {
  const [activeTab, setActiveTab] = useState("curriculum"); // 'curriculum' or 'consultations'
  const [sessionLogs, setSessionLogs] = useState([]);
  const [scheduledSessions, setScheduledSessions] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);
  const [logNoteText, setLogNoteText] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  // Schedule Modal State
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [schedEmployeeName, setSchedEmployeeName] = useState("");
  const [schedTopic, setSchedTopic] = useState("Workstation Posture Assessment");
  const [schedDate, setSchedDate] = useState("2026-10-06");
  const [schedTime, setSchedTime] = useState("11:00 AM");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const logs = trainerService.getTrainerSessionLogs();
    const data = trainerService.getTrainerData();
    setSessionLogs(logs);
    setScheduledSessions(data.sessions || []);
  };

  const handleOpenNoteModal = (log) => {
    setSelectedLog(log);
    setLogNoteText(log.trainerNote || "");
  };

  const handleSaveNote = () => {
    if (!selectedLog) return;
    trainerService.saveTrainerSessionNote(selectedLog.id, logNoteText);
    loadData();
    setSelectedLog(null);
    setToastMessage("Session clinical note saved successfully.");
  };

  const handleCompleteConsultation = (sessionId) => {
    trainerService.completeSession(sessionId);
    loadData();
    setToastMessage("Consultation marked as Completed.");
  };

  const handleCreateSchedule = (e) => {
    e.preventDefault();
    if (!schedEmployeeName.trim()) return;

    trainerService.scheduleSession({
      employeeName: schedEmployeeName.trim(),
      department: "Corporate Operations",
      topic: schedTopic,
      date: schedDate,
      time: schedTime,
      type: "1-on-1 Coaching",
      notes: "Workplace ergonomic coaching and habit review."
    });

    setIsScheduleOpen(false);
    setSchedEmployeeName("");
    loadData();
    setToastMessage(`Consultation scheduled with ${schedEmployeeName.trim()}.`);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: "1280px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
        <div>
          <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Occupational Coaching & Curriculum Tracking
          </span>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "var(--text-heading)", margin: "4px 0 0" }}>
            Coaching & Session Supervision
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", margin: "4px 0 0" }}>
            Monitor completed employee curriculum sessions, attach specialist notes, and coordinate 1-on-1 consultations.
          </p>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            type="button"
            onClick={() => setIsScheduleOpen(true)}
            className="btn-primary"
          >
            <Plus size={16} />
            <span>Schedule Consultation</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, borderBottom: "1px solid var(--border-subtle)", paddingBottom: 8 }}>
        <button
          type="button"
          onClick={() => setActiveTab("curriculum")}
          style={{
            background: activeTab === "curriculum" ? "var(--color-primary-light)" : "transparent",
            border: "none",
            borderRadius: 6,
            padding: "8px 16px",
            color: activeTab === "curriculum" ? "var(--color-primary)" : "var(--text-muted)",
            fontWeight: activeTab === "curriculum" ? 700 : 500,
            fontSize: "13.5px",
            cursor: "pointer"
          }}
        >
          Curriculum Session Logs ({sessionLogs.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("consultations")}
          style={{
            background: activeTab === "consultations" ? "var(--color-primary-light)" : "transparent",
            border: "none",
            borderRadius: 6,
            padding: "8px 16px",
            color: activeTab === "consultations" ? "var(--color-primary)" : "var(--text-muted)",
            fontWeight: activeTab === "consultations" ? 700 : 500,
            fontSize: "13.5px",
            cursor: "pointer"
          }}
        >
          1-on-1 Consultations ({scheduledSessions.length})
        </button>
      </div>

      {/* Tab 1: Curriculum Session Logs */}
      {activeTab === "curriculum" && (
        <div>
          {sessionLogs.length === 0 ? (
            <div className="corporate-card" style={{ padding: "48px 24px", textAlign: "center", maxWidth: "600px", margin: "20px auto" }}>
              <BookOpen size={40} color="var(--text-muted)" style={{ margin: "0 auto 12px", opacity: 0.6 }} />
              <h3 style={{ fontSize: "16.5px", fontWeight: 700, color: "var(--text-heading)", margin: "0 0 6px 0" }}>
                No Curriculum Sessions Logged Yet
              </h3>
              <p style={{ fontSize: "13.5px", color: "var(--text-muted)", margin: 0 }}>
                When enrolled employees start completing sessions in their programs, session logs will appear here for specialist review and notes.
              </p>
            </div>
          ) : (
            <div className="corporate-card" style={{ padding: 0, overflow: "hidden" }}>
              <div style={{ overflowX: "auto" }}>
                <table className="corporate-table" style={{ width: "100%" }}>
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Program</th>
                      <th>Session</th>
                      <th>Duration</th>
                      <th>Status</th>
                      <th>Trainer Note</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessionLogs.map((log) => (
                      <tr key={log.id}>
                        <td>
                          <strong style={{ color: "var(--text-heading)", display: "block", fontSize: "13.5px" }}>
                            {log.employeeName}
                          </strong>
                          <span style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>
                            {log.department}
                          </span>
                        </td>
                        <td style={{ fontSize: "13px", fontWeight: 600, color: "var(--color-primary)" }}>
                          {log.programName}
                        </td>
                        <td>
                          <strong style={{ display: "block", fontSize: "13px", color: "var(--text-heading)" }}>
                            Session {log.sessionId}: {log.sessionTitle}
                          </strong>
                          <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                            Focus: Postural alignment & relief
                          </span>
                        </td>
                        <td style={{ fontSize: "12.5px", color: "var(--text-muted)" }}>
                          {log.duration}
                        </td>
                        <td>
                          {log.isCompleted ? (
                            <span className="badge badge-low" style={{ fontSize: "11px" }}>
                              <CheckCircle2 size={12} style={{ display: "inline", marginRight: 4 }} />
                              Completed
                            </span>
                          ) : (
                            <span className="badge badge-neutral" style={{ fontSize: "11px" }}>
                              Pending
                            </span>
                          )}
                        </td>
                        <td style={{ maxWidth: "220px", fontSize: "12px", color: "var(--text-muted)" }}>
                          {log.trainerNote ? (
                            <span style={{ color: "var(--text-heading)", fontStyle: "italic" }}>
                              "{log.trainerNote}"
                            </span>
                          ) : (
                            <span style={{ color: "var(--text-muted)" }}>No notes added</span>
                          )}
                        </td>
                        <td>
                          <button
                            type="button"
                            onClick={() => handleOpenNoteModal(log)}
                            className="btn-secondary"
                            style={{ padding: "5px 10px", fontSize: "12px" }}
                          >
                            <MessageSquare size={13} />
                            <span>{log.trainerNote ? "Edit Note" : "Add Note"}</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: 1-on-1 Consultations */}
      {activeTab === "consultations" && (
        <div>
          {scheduledSessions.length === 0 ? (
            <div className="corporate-card" style={{ padding: "48px 24px", textAlign: "center", maxWidth: "600px", margin: "20px auto" }}>
              <Calendar size={40} color="var(--text-muted)" style={{ margin: "0 auto 12px", opacity: 0.6 }} />
              <h3 style={{ fontSize: "16.5px", fontWeight: 700, color: "var(--text-heading)", margin: "0 0 6px 0" }}>
                No Consultations Scheduled
              </h3>
              <p style={{ fontSize: "13.5px", color: "var(--text-muted)", margin: "0 0 18px 0" }}>
                Schedule targeted 1-on-1 ergonomics or stress consultations with corporate team members.
              </p>
              <button
                type="button"
                onClick={() => setIsScheduleOpen(true)}
                className="btn-primary"
                style={{ margin: "0 auto" }}
              >
                <Plus size={15} />
                <span>Schedule First Consultation</span>
              </button>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 20 }}>
              {scheduledSessions.map((ses) => (
                <div key={ses.id} className="corporate-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <span className="badge badge-low">{ses.type || "Coaching"}</span>
                      <span
                        className={`badge ${
                          ses.status === "Completed"
                            ? "badge-low"
                            : ses.status === "Confirmed"
                            ? "badge-mod"
                            : "badge-neutral"
                        }`}
                      >
                        {ses.status}
                      </span>
                    </div>

                    <h3 style={{ fontSize: "16.5px", fontWeight: 700, color: "var(--text-heading)", marginBottom: 6 }}>
                      {ses.topic}
                    </h3>

                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "13px", color: "var(--text-heading)", marginBottom: 12 }}>
                      <User size={15} color="var(--color-primary)" />
                      <strong>{ses.employeeName}</strong>
                      {ses.department && <span style={{ color: "var(--text-muted)" }}>• {ses.department}</span>}
                    </div>

                    <div style={{ display: "flex", gap: 16, fontSize: "12.5px", color: "var(--text-muted)", marginBottom: 14 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <Calendar size={14} />
                        <span>{ses.date}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <Clock size={14} />
                        <span>{ses.time}</span>
                      </div>
                    </div>

                    {ses.notes && (
                      <div style={{ padding: "10px 12px", background: "#F8FAF9", borderRadius: 6, border: "1px solid var(--border-subtle)", fontSize: "12px", color: "var(--text-muted)" }}>
                        <strong>Notes: </strong>{ses.notes}
                      </div>
                    )}
                  </div>

                  <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: 14, marginTop: 16, display: "flex", justifyContent: "flex-end", gap: 8 }}>
                    {ses.status !== "Completed" && (
                      <button
                        type="button"
                        onClick={() => handleCompleteConsultation(ses.id)}
                        className="btn-primary"
                        style={{ padding: "7px 14px", fontSize: "12.5px" }}
                      >
                        <CheckCircle2 size={14} />
                        <span>Mark Completed</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Note Modal */}
      <Modal
        isOpen={!!selectedLog}
        onClose={() => setSelectedLog(null)}
        title={selectedLog ? `Session Note: ${selectedLog.employeeName}` : ""}
        subtitle={selectedLog ? `${selectedLog.programName} • Session ${selectedLog.sessionId}: ${selectedLog.sessionTitle}` : ""}
      >
        {selectedLog && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Specialist Clinical & Coaching Note</label>
              <textarea
                className="form-input"
                rows={4}
                value={logNoteText}
                onChange={(e) => setLogNoteText(e.target.value)}
                placeholder="Enter posture notes, compliance reminders, or guidance for this session..."
                style={{ resize: "vertical", fontSize: "13.5px" }}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setSelectedLog(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={handleSaveNote}
              >
                <Save size={14} />
                <span>Save Note</span>
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Schedule Modal */}
      <Modal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        title="Schedule 1-on-1 Consultation"
        subtitle="Book an ergonomic review or wellbeing consultation"
      >
        <form onSubmit={handleCreateSchedule} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Employee Name</label>
            <input
              type="text"
              className="form-input"
              value={schedEmployeeName}
              onChange={(e) => setSchedEmployeeName(e.target.value)}
              placeholder="e.g. Bhavana Thota"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Consultation Topic</label>
            <input
              type="text"
              className="form-input"
              value={schedTopic}
              onChange={(e) => setSchedTopic(e.target.value)}
              required
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Date</label>
              <input
                type="date"
                className="form-input"
                value={schedDate}
                onChange={(e) => setSchedDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Time</label>
              <input
                type="text"
                className="form-input"
                value={schedTime}
                onChange={(e) => setSchedTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 10 }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setIsScheduleOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Schedule Appointment
            </button>
          </div>
        </form>
      </Modal>

      <Toast message={toastMessage} onClose={() => setToastMessage("")} />
    </div>
  );
}

