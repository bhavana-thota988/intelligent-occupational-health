import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  TrendingDown,
  Calendar,
  CheckSquare,
  Square,
  Award,
  ArrowRight,
  ShieldCheck,
  Activity,
  UserCheck
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from "recharts";
import { employeeService } from "../../services/employeeService";
import StatCard from "../../components/common/StatCard";
import Toast from "../../components/common/Toast";

export default function MyProgress() {
  const [progressData, setProgressData] = useState(employeeService.getProgressData());
  const [habits, setHabits] = useState(progressData.weeklyHabits);
  const [toastMessage, setToastMessage] = useState("");

  const toggleDayHabit = (habitId, dayIndex) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === habitId) {
          const updatedDays = [...h.days];
          updatedDays[dayIndex] = !updatedDays[dayIndex];
          return { ...h, days: updatedDays };
        }
        return h;
      })
    );
    setToastMessage("Daily workplace habit logged successfully.");
  };

  const daysLabels = ["Mon", "Tue", "Wed", "Thu", "Fri"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: "1200px", margin: "0 auto" }}>
      {/* Top Banner */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
        <div>
          <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Longitudinal Health Metrics
          </span>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "var(--text-heading)", margin: "4px 0 0" }}>
            My Health & Risk Reduction Progress
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", margin: "4px 0 0" }}>
            Track historical assessment scores, intervention adherence, and daily workstation wellbeing habits.
          </p>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <Link to="/employee/assessment" className="btn-secondary">
            Retake Assessment
          </Link>
          <Link to="/employee/my-programs" className="btn-primary">
            <span>Continue Courses</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 18 }}>
        <StatCard
          title="Current Overall Risk"
          value={`${progressData.kpis.currentRisk}%`}
          subtitle="Latest screening benchmark"
          icon={Activity}
          badgeText="Improving"
          badgeType="success"
        />
        <StatCard
          title="Risk Reduction Trend"
          value={`${progressData.kpis.improvementPct}%`}
          subtitle="Net decline in strain since baseline"
          icon={TrendingDown}
          badgeText="Positive"
          badgeType="success"
        />
        <StatCard
          title="Active Interventions"
          value={`${progressData.kpis.programsActive} Programs`}
          subtitle="Ergonomics and movement track"
          icon={Award}
          badgeText="On Track"
          badgeType="success"
        />
        <StatCard
          title="Adherence Streak"
          value={`${progressData.kpis.streakDays} Days`}
          subtitle="Consistent habit completion"
          icon={ShieldCheck}
          badgeText="Active"
          badgeType="success"
        />
      </div>

      {/* Longitudinal Risk Trend Line Chart */}
      <div className="corporate-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <h3 style={{ fontSize: "17px", fontWeight: 700, color: "var(--text-heading)" }}>
              Workplace Risk Trajectory Over Time
            </h3>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: 0 }}>
              Tracking reduction across posture, activity, stress, and recovery dimensions
            </p>
          </div>
          <span className="badge badge-low">Downward Trend (-24%)</span>
        </div>

        <div style={{ height: 300, width: "100%" }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={progressData.scoreHistory} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E4EFEA" />
              <XAxis dataKey="date" tick={{ fill: "#6D817D", fontSize: 12 }} />
              <YAxis domain={[0, 100]} tick={{ fill: "#6D817D", fontSize: 12 }} />
              <Tooltip
                formatter={(val) => [`${val}%`, ""]}
                contentStyle={{ backgroundColor: "#FFFFFF", borderRadius: 8, border: "1px solid var(--border-subtle)" }}
              />
              <Legend wrapperStyle={{ paddingTop: 14, fontSize: "12px" }} />
              <Line type="monotone" dataKey="score" name="Overall Risk" stroke="#147D75" strokeWidth={3} dot={{ r: 5 }} />
              <Line type="monotone" dataKey="posture" name="Posture Strain" stroke="#C97A1C" strokeWidth={2} strokeDasharray="4 4" />
              <Line type="monotone" dataKey="stress" name="Stress Load" stroke="#C93B3B" strokeWidth={2} strokeDasharray="4 4" />
              <Line type="monotone" dataKey="recovery" name="Recovery Deficit" stroke="#4F6D7A" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Visual Wellbeing Journey Timeline (Section 41) */}
      <div className="corporate-card">
        <div style={{ marginBottom: 18 }}>
          <h3 style={{ fontSize: "17px", fontWeight: 700, color: "var(--text-heading)", margin: "0 0 4px 0" }}>
            Workplace Wellbeing Journey Milestones
          </h3>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: 0 }}>
            Your continuous journey from baseline risk screening to certified ergonomic compliance
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
          {(progressData.journeyMilestones || []).map((m, idx) => (
            <div
              key={idx}
              style={{
                padding: "16px",
                borderRadius: 8,
                background: m.status === "completed" ? "#E8F5F1" : m.status === "in_progress" ? "#FEF9EE" : "#F8FAF9",
                border: m.status === "completed" ? "1px solid #B8E4D7" : m.status === "in_progress" ? "1px solid #F5E0B8" : "1px solid var(--border-subtle)",
                display: "flex",
                flexDirection: "column",
                gap: 8
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    background: m.status === "completed" ? "var(--color-primary)" : m.status === "in_progress" ? "#C97A1C" : "#A0B0AD",
                    color: "#FFFFFF",
                    display: "grid",
                    placeItems: "center",
                    fontSize: "11px",
                    fontWeight: 800
                  }}
                >
                  {idx + 1}
                </span>
                <span
                  className={`badge ${
                    m.status === "completed" ? "badge-low" : m.status === "in_progress" ? "badge-mod" : "badge-neutral"
                  }`}
                  style={{ fontSize: "10.5px" }}
                >
                  {m.status === "completed" ? "Completed" : m.status === "in_progress" ? "In Progress" : "Upcoming"}
                </span>
              </div>

              <strong style={{ fontSize: "13.5px", color: "var(--text-heading)", lineHeight: 1.3 }}>
                {m.title}
              </strong>

              <span style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>
                {m.date}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Workplace Habit Tracker */}
      <div className="corporate-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div>
            <h3 style={{ fontSize: "17px", fontWeight: 700, color: "var(--text-heading)" }}>
              Weekly Workstation Adherence Checklist
            </h3>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: 0 }}>
              Click each day's box to toggle completion of recommended micro-routines
            </p>
          </div>
          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Current Week (Mon - Fri)</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {habits.map((habit) => (
            <div
              key={habit.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "14px 18px",
                borderRadius: 8,
                background: "#F8FAF9",
                border: "1px solid var(--border-subtle)",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-heading)", flex: 1, minWidth: "220px" }}>
                {habit.title}
              </span>

              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                {habit.days.map((isDone, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleDayHabit(habit.id, idx)}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 4,
                      padding: "4px 8px",
                      borderRadius: 6,
                      background: isDone ? "var(--color-primary-light)" : "#FFFFFF",
                      border: isDone ? "1px solid var(--color-primary)" : "1px solid var(--border-subtle)",
                      color: isDone ? "var(--color-primary)" : "var(--text-muted)",
                      cursor: "pointer",
                    }}
                  >
                    <span style={{ fontSize: "10px", fontWeight: 700 }}>{daysLabels[idx]}</span>
                    {isDone ? <CheckSquare size={16} /> : <Square size={16} />}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Toast message={toastMessage} onClose={() => setToastMessage("")} />
    </div>
  );
}
