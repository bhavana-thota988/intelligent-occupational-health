import React, { useState, useEffect } from "react";
import {
  FolderOpen,
  Plus,
  Search,
  Filter,
  FileText,
  Video,
  Image as ImageIcon,
  Download,
  Eye,
  Edit3,
  Archive,
  Trash2,
  CheckCircle2,
  ExternalLink,
  X,
  FileCheck,
  Calendar,
  Layers
} from "lucide-react";
import { adminService } from "../../services/adminService";
import StatusBadge from "../../components/admin/StatusBadge";
import ConfirmDialog from "../../components/admin/ConfirmDialog";

const CATEGORIES = [
  "Diabetes Awareness",
  "Blood Pressure",
  "Healthy Eating",
  "Physical Activity",
  "Sleep Health",
  "Obesity Prevention"
];

const RESOURCE_TYPES = [
  "PDF Guide",
  "Health Document",
  "Awareness Poster",
  "Educational Video"
];

const PRESET_FILES = [
  {
    type: "PDF Guide",
    fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    fileSize: "2.4 MB"
  },
  {
    type: "Awareness Poster",
    fileUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop",
    fileSize: "1.8 MB"
  },
  {
    type: "Educational Video",
    fileUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    fileSize: "18 mins"
  },
  {
    type: "Health Document",
    fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    fileSize: "1.2 MB"
  }
];

