import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Eye,
  Edit3,
  Archive,
  Trash2,
  CheckCircle2,
  Clock,
  FileText,
  X,
  ExternalLink,
  Sparkles,
  Calendar,
  User,
  Image as ImageIcon
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

const PRESET_IMAGES = [
  { label: "Clinical Lab", url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop" },
  { label: "Healthy Food", url: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&auto=format&fit=crop" },
  { label: "Physical Fitness", url: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop" },
  { label: "Sleep & Mind", url: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&auto=format&fit=crop" },
  { label: "Doctor Stethoscope", url: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&auto=format&fit=crop" }
];

export default function PublicHealthAwareness() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [previewArticle, setPreviewArticle] = useState(null);

  // Form Fields
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    category: CATEGORIES[0],
    coverImage: "",
    content: "",
    author: "",
    publicationDate: new Date().toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" }),
    status: "Published"
  });
  const [formErrors, setFormErrors] = useState({});

  // Confirmation Dialog
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    title: "",
    message: "",
    variant: "danger",
    action: null
  });

  // Notification Toast
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    setLoading(true);
    try {
      const data = await adminService.getArticles();
      setArticles(data || []);
    } catch (e) {
      console.error("Failed to load articles:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingArticle(null);
    setFormData({
      title: "",
      summary: "",
      category: CATEGORIES[0],
      coverImage: PRESET_IMAGES[0].url,
      content: "",
      author: "Dr. Public Health Team",
      publicationDate: new Date().toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" }),
      status: "Published"
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const handleOpenEdit = (article) => {
    setEditingArticle(article);
    setFormData({
      title: article.title || "",
      summary: article.summary || "",
      category: article.category || CATEGORIES[0],
      coverImage: article.coverImage || "",
      content: article.content || "",
      author: article.author || "",
      publicationDate: article.publicationDate || "",
      status: article.status || "Published"
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = "Article title is required.";
    if (!formData.summary.trim()) errs.summary = "A concise summary is required.";
    if (!formData.content.trim()) errs.content = "Article content is required.";
    if (!formData.author.trim()) errs.author = "Author credential / name is required.";
    if (!formData.category) errs.category = "Please select a category.";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmitForm = async (targetStatus) => {
    if (!validateForm()) return;

    const payload = {
      ...formData,
      status: targetStatus || formData.status
    };

    if (editingArticle) {
      await adminService.updateArticle(editingArticle.id, payload);
      showToast("Article updated successfully!");
    } else {
      await adminService.createArticle(payload);
      showToast(targetStatus === "Draft" ? "Article saved as draft." : "Article published successfully!");
    }

    setIsFormOpen(false);
    loadArticles();
  };

  const handleStatusChange = async (article, newStatus) => {
    await adminService.updateArticleStatus(article.id, newStatus);
    showToast(`Article status updated to ${newStatus}.`);
    loadArticles();
  };

  const confirmDelete = (article) => {
    setConfirmState({
      isOpen: true,
      title: "Delete Article",
      message: `Are you sure you want to permanently delete "${article.title}"? This action cannot be undone.`,
      variant: "danger",
      action: async () => {
        await adminService.deleteArticle(article.id);
        setConfirmState({ ...confirmState, isOpen: false });
        showToast("Article deleted successfully.");
        loadArticles();
      }
    });
  };

  const confirmArchive = (article) => {
    setConfirmState({
      isOpen: true,
      title: "Archive Article",
      message: `Move "${article.title}" to archives? It will no longer be visible on community health bulletins.`,
      variant: "warning",
      action: async () => {
        await adminService.updateArticleStatus(article.id, "Archived");
        setConfirmState({ ...confirmState, isOpen: false });
        showToast("Article archived.");
        loadArticles();
      }
    });
  };

  // Filtered List
  const filteredArticles = articles.filter((art) => {
    const matchesSearch =
      art.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.author?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "ALL" || art.category === selectedCategory;
    const matchesStatus = selectedStatus === "ALL" || art.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div style={{ padding: "28px 32px", maxWidth: "1400px", margin: "0 auto" }}>
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
              <BookOpen size={20} />
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
              Public Health Awareness
            </h1>
          </div>
          <p style={{ margin: 0, color: "#64748B", fontSize: "0.9375rem" }}>
            Curate evidence-based preventive health education articles, guidelines, and wellness publications.
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
          <span>Create Article</span>
        </button>
      </div>

      {/* Search & Filters Bar */}
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
        <div style={{ position: "relative", flex: "1 1 320px" }}>
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
            placeholder="Search articles by title, summary, or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "9px 12px 9px 38px",
              borderRadius: "8px",
              border: "1px solid #CBD5E1",
              fontSize: "0.875rem",
              color: "#0F172A",
              outline: "none"
            }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
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
                outline: "none",
                cursor: "pointer"
              }}
            >
              <option value="ALL">All Categories ({articles.length})</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

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
                outline: "none",
                cursor: "pointer"
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

      {/* Articles Content */}
      {loading ? (
        <div style={{ padding: "60px 0", textAlign: "center", color: "#64748B" }}>
          <div style={{ display: "inline-block", width: "32px", height: "32px", border: "3px solid #E2E8F0", borderTopColor: "#0D9488", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
          <p style={{ marginTop: "12px", fontSize: "0.875rem" }}>Loading articles from registry...</p>
        </div>
      ) : filteredArticles.length === 0 ? (
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
            <BookOpen size={24} />
          </div>
          <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#1E293B", marginBottom: "6px" }}>
            No Articles Found
          </h3>
          <p style={{ color: "#64748B", fontSize: "0.875rem", maxWidth: "420px", margin: "0 auto 20px" }}>
            {searchTerm || selectedCategory !== "ALL" || selectedStatus !== "ALL"
              ? "No articles matched your filter criteria. Try clearing search filters."
              : "No health awareness articles published yet. Click Create Article to publish your first clinical guide."}
          </p>
          {(searchTerm || selectedCategory !== "ALL" || selectedStatus !== "ALL") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("ALL");
                setSelectedStatus("ALL");
              }}
              style={{
                padding: "8px 16px",
                backgroundColor: "#F1F5F9",
                color: "#475569",
                border: "1px solid #CBD5E1",
                borderRadius: "6px",
                fontSize: "0.8125rem",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
            gap: "24px"
          }}
        >
          {filteredArticles.map((art) => (
            <div
              key={art.id}
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "12px",
                border: "1px solid #E2E8F0",
                overflow: "hidden",
                boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.15s ease, box-shadow 0.15s ease"
              }}
            >
              {/* Cover Image */}
              <div
                style={{
                  height: "170px",
                  width: "100%",
                  backgroundColor: "#F1F5F9",
                  position: "relative",
                  overflow: "hidden"
                }}
              >
                {art.coverImage ? (
                  <img
                    src={art.coverImage}
                    alt={art.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <div
                    style={{
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#94A3B8"
                    }}
                  >
                    <ImageIcon size={36} />
                  </div>
                )}
                <div
                  style={{
                    position: "absolute",
                    top: "12px",
                    left: "12px",
                    display: "flex",
                    gap: "8px"
                  }}
                >
                  <span
                    style={{
                      backgroundColor: "rgba(15, 23, 42, 0.75)",
                      color: "#FFFFFF",
                      backdropFilter: "blur(4px)",
                      padding: "4px 8px",
                      borderRadius: "6px",
                      fontSize: "0.6875rem",
                      fontWeight: "600",
                      letterSpacing: "0.02em"
                    }}
                  >
                    {art.category}
                  </span>
                </div>
                <div style={{ position: "absolute", top: "12px", right: "12px" }}>
                  <StatusBadge status={art.status} />
                </div>
              </div>

              {/* Body */}
              <div style={{ padding: "20px", display: "flex", flexDirection: "column", flex: 1 }}>
                <h3
                  style={{
                    fontSize: "1.0625rem",
                    fontWeight: "700",
                    color: "#0F172A",
                    lineHeight: "1.4",
                    marginBottom: "8px"
                  }}
                >
                  {art.title}
                </h3>

                <p
                  style={{
                    fontSize: "0.8125rem",
                    color: "#64748B",
                    lineHeight: "1.5",
                    marginBottom: "16px",
                    flex: 1,
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden"
                  }}
                >
                  {art.summary}
                </p>

                {/* Metadata */}
                <div
                  style={{
                    paddingTop: "12px",
                    borderTop: "1px solid #F1F5F9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontSize: "0.75rem",
                    color: "#64748B",
                    marginBottom: "16px"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <User size={13} color="#94A3B8" />
                    <span style={{ fontWeight: "500" }}>{art.author}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <Calendar size={13} color="#94A3B8" />
                    <span>{art.publicationDate}</span>
                  </div>
                </div>

                {/* Actions */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "8px"
                  }}
                >
                  <button
                    onClick={() => setPreviewArticle(art)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px",
                      padding: "6px 10px",
                      borderRadius: "6px",
                      backgroundColor: "#F8FAFC",
                      border: "1px solid #E2E8F0",
                      color: "#1E293B",
                      fontSize: "0.75rem",
                      fontWeight: "600",
                      cursor: "pointer"
                    }}
                  >
                    <Eye size={14} />
                    <span>Preview</span>
                  </button>

                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <button
                      onClick={() => handleOpenEdit(art)}
                      title="Edit Article"
                      style={{
                        padding: "6px",
                        borderRadius: "6px",
                        backgroundColor: "#F8FAFC",
                        border: "1px solid #E2E8F0",
                        color: "#0284C7",
                        cursor: "pointer"
                      }}
                    >
                      <Edit3 size={15} />
                    </button>

                    {art.status === "Published" ? (
                      <button
                        onClick={() => confirmArchive(art)}
                        title="Archive Article"
                        style={{
                          padding: "6px",
                          borderRadius: "6px",
                          backgroundColor: "#F8FAFC",
                          border: "1px solid #E2E8F0",
                          color: "#D97706",
                          cursor: "pointer"
                        }}
                      >
                        <Archive size={15} />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStatusChange(art, "Published")}
                        title="Publish Article"
                        style={{
                          padding: "6px",
                          borderRadius: "6px",
                          backgroundColor: "#F0FDFA",
                          border: "1px solid #A7F3D0",
                          color: "#0D9488",
                          cursor: "pointer"
                        }}
                      >
                        <CheckCircle2 size={15} />
                      </button>
                    )}

                    <button
                      onClick={() => confirmDelete(art)}
                      title="Delete Article"
                      style={{
                        padding: "6px",
                        borderRadius: "6px",
                        backgroundColor: "#FEF2F2",
                        border: "1px solid #FECACA",
                        color: "#DC2626",
                        cursor: "pointer"
                      }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
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
            {/* Modal Header */}
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
                  {editingArticle ? "Edit Health Article" : "Create Public Health Article"}
                </h2>
                <p style={{ margin: "4px 0 0", fontSize: "0.8125rem", color: "#64748B" }}>
                  Provide clinical prevention insights and evidence-based recommendations.
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

            {/* Form Fields */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Title */}
              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: "600", color: "#1E293B", marginBottom: "6px" }}>
                  Article Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Early Detection & Dietary Strategies for Type 2 Diabetes Prevention"
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

              {/* Category & Author Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: "600", color: "#1E293B", marginBottom: "6px" }}>
                    Category *
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
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: "600", color: "#1E293B", marginBottom: "6px" }}>
                    Author / Clinical Credentials *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Dr. Anita Desai, MD (Endocrinology)"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      borderRadius: "8px",
                      border: formErrors.author ? "1px solid #DC2626" : "1px solid #CBD5E1",
                      fontSize: "0.875rem",
                      outline: "none"
                    }}
                  />
                  {formErrors.author && (
                    <span style={{ fontSize: "0.75rem", color: "#DC2626", marginTop: "4px", display: "block" }}>
                      {formErrors.author}
                    </span>
                  )}
                </div>
              </div>

              {/* Cover Image & Presets */}
              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: "600", color: "#1E293B", marginBottom: "6px" }}>
                  Cover Image URL
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
                  <span style={{ fontSize: "0.75rem", color: "#64748B" }}>Presets:</span>
                  {PRESET_IMAGES.map((img) => (
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

              {/* Summary */}
              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: "600", color: "#1E293B", marginBottom: "6px" }}>
                  Executive Summary (1-2 sentences) *
                </label>
                <textarea
                  rows={2}
                  placeholder="A concise summary displayed on article overview cards..."
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: "8px",
                    border: formErrors.summary ? "1px solid #DC2626" : "1px solid #CBD5E1",
                    fontSize: "0.875rem",
                    outline: "none"
                  }}
                />
                {formErrors.summary && (
                  <span style={{ fontSize: "0.75rem", color: "#DC2626", marginTop: "4px", display: "block" }}>
                    {formErrors.summary}
                  </span>
                )}
              </div>

              {/* Full Content */}
              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: "600", color: "#1E293B", marginBottom: "6px" }}>
                  Article Content (Clinical / Preventive Education) *
                </label>
                <textarea
                  rows={7}
                  placeholder="Write complete article guidelines, research findings, and actionable steps..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: formErrors.content ? "1px solid #DC2626" : "1px solid #CBD5E1",
                    fontSize: "0.875rem",
                    outline: "none",
                    fontFamily: "inherit"
                  }}
                />
                {formErrors.content && (
                  <span style={{ fontSize: "0.75rem", color: "#DC2626", marginTop: "4px", display: "block" }}>
                    {formErrors.content}
                  </span>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
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

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => handleSubmitForm("Draft")}
                  style={{
                    padding: "9px 16px",
                    borderRadius: "8px",
                    border: "1px solid #FDE68A",
                    backgroundColor: "#FFFBEB",
                    color: "#B45309",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    cursor: "pointer"
                  }}
                >
                  Save as Draft
                </button>
                <button
                  type="button"
                  onClick={() => handleSubmitForm("Published")}
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
                  {editingArticle ? "Update & Publish" : "Publish Article"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ARTICLE PREVIEW MODAL */}
      {previewArticle && (
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
          onClick={() => setPreviewArticle(null)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "720px",
              maxHeight: "85vh",
              overflowY: "auto",
              backgroundColor: "#FFFFFF",
              borderRadius: "14px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              border: "1px solid #E2E8F0",
              overflow: "hidden"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {previewArticle.coverImage && (
              <div style={{ height: "220px", width: "100%", overflow: "hidden" }}>
                <img
                  src={previewArticle.coverImage}
                  alt={previewArticle.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            )}
            <div style={{ padding: "28px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <span
                    style={{
                      backgroundColor: "#F0FDFA",
                      color: "#0F766E",
                      border: "1px solid #99F6E4",
                      padding: "4px 10px",
                      borderRadius: "6px",
                      fontSize: "0.75rem",
                      fontWeight: "600"
                    }}
                  >
                    {previewArticle.category}
                  </span>
                  <StatusBadge status={previewArticle.status} />
                </div>
                <button
                  onClick={() => setPreviewArticle(null)}
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

              <h2
                style={{
                  fontSize: "1.375rem",
                  fontWeight: "700",
                  color: "#0F172A",
                  lineHeight: "1.35",
                  marginBottom: "12px"
                }}
              >
                {previewArticle.title}
              </h2>

              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  fontSize: "0.8125rem",
                  color: "#64748B",
                  paddingBottom: "16px",
                  marginBottom: "18px",
                  borderBottom: "1px solid #F1F5F9"
                }}
              >
                <span><strong>Author:</strong> {previewArticle.author}</span>
                <span>•</span>
                <span><strong>Date:</strong> {previewArticle.publicationDate}</span>
                <span>•</span>
                <span><strong>Views:</strong> {previewArticle.viewsCount || 0}</span>
              </div>

              <div
                style={{
                  backgroundColor: "#F8FAFC",
                  borderLeft: "4px solid #0D9488",
                  padding: "12px 16px",
                  borderRadius: "4px",
                  marginBottom: "20px",
                  fontSize: "0.875rem",
                  color: "#334155",
                  fontStyle: "italic"
                }}
              >
                {previewArticle.summary}
              </div>

              <div
                style={{
                  fontSize: "0.9375rem",
                  lineHeight: "1.7",
                  color: "#1E293B",
                  whiteSpace: "pre-line"
                }}
              >
                {previewArticle.content}
              </div>

              <div style={{ marginTop: "28px", paddingTop: "16px", borderTop: "1px solid #E2E8F0", textAlign: "right" }}>
                <button
                  onClick={() => setPreviewArticle(null)}
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
                  Close Preview
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
