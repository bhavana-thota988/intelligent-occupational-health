import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Award,
  Send,
  User,
  BookOpen,
  Calendar,
  Clock,
  ShieldCheck,
  FileCheck
} from "lucide-react";
import { authService } from "../../services/authService";
import { trainerService } from "../../services/trainerService";
import { employeeService } from "../../services/employeeService";
import Toast from "../../components/common/Toast";

export default function ReviewDetail() {
  const { reviewId } = useParams();
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();
  const trainerName = currentUser?.name || "Dr. Sarah Jenkins";

  const [review, setReview] = useState(null);
  const [checklist, setChecklist] = useState({
    completion: true,
    participation: true,
    reflection: true,
    ergonomics: true
  });
  const [observations, setObservations] = useState(
    "Workstation display height optimized to eye level; lumbar spine stability demonstrated throughout the protocol."
  );
  const [feedback, setFeedback] = useState(
    "Demonstrated exemplary engagement with all movement routines. Workstation alignment and daily posture habits verified."
  );
  const [toastMessage, setToastMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadReview();
  }, [reviewId]);

  const loadReview = () => {
    const rev = trainerService.getReviewById(reviewId);
    if (rev) {
      setReview(rev);
      if (rev.trainerFeedback) {
        setFeedback(rev.trainerFeedback);
      }
    }
  };

  const handleApprove = () => {
    if (!feedback.trim()) {
      setToastMessage("Please provide feedback notes before approving.");
      return;
    }
    if (!checklist.completion || !checklist.participation) {
      setToastMessage("Please confirm completion and participation checklist items before approving.");
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const combinedFeedback = observations.trim() 
        ? `${feedback.trim()} [Specialist Observation: ${observations.trim()}]`
        : feedback.trim();
      const cert = trainerService.approveReview(review.id, trainerName, combinedFeedback);
      loadReview();
      setIsProcessing(false);
      setToastMessage(`Program approved! Certificate ${cert?.certificateId || ""} successfully generated.`);
    }, 600);
  };

  const handleRequestCorrection = () => {
    if (!feedback.trim()) {
      setToastMessage("Please enter adjustment guidance for the employee.");
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      trainerService.requestCorrection(review.id, trainerName, feedback);
      loadReview();
      setIsProcessing(false);
      setToastMessage("Correction request sent to employee.");
    }, 600);
  };

  if (!review) {
    return (
      <div className="corporate-card" style={{ padding: 40, textAlign: "center" }}>
        <p>Review submission record not found.</p>
        <Link to="/trainer/reviews" className="btn-primary" style={{ display: "inline-flex", marginTop: 12 }}>
          Back to Review Queue
        </Link>
      </div>
    );
  }

  const program = employeeService.getProgramById(review.programId);
  const isPending = review.status === "pending";
  const isApproved = review.status === "approved";
  const isCorrection = review.status === "needs_correction";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: "1100px", margin: "0 auto" }}>
      {/* Back Button */}
      <div>
        <Link
          to="/trainer/reviews"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: "13.5px",
            fontWeight: 600,
            color: "var(--text-muted)",
            textDecoration: "none"
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Review Queue</span>
        </Link>
      </div>

      {/* Header Banner */}
      <div
        className="corporate-card"
        style={{
          padding: "28px 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 20
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <span
              className={`badge ${
                isApproved
                  ? "badge-low"
                  : isPending
                  ? "badge-mod"
                  : "badge-high"
              }`}
              style={{ fontSize: "12px", padding: "4px 10px" }}
            >
              {isApproved ? "Approved & Certificate Issued" : isPending ? "Pending Clinical Review" : "Correction Requested"}
            </span>
            <span style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "monospace" }}>
              Submission ID: {review.id}
            </span>
          </div>

          <h1 style={{ fontSize: "24px", fontWeight: 800, color: "var(--text-heading)", margin: "0 0 6px 0" }}>
            Curriculum Verification: {review.programName}
          </h1>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 20, fontSize: "13.5px", color: "var(--text-body)" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <User size={15} color="var(--color-primary)" />
              Employee: <strong>{review.employeeName}</strong> ({review.department})
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Clock size={15} color="var(--color-primary)" />
              Submitted: <strong>{review.submittedAt}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* 2-Column Layout: Session Logs & Clinical Decision */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 24 }} className="dashboard-grid-2col">
        {/* Left Column: Completed Sessions Checklist Log */}
        <div className="corporate-card" style={{ padding: "26px" }}>
          <h3 style={{ fontSize: "17px", fontWeight: 700, color: "var(--text-heading)", margin: "0 0 4px 0" }}>
            Logged Curriculum Sessions
          </h3>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: "0 0 20px 0" }}>
            All {review.totalSessions} sessions logged as performed by employee at their workstation.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {program?.sessions.map((session, idx) => (
              <div
                key={session.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  borderRadius: 6,
                  background: "#F8FAF9",
                  border: "1px solid var(--border-subtle)"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      background: "var(--color-primary)",
                      color: "#FFFFFF",
                      display: "grid",
                      placeItems: "center"
                    }}
                  >
                    <CheckCircle2 size={15} />
                  </div>
                  <div>
                    <strong style={{ fontSize: "13.5px", color: "var(--text-heading)", display: "block" }}>
                      Session {idx + 1}: {session.title}
                    </strong>
                    <span style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>
                      Duration: {session.duration}
                    </span>
                  </div>
                </div>

                <span className="badge badge-low" style={{ fontSize: "11px" }}>
                  Verified Complete
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Trainer Decision & Feedback */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="corporate-card" style={{ padding: "26px" }}>
            <h3 style={{ fontSize: "17px", fontWeight: 700, color: "var(--text-heading)", margin: "0 0 4px 0" }}>
              Clinical Assessment & Guidance
            </h3>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: "0 0 16px 0" }}>
              Evaluate employee curriculum compliance and specify verification findings.
            </p>

            {/* Structured Verification Checklist */}
            <div style={{ background: "#F8FAF9", padding: "14px 16px", borderRadius: 8, border: "1px solid var(--border-subtle)", marginBottom: 16 }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 10 }}>
                Structured Review Verification Checklist
              </span>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "13px", cursor: isPending ? "pointer" : "default" }}>
                  <input
                    type="checkbox"
                    checked={checklist.completion}
                    onChange={(e) => setChecklist({ ...checklist, completion: e.target.checked })}
                    disabled={!isPending}
                  />
                  <span><strong>Completion Verification:</strong> All {review.totalSessions} sessions logged as finished</span>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "13px", cursor: isPending ? "pointer" : "default" }}>
                  <input
                    type="checkbox"
                    checked={checklist.participation}
                    onChange={(e) => setChecklist({ ...checklist, participation: e.target.checked })}
                    disabled={!isPending}
                  />
                  <span><strong>Participation Consistency:</strong> Regular cadence and movement intervals observed</span>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "13px", cursor: isPending ? "pointer" : "default" }}>
                  <input
                    type="checkbox"
                    checked={checklist.reflection}
                    onChange={(e) => setChecklist({ ...checklist, reflection: e.target.checked })}
                    disabled={!isPending}
                  />
                  <span><strong>Reflection & Fatigue:</strong> Self-reported strain and recovery improvements noted</span>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "13px", cursor: isPending ? "pointer" : "default" }}>
                  <input
                    type="checkbox"
                    checked={checklist.ergonomics}
                    onChange={(e) => setChecklist({ ...checklist, ergonomics: e.target.checked })}
                    disabled={!isPending}
                  />
                  <span><strong>Ergonomic Alignment:</strong> Workstation setup meets baseline health guidelines</span>
                </label>
              </div>
            </div>

            {/* Trainer Observations */}
            <div className="form-group" style={{ marginBottom: 14 }}>
              <label className="form-label">Specialist Observations</label>
              <textarea
                className="form-input"
                rows={2}
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                disabled={isApproved}
                placeholder="Key clinical or postural observations from session evaluations..."
                style={{ resize: "vertical", fontSize: "13px", lineHeight: 1.4 }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Official Feedback (Appears on Certificate & Employee Record)</label>
              <textarea
                className="form-input"
                rows={4}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                disabled={isApproved}
                placeholder="Enter feedback on ergonomic posture, movement cadence, and habits..."
                style={{ resize: "vertical", fontSize: "13.5px", lineHeight: 1.5 }}
              />
            </div>

            {/* Decision Actions */}
            {isPending && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 18 }}>
                <button
                  type="button"
                  onClick={handleApprove}
                  className="btn-primary"
                  style={{ width: "100%", padding: "12px", fontSize: "14px", fontWeight: 700 }}
                  disabled={isProcessing}
                >
                  <Award size={16} />
                  <span>{isProcessing ? "Verifying..." : "Approve & Issue Certificate"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleRequestCorrection}
                  className="btn-secondary"
                  style={{ width: "100%", padding: "11px", fontSize: "13.5px", color: "#C93B3B" }}
                  disabled={isProcessing}
                >
                  <AlertCircle size={15} />
                  <span>Request Session Adjustments</span>
                </button>
              </div>
            )}

            {isApproved && (
              <div
                style={{
                  background: "#E8F5F1",
                  border: "1px solid #B8E4D7",
                  padding: "16px",
                  borderRadius: 8,
                  color: "var(--color-primary-dark)",
                  marginTop: 16
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <ShieldCheck size={18} color="var(--color-primary)" />
                  <strong style={{ fontSize: "14px" }}>Credential Issued Successfully</strong>
                </div>
                <p style={{ fontSize: "12.5px", margin: "0 0 10px 0" }}>
                  Verified by {review.reviewedBy || trainerName} on {review.reviewedAt}. The employee can now view, print, or download their verified certificate.
                </p>
                <button
                  type="button"
                  onClick={() => navigate("/trainer/reviews")}
                  className="btn-primary"
                  style={{ width: "100%", padding: "9px", fontSize: "13px" }}
                >
                  Return to Review Queue
                </button>
              </div>
            )}

            {isCorrection && (
              <div
                style={{
                  background: "#FDEEEE",
                  border: "1px solid #F5C6C6",
                  padding: "16px",
                  borderRadius: 8,
                  color: "#C93B3B",
                  marginTop: 16
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <AlertCircle size={18} />
                  <strong style={{ fontSize: "14px" }}>Correction Requested</strong>
                </div>
                <p style={{ fontSize: "12.5px", margin: "0 0 10px 0" }}>
                  The employee was notified of your adjustment notes and will re-submit upon reviewing.
                </p>
                <button
                  type="button"
                  onClick={handleApprove}
                  className="btn-primary"
                  style={{ width: "100%", padding: "9px", fontSize: "13px" }}
                  disabled={isProcessing}
                >
                  Override & Approve Now
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Toast message={toastMessage} onClose={() => setToastMessage("")} />
    </div>
  );
}
