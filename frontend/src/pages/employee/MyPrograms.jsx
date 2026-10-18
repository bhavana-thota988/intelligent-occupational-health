import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  User,
  ArrowRight,
  Sparkles,
  Award,
  AlertCircle,
  Filter,
  Search,
  ShieldCheck,
  CheckCircle,
  Activity,
  Heart,
  Eye,
  Brain,
  Shield,
  Coffee,
  Sun,
  X,
  Compass,
  FileCheck
} from "lucide-react";
import { authService } from "../../services/authService";
import { programService } from "../../services/programService";

const PROGRAM_CATEGORIES = [
  { key: "all", label: "All Categories", icon: Compass },
  { key: "Ergonomic Wellness", label: "Ergonomic Wellness", icon: Activity },
  { key: "Stress Management", label: "Stress Management", icon: Brain },
  { key: "Fatigue and Sleep Management", label: "Fatigue & Sleep", icon: Coffee },
  { key: "Workplace Safety Essentials", label: "Workplace Safety", icon: Shield },
  { key: "Healthy Lifestyle at Work", label: "Healthy Lifestyle", icon: Heart },
  { key: "Digital Eye Care", label: "Digital Eye Care", icon: Eye },
];

export default function MyPrograms() {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    allPrograms: [],
    assignedPrograms: [],
    recommendedPrograms: [],
    inProgressPrograms: [],
    completedPrograms: [],
    counts: { total: 0, enrolled: 0, inProgress: 0, completed: 0, recommended: 0 }
  });

  const [activeTab, setActiveTab] = useState("all"); // 'all', 'recommended', 'assigned', 'in_progress', 'completed'
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [enrollLoading, setEnrollLoading] = useState(null);

  useEffect(() => {
    fetchPrograms();
  }, [activeTab, selectedCategory]);

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const res = await programService.getPrograms({
        category: selectedCategory,
        status: activeTab,
        search: searchQuery
      });
      setData(res);
    } catch (err) {
      console.error("Failed to load programs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchPrograms();
  };

  const handleEnroll = async (e, program) => {
    e.stopPropagation();
    const progKey = program.slug || program.id;
    try {
      setEnrollLoading(progKey);
      await programService.enrollProgram(progKey);
      await fetchPrograms();
      navigate(`/employee/program/${progKey}`);
    } catch (err) {
      console.error("Enrollment failed:", err);
      navigate(`/employee/program/${progKey}`);
    } finally {
      setEnrollLoading(null);
    }
  };

  const getCategoryIcon = (category) => {
    const cat = PROGRAM_CATEGORIES.find((c) => c.key === category);
    const IconComp = cat ? cat.icon : BookOpen;
    return <IconComp size={18} />;
  };

  const renderProgramCard = (program) => {
    const isCompleted = program.status === "Completed";
    const isAwaitingVerification = program.status === "Awaiting Verification";
    const isInProgress = program.isEnrolled && !isCompleted && !isAwaitingVerification;
    const isNotStarted = !program.isEnrolled;

    return (
      <div
        key={program.id}
        style={{
          background: "#ffffff",
          borderRadius: 14,
          border: isCompleted
            ? "1.5px solid #a7f3d0"
            : isAwaitingVerification
            ? "1.5px solid #fed7aa"
            : program.assignmentSource === "Assigned"
            ? "1.5px solid #bbf7d0"
            : "1px solid #e2e8f0",
          boxShadow: "0 2px 8px rgba(15, 23, 42, 0.04)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 24,
          transition: "transform 0.15s ease, box-shadow 0.15s ease",
          position: "relative",
          overflow: "hidden"
        }}
      >
        {/* Top Accent Strip */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: isCompleted
              ? "#10b981"
              : isAwaitingVerification
              ? "#f59e0b"
              : isInProgress
              ? "#0284c7"
              : program.assignmentSource === "Assigned"
              ? "#16a34a"
              : "#0d9488"
          }}
        />

        <div>
          {/* Badges Bar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#0f766e",
                  background: "#f0fdfa",
                  padding: "4px 10px",
                  borderRadius: 6,
                  border: "1px solid #ccfbf1"
                }}
              >
                {getCategoryIcon(program.category)}
                {program.category}
              </span>

              {program.assignmentSource === "Assigned" && (
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#15803d",
                    background: "#f0fdf4",
                    padding: "4px 8px",
                    borderRadius: 6,
                    border: "1px solid #bbf7d0"
                  }}
                >
                  Assigned by Employer
                </span>
              )}

              {program.isRecommended && program.assignmentSource !== "Assigned" && (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#0369a1",
                    background: "#f0f9ff",
                    padding: "4px 8px",
                    borderRadius: 6,
                    border: "1px solid #bae6fd"
                  }}
                >
                  <Sparkles size={12} />
                  AI Recommended
                </span>
              )}
            </div>

            {/* Status Pill */}
            {isCompleted && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#047857",
                  background: "#ecfdf5",
                  padding: "3px 8px",
                  borderRadius: 20,
                  border: "1px solid #a7f3d0"
                }}
              >
                <CheckCircle2 size={13} />
                Verified
              </span>
            )}
            {isAwaitingVerification && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#b45309",
                  background: "#fffbeb",
                  padding: "3px 8px",
                  borderRadius: 20,
                  border: "1px solid #fde68a"
                }}
              >
                <Clock size={13} />
                Awaiting Verification
              </span>
            )}
            {isInProgress && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#0284c7",
                  background: "#f0f9ff",
                  padding: "3px 8px",
                  borderRadius: 20,
                  border: "1px solid #bae6fd"
                }}
              >
                <Clock size={13} />
                In Progress
              </span>
            )}
          </div>

          {/* Title */}
          <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", margin: "0 0 8px" }}>
            {program.title}
          </h3>

          {/* Description */}
          <p style={{ fontSize: 13.5, color: "#64748b", lineHeight: 1.55, margin: "0 0 16px" }}>
            {program.description}
          </p>

          {/* Metadata Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 8,
              padding: "10px 12px",
              background: "#f8fafc",
              borderRadius: 8,
              marginBottom: 16,
              fontSize: 12,
              color: "#475569"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Clock size={14} color="#0d9488" />
              <span>Duration: <strong>{program.duration}</strong></span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <BookOpen size={14} color="#0d9488" />
              <span>Modules: <strong>{program.completedModules || 0} / {program.totalModules}</strong></span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, gridColumn: "span 2" }}>
              <User size={14} color="#0d9488" />
              <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                Supervised by: <strong>{program.trainerName}</strong>
              </span>
            </div>
          </div>

          {/* Real Progress Bar */}
          {program.isEnrolled && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 5 }}>
                <span style={{ color: "#64748b", fontWeight: 600 }}>Actual Learning Progress</span>
                <span style={{ color: "#0f766e", fontWeight: 700 }}>
                  {program.progress}% ({program.completedModules || 0}/{program.totalModules} modules)
                </span>
              </div>
              <div style={{ width: "100%", height: 7, background: "#e2e8f0", borderRadius: 10, overflow: "hidden" }}>
                <div
                  style={{
                    width: `${program.progress}%`,
                    height: "100%",
                    background: isCompleted ? "#10b981" : "#0d9488",
                    borderRadius: 10,
                    transition: "width 0.3s ease"
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div style={{ marginTop: 8 }}>
          {isCompleted ? (
            <div style={{ display: "flex", gap: 8 }}>
              <Link
                to={`/employee/program/${program.slug || program.id}`}
                style={{
                  flex: 1,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  padding: "9px 12px",
                  fontSize: 13,
                  fontWeight: 600,
                  borderRadius: 8,
                  color: "#0f766e",
                  background: "#f0fdfa",
                  border: "1px solid #ccfbf1",
                  textDecoration: "none"
                }}
              >
                Review Curriculum
              </Link>
              {program.certificateId ? (
                <Link
                  to={`/verify/${program.certificateId}`}
                  style={{
                    flex: 1,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    padding: "9px 12px",
                    fontSize: 13,
                    fontWeight: 700,
                    borderRadius: 8,
                    color: "#ffffff",
                    background: "#059669",
                    border: "none",
                    textDecoration: "none"
                  }}
                >
                  <Award size={15} />
                  Certificate
                </Link>
              ) : (
                <Link
                  to="/employee/certificates"
                  style={{
                    flex: 1,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    padding: "9px 12px",
                    fontSize: 13,
                    fontWeight: 700,
                    borderRadius: 8,
                    color: "#ffffff",
                    background: "#059669",
                    border: "none",
                    textDecoration: "none"
                  }}
                >
                  <Award size={15} />
                  Certificate
                </Link>
              )}
            </div>
          ) : isAwaitingVerification ? (
            <Link
              to={`/employee/program/${program.slug || program.id}`}
              style={{
                width: "100%",
                boxBox: "border-box",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                padding: "10px 14px",
                fontSize: 13,
                fontWeight: 600,
                borderRadius: 8,
                color: "#b45309",
                background: "#fef3c7",
                border: "1px solid #fde68a",
                textDecoration: "none"
              }}
            >
              <Clock size={15} />
              Review Status (Awaiting Specialist)
            </Link>
          ) : isInProgress ? (
            <Link
              to={`/employee/program/${program.slug || program.id}`}
              style={{
                width: "100%",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                padding: "10px 14px",
                fontSize: 13,
                fontWeight: 700,
                borderRadius: 8,
                color: "#ffffff",
                background: "#0f766e",
                border: "none",
                textDecoration: "none"
              }}
            >
              <span>Continue Learning</span>
              <ArrowRight size={15} />
            </Link>
          ) : (
            <div style={{ display: "flex", gap: 8 }}>
              <Link
                to={`/employee/program/${program.slug || program.id}`}
                style={{
                  flex: 1,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "9px 10px",
                  fontSize: 13,
                  fontWeight: 600,
                  borderRadius: 8,
                  color: "#334155",
                  background: "#f1f5f9",
                  border: "1px solid #e2e8f0",
                  textDecoration: "none"
                }}
              >
                Syllabus
              </Link>
              <button
                type="button"
                onClick={(e) => handleEnroll(e, program)}
                disabled={enrollLoading === (program.slug || program.id)}
                style={{
                  flex: 1.4,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  padding: "9px 12px",
                  fontSize: 13,
                  fontWeight: 700,
                  borderRadius: 8,
                  color: "#ffffff",
                  background: "#0f766e",
                  border: "none",
                  cursor: enrollLoading === (program.slug || program.id) ? "wait" : "pointer"
                }}
              >
                <span>{enrollLoading === (program.slug || program.id) ? "Enrolling..." : "Enroll Now"}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28, maxWidth: "1280px", margin: "0 auto", padding: "8px 0 40px" }}>
      {/* Top Professional Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #0d9488 0%, #0f766e 60%, #115e59 100%)",
          borderRadius: 16,
          padding: "32px 36px",
          color: "#ffffff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 24,
          boxShadow: "0 10px 25px -5px rgba(13, 148, 136, 0.25)"
        }}
      >
        <div style={{ maxWidth: 700 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                background: "rgba(255, 255, 255, 0.2)",
                padding: "3px 10px",
                borderRadius: 20
              }}
            >
              Enterprise Occupational Health
            </span>
            <span style={{ fontSize: 12, opacity: 0.9 }}>· ISO 45001 Guided</span>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, margin: "0 0 10px", letterSpacing: "-0.02em" }}>
            My Programs
          </h1>
          <p style={{ fontSize: 14.5, opacity: 0.95, lineHeight: 1.6, margin: 0 }}>
            Structured workplace wellness and injury prevention curricula. Complete modules, practice ergonomic
            and mindfulness exercises, and pass knowledge assessments to earn official corporate certificates verified by occupational health specialists.
          </p>
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link
            to="/employee/assessment"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 18px",
              borderRadius: 8,
              background: "rgba(255, 255, 255, 0.15)",
              color: "#ffffff",
              fontSize: 13.5,
              fontWeight: 700,
              textDecoration: "none",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              backdropFilter: "blur(6px)"
            }}
          >
            <Sparkles size={16} />
            <span>Health Risk Profile</span>
          </Link>
          <Link
            to="/employee/certificates"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 20px",
              borderRadius: 8,
              background: "#ffffff",
              color: "#0f766e",
              fontSize: 13.5,
              fontWeight: 800,
              textDecoration: "none",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
            }}
          >
            <Award size={16} />
            <span>My Certificates ({data.counts.completed})</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
          gap: 16
        }}
      >
        <div style={{ background: "#ffffff", padding: "18px 20px", borderRadius: 12, border: "1px solid #e2e8f0" }}>
          <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>Catalog Programs</span>
          <div style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", marginTop: 4 }}>{data.counts.total}</div>
          <span style={{ fontSize: 11.5, color: "#0f766e" }}>Official Corporate Categories</span>
        </div>
        <div style={{ background: "#ffffff", padding: "18px 20px", borderRadius: 12, border: "1px solid #e2e8f0" }}>
          <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>In Progress</span>
          <div style={{ fontSize: 26, fontWeight: 800, color: "#0284c7", marginTop: 4 }}>{data.counts.inProgress}</div>
          <span style={{ fontSize: 11.5, color: "#64748b" }}>Active Learning Curricula</span>
        </div>
        <div style={{ background: "#ffffff", padding: "18px 20px", borderRadius: 12, border: "1px solid #e2e8f0" }}>
          <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>Personalized Recommendations</span>
          <div style={{ fontSize: 26, fontWeight: 800, color: "#0d9488", marginTop: 4 }}>{data.counts.recommended}</div>
          <span style={{ fontSize: 11.5, color: "#0d9488" }}>Mapped to Health Profile</span>
        </div>
        <div style={{ background: "#ffffff", padding: "18px 20px", borderRadius: 12, border: "1px solid #e2e8f0" }}>
          <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>Completed & Certified</span>
          <div style={{ fontSize: 26, fontWeight: 800, color: "#10b981", marginTop: 4 }}>{data.counts.completed}</div>
          <span style={{ fontSize: 11.5, color: "#10b981" }}>Specialist Verified</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: 14,
          padding: 20,
          border: "1px solid #e2e8f0",
          display: "flex",
          flexDirection: "column",
          gap: 16
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
          {/* Status Tabs */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {[
              { key: "all", label: `All Programs (${data.counts.total})` },
              { key: "assigned", label: `Assigned (${data.assignedPrograms?.length || 0})` },
              { key: "recommended", label: `Recommended (${data.recommendedPrograms?.length || 0})` },
              { key: "in_progress", label: `In Progress (${data.counts.inProgress})` },
              { key: "completed", label: `Completed (${data.counts.completed})` }
            ].map((tab) => {
              const active = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: active ? 700 : 500,
                    border: active ? "1.5px solid #0f766e" : "1px solid #e2e8f0",
                    background: active ? "#f0fdfa" : "#ffffff",
                    color: active ? "#0f766e" : "#475569",
                    cursor: "pointer",
                    transition: "all 0.15s ease"
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} style={{ display: "flex", gap: 8, minWidth: 260 }}>
            <div style={{ position: "relative", width: "100%" }}>
              <Search
                size={16}
                color="#94a3b8"
                style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}
              />
              <input
                type="text"
                placeholder="Search program or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "8px 12px 8px 36px",
                  borderRadius: 8,
                  border: "1px solid #cbd5e1",
                  fontSize: 13,
                  outline: "none"
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => { setSearchQuery(""); fetchPrograms(); }}
                  style={{
                    position: "absolute",
                    right: 8,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    padding: 2,
                    cursor: "pointer"
                  }}
                >
                  <X size={14} color="#94a3b8" />
                </button>
              )}
            </div>
            <button
              type="submit"
              style={{
                padding: "8px 14px",
                background: "#0f766e",
                color: "#ffffff",
                border: "none",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              Filter
            </button>
          </form>
        </div>

        {/* Category Pills Bar */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", borderTop: "1px solid #f1f5f9", paddingTop: 14 }}>
          {PROGRAM_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.key;
            const Icon = cat.icon;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setSelectedCategory(cat.key)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 12px",
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: isSelected ? 700 : 500,
                  border: isSelected ? "1px solid #0f766e" : "1px solid #e2e8f0",
                  background: isSelected ? "#0f766e" : "#f8fafc",
                  color: isSelected ? "#ffffff" : "#475569",
                  cursor: "pointer",
                  transition: "all 0.15s ease"
                }}
              >
                <Icon size={14} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#64748b" }}>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Loading Workplace Programs...</div>
          <span style={{ fontSize: 13 }}>Fetching catalog, personalized recommendations, and module progress from server.</span>
        </div>
      ) : activeTab === "all" && !searchQuery && selectedCategory === "all" ? (
        /* Segmented Comprehensive View when "All" is active */
        <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
          {/* 1. Recommended Programs Section */}
          {data.recommendedPrograms && data.recommendedPrograms.length > 0 && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 16 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#0369a1", fontSize: 12, fontWeight: 700, textTransform: "uppercase" }}>
                    <Sparkles size={14} />
                    <span>Personalized Workplace Wellness</span>
                  </div>
                  <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", margin: "4px 0 0" }}>
                    Recommended For You
                  </h2>
                  <p style={{ fontSize: 13, color: "#64748b", margin: "2px 0 0" }}>
                    Guidance derived from your occupational health assessment risk scores (ergonomics, stress, recovery, and screen time). Not a medical diagnosis.
                  </p>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: 20 }}>
                {data.recommendedPrograms.map((p) => renderProgramCard(p))}
              </div>
            </div>
          )}

          {/* 2. Assigned Programs Section */}
          {data.assignedPrograms && data.assignedPrograms.length > 0 && (
            <div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#15803d", fontSize: 12, fontWeight: 700, textTransform: "uppercase" }}>
                  <ShieldCheck size={14} />
                  <span>Mandatory / Departmental Learning</span>
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", margin: "4px 0 0" }}>
                  Assigned Programs
                </h2>
                <p style={{ fontSize: 13, color: "#64748b", margin: "2px 0 0" }}>
                  Official training assigned by occupational health and safety coordinators.
                </p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: 20 }}>
                {data.assignedPrograms.map((p) => renderProgramCard(p))}
              </div>
            </div>
          )}

          {/* 3. In Progress Section */}
          {data.inProgressPrograms && data.inProgressPrograms.length > 0 && (
            <div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#0284c7", fontSize: 12, fontWeight: 700, textTransform: "uppercase" }}>
                  <Clock size={14} />
                  <span>Active Learning Queue</span>
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", margin: "4px 0 0" }}>
                  In Progress Programs
                </h2>
                <p style={{ fontSize: 13, color: "#64748b", margin: "2px 0 0" }}>
                  Pick up right where you left off with educational lessons and practical activities.
                </p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: 20 }}>
                {data.inProgressPrograms.map((p) => renderProgramCard(p))}
              </div>
            </div>
          )}

          {/* 4. Completed Section */}
          {data.completedPrograms && data.completedPrograms.length > 0 && (
            <div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#059669", fontSize: 12, fontWeight: 700, textTransform: "uppercase" }}>
                  <Award size={14} />
                  <span>Specialist Verified Achievements</span>
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", margin: "4px 0 0" }}>
                  Completed Programs & Certificates
                </h2>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: 20 }}>
                {data.completedPrograms.map((p) => renderProgramCard(p))}
              </div>
            </div>
          )}

          {/* 5. Complete Catalog Grid */}
          <div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#0f766e", fontSize: 12, fontWeight: 700, textTransform: "uppercase" }}>
                <BookOpen size={14} />
                <span>All 6 Official Curricula</span>
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", margin: "4px 0 0" }}>
                Wellness Learning Catalog
              </h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: 20 }}>
              {data.allPrograms.map((p) => renderProgramCard(p))}
            </div>
          </div>
        </div>
      ) : (
        /* Tab Filtered or Searched View */
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", margin: 0 }}>
              {searchQuery ? `Search Results for "${searchQuery}"` : `${activeTab.replace("_", " ").toUpperCase()} Programs`}
              {" "}<span style={{ fontSize: 14, fontWeight: 500, color: "#64748b" }}>({data.allPrograms.length} found)</span>
            </h2>
          </div>

          {data.allPrograms.length === 0 ? (
            <div
              style={{
                background: "#ffffff",
                borderRadius: 14,
                padding: "48px 24px",
                textAlign: "center",
                border: "1px solid #e2e8f0"
              }}
            >
              <AlertCircle size={40} color="#94a3b8" style={{ margin: "0 auto 12px" }} />
              <h3 style={{ fontSize: 17, fontWeight: 700, color: "#334155", margin: "0 0 6px" }}>
                No programs found matching this criteria
              </h3>
              <p style={{ fontSize: 13.5, color: "#64748b", maxWidth: 450, margin: "0 auto 16px" }}>
                {searchQuery
                  ? `No workplace programs matched the search query "${searchQuery}". Try searching for Ergonomics, Stress, Fatigue, Safety, Lifestyle, or Eye Care.`
                  : "You do not have any programs in this status currently."}
              </p>
              <button
                type="button"
                onClick={() => { setActiveTab("all"); setSelectedCategory("all"); setSearchQuery(""); }}
                style={{
                  padding: "8px 16px",
                  borderRadius: 8,
                  background: "#0f766e",
                  color: "#ffffff",
                  border: "none",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: 20 }}>
              {data.allPrograms.map((p) => renderProgramCard(p))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
