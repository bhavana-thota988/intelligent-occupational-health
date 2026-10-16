import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BookOpen,
  Calendar,
  FolderOpen,
  Users,
  Plus,
  ArrowRight,
  Clock,
  MapPin,
  TrendingUp,
  FileText,
  Activity,
  CheckCircle2,
  BarChart3
} from "lucide-react";
import { adminService } from "../../services/adminService";
import StatusBadge from "../../components/admin/StatusBadge";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [toastMessage, setToastMessage] = useState(null);
  const [liveTime, setLiveTime] = useState(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));

  useEffect(() => {
    loadDashboard();
    const interval = setInterval(() => {
      setLiveTime(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleQuickCheckIn = async (campaign) => {
    const newReg = (campaign.registrations || campaign.registrationsCount || 0) + 1;
    await adminService.updateCampaign(campaign.id, {
      ...campaign,
      registrationsCount: newReg
    });
    showToast(`Registered new walk-in attendee for "${campaign.name}"! (${newReg} participants)`);
    loadDashboard();
  };

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const res = await adminService.getDashboardStats();
      setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !data) {
    return (
      <div style={{ padding: "40px 20px", textAlign: "center", color: "#64748B" }}>
        <div className="spinner" style={{ margin: "0 auto 12px" }} />
        <span>Loading Public Health Administration metrics...</span>
      </div>
    );
  }

  const { summary, upcomingCampaigns, recentArticles, recentActivity } = data || {
    summary: { totalPublishedArticles: 0, upcomingCampaigns: 0, publishedHealthResources: 0, totalCampaignParticipants: 0 },
    upcomingCampaigns: [],
    recentArticles: [],
    recentActivity: []
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: "1280px", margin: "0 auto", position: "relative" }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "28px",
            right: "28px",
            backgroundColor: "#0F172A",
            color: "#FFFFFF",
            padding: "12px 20px",
            borderRadius: "8px",
            fontSize: "0.875rem",
            fontWeight: "500",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}
        >
          <CheckCircle2 size={18} color="#10B981" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Live System Operational Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#FFFFFF",
          borderRadius: "8px",
          border: "1px solid #E2E8F0",
          padding: "10px 18px",
          fontSize: "12px",
          color: "#475569"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#0F766E", fontWeight: 700 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#10B981", boxShadow: "0 0 0 2px rgba(16, 185, 129, 0.3)" }} />
            REST Engine Active (Port 8000)
          </span>
          <span>•</span>
          <span>SQLite Database Synchronized</span>
          <span>•</span>
          <span>Directorate Session: Lead Health Admin</span>
        </div>
        <div style={{ fontWeight: 600, color: "#0F172A", fontFamily: "monospace" }}>
          LIVE: {liveTime}
        </div>
      </div>

      {/* Header Banner */}
      <div
        className="corporate-card"
        style={{
          background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
          color: "#FFFFFF",
          padding: "28px 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
          borderRadius: "12px",
          border: "1px solid #334155"
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: "11px", letterSpacing: "0.08em", fontWeight: 700, color: "#2DD4BF", textTransform: "uppercase" }}>
              Public Health Directorate Administration
            </span>
          </div>
          <h1 style={{ fontSize: "26px", fontWeight: 800, color: "#FFFFFF", margin: "0 0 6px 0", letterSpacing: "-0.02em" }}>
            Public Health Dashboard
          </h1>
          <p style={{ fontSize: "13.5px", color: "#94A3B8", margin: 0, maxWidth: "660px", lineHeight: 1.5 }}>
            Manage community wellness campaigns, publish clinical education articles, organize resources, and track population health participation.
          </p>
        </div>

        {/* Quick Actions Header Buttons */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            onClick={() => navigate("/admin/awareness")}
            style={{
              padding: "9px 16px",
              borderRadius: "8px",
              backgroundColor: "#0F766E",
              color: "#FFFFFF",
              border: "none",
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 6
            }}
          >
            <Plus size={15} />
            <span>Create Article</span>
          </button>
          <button
            onClick={() => navigate("/admin/campaigns")}
            style={{
              padding: "9px 16px",
              borderRadius: "8px",
              backgroundColor: "rgba(255, 255, 255, 0.12)",
              color: "#FFFFFF",
              border: "1px solid rgba(255, 255, 255, 0.25)",
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 6
            }}
          >
            <Calendar size={15} />
            <span>Schedule Campaign</span>
          </button>
        </div>
      </div>

      {/* 4 Database-Backed Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 18 }}>
        {/* Total Published Articles */}
        <div className="corporate-card" style={{ padding: "22px 24px", border: "1px solid #E2E8F0", background: "#FFFFFF", borderRadius: "10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
            <span style={{ fontSize: "12.5px", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Total Published Articles
            </span>
            <div style={{ width: 38, height: 38, borderRadius: "8px", background: "#F0FDFA", color: "#0F766E", display: "grid", placeItems: "center" }}>
              <BookOpen size={18} />
            </div>
          </div>
          <div style={{ fontSize: "30px", fontWeight: 800, color: "#0F172A", lineHeight: 1.1, marginBottom: 6 }}>
            {summary.totalPublishedArticles}
          </div>
          <span style={{ fontSize: "12px", color: "#0F766E", fontWeight: 600 }}>
            Active Educational Guides
          </span>
        </div>

        {/* Upcoming Campaigns */}
        <div className="corporate-card" style={{ padding: "22px 24px", border: "1px solid #E2E8F0", background: "#FFFFFF", borderRadius: "10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
            <span style={{ fontSize: "12.5px", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Upcoming Campaigns
            </span>
            <div style={{ width: 38, height: 38, borderRadius: "8px", background: "#EFF6FF", color: "#1D4ED8", display: "grid", placeItems: "center" }}>
              <Calendar size={18} />
            </div>
          </div>
          <div style={{ fontSize: "30px", fontWeight: 800, color: "#0F172A", lineHeight: 1.1, marginBottom: 6 }}>
            {summary.upcomingCampaigns}
          </div>
          <span style={{ fontSize: "12px", color: "#1D4ED8", fontWeight: 600 }}>
            Scheduled Community Drives
          </span>
        </div>

        {/* Published Health Resources */}
        <div className="corporate-card" style={{ padding: "22px 24px", border: "1px solid #E2E8F0", background: "#FFFFFF", borderRadius: "10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
            <span style={{ fontSize: "12.5px", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Published Resources
            </span>
            <div style={{ width: 38, height: 38, borderRadius: "8px", background: "#F5F3FF", color: "#7C3AED", display: "grid", placeItems: "center" }}>
              <FolderOpen size={18} />
            </div>
          </div>
          <div style={{ fontSize: "30px", fontWeight: 800, color: "#0F172A", lineHeight: 1.1, marginBottom: 6 }}>
            {summary.publishedHealthResources}
          </div>
          <span style={{ fontSize: "12px", color: "#7C3AED", fontWeight: 600 }}>
            PDFs, Posters & Videos
          </span>
        </div>

        {/* Total Campaign Participants */}
        <div className="corporate-card" style={{ padding: "22px 24px", border: "1px solid #E2E8F0", background: "#FFFFFF", borderRadius: "10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
            <span style={{ fontSize: "12.5px", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Campaign Participants
            </span>
            <div style={{ width: 38, height: 38, borderRadius: "8px", background: "#ECFDF5", color: "#047857", display: "grid", placeItems: "center" }}>
              <Users size={18} />
            </div>
          </div>
          <div style={{ fontSize: "30px", fontWeight: 800, color: "#0F172A", lineHeight: 1.1, marginBottom: 6 }}>
            {summary.totalCampaignParticipants}
          </div>
          <span style={{ fontSize: "12px", color: "#047857", fontWeight: 600 }}>
            Total Registrations Tracked
          </span>
        </div>
      </div>

      {/* Quick Action Navigation Bar */}
      <div
        className="corporate-card"
        style={{
          padding: "16px 20px",
          background: "#FFFFFF",
          border: "1px solid #E2E8F0",
          borderRadius: "10px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12
        }}
      >
        <span style={{ fontSize: "12.5px", fontWeight: 700, color: "#334155" }}>
          Administrative Quick Actions:
        </span>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            onClick={() => navigate("/admin/awareness", { state: { openCreate: true } })}
            style={{ padding: "7px 14px", borderRadius: "6px", background: "#F0FDFA", color: "#0F766E", border: "1px solid #99F6E4", fontSize: "12.5px", fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            <Plus size={14} />
            <span>Create Article</span>
          </button>
          <button
            onClick={() => navigate("/admin/campaigns", { state: { openCreate: true } })}
            style={{ padding: "7px 14px", borderRadius: "6px", background: "#EFF6FF", color: "#1D4ED8", border: "1px solid #BFDBFE", fontSize: "12.5px", fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            <Calendar size={14} />
            <span>Schedule Campaign</span>
          </button>
          <button
            onClick={() => navigate("/admin/resources", { state: { openCreate: true } })}
            style={{ padding: "7px 14px", borderRadius: "6px", background: "#F5F3FF", color: "#7C3AED", border: "1px solid #DDD6FE", fontSize: "12.5px", fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            <FolderOpen size={14} />
            <span>Upload Resource</span>
          </button>
          <button
            onClick={() => navigate("/admin/reports")}
            style={{ padding: "7px 14px", borderRadius: "6px", background: "#F8FAFC", color: "#0F172A", border: "1px solid #CBD5E1", fontSize: "12.5px", fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            <BarChart3 size={14} />
            <span>View Reports</span>
          </button>
        </div>
      </div>

      {/* TWO COLUMN GRID: Upcoming Campaigns & Recently Published Articles */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(460px, 1fr))", gap: 20 }}>
        {/* Upcoming Campaigns Section */}
        <div className="corporate-card" style={{ padding: "24px", background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <h2 style={{ fontSize: "16px", fontWeight: 800, color: "#0F172A", margin: "0 0 2px 0" }}>
                Upcoming Community Campaigns
              </h2>
              <span style={{ fontSize: "12px", color: "#64748B" }}>
                Scheduled health screenings and awareness drives
              </span>
            </div>
            <Link to="/admin/campaigns" style={{ fontSize: "12.5px", fontWeight: 700, color: "#0F766E", display: "inline-flex", alignItems: "center", gap: 4 }}>
              <span>View All</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {upcomingCampaigns.length === 0 ? (
              <div style={{ padding: "24px", textAlign: "center", color: "#94A3B8", fontSize: "13px" }}>
                No upcoming campaigns currently scheduled.
              </div>
            ) : (
              upcomingCampaigns.map((c) => (
                <div
                  key={c.id}
                  style={{
                    padding: "14px 16px",
                    borderRadius: "8px",
                    backgroundColor: "#F8FAFC",
                    border: "1px solid #E2E8F0",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 14
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
                    {c.coverImage ? (
                      <img
                        src={c.coverImage}
                        alt={c.name}
                        style={{ width: 52, height: 52, borderRadius: 8, objectFit: "cover", flexShrink: 0, border: "1px solid #E2E8F0" }}
                      />
                    ) : (
                      <div style={{ width: 52, height: 52, borderRadius: 8, backgroundColor: "#E0F2FE", color: "#0284C7", display: "grid", placeItems: "center", flexShrink: 0 }}>
                        <Calendar size={22} />
                      </div>
                    )}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <strong style={{ fontSize: "13.5px", color: "#0F172A" }}>{c.name}</strong>
                        <StatusBadge status={c.status} />
                      </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: "12px", color: "#64748B" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                        <Clock size={12} />
                        {c.date} ({c.time})
                      </span>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                        <MapPin size={12} />
                        {c.venue.split(",")[0]}
                      </span>
                    </div>
                  </div>
                </div>
                  <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                    <div>
                      <span style={{ fontSize: "12px", fontWeight: 700, color: "#0F766E", display: "block" }}>
                        {c.registrations || c.registrationsCount || 0} / {c.capacity}
                      </span>
                      <span style={{ fontSize: "11px", color: "#94A3B8" }}>Registered</span>
                    </div>
                    <button
                      onClick={() => handleQuickCheckIn(c)}
                      style={{
                        padding: "4px 8px",
                        borderRadius: "5px",
                        backgroundColor: "#F0FDFA",
                        border: "1px solid #99F6E4",
                        color: "#0F766E",
                        fontSize: "11px",
                        fontWeight: 700,
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 3
                      }}
                      title="Simulate on-site walk-in attendee registration"
                    >
                      <Plus size={11} />
                      <span>Walk-in (+1)</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recently Published Articles Section */}
        <div className="corporate-card" style={{ padding: "24px", background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <h2 style={{ fontSize: "16px", fontWeight: 800, color: "#0F172A", margin: "0 0 2px 0" }}>
                Recently Published Health Articles
              </h2>
              <span style={{ fontSize: "12px", color: "#64748B" }}>
                Clinical guidance and public disease prevention topics
              </span>
            </div>
            <Link to="/admin/awareness" style={{ fontSize: "12.5px", fontWeight: 700, color: "#0F766E", display: "inline-flex", alignItems: "center", gap: 4 }}>
              <span>View All</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {recentArticles.length === 0 ? (
              <div style={{ padding: "24px", textAlign: "center", color: "#94A3B8", fontSize: "13px" }}>
                No articles published yet.
              </div>
            ) : (
              recentArticles.map((a) => (
                <div
                  key={a.id}
                  style={{
                    padding: "14px 16px",
                    borderRadius: "8px",
                    backgroundColor: "#F8FAFC",
                    border: "1px solid #E2E8F0",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 12
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <strong style={{ fontSize: "13.5px", color: "#0F172A" }}>{a.title}</strong>
                      <StatusBadge status={a.status} />
                    </div>
                    <div style={{ fontSize: "12px", color: "#64748B" }}>
                      <span style={{ fontWeight: 600, color: "#0F766E" }}>{a.category}</span>
                      <span> • By {a.author}</span>
                      <span> • {a.publicationDate}</span>
                    </div>
                  </div>
                  <Link
                    to="/admin/awareness"
                    style={{
                      padding: "6px 10px",
                      borderRadius: "6px",
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #CBD5E1",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#0F172A",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4
                    }}
                  >
                    <span>Inspect</span>
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity Audit Trail */}
      <div className="corporate-card" style={{ padding: "24px", background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "10px" }}>
        <h2 style={{ fontSize: "16px", fontWeight: 800, color: "#0F172A", margin: "0 0 14px 0" }}>
          Recent Public Health Administration Activity
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {recentActivity.map((act) => (
            <div
              key={act.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 14px",
                borderRadius: "6px",
                backgroundColor: "#F8FAFC",
                border: "1px solid #F1F5F9"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#0F766E" }} />
                <div>
                  <strong style={{ fontSize: "13px", color: "#0F172A" }}>{act.action}: </strong>
                  <span style={{ fontSize: "13px", color: "#475569" }}>{act.detail}</span>
                </div>
              </div>
              <span style={{ fontSize: "11.5px", color: "#94A3B8" }}>{act.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