export default function HealthResourceLibrary() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("ALL");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [previewResource, setPreviewResource] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: CATEGORIES[0],
    resourceType: RESOURCE_TYPES[0],
    fileUrl: PRESET_FILES[0].fileUrl,
    fileSize: PRESET_FILES[0].fileSize,
    uploadDate: new Date().toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" }),
    status: "Published"
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
    loadResources();
  }, []);

  const loadResources = async () => {
    setLoading(true);
    try {
      const data = await adminService.getResources();
      setResources(data || []);
    } catch (e) {
      console.error("Failed to load resources:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingResource(null);
    setFormData({
      title: "",
      description: "",
      category: CATEGORIES[0],
      resourceType: RESOURCE_TYPES[0],
      fileUrl: PRESET_FILES[0].fileUrl,
      fileSize: PRESET_FILES[0].fileSize,
      uploadDate: new Date().toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" }),
      status: "Published"
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const handleOpenEdit = (res) => {
    setEditingResource(res);
    setFormData({
      title: res.title || "",
      description: res.description || "",
      category: res.category || CATEGORIES[0],
      resourceType: res.resourceType || RESOURCE_TYPES[0],
      fileUrl: res.fileUrl || "",
      fileSize: res.fileSize || "1.5 MB",
      uploadDate: res.uploadDate || "",
      status: res.status || "Published"
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = "Resource title is required.";
    if (!formData.description.trim()) errs.description = "Clinical description is required.";
    if (!formData.fileUrl.trim()) errs.fileUrl = "File URL or storage URI is required.";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmitForm = async () => {
    if (!validateForm()) return;

    if (editingResource) {
      await adminService.updateResource(editingResource.id, formData);
      showToast("Resource updated successfully!");
    } else {
      await adminService.createResource(formData);
      showToast("New educational resource added to library!");
    }

    setIsFormOpen(false);
    loadResources();
  };

  const handleStatusChange = async (res, newStatus) => {
    await adminService.updateResourceStatus(res.id, newStatus);
    showToast(`Resource status changed to ${newStatus}.`);
    loadResources();
  };

  const confirmArchive = (res) => {
    setConfirmState({
      isOpen: true,
      title: "Archive Resource",
      message: `Archive "${res.title}"? It will no longer appear in open community downloads.`,
      variant: "warning",
      action: async () => {
        await adminService.updateResourceStatus(res.id, "Archived");
        setConfirmState({ ...confirmState, isOpen: false });
        showToast("Resource archived.");
        loadResources();
      }
    });
  };

  const confirmDelete = (res) => {
    setConfirmState({
      isOpen: true,
      title: "Delete Resource",
      message: `Permanently delete "${res.title}" from storage?`,
      variant: "danger",
      action: async () => {
        await adminService.deleteResource(res.id);
        setConfirmState({ ...confirmState, isOpen: false });
        showToast("Resource deleted.");
        loadResources();
      }
    });
  };

  const handleDownloadResource = async (res) => {
    const content = `================================================================================
NATIONAL PUBLIC HEALTH DIRECTORATE - CLINICAL RESOURCE ARCHIVE
Document Control ID: DOC-PH-${res.id.toString().padStart(4, "0")}
Classification: Official Public Health Guidance (${res.category})
================================================================================

TITLE: ${res.title}
RESOURCE TYPE: ${res.resourceType}
CATEGORY: ${res.category}
PUBLICATION DATE: ${res.uploadDate}
DOCUMENT SIZE / DURATION: ${res.fileSize || "Standard Edition"}
STATUS: ${res.status}

1. EXECUTIVE CLINICAL SUMMARY
--------------------------------------------------------------------------------
${res.description}

2. EVIDENCE-BASED GUIDELINES & PROTOCOLS
--------------------------------------------------------------------------------
- Recommended for routine screening, preventive counseling, and community distribution.
- Ensure all screening personnel comply with standardized biosecurity and data protection guidelines.
- Materials validated by the Directorate Clinical Advisory Board.

3. RESOURCE ACCESS URI
--------------------------------------------------------------------------------
Storage Reference: ${res.fileUrl}

================================================================================
Generated from Intelligent Occupational Health & Public Health Directorate
Confidentiality & Integrity Verified.
================================================================================`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const safeName = res.title.toLowerCase().replace(/[^a-z0-9]/g, "_").slice(0, 32);
    link.href = url;
    link.download = `${safeName}_clinical_guide.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    const newCount = (res.downloadsCount || 0) + 1;
    await adminService.updateResource(res.id, { ...res, downloadsCount: newCount });
    showToast(`Downloaded "${res.title}"! (${newCount} total downloads)`);
    loadResources();
  };

  // Filtered List
  const filteredResources = resources.filter((res) => {
    const matchesSearch =
      res.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "ALL" || res.resourceType === selectedType;
    const matchesCategory = selectedCategory === "ALL" || res.category === selectedCategory;
    const matchesStatus = selectedStatus === "ALL" || res.status === selectedStatus;
    return matchesSearch && matchesType && matchesCategory && matchesStatus;
  });

  const getTypeIcon = (type) => {
    switch (type) {
      case "PDF Guide":
        return <FileText size={20} color="#DC2626" />;
      case "Educational Video":
        return <Video size={20} color="#6366F1" />;
      case "Awareness Poster":
        return <ImageIcon size={20} color="#0D9488" />;
      default:
        return <FileCheck size={20} color="#0284C7" />;
    }
  };

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
                backgroundColor: "#F0FDFA",
                color: "#0F766E"
              }}
            >
              <FolderOpen size={20} />
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
              Health Resource Library
            </h1>
          </div>
          <p style={{ margin: 0, color: "#64748B", fontSize: "0.9375rem" }}>
            Upload and manage clinical PDF guides, printable health posters, infographics, and accredited educational videos.
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
          <span>Upload Resource</span>
        </button>
      </div>

      {/* Filters Bar */}
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
        <div style={{ position: "relative", flex: "1 1 260px" }}>
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
            placeholder="Search resources by title or keywords..."
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

        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          {/* Resource Type */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "0.8125rem", fontWeight: "600", color: "#64748B" }}>Type:</span>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              style={{
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid #CBD5E1",
                fontSize: "0.875rem",
                color: "#1E293B",
                backgroundColor: "#FFFFFF",
                outline: "none"
              }}
            >
              <option value="ALL">All Types</option>
              {RESOURCE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "0.8125rem", fontWeight: "600", color: "#64748B" }}>Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid #CBD5E1",
                fontSize: "0.875rem",
                color: "#1E293B",
                backgroundColor: "#FFFFFF",
                outline: "none"
              }}
            >
              <option value="ALL">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "0.8125rem", fontWeight: "600", color: "#64748B" }}>Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              style={{
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid #CBD5E1",
                fontSize: "0.875rem",
                color: "#1E293B",
                backgroundColor: "#FFFFFF",
                outline: "none"
              }}
            >
              <option value="ALL">All Statuses</option>
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
              <option value="Archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Resources Table / Grid */}
      {loading ? (
        <div style={{ padding: "60px 0", textAlign: "center", color: "#64748B" }}>
          <div style={{ display: "inline-block", width: "32px", height: "32px", border: "3px solid #E2E8F0", borderTopColor: "#0D9488", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
          <p style={{ marginTop: "12px", fontSize: "0.875rem" }}>Loading resource library catalog...</p>
        </div>
      ) : filteredResources.length === 0 ? (
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
            <FolderOpen size={24} />
          </div>
          <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#1E293B", marginBottom: "6px" }}>
            No Resources Found
          </h3>
          <p style={{ color: "#64748B", fontSize: "0.875rem", maxWidth: "420px", margin: "0 auto 20px" }}>
            {searchTerm || selectedType !== "ALL" || selectedCategory !== "ALL"
              ? "No resources matched your selected filters."
              : "No clinical materials found. Click Upload Resource to store medical documents."}
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
            gap: "20px"
          }}
        >
          {filteredResources.map((res) => (
            <div
              key={res.id}
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "12px",
                border: "1px solid #E2E8F0",
                padding: "20px",
                boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: "16px"
              }}
            >
              <div>
                {/* Top header row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div
                      style={{
                        padding: "8px",
                        borderRadius: "8px",
                        backgroundColor: "#F8FAFC",
                        border: "1px solid #E2E8F0"
                      }}
                    >
                      {getTypeIcon(res.resourceType)}
                    </div>
                    <div>
                      <span
                        style={{
                          backgroundColor: "#F1F5F9",
                          color: "#334155",
                          padding: "2px 7px",
                          borderRadius: "4px",
                          fontSize: "0.6875rem",
                          fontWeight: "600",
                          textTransform: "uppercase"
                        }}
                      >
                        {res.resourceType}
                      </span>
                      <div style={{ fontSize: "0.75rem", color: "#64748B", marginTop: "2px" }}>
                        {res.fileSize || "Clinical Material"}
                      </div>
                    </div>
                  </div>

                  <StatusBadge status={res.status} />
                </div>

                <h3
                  style={{
                    fontSize: "1.0625rem",
                    fontWeight: "700",
                    color: "#0F172A",
                    lineHeight: "1.35",
                    marginBottom: "6px"
                  }}
                >
                  {res.title}
                </h3>

                <p
                  style={{
                    fontSize: "0.8125rem",
                    color: "#64748B",
                    lineHeight: "1.5",
                    margin: "0 0 14px 0",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden"
                  }}
                >
                  {res.description}
                </p>

                <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                  <span
                    style={{
                      backgroundColor: "#F0FDFA",
                      color: "#0F766E",
                      border: "1px solid #CCFBF1",
                      padding: "3px 8px",
                      borderRadius: "6px",
                      fontSize: "0.6875rem",
                      fontWeight: "600"
                    }}
                  >
                    {res.category}
                  </span>
                  <span style={{ fontSize: "0.75rem", color: "#94A3B8" }}>•</span>
                  <span style={{ fontSize: "0.75rem", color: "#64748B" }}>{res.uploadDate}</span>
                </div>
              </div>

              {/* Stats & Actions Footer */}
              <div
                style={{
                  paddingTop: "14px",
                  borderTop: "1px solid #F1F5F9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}
              >
                <div style={{ display: "flex", gap: "12px", fontSize: "0.75rem", color: "#64748B" }}>
                  <span><strong>{res.viewsCount || 0}</strong> views</span>
                  <span><strong>{res.downloadsCount || 0}</strong> downloads</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <button
                    onClick={() => setPreviewResource(res)}
                    title="Preview Resource"
                    style={{
                      padding: "6px 10px",
                      borderRadius: "6px",
                      backgroundColor: "#F8FAFC",
                      border: "1px solid #CBD5E1",
                      color: "#1E293B",
                      fontSize: "0.75rem",
                      fontWeight: "600",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px"
                    }}
                  >
                    <Eye size={13} />
                    <span>View</span>
                  </button>

                  <button
                    onClick={() => handleDownloadResource(res)}
                    title="Download Resource Guide"
                    style={{
                      padding: "6px",
                      borderRadius: "6px",
                      backgroundColor: "#F0FDFA",
                      border: "1px solid #99F6E4",
                      color: "#0D9488",
                      cursor: "pointer"
                    }}
                  >
                    <Download size={14} />
                  </button>

                  <button
                    onClick={() => handleOpenEdit(res)}
                    title="Edit Metadata"
                    style={{
                      padding: "6px",
                      borderRadius: "6px",
                      backgroundColor: "#F8FAFC",
                      border: "1px solid #CBD5E1",
                      color: "#0284C7",
                      cursor: "pointer"
                    }}
                  >
                    <Edit3 size={14} />
                  </button>

                  {res.status === "Published" ? (
                    <button
                      onClick={() => confirmArchive(res)}
                      title="Archive Resource"
                      style={{
                        padding: "6px",
                        borderRadius: "6px",
                        backgroundColor: "#F8FAFC",
                        border: "1px solid #CBD5E1",
                        color: "#D97706",
                        cursor: "pointer"
                      }}
                    >
                      <Archive size={14} />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStatusChange(res, "Published")}
                      title="Publish Resource"
                      style={{
                        padding: "6px",
                        borderRadius: "6px",
                        backgroundColor: "#F0FDFA",
                        border: "1px solid #A7F3D0",
                        color: "#0D9488",
                        cursor: "pointer"
                      }}
                    >
                      <CheckCircle2 size={14} />
                    </button>
                  )}

                  <button
                    onClick={() => confirmDelete(res)}
                    title="Delete Resource"
                    style={{
                      padding: "6px",
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
            </div>
          ))}
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
              maxWidth: "680px",
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
                  {editingResource ? "Edit Resource Information" : "Upload Health Education Resource"}
                </h2>
                <p style={{ margin: "4px 0 0", fontSize: "0.8125rem", color: "#64748B" }}>
                  Store and distribute accredited preventive guides and media assets.
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
              {/* Title */}
              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: "600", color: "#1E293B", marginBottom: "6px" }}>
                  Resource Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Clinical Guidelines for Blood Pressure Self-Monitoring at Home"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: "8px",
                    border: formErrors.title ? "1px solid #DC2626" : "1px solid #CBD5E1",
                    fontSize: "0.875rem",
                    outline: "none"
                  }}
                />
                {formErrors.title && (
                  <span style={{ fontSize: "0.75rem", color: "#DC2626", marginTop: "4px", display: "block" }}>
                    {formErrors.title}
                  </span>
                )}
              </div>

              {/* Resource Type & Category Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: "600", color: "#1E293B", marginBottom: "6px" }}>
                    Resource Type *
                  </label>
                  <select
                    value={formData.resourceType}
                    onChange={(e) => {
                      const selected = e.target.value;
                      const preset = PRESET_FILES.find((p) => p.type === selected) || PRESET_FILES[0];
                      setFormData({
                        ...formData,
                        resourceType: selected,
                        fileUrl: preset.fileUrl,
                        fileSize: preset.fileSize
                      });
                    }}
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
                    {RESOURCE_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: "600", color: "#1E293B", marginBottom: "6px" }}>
                    Health Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* File URL & File Size */}
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: "600", color: "#1E293B", marginBottom: "6px" }}>
                    File Location / Media URL *
                  </label>
                  <input
                    type="text"
                    placeholder="https://... or /storage/resources/..."
                    value={formData.fileUrl}
                    onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      borderRadius: "8px",
                      border: formErrors.fileUrl ? "1px solid #DC2626" : "1px solid #CBD5E1",
                      fontSize: "0.875rem",
                      outline: "none"
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: "600", color: "#1E293B", marginBottom: "6px" }}>
                    File Size / Runtime
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 2.4 MB"
                    value={formData.fileSize}
                    onChange={(e) => setFormData({ ...formData, fileSize: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      borderRadius: "8px",
                      border: "1px solid #CBD5E1",
                      fontSize: "0.875rem",
                      outline: "none"
                    }}
                  />
                </div>
              </div>

              {/* Publication Status */}
              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: "600", color: "#1E293B", marginBottom: "6px" }}>
                  Publication Status *
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
                  <option value="Published">Published (Live in Community Catalog)</option>
                  <option value="Draft">Draft (Internal Review)</option>
                  <option value="Archived">Archived (Hidden)</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: "600", color: "#1E293B", marginBottom: "6px" }}>
                  Resource Overview & Purpose *
                </label>
                <textarea
                  rows={3}
                  placeholder="Outline key educational topics, target patient audience, and intended usage..."
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
                {editingResource ? "Save Changes" : "Save Resource"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RESOURCE PREVIEW MODAL */}
      {previewResource && (
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
          onClick={() => setPreviewResource(null)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "640px",
              backgroundColor: "#FFFFFF",
              borderRadius: "14px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              border: "1px solid #E2E8F0",
              padding: "28px"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <span
                  style={{
                    backgroundColor: "#F1F5F9",
                    color: "#334155",
                    padding: "4px 8px",
                    borderRadius: "6px",
                    fontSize: "0.75rem",
                    fontWeight: "600"
                  }}
                >
                  {previewResource.resourceType}
                </span>
                <StatusBadge status={previewResource.status} />
              </div>

              <button
                onClick={() => setPreviewResource(null)}
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

            <h2 style={{ fontSize: "1.25rem", fontWeight: "700", color: "#0F172A", marginBottom: "10px" }}>
              {previewResource.title}
            </h2>

            <div
              style={{
                backgroundColor: "#F8FAFC",
                borderRadius: "8px",
                padding: "16px",
                border: "1px solid #E2E8F0",
                marginBottom: "20px"
              }}
            >
              <div style={{ fontSize: "0.8125rem", color: "#64748B", marginBottom: "8px" }}>
                <strong>Category:</strong> {previewResource.category}
              </div>
              <div style={{ fontSize: "0.8125rem", color: "#64748B", marginBottom: "8px" }}>
                <strong>File Size:</strong> {previewResource.fileSize || "Clinical Material"}
              </div>
              <div style={{ fontSize: "0.8125rem", color: "#64748B", marginBottom: "8px" }}>
                <strong>Upload Date:</strong> {previewResource.uploadDate}
              </div>
              <p style={{ margin: "12px 0 0", fontSize: "0.875rem", color: "#334155", lineHeight: "1.5" }}>
                {previewResource.description}
              </p>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.8125rem", color: "#64748B" }}>
                Downloads: {previewResource.downloadsCount || 0}
              </span>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() => setPreviewResource(null)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "6px",
                    border: "1px solid #CBD5E1",
                    backgroundColor: "#FFFFFF",
                    color: "#475569",
                    fontSize: "0.8125rem",
                    fontWeight: "600",
                    cursor: "pointer"
                  }}
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleDownloadResource(previewResource);
                    setPreviewResource(null);
                  }}
                  style={{
                    padding: "8px 18px",
                    borderRadius: "6px",
                    border: "none",
                    backgroundColor: "#0D9488",
                    color: "#FFFFFF",
                    fontSize: "0.8125rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}
                >
                  <Download size={14} />
                  <span>Download File</span>
                </button>
              </div>
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
