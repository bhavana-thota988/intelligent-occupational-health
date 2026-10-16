import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FileCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  User,
  BookOpen,
  Filter
} from "lucide-react";
import { trainerService } from "../../services/trainerService";

export default function ProgramReviews() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [filter, setFilter] = useState("pending"); // 'pending', 'approved', 'all'

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = () => {
    const all = trainerService.getAllReviews();
    setReviews(all);
  };

  const filteredReviews = reviews.filter((r) => {
    if (filter === "pending") return r.status === "pending";
    if (filter === "approved") return r.status === "approved";
    if (filter === "needs_correction") return r.status === "needs_correction";
    return true; // 'all'
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
        <div>
          <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Occupational Verification Workflow
          </span>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "var(--text-heading)", margin: "4px 0 0" }}>
            Program Completion Review Queue
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", margin: "4px 0 0" }}>
            Review employee curriculum logs, evaluate consistency, and approve official corporate certificate issuance.
          </p>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <Link to="/trainer/dashboard" className="btn-secondary">
            Trainer Overview
          </Link>
          <Link to="/trainer/employees" className="btn-primary">
            <span>Assigned Roster</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: 8, borderBottom: "1px solid var(--border-subtle)", paddingBottom: 8, flexWrap: "wrap" }}>
        {[
          { key: "pending", label: `Pending Reviews (${reviews.filter((r) => r.status === "pending").length})` },
          { key: "approved", label: `Verified (${reviews.filter((r) => r.status === "approved").length})` },
          { key: "needs_correction", label: `Corrections Requested (${reviews.filter((r) => r.status === "needs_correction").length})` },
          { key: "all", label: `All Submissions (${reviews.length})` },
        ].map((tab) => {
          const isActive = filter === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilter(tab.key)}
              style={{
                background: isActive ? "var(--color-primary-light)" : "transparent",
                border: "none",
                borderRadius: 6,
                padding: "8px 16px",
                color: isActive ? "var(--color-primary)" : "var(--text-muted)",
                fontWeight: isActive ? 700 : 500,
                fontSize: "13.5px",
                cursor: "pointer",
                transition: "all 0.15s ease"
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Reviews Table / List */}
      {filteredReviews.length === 0 ? (
        <div className="corporate-card" style={{ padding: "48px 32px", textAlign: "center", maxWidth: "600px", margin: "20px auto" }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "#E8F5F1",
              color: "var(--color-primary)",
              display: "grid",
              placeItems: "center",
              margin: "0 auto 16px"
            }}
          >
            <CheckCircle2 size={28} />
          </div>
          <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-heading)", marginBottom: 6 }}>
            {filter === "pending" ? "All Caught Up!" : "No Submissions Found"}
          </h3>
          <p style={{ fontSize: "13.5px", color: "var(--text-muted)", lineHeight: 1.5, margin: 0 }}>
            {filter === "pending"
              ? "There are currently no employee submissions awaiting your clinical review. When an employee completes all sessions in a program and submits for verification, their record will appear here."
              : "No records match your selected filter."}
          </p>
        </div>
      ) : (
        <div className="corporate-card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13.5px" }}>
              <thead>
                <tr style={{ background: "#F8FAF9", borderBottom: "1px solid var(--border-subtle)", color: "var(--text-muted)", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  <th style={{ padding: "14px 20px" }}>Employee</th>
                  <th style={{ padding: "14px 20px" }}>Department</th>
                  <th style={{ padding: "14px 20px" }}>Wellbeing Program</th>
                  <th style={{ padding: "14px 20px" }}>Sessions</th>
                  <th style={{ padding: "14px 20px" }}>Submitted On</th>
                  <th style={{ padding: "14px 20px" }}>Status</th>
                  <th style={{ padding: "14px 20px", textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredReviews.map((rev) => {
                  const isPending = rev.status === "pending";
                  const isApproved = rev.status === "approved";
                  const isCorrection = rev.status === "needs_correction";

                  return (
                    <tr
                      key={rev.id}
                      style={{
                        borderBottom: "1px solid var(--border-subtle)",
                        transition: "background 0.15s ease",
                      }}
                    >
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: "50%",
                              background: "var(--color-primary-light)",
                              color: "var(--color-primary)",
                              display: "grid",
                              placeItems: "center",
                              fontWeight: 700,
                              fontSize: "13px"
                            }}
                          >
                            {rev.employeeName?.charAt(0) || "E"}
                          </div>
                          <div>
                            <strong style={{ display: "block", color: "var(--text-heading)" }}>{rev.employeeName}</strong>
                            <span style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>{rev.employeeEmail}</span>
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: "16px 20px", color: "var(--text-body)" }}>
                        {rev.department}
                      </td>

                      <td style={{ padding: "16px 20px" }}>
                        <strong style={{ color: "var(--text-heading)", display: "block" }}>{rev.programName}</strong>
                        <span style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>{rev.programDuration}</span>
                      </td>

                      <td style={{ padding: "16px 20px" }}>
                        <span style={{ fontWeight: 600, color: "var(--color-primary)" }}>
                          {rev.sessionsCompleted} / {rev.totalSessions} (100%)
                        </span>
                      </td>

                      <td style={{ padding: "16px 20px", color: "var(--text-muted)" }}>
                        {rev.submittedAt}
                      </td>

                      <td style={{ padding: "16px 20px" }}>
                        <span
                          className={`badge ${
                            isApproved
                              ? "badge-low"
                              : isPending
                              ? "badge-mod"
                              : isCorrection
                              ? "badge-high"
                              : "badge-neutral"
                          }`}
                        >
                          {isApproved ? "Approved & Verified" : isPending ? "Pending Review" : "Correction Requested"}
                        </span>
                      </td>

                      <td style={{ padding: "16px 20px", textAlign: "right" }}>
                        <button
                          type="button"
                          onClick={() => navigate(`/trainer/reviews/${rev.id}`)}
                          className={isPending ? "btn-primary" : "btn-secondary"}
                          style={{ padding: "7px 14px", fontSize: "12.5px" }}
                        >
                          <span>{isPending ? "Review & Verify" : "View Record"}</span>
                          <ArrowRight size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
