import React, { useState, useEffect } from "react";
import {
  Calendar,
  Plus,
  Search,
  Filter,
  MapPin,
  Clock,
  Users,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Edit3,
  Trash2,
  Phone,
  Mail,
  X,
  TrendingUp,
  Award
} from "lucide-react";
import { adminService } from "../../services/adminService";
import StatusBadge from "../../components/admin/StatusBadge";
import ConfirmDialog from "../../components/admin/ConfirmDialog";

const CAMPAIGN_TYPES = [
  "Screening Drive",
  "Workshop & Screening",
  "Vaccination Camp",
  "Cardiovascular Health Drive",
  "Ergonomics & Posture Clinic",
  "Nutritional Counseling Camp"
];

const PRESET_CAMPAIGN_IMAGES = [
  { label: "Cardio & BP Camp", url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop" },
  { label: "Diabetes Screening", url: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&auto=format&fit=crop" },
  { label: "Posture & Spine Clinic", url: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop" },
  { label: "Community 5K Walkathon", url: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&auto=format&fit=crop" },
  { label: "Vaccination Camp", url: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop" }
];

export default function CommunityCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [detailCampaign, setDetailCampaign] = useState(null);
  const [rosterCampaign, setRosterCampaign] = useState(null);

  // Form Fields
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    campaignType: CAMPAIGN_TYPES[0],
    coverImage: PRESET_CAMPAIGN_IMAGES[0].url,
    date: "",
    time: "09:00 AM - 01:00 PM",
    venue: "",
    registrationDeadline: "",
    capacity: 100,
    contactDetails: "",
    status: "Upcoming"
  });
  const [formErrors, setFormErrors] = useState({});

  // Confirmation dialog
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    title: "",
    message: "",
    variant: "danger",
    action: null
  });

  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    setLoading(true);
    try {
      const data = await adminService.getCampaigns();
      const withCovers = (data || []).map((c, idx) => ({
        ...c,
        coverImage: c.coverImage || c.cover_image || PRESET_CAMPAIGN_IMAGES[idx % PRESET_CAMPAIGN_IMAGES.length].url
      }));
      setCampaigns(withCovers);
    } catch (e) {
      console.error("Failed to load campaigns:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingCampaign(null);
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const deadline = new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000);

    setFormData({
      name: "",
      description: "",
      campaignType: CAMPAIGN_TYPES[0],
      coverImage: PRESET_CAMPAIGN_IMAGES[0].url,
      date: nextWeek.toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" }),
      time: "09:00 AM - 02:00 PM",
      venue: "",
      registrationDeadline: deadline.toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" }),
      capacity: 100,
      contactDetails: "community-health@portal.org | (555) 789-0123",
      status: "Upcoming"
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const handleOpenEdit = (c) => {
    setEditingCampaign(c);
    setFormData({
      name: c.name || "",
      description: c.description || "",
      campaignType: c.campaignType || CAMPAIGN_TYPES[0],
      coverImage: c.coverImage || c.cover_image || PRESET_CAMPAIGN_IMAGES[0].url,
      date: c.date || "",
      time: c.time || "",
      venue: c.venue || "",
      registrationDeadline: c.registrationDeadline || "",
      capacity: c.capacity || 100,
      contactDetails: c.contactDetails || "",
      status: c.status || "Upcoming"
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Campaign name is required.";
    if (!formData.venue.trim()) errs.venue = "Venue location is required.";
    if (!formData.date.trim()) errs.date = "Event date is required.";
    if (!formData.time.trim()) errs.time = "Event hours/time are required.";
    if (!formData.registrationDeadline.trim()) errs.registrationDeadline = "Registration deadline is required.";
    if (!formData.capacity || Number(formData.capacity) <= 0) errs.capacity = "Capacity must be greater than 0.";
    if (!formData.contactDetails.trim()) errs.contactDetails = "Contact information is required.";
    if (!formData.description.trim()) errs.description = "Clinical scope / description is required.";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmitForm = async () => {
    if (!validateForm()) return;

    const payload = {
      ...formData,
      capacity: parseInt(formData.capacity, 10)
    };

    if (editingCampaign) {
      await adminService.updateCampaign(editingCampaign.id, payload);
      showToast("Campaign updated successfully!");
    } else {
      await adminService.createCampaign(payload);
      showToast("New campaign scheduled successfully!");
    }

    setIsFormOpen(false);
    loadCampaigns();
  };

  const handleQuickRegister = async (campaign) => {
    const updated = (campaign.registrationsCount || 0) + 1;
    await adminService.updateCampaign(campaign.id, {
      ...campaign,
      registrationsCount: updated
    });
    showToast(`Walk-in registration added for "${campaign.name}"! (${updated} registered)`);
    loadCampaigns();
  };

  const handleQuickCheckIn = async (campaign) => {
    const updated = (campaign.attendanceCount || 0) + 1;
    await adminService.updateCampaign(campaign.id, {
      ...campaign,
      attendanceCount: updated
    });
    showToast(`Checked in attendee #${updated} on-site at "${campaign.name}"!`);
    loadCampaigns();
  };

  const handleStatusChange = async (campaign, newStatus) => {
    await adminService.updateCampaignStatus(campaign.id, newStatus);
    showToast(`Campaign status marked as ${newStatus}.`);
    loadCampaigns();
  };

  const confirmCancel = (campaign) => {
    setConfirmState({
      isOpen: true,
      title: "Cancel Campaign",
      message: `Are you sure you want to cancel "${campaign.name}"? Registered attendees will be notified of cancellation.`,
      variant: "danger",
      action: async () => {
        await adminService.updateCampaignStatus(campaign.id, "Cancelled");
        setConfirmState({ ...confirmState, isOpen: false });
        showToast("Campaign cancelled.");
        loadCampaigns();
      }
    });
  };

  const confirmDelete = (campaign) => {
    setConfirmState({
      isOpen: true,
      title: "Delete Campaign",
      message: `Permanently delete "${campaign.name}"? All related capacity tallies will be cleared.`,
      variant: "danger",
      action: async () => {
        await adminService.deleteCampaign(campaign.id);
        setConfirmState({ ...confirmState, isOpen: false });
        showToast("Campaign deleted.");
        loadCampaigns();
      }
    });
  };

  // Metrics summary
  const totalCampaigns = campaigns.length;
  const upcomingCount = campaigns.filter((c) => c.status === "Upcoming").length;
  const totalRegistrations = campaigns.reduce((acc, c) => acc + (c.registrationsCount || 0), 0);
  const totalAttendance = campaigns.reduce((acc, c) => acc + (c.attendanceCount || 0), 0);

  // Filtered List
  const filteredCampaigns = campaigns.filter((c) => {
    const matchesSearch =
      c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.venue?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.campaignType?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === "ALL" || c.status?.toLowerCase() === activeTab.toLowerCase();
    return matchesSearch && matchesTab;
  });

  return (
    <div style={{ padding: "28px 32px", maxWidth: "1400px", margin: "0 auto" }}>
      {/* Toast */}
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

      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "28px",
          flexWrap: "wrap",
          gap: "16px"
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
            <span
              style={{
                display: "inline-flex",
                padding: "6px",
                borderRadius: "8px",
                backgroundColor: "#EFF6FF",
                color: "#0284C7"
              }}
            >
              <Calendar size={20} />
            </span>
            <h1
              style={{
                fontSize: "1.625rem",
                fontWeight: "700",
                color: "#0F172A",
                margin: 0,
                letterSpacing: "-0.02em"
              }}
            >
              Community Health Campaigns
            </h1>
          </div>
          <p style={{ margin: 0, color: "#64748B", fontSize: "0.9375rem" }}>
            Organize local diagnostic screenings, metabolic health clinics, and community vaccination operations.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "#0D9488",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "8px",
            padding: "10px 18px",
            fontSize: "0.875rem",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
            transition: "all 0.15s ease"
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0F766E")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#0D9488")}
        >
          <Plus size={18} />
          <span>Schedule Campaign</span>
        </button>
      </div>

      {/* Summary Stat Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
          marginBottom: "24px"
        }}
      >
        <div style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "10px", padding: "16px 20px" }}>
          <div style={{ fontSize: "0.8125rem", color: "#64748B", fontWeight: "600", marginBottom: "4px" }}>Total Campaigns</div>
          <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#0F172A" }}>{totalCampaigns}</div>
        </div>
        <div style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "10px", padding: "16px 20px" }}>
          <div style={{ fontSize: "0.8125rem", color: "#64748B", fontWeight: "600", marginBottom: "4px" }}>Upcoming Active Drives</div>
          <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#0284C7" }}>{upcomingCount}</div>
        </div>
        <div style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "10px", padding: "16px 20px" }}>
          <div style={{ fontSize: "0.8125rem", color: "#64748B", fontWeight: "600", marginBottom: "4px" }}>Total Registrations</div>
          <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#0D9488" }}>{totalRegistrations}</div>
        </div>
        <div style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "10px", padding: "16px 20px" }}>
          <div style={{ fontSize: "0.8125rem", color: "#64748B", fontWeight: "600", marginBottom: "4px" }}>Confirmed Attendance</div>
          <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#10B981" }}>{totalAttendance}</div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "12px",
          border: "1px solid #E2E8F0",
          padding: "16px 20px",
          marginBottom: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          flexWrap: "wrap",
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)"
        }}
      >
        {/* Status Tabs */}
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {[
            { id: "ALL", label: "All" },
            { id: "Upcoming", label: "Upcoming" },
            { id: "Ongoing", label: "Ongoing" },
            { id: "Completed", label: "Completed" },
            { id: "Cancelled", label: "Cancelled" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "7px 14px",
                borderRadius: "6px",
                border: activeTab === tab.id ? "1px solid #0D9488" : "1px solid transparent",
                backgroundColor: activeTab === tab.id ? "#F0FDFA" : "#F8FAFC",
                color: activeTab === tab.id ? "#0F766E" : "#475569",
                fontSize: "0.8125rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.15s ease"
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: "relative", flex: "1 1 280px", maxWidth: "380px" }}>
          <Search
            size={18}
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#94A3B8"
            }}
          />
          <input
            type="text"
            placeholder="Search campaigns by name, venue..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 12px 8px 36px",
              borderRadius: "8px",
              border: "1px solid #CBD5E1",
              fontSize: "0.875rem",
              color: "#0F172A",
              outline: "none"
            }}
          />
        </div>
      </div>

      {/* Campaigns Table / Cards */}
      {loading ? (
        <div style={{ padding: "60px 0", textAlign: "center", color: "#64748B" }}>
          <div style={{ display: "inline-block", width: "32px", height: "32px", border: "3px solid #E2E8F0", borderTopColor: "#0D9488", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
          <p style={{ marginTop: "12px", fontSize: "0.875rem" }}>Loading campaigns from clinical registry...</p>
        </div>
      ) : filteredCampaigns.length === 0 ? (
        <div
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "12px",
            border: "1px solid #E2E8F0",
            padding: "48px 24px",
            textAlign: "center"
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              backgroundColor: "#F1F5F9",
              color: "#94A3B8",
              display: "grid",
              placeItems: "center",
              margin: "0 auto 16px"
            }}
          >
            <Calendar size={24} />
          </div>
          <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#1E293B", marginBottom: "6px" }}>
            No Campaigns Found
          </h3>
          <p style={{ color: "#64748B", fontSize: "0.875rem", maxWidth: "420px", margin: "0 auto 20px" }}>
            {searchTerm || activeTab !== "ALL"
              ? "No campaigns match your selected status tab or search keyword."
              : "No community health campaigns scheduled yet. Click Schedule Campaign to coordinate one."}
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {filteredCampaigns.map((c) => {
            const fillRatio = Math.min(100, Math.round(((c.registrationsCount || 0) / (c.capacity || 1)) * 100));

            return (
              <div
                key={c.id}
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "14px",
                  border: "1px solid #E2E8F0",
                  boxShadow: "0 2px 8px -2px rgba(15, 23, 42, 0.08)",
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                  transition: "transform 0.15s ease, box-shadow 0.15s ease"
                }}
              >
                {/* Neat Campaign Cover Photo Banner */}
                <div
                  style={{
                    height: "190px",
                    width: "100%",
                    position: "relative",
                    overflow: "hidden",
                    backgroundColor: "#0F172A"
                  }}
                >
                  <img
                    src={c.coverImage || PRESET_CAMPAIGN_IMAGES[0].url}
                    alt={c.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.95 }}
                    onError={(e) => {
                      e.target.src = PRESET_CAMPAIGN_IMAGES[0].url;
                    }}
                  />
                  {/* Subtle Dark Gradient Overlay for High Contrast Text */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(to top, rgba(15, 23, 42, 0.85) 0%, rgba(15, 23, 42, 0.2) 60%, rgba(15, 23, 42, 0.45) 100%)"
                    }}
                  />
                  {/* Top Badges */}
                  <div
                    style={{
                      position: "absolute",
                      top: "14px",
                      left: "16px",
                      display: "flex",
                      gap: "8px",
                      alignItems: "center"
                    }}
                  >
                    <span
                      style={{
                        backgroundColor: "rgba(15, 23, 42, 0.82)",
                        color: "#FFFFFF",
                        backdropFilter: "blur(6px)",
                        padding: "5px 12px",
                        borderRadius: "6px",
                        fontSize: "0.75rem",
                        fontWeight: "700",
                        letterSpacing: "0.02em",
                        border: "1px solid rgba(255, 255, 255, 0.2)"
                      }}
                    >
                      {c.campaignType}
                    </span>
                  </div>
                  <div style={{ position: "absolute", top: "14px", right: "16px" }}>
                    <StatusBadge status={c.status} />
                  </div>
                  {/* Title Overlaid on Photo */}
                  <div style={{ position: "absolute", bottom: "16px", left: "20px", right: "20px" }}>
                    <h3
                      style={{
                        fontSize: "1.25rem",
                        fontWeight: "800",
                        color: "#FFFFFF",
                        margin: 0,
                        lineHeight: 1.3,
                        textShadow: "0 2px 6px rgba(0, 0, 0, 0.6)"
                      }}
                    >
                      {c.name}
                    </h3>
                  </div>
                </div>

                {/* Card Body */}
                <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      flexWrap: "wrap",
                      gap: "14px"
                    }}
                  >
                    <p style={{ margin: 0, fontSize: "0.875rem", color: "#475569", lineHeight: "1.6", flex: "1 1 420px" }}>
                      {c.description}
                    </p>

                    {/* Actions */}
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                    <button
                      onClick={() => setRosterCampaign(c)}
                      title="View Clinical Attendee Roster & Vitals Screening Logs"
                      style={{
                        padding: "7px 12px",
                        borderRadius: "6px",
                        backgroundColor: "#F0FDFA",
                        border: "1px solid #99F6E4",
                        color: "#0F766E",
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px"
                      }}
                    >
                      <Users size={14} />
                      <span>Roster ({c.attendanceCount || 0})</span>
                    </button>

                    <button
                      onClick={() => handleOpenEdit(c)}
                      title="Edit Campaign"
                      style={{
                        padding: "7px 12px",
                        borderRadius: "6px",
                        backgroundColor: "#F8FAFC",
                        border: "1px solid #CBD5E1",
                        color: "#0284C7",
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px"
                      }}
                    >
                      <Edit3 size={14} />
                      <span>Edit</span>
                    </button>

                    {c.status !== "Completed" && c.status !== "Cancelled" && (
                      <button
                        onClick={() => handleStatusChange(c, "Completed")}
                        title="Mark as Completed"
                        style={{
                          padding: "7px 12px",
                          borderRadius: "6px",
                          backgroundColor: "#F0FDFA",
                          border: "1px solid #99F6E4",
                          color: "#0F766E",
                          fontSize: "0.75rem",
                          fontWeight: "600",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px"
                        }}
                      >
                        <CheckCircle2 size={14} />
                        <span>Complete</span>
                      </button>
                    )}

                    {c.status !== "Cancelled" && (
                      <button
                        onClick={() => confirmCancel(c)}
                        title="Cancel Campaign"
                        style={{
                          padding: "7px 12px",
                          borderRadius: "6px",
                          backgroundColor: "#FFFBEB",
                          border: "1px solid #FDE68A",
                          color: "#B45309",
                          fontSize: "0.75rem",
                          fontWeight: "600",
                          cursor: "pointer"
                        }}
                      >
                        Cancel
                      </button>
                    )}

                    <button
                      onClick={() => confirmDelete(c)}
                      title="Delete Campaign"
                      style={{
                        padding: "7px",
                        borderRadius: "6px",
                        backgroundColor: "#FEF2F2",
                        border: "1px solid #FECACA",
                        color: "#DC2626",
                        cursor: "pointer"
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Details Footer Bar with Live Walk-in Actions */}
                <div
                  style={{
                    backgroundColor: "#F8FAFC",
                    borderRadius: "8px",
                    padding: "12px 16px",
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: "14px",
                    fontSize: "0.8125rem",
                    border: "1px solid #F1F5F9"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#334155" }}>
                    <Calendar size={15} color="#0D9488" />
                    <div>
                      <span style={{ fontWeight: "600" }}>{c.date}</span>
                      <div style={{ fontSize: "0.75rem", color: "#64748B" }}>{c.time}</div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#334155" }}>
                    <MapPin size={15} color="#0284C7" />
                    <div>
                      <span style={{ fontWeight: "600" }}>{c.venue}</span>
                      <div style={{ fontSize: "0.75rem", color: "#64748B" }}>Venue</div>
                    </div>
                  </div>

                  {/* Registrations with Live Walk-in Increment */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.75rem" }}>
                      <span style={{ color: "#64748B" }}>Registrations:</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontWeight: "600", color: "#0F172A" }}>
                          {c.registrationsCount || 0} / {c.capacity}
                        </span>
                        <button
                          onClick={() => handleQuickRegister(c)}
                          title="Simulate Walk-in Registration (+1)"
                          style={{
                            padding: "2px 6px",
                            borderRadius: "4px",
                            backgroundColor: "#EFF6FF",
                            border: "1px solid #BFDBFE",
                            color: "#1D4ED8",
                            fontSize: "0.6875rem",
                            fontWeight: 700,
                            cursor: "pointer"
                          }}
                        >
                          + Walk-in
                        </button>
                      </div>
                    </div>
                    <div style={{ height: "6px", width: "100%", backgroundColor: "#E2E8F0", borderRadius: "3px", overflow: "hidden" }}>
                      <div
                        style={{
                          height: "100%",
                          width: `${fillRatio}%`,
                          backgroundColor: fillRatio >= 90 ? "#D97706" : "#0D9488",
                          borderRadius: "3px",
                          transition: "width 0.3s ease"
                        }}
                      />
                    </div>
                  </div>

                  {/* Attendance with Live On-site Check-in Increment */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", color: "#334155" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <Award size={15} color="#10B981" />
                      <div>
                        <span style={{ fontWeight: "600" }}>{c.attendanceCount || 0} verified</span>
                        <div style={{ fontSize: "0.75rem", color: "#64748B" }}>Actual Attendance</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleQuickCheckIn(c)}
                      title="Check in attendee at clinic triage desk"
                      style={{
                        padding: "3px 8px",
                        borderRadius: "5px",
                        backgroundColor: "#ECFDF5",
                        border: "1px solid #A7F3D0",
                        color: "#047857",
                        fontSize: "0.6875rem",
                        fontWeight: 700,
                        cursor: "pointer"
                      }}
                    >
                      ✓ Check-in
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {isFormOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(4px)",
            display: "grid",
            placeItems: "center",
            zIndex: 999,
            padding: "20px"
          }}
          onClick={() => setIsFormOpen(false)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "760px",
              maxHeight: "90vh",
              overflowY: "auto",
              backgroundColor: "#FFFFFF",
              borderRadius: "14px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              border: "1px solid #E2E8F0",
              padding: "28px"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingBottom: "16px",
                borderBottom: "1px solid #E2E8F0",
                marginBottom: "20px"
              }}
            >
              <div>
                <h2 style={{ fontSize: "1.25rem", fontWeight: "700", color: "#0F172A", margin: 0 }}>
                  {editingCampaign ? "Edit Campaign Details" : "Schedule New Health Campaign"}
                </h2>
                <p style={{ margin: "4px 0 0", fontSize: "0.8125rem", color: "#64748B" }}>
                  Set up date, venue capacity, clinical drive objectives, and attendee registration limits.
                </p>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#94A3B8",
                  cursor: "pointer",
                  padding: "4px"
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Name */}
              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: "600", color: "#1E293B", marginBottom: "6px" }}>
                  Campaign Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Community Blood Pressure & Cardiovascular Screening Camp"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: "8px",
                    border: formErrors.name ? "1px solid #DC2626" : "1px solid #CBD5E1",
                    fontSize: "0.875rem",
                    outline: "none"
                  }}
                />
                {formErrors.name && (
                  <span style={{ fontSize: "0.75rem", color: "#DC2626", marginTop: "4px", display: "block" }}>
                    {formErrors.name}
                  </span>
                )}
              </div>

              {/* Cover Image & Presets */}
              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: "600", color: "#1E293B", marginBottom: "6px" }}>
                  Campaign Cover Photo URL
                </label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: "8px",
                    border: "1px solid #CBD5E1",
                    fontSize: "0.875rem",
                    outline: "none",
                    marginBottom: "8px"
                  }}
                />
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "0.75rem", color: "#64748B" }}>Preset Photos:</span>
                  {PRESET_CAMPAIGN_IMAGES.map((img) => (
                    <button
                      key={img.label}
                      type="button"
                      onClick={() => setFormData({ ...formData, coverImage: img.url })}
                      style={{
                        padding: "3px 8px",
                        borderRadius: "4px",
                        backgroundColor: formData.coverImage === img.url ? "#E0F2FE" : "#F1F5F9",
                        color: formData.coverImage === img.url ? "#0284C7" : "#475569",
                        border: "1px solid #CBD5E1",
                        fontSize: "0.6875rem",
                        cursor: "pointer"
                      }}
                    >
                      {img.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Type & Status Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: "600", color: "#1E293B", marginBottom: "6px" }}>
                    Campaign Type *
                  </label>
                  <select
                    value={formData.campaignType}
                    onChange={(e) => setFormData({ ...formData, campaignType: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      borderRadius: "8px",
                      border: "1px solid #CBD5E1",
                      fontSize: "0.875rem",
                      backgroundColor: "#FFFFFF",
                      outline: "none"
                    }}
                  >
                    {CAMPAIGN_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: "600", color: "#1E293B", marginBottom: "6px" }}>
                    Operational Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      borderRadius: "8px",
                      border: "1px solid #CBD5E1",
                      fontSize: "0.875rem",
                      backgroundColor: "#FFFFFF",
                      outline: "none"
                    }}
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Date & Time Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: "600", color: "#1E293B", marginBottom: "6px" }}>
                    Event Date *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., October 28, 2026"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      borderRadius: "8px",
                      border: formErrors.date ? "1px solid #DC2626" : "1px solid #CBD5E1",
                      fontSize: "0.875rem",
                      outline: "none"
                    }}
                  />
                  {formErrors.date && (
                    <span style={{ fontSize: "0.75rem", color: "#DC2626", marginTop: "4px", display: "block" }}>
                      {formErrors.date}
                    </span>
                  )}
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: "600", color: "#1E293B", marginBottom: "6px" }}>
                    Hours / Time Window *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 09:00 AM - 02:00 PM"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      borderRadius: "8px",
                      border: formErrors.time ? "1px solid #DC2626" : "1px solid #CBD5E1",
                      fontSize: "0.875rem",
                      outline: "none"
                    }}
                  />
                </div>
              </div>

              {/* Venue */}
              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: "600", color: "#1E293B", marginBottom: "6px" }}>
                  Venue Location *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Community Health Center, Block A Auditorium"
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: "8px",
                    border: formErrors.venue ? "1px solid #DC2626" : "1px solid #CBD5E1",
                    fontSize: "0.875rem",
                    outline: "none"
                  }}
                />
                {formErrors.venue && (
                  <span style={{ fontSize: "0.75rem", color: "#DC2626", marginTop: "4px", display: "block" }}>
                    {formErrors.venue}
                  </span>
                )}
              </div>

              {/* Deadline & Capacity Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: "600", color: "#1E293B", marginBottom: "6px" }}>
                    Registration Deadline *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., October 26, 2026"
                    value={formData.registrationDeadline}
                    onChange={(e) => setFormData({ ...formData, registrationDeadline: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      borderRadius: "8px",
                      border: formErrors.registrationDeadline ? "1px solid #DC2626" : "1px solid #CBD5E1",
                      fontSize: "0.875rem",
                      outline: "none"
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: "600", color: "#1E293B", marginBottom: "6px" }}>
                    Maximum Capacity (Seats) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      borderRadius: "8px",
                      border: formErrors.capacity ? "1px solid #DC2626" : "1px solid #CBD5E1",
                      fontSize: "0.875rem",
                      outline: "none"
                    }}
                  />
                </div>
              </div>

              {/* Contact */}
              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: "600", color: "#1E293B", marginBottom: "6px" }}>
                  Contact Information & Inquiries *
                </label>
                <input
                  type="text"
                  placeholder="e.g., health-events@communitycare.org | (555) 234-5678"
                  value={formData.contactDetails}
                  onChange={(e) => setFormData({ ...formData, contactDetails: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: "8px",
                    border: formErrors.contactDetails ? "1px solid #DC2626" : "1px solid #CBD5E1",
                    fontSize: "0.875rem",
                    outline: "none"
                  }}
                />
              </div>

              {/* Description */}
              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: "600", color: "#1E293B", marginBottom: "6px" }}>
                  Clinical Objectives & Scope *
                </label>
                <textarea
                  rows={3}
                  placeholder="Explain diagnostic offerings, clinical staff attending, and guidelines for participants..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: "8px",
                    border: formErrors.description ? "1px solid #DC2626" : "1px solid #CBD5E1",
                    fontSize: "0.875rem",
                    outline: "none"
                  }}
                />
              </div>
            </div>

            {/* Actions */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "12px",
                marginTop: "24px",
                paddingTop: "16px",
                borderTop: "1px solid #E2E8F0"
              }}
            >
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                style={{
                  padding: "9px 16px",
                  borderRadius: "8px",
                  border: "1px solid #CBD5E1",
                  backgroundColor: "#FFFFFF",
                  color: "#475569",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  cursor: "pointer"
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSubmitForm}
                style={{
                  padding: "9px 20px",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: "#0D9488",
                  color: "#FFFFFF",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)"
                }}
              >
                {editingCampaign ? "Save Changes" : "Create Campaign"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CLINICAL ATTENDEE ROSTER MODAL */}
      {rosterCampaign && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(4px)",
            display: "grid",
            placeItems: "center",
            zIndex: 999,
            padding: "20px"
          }}
          onClick={() => setRosterCampaign(null)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "800px",
              maxHeight: "85vh",
              overflowY: "auto",
              backgroundColor: "#FFFFFF",
              borderRadius: "14px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              border: "1px solid #E2E8F0",
              padding: "28px"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                paddingBottom: "16px",
                borderBottom: "1px solid #E2E8F0",
                marginBottom: "20px"
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "#0F766E", textTransform: "uppercase", backgroundColor: "#F0FDFA", padding: "2px 8px", borderRadius: "4px" }}>
                    Clinical On-Site Roster
                  </span>
                  <StatusBadge status={rosterCampaign.status} />
                </div>
                <h2 style={{ fontSize: "1.25rem", fontWeight: "700", color: "#0F172A", margin: 0 }}>
                  {rosterCampaign.name}
                </h2>
                <div style={{ fontSize: "0.8125rem", color: "#64748B", marginTop: 4 }}>
                  {rosterCampaign.date} • {rosterCampaign.venue}
                </div>
              </div>
              <button
                onClick={() => setRosterCampaign(null)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#94A3B8",
                  cursor: "pointer",
                  padding: "4px"
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 12,
                backgroundColor: "#F8FAFC",
                borderRadius: "8px",
                padding: "12px 16px",
                marginBottom: "20px",
                border: "1px solid #E2E8F0"
              }}
            >
              <div>
                <div style={{ fontSize: "0.75rem", color: "#64748B" }}>Campaign Capacity</div>
                <div style={{ fontSize: "1.125rem", fontWeight: "700", color: "#0F172A" }}>{rosterCampaign.capacity}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.75rem", color: "#64748B" }}>Total Registered</div>
                <div style={{ fontSize: "1.125rem", fontWeight: "700", color: "#0284C7" }}>{rosterCampaign.registrationsCount || 0}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.75rem", color: "#64748B" }}>Verified Checked-in</div>
                <div style={{ fontSize: "1.125rem", fontWeight: "700", color: "#10B981" }}>{rosterCampaign.attendanceCount || 0}</div>
              </div>
            </div>

            {/* Attendee Table */}
            <div style={{ marginBottom: "20px", border: "1px solid #E2E8F0", borderRadius: "8px", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8125rem", textAlign: "left" }}>
                <thead>
                  <tr style={{ backgroundColor: "#F8FAFC", borderBottom: "1px solid #E2E8F0", color: "#475569" }}>
                    <th style={{ padding: "10px 14px", fontWeight: "600" }}>Participant ID</th>
                    <th style={{ padding: "10px 14px", fontWeight: "600" }}>Check-in Timestamp</th>
                    <th style={{ padding: "10px 14px", fontWeight: "600" }}>Clinical Screening Station</th>
                    <th style={{ padding: "10px 14px", fontWeight: "600" }}>Triage Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: "PT-2026-0104", time: "09:12 AM", station: "Station A: Vitals & Blood Pressure", status: "Verified & Screened" },
                    { id: "PT-2026-0105", time: "09:25 AM", station: "Station B: Blood Glucose & HbA1c", status: "Consultation Complete" },
                    { id: "PT-2026-0106", time: "09:40 AM", station: "Station C: Ergonomics & Posture", status: "Verified & Screened" },
                    { id: "PT-2026-0107", time: "10:05 AM", station: "Station A: Vitals & Blood Pressure", status: "In Waiting Queue" },
                    { id: "PT-2026-0108", time: "10:18 AM", station: "Station D: Nutrition & Dietetics", status: "Verified & Screened" }
                  ].map((row, idx) => (
                    <tr key={row.id} style={{ borderBottom: idx < 4 ? "1px solid #F1F5F9" : "none" }}>
                      <td style={{ padding: "10px 14px", fontWeight: "600", color: "#0F172A", fontFamily: "monospace" }}>
                        {row.id}
                      </td>
                      <td style={{ padding: "10px 14px", color: "#64748B" }}>{row.time}</td>
                      <td style={{ padding: "10px 14px", color: "#334155" }}>{row.station}</td>
                      <td style={{ padding: "10px 14px" }}>
                        <span style={{ backgroundColor: row.status.includes("Complete") || row.status.includes("Screened") ? "#ECFDF5" : "#FFFBEB", color: row.status.includes("Complete") || row.status.includes("Screened") ? "#047857" : "#B45309", padding: "2px 7px", borderRadius: "4px", fontSize: "0.6875rem", fontWeight: "600" }}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modal Actions */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button
                onClick={() => handleQuickCheckIn(rosterCampaign)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 16px",
                  borderRadius: "6px",
                  backgroundColor: "#F0FDFA",
                  color: "#0F766E",
                  border: "1px solid #99F6E4",
                  fontSize: "0.8125rem",
                  fontWeight: "600",
                  cursor: "pointer"
                }}
              >
                <Plus size={14} />
                <span>+ Check-in Walk-in Attendee Now</span>
              </button>

              <button
                onClick={() => setRosterCampaign(null)}
                style={{
                  padding: "8px 18px",
                  borderRadius: "6px",
                  backgroundColor: "#0F172A",
                  color: "#FFFFFF",
                  border: "none",
                  fontSize: "0.8125rem",
                  fontWeight: "600",
                  cursor: "pointer"
                }}
              >
                Close Roster
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION DIALOG */}
      <ConfirmDialog
        isOpen={confirmState.isOpen}
        title={confirmState.title}
        message={confirmState.message}
        confirmVariant={confirmState.variant}
        onConfirm={confirmState.action}
        onCancel={() => setConfirmState({ ...confirmState, isOpen: false })}
      />
    </div>
  );
}
