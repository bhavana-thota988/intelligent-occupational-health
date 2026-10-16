import axios from "axios";
import { dataStore } from "./dataStore";
import { authService } from "./authService";

const API_BASE = "http://127.0.0.1:8000/api/admin";

// Persistent fallback seeds in localStorage if backend is offline
const INITIAL_ARTICLES = [
  {
    id: 1,
    title: "Early Detection & Dietary Strategies for Type 2 Diabetes Prevention",
    summary: "Evidence-based dietary guidelines to stabilize blood glucose and reduce insulin resistance in sedentary desk workers.",
    category: "Diabetes Awareness",
    coverImage: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&auto=format&fit=crop",
    content: "Sedentary corporate schedules and irregular meal cadence are prominent drivers of insulin resistance. Incorporating soluble fiber, managing glycemic index, and taking 10-minute post-meal strolls substantially blunt postprandial glucose spikes.",
    author: "Dr. Anita Desai, MD (Endocrinology)",
    publicationDate: "October 04, 2026",
    status: "Published",
    viewsCount: 142
  },
  {
    id: 2,
    title: "Workday Blood Pressure Management: The Hidden Impact of Chronic Stress",
    summary: "Understanding sympathetic nervous arousal, sodium intake, and breathing techniques to maintain healthy cardiovascular metrics.",
    category: "Blood Pressure",
    coverImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop",
    content: "Elevated workplace tension often translates into sustained arterial vasoconstriction. Adopting box-breathing protocols and monitoring sodium consumption help preserve endothelial elasticity and stabilize systolic pressure.",
    author: "Dr. Vikram Sen, Cardiologist",
    publicationDate: "September 28, 2026",
    status: "Published",
    viewsCount: 98
  },
  {
    id: 3,
    title: "Optimizing Circadian Sleep Architecture for Cognitive Stamina",
    summary: "How blue light reduction and evening wind-down rituals restore deep slow-wave sleep and memory consolidation.",
    category: "Sleep Health",
    coverImage: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&auto=format&fit=crop",
    content: "Disruptions in slow-wave sleep diminish prefrontal cortex clarity the following workday. Ceasing electronic screen exposure 45 minutes prior to sleep and maintaining a cool room temperature ensure optimal REM and NREM cycles.",
    author: "Elena Rostova, Sleep & Autonomic Coach",
    publicationDate: "September 20, 2026",
    status: "Published",
    viewsCount: 185
  },
  {
    id: 4,
    title: "Ergonomics & Desk-Side Movement: Preventing Obesity & Metabolic Slump",
    summary: "Actionable micro-movement sequences to stimulate lymphatic drainage and boost daily non-exercise physical activity.",
    category: "Physical Activity",
    coverImage: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop",
    content: "Sitting continuously for beyond 6 hours slows lipoprotein lipase activity by up to 90%. Integrating 50/10 work-to-movement rhythms reactivates lower limb muscle pumps and boosts daily metabolic rate.",
    author: "Marcus Vance, Physical Therapist",
    publicationDate: "October 08, 2026",
    status: "Published",
    viewsCount: 210
  },
  {
    id: 5,
    title: "Nutritional Foundations: Anti-Inflammatory Eating for Office Workers",
    summary: "A practical guide to meal prepping omega-3 fatty acids, colorful polyphenols, and hydrating adequately during busy project deadlines.",
    category: "Healthy Eating",
    coverImage: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&auto=format&fit=crop",
    content: "Chronic low-grade inflammation often stems from ultra-processed snacks consumed during prolonged cognitive exertion. Transitioning to walnut snack packs, green tea, and raw vegetables sustains afternoon mental acuity.",
    author: "Dr. Radhika Nair, Clinical Nutritionist",
    publicationDate: "October 01, 2026",
    status: "Draft",
    viewsCount: 0
  }
];

const INITIAL_CAMPAIGNS = [
  {
    id: 1,
    name: "Community Blood Pressure & Cardiovascular Screening Camp",
    description: "Free comprehensive blood pressure assessment, arterial stiffness check, and on-site clinical consultation with cardiology specialists.",
    campaignType: "Screening Drive",
    coverImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop",
    date: "October 28, 2026",
    time: "09:00 AM - 02:00 PM",
    venue: "Community Health Center, Block A Auditorium",
    registrationDeadline: "October 26, 2026",
    capacity: 120,
    contactDetails: "health-events@communitycare.org | (555) 234-5678",
    status: "Upcoming",
    registrationsCount: 84,
    attendanceCount: 0
  },
  {
    id: 2,
    name: "Workplace Diabetes Risk & Glucose Awareness Drive",
    description: "HbA1c rapid testing, personalized nutrition counseling, and interactive meal-planning workshop for high-risk individuals.",
    campaignType: "Workshop & Screening",
    coverImage: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&auto=format&fit=crop",
    date: "November 05, 2026",
    time: "10:00 AM - 04:00 PM",
    venue: "Civic Wellness Pavilion, 2nd Floor",
    registrationDeadline: "November 02, 2026",
    capacity: 100,
    contactDetails: "diabetes-initiative@publichealth.gov | (555) 890-1234",
    status: "Upcoming",
    registrationsCount: 62,
    attendanceCount: 0
  },
  {
    id: 3,
    name: "Active Spine & Ergonomic Posture Masterclass",
    description: "Hands-on workstation alignment session led by certified ergonomists. Practical drills to counteract desk slump and neck pain.",
    campaignType: "Interactive Workshop",
    coverImage: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop",
    date: "September 15, 2026",
    time: "02:00 PM - 05:00 PM",
    venue: "Corporate Townhall Main Stage",
    registrationDeadline: "September 12, 2026",
    capacity: 80,
    contactDetails: "ergonomics-team@workhealth.org | (555) 678-9012",
    status: "Completed",
    registrationsCount: 78,
    attendanceCount: 74
  },
  {
    id: 4,
    name: "Healthy Heart 5K Community Walkathon & Health Fair",
    description: "Public wellness walk promoting cardio endurance followed by healthy hydration booths and physical fitness demos.",
    campaignType: "Community Walkathon",
    coverImage: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&auto=format&fit=crop",
    date: "October 10, 2026",
    time: "06:30 AM - 10:30 AM",
    venue: "City Central Park Esplanade",
    registrationDeadline: "October 08, 2026",
    capacity: 250,
    contactDetails: "events@hearthealth.org | (555) 345-9876",
    status: "Completed",
    registrationsCount: 215,
    attendanceCount: 202
  },
  {
    id: 5,
    name: "Community Seasonal Influenza & Adult Immunization Camp",
    description: "Free quadrivalent flu vaccination drive with pre-vaccine allergy screening and on-site immunization certificates.",
    campaignType: "Vaccination Camp",
    coverImage: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop",
    date: "November 14, 2026",
    time: "09:30 AM - 03:30 PM",
    venue: "District Medical Hall, Clinic Wing 3",
    registrationDeadline: "November 11, 2026",
    capacity: 150,
    contactDetails: "vaccines@publichealth.org | (555) 678-4321",
    status: "Upcoming",
    registrationsCount: 42,
    attendanceCount: 0
  }
];

const INITIAL_RESOURCES = [
  {
    id: 1,
    title: "Comprehensive Diabetes Diet & Glycemic Index Guide",
    description: "16-page clinician-approved handbook detailing glycemic indices, meal prep templates, and healthy carbohydrate swaps.",
    category: "Diabetes Awareness",
    resourceType: "PDF Guide",
    fileUrl: "https://www.who.int/publications/i/item/9789241565257",
    uploadDate: "October 02, 2026",
    status: "Published",
    viewsCount: 320,
    downloadsCount: 184
  },
  {
    id: 2,
    title: "OSHA-Aligned Ergonomic Workstation Calibration Poster",
    description: "High-resolution visual infographic illustrating 90-degree arm alignment, eye-level monitor height, and lumbar support adjustments.",
    category: "Physical Activity",
    resourceType: "Awareness Poster",
    fileUrl: "https://www.osha.gov/etools/computer-workstations/components",
    uploadDate: "September 24, 2026",
    status: "Published",
    viewsCount: 540,
    downloadsCount: 412
  },
  {
    id: 3,
    title: "Hypertension Care Protocol & Home BP Monitoring Log",
    description: "Printable blood pressure tracking sheet with physician thresholds and morning/evening measurement best practices.",
    category: "Blood Pressure",
    resourceType: "Health Document",
    fileUrl: "https://www.heart.org/en/health-topics/high-blood-pressure",
    uploadDate: "September 18, 2026",
    status: "Published",
    viewsCount: 215,
    downloadsCount: 145
  },
  {
    id: 4,
    title: "Autonomic Nervous System Reset: 5-Minute Guided Audio Video",
    description: "Clinical diaphragmatic respiration walkthrough to reduce sympathetic tone and reduce workplace cortisol surges.",
    category: "Sleep Health",
    resourceType: "Educational Video",
    fileUrl: "https://www.youtube.com/watch?v=tybOi4hjZFQ",
    uploadDate: "October 05, 2026",
    status: "Published",
    viewsCount: 430,
    downloadsCount: 89
  }
];

export const adminService = {
  // -------------------------------------------------------------------------
  // 1. DASHBOARD STATS & RECENT ACTIVITY
  // -------------------------------------------------------------------------
  getDashboardStats: async () => {
    try {
      const res = await axios.get(`${API_BASE}/dashboard/stats`, { timeout: 2500 });
      return res.data;
    } catch (e) {
      // Offline fallback using persistent local data
      const articles = adminService.getLocalArticles();
      const campaigns = adminService.getLocalCampaigns();
      const resources = adminService.getLocalResources();

      const publishedArticles = articles.filter((a) => a.status === "Published").length;
      const upcomingCampaigns = campaigns.filter((c) => c.status === "Upcoming").length;
      const publishedResources = resources.filter((r) => r.status === "Published").length;
      const totalParticipants = campaigns.reduce((acc, c) => acc + (c.registrationsCount || 0), 0);

      return {
        summary: {
          totalPublishedArticles: publishedArticles,
          upcomingCampaigns: upcomingCampaigns,
          publishedHealthResources: publishedResources,
          totalCampaignParticipants: totalParticipants
        },
        upcomingCampaigns: campaigns.filter((c) => c.status === "Upcoming").slice(0, 4),
        recentArticles: articles.slice(0, 5),
        recentActivity: [
          { id: 1, action: "Campaign Scheduled", detail: "Community BP Screening Drive scheduled for Oct 28", timestamp: "Today, 09:30 AM", type: "campaign" },
          { id: 2, action: "Article Published", detail: "Type 2 Diabetes Prevention strategies published", timestamp: "Today, 08:15 AM", type: "article" },
          { id: 3, action: "Resource Uploaded", detail: "OSHA Workstation Calibration Poster published", timestamp: "Yesterday, 04:00 PM", type: "resource" },
          { id: 4, action: "Registration Update", detail: "Hypertension drive registration at 70% capacity", timestamp: "Yesterday, 02:20 PM", type: "campaign" }
        ]
      };
    }
  },

  // -------------------------------------------------------------------------
  // 2. PUBLIC HEALTH AWARENESS ARTICLES
  // -------------------------------------------------------------------------
  getLocalArticles: () => {
    return dataStore.get("admin_health_articles", INITIAL_ARTICLES);
  },

  saveLocalArticles: (list) => {
    dataStore.set("admin_health_articles", list);
  },

  getArticles: async (category = "All", status = "All", search = "") => {
    try {
      const res = await axios.get(`${API_BASE}/articles`, {
        params: { category, status, search },
        timeout: 2500
      });
      return res.data.articles || [];
    } catch (e) {
      let list = adminService.getLocalArticles();
      if (category && category !== "All") {
        list = list.filter((a) => a.category === category);
      }
      if (status && status !== "All") {
        list = list.filter((a) => a.status === status);
      }
      if (search && search.trim()) {
        const q = search.toLowerCase();
        list = list.filter((a) => a.title.toLowerCase().includes(q) || a.summary.toLowerCase().includes(q));
      }
      return list;
    }
  },

  createArticle: async (articleData) => {
    try {
      const res = await axios.post(`${API_BASE}/articles`, {
        title: articleData.title,
        summary: articleData.summary,
        category: articleData.category,
        cover_image: articleData.coverImage || "",
        content: articleData.content,
        author: articleData.author,
        publication_date: articleData.publicationDate,
        status: articleData.status
      }, { timeout: 2500 });
      return res.data.article;
    } catch (e) {
      const list = adminService.getLocalArticles();
      const newArticle = {
        id: Date.now(),
        ...articleData,
        viewsCount: 0
      };
      list.unshift(newArticle);
      adminService.saveLocalArticles(list);
      return newArticle;
    }
  },

  updateArticle: async (id, articleData) => {
    try {
      const res = await axios.put(`${API_BASE}/articles/${id}`, {
        title: articleData.title,
        summary: articleData.summary,
        category: articleData.category,
        cover_image: articleData.coverImage || "",
        content: articleData.content,
        author: articleData.author,
        publication_date: articleData.publicationDate,
        status: articleData.status
      }, { timeout: 2500 });
      return res.data.article;
    } catch (e) {
      const list = adminService.getLocalArticles();
      const index = list.findIndex((a) => a.id === id);
      if (index >= 0) {
        list[index] = { ...list[index], ...articleData };
        adminService.saveLocalArticles(list);
        return list[index];
      }
      return articleData;
    }
  },

  deleteArticle: async (id) => {
    try {
      await axios.delete(`${API_BASE}/articles/${id}`, { timeout: 2500 });
    } catch (e) {
      // Local fallback
    }
    const list = adminService.getLocalArticles().filter((a) => a.id !== id);
    adminService.saveLocalArticles(list);
    return true;
  },

  patchArticleStatus: async (id, status) => {
    try {
      await axios.patch(`${API_BASE}/articles/${id}/status?status=${status}`, {}, { timeout: 2500 });
    } catch (e) {
      // Local fallback
    }
    const list = adminService.getLocalArticles();
    const item = list.find((a) => a.id === id);
    if (item) {
      item.status = status;
      adminService.saveLocalArticles(list);
    }
    return true;
  },

  // -------------------------------------------------------------------------
  // 3. COMMUNITY HEALTH CAMPAIGNS
  // -------------------------------------------------------------------------
  getLocalCampaigns: () => {
    return dataStore.get("admin_health_campaigns", INITIAL_CAMPAIGNS);
  },

  saveLocalCampaigns: (list) => {
    dataStore.set("admin_health_campaigns", list);
  },

  getCampaigns: async (status = "All", search = "") => {
    try {
      const res = await axios.get(`${API_BASE}/campaigns`, {
        params: { status, search },
        timeout: 2500
      });
      return res.data.campaigns || [];
    } catch (e) {
      let list = adminService.getLocalCampaigns();
      if (status && status !== "All") {
        list = list.filter((c) => c.status === status);
      }
      if (search && search.trim()) {
        const q = search.toLowerCase();
        list = list.filter((c) => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q) || c.venue.toLowerCase().includes(q));
      }
      return list;
    }
  },

  createCampaign: async (campData) => {
    try {
      const res = await axios.post(`${API_BASE}/campaigns`, {
        name: campData.name,
        description: campData.description,
        campaign_type: campData.campaignType,
        cover_image: campData.coverImage || "",
        date: campData.date,
        time: campData.time,
        venue: campData.venue,
        registration_deadline: campData.registrationDeadline,
        capacity: Number(campData.capacity) || 50,
        contact_details: campData.contactDetails,
        status: campData.status || "Upcoming",
        registrations_count: Number(campData.registrationsCount) || 0,
        attendance_count: Number(campData.attendanceCount) || 0
      }, { timeout: 2500 });
      return res.data.campaign;
    } catch (e) {
      const list = adminService.getLocalCampaigns();
      const newCamp = {
        id: Date.now(),
        ...campData,
        capacity: Number(campData.capacity) || 50,
        registrationsCount: Number(campData.registrationsCount) || 0,
        attendanceCount: Number(campData.attendanceCount) || 0
      };
      list.unshift(newCamp);
      adminService.saveLocalCampaigns(list);
      return newCamp;
    }
  },

  updateCampaign: async (id, campData) => {
    try {
      const res = await axios.put(`${API_BASE}/campaigns/${id}`, {
        name: campData.name,
        description: campData.description,
        campaign_type: campData.campaignType,
        cover_image: campData.coverImage || "",
        date: campData.date,
        time: campData.time,
        venue: campData.venue,
        registration_deadline: campData.registrationDeadline,
        capacity: Number(campData.capacity) || 50,
        contact_details: campData.contactDetails,
        status: campData.status || "Upcoming",
        registrations_count: Number(campData.registrationsCount) || 0,
        attendance_count: Number(campData.attendanceCount) || 0
      }, { timeout: 2500 });
      return res.data.campaign;
    } catch (e) {
      const list = adminService.getLocalCampaigns();
      const index = list.findIndex((c) => c.id === id);
      if (index >= 0) {
        list[index] = { ...list[index], ...campData };
        adminService.saveLocalCampaigns(list);
        return list[index];
      }
      return campData;
    }
  },

  deleteCampaign: async (id) => {
    try {
      await axios.delete(`${API_BASE}/campaigns/${id}`, { timeout: 2500 });
    } catch (e) {
      // Local fallback
    }
    const list = adminService.getLocalCampaigns().filter((c) => c.id !== id);
    adminService.saveLocalCampaigns(list);
    return true;
  },

  patchCampaignStatus: async (id, status) => {
    try {
      await axios.patch(`${API_BASE}/campaigns/${id}/status?status=${status}`, {}, { timeout: 2500 });
    } catch (e) {
      // Local fallback
    }
    const list = adminService.getLocalCampaigns();
    const item = list.find((c) => c.id === id);
    if (item) {
      item.status = status;
      adminService.saveLocalCampaigns(list);
    }
    return true;
  },

  // -------------------------------------------------------------------------
  // 4. HEALTH RESOURCE LIBRARY
  // -------------------------------------------------------------------------
  getLocalResources: () => {
    return dataStore.get("admin_health_resources", INITIAL_RESOURCES);
  },

  saveLocalResources: (list) => {
    dataStore.set("admin_health_resources", list);
  },

  getResources: async (category = "All", resourceType = "All", search = "") => {
    try {
      const res = await axios.get(`${API_BASE}/resources`, {
        params: { category, resource_type: resourceType, search },
        timeout: 2500
      });
      return res.data.resources || [];
    } catch (e) {
      let list = adminService.getLocalResources();
      if (category && category !== "All") {
        list = list.filter((r) => r.category === category);
      }
      if (resourceType && resourceType !== "All") {
        list = list.filter((r) => r.resourceType === resourceType);
      }
      if (search && search.trim()) {
        const q = search.toLowerCase();
        list = list.filter((r) => r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q));
      }
      return list;
    }
  },

  createResource: async (resData) => {
    try {
      const res = await axios.post(`${API_BASE}/resources`, {
        title: resData.title,
        description: resData.description,
        category: resData.category,
        resource_type: resData.resourceType,
        file_url: resData.fileUrl,
        upload_date: resData.uploadDate,
        status: resData.status
      }, { timeout: 2500 });
      return res.data.resource;
    } catch (e) {
      const list = adminService.getLocalResources();
      const newRes = {
        id: Date.now(),
        ...resData,
        viewsCount: 1,
        downloadsCount: 0
      };
      list.unshift(newRes);
      adminService.saveLocalResources(list);
      return newRes;
    }
  },

  updateResource: async (id, resData) => {
    try {
      const res = await axios.put(`${API_BASE}/resources/${id}`, {
        title: resData.title,
        description: resData.description,
        category: resData.category,
        resource_type: resData.resourceType,
        file_url: resData.fileUrl,
        status: resData.status
      }, { timeout: 2500 });
      return res.data.resource;
    } catch (e) {
      const list = adminService.getLocalResources();
      const index = list.findIndex((r) => r.id === id);
      if (index >= 0) {
        list[index] = { ...list[index], ...resData };
        adminService.saveLocalResources(list);
        return list[index];
      }
      return resData;
    }
  },

  deleteResource: async (id) => {
    try {
      await axios.delete(`${API_BASE}/resources/${id}`, { timeout: 2500 });
    } catch (e) {
      // Local fallback
    }
    const list = adminService.getLocalResources().filter((r) => r.id !== id);
    adminService.saveLocalResources(list);
    return true;
  },

  patchResourceStatus: async (id, status) => {
    try {
      await axios.patch(`${API_BASE}/resources/${id}/status?status=${status}`, {}, { timeout: 2500 });
    } catch (e) {
      // Local fallback
    }
    const list = adminService.getLocalResources();
    const item = list.find((r) => r.id === id);
    if (item) {
      item.status = status;
      adminService.saveLocalResources(list);
    }
    return true;
  },

  // -------------------------------------------------------------------------
  // 5. PUBLIC HEALTH REPORTS & CSV EXPORT
  // -------------------------------------------------------------------------
  getReports: async () => {
    try {
      const res = await axios.get(`${API_BASE}/reports`, { timeout: 2500 });
      return res.data;
    } catch (e) {
      const articles = adminService.getLocalArticles();
      const campaigns = adminService.getLocalCampaigns();
      const resources = adminService.getLocalResources();

      const categories = [
        "Diabetes Awareness", "Blood Pressure", "Healthy Eating",
        "Physical Activity", "Sleep Health", "Obesity Prevention"
      ];
      const articlesByCat = categories.map((cat) => ({
        category: cat,
        count: articles.filter((a) => a.category === cat).length
      }));

      const totalReg = campaigns.reduce((acc, c) => acc + (c.registrationsCount || 0), 0);
      const totalAtt = campaigns.reduce((acc, c) => acc + (c.attendanceCount || 0), 0);

      return {
        articlesByCategory: articlesByCat,
        campaignsSummary: {
          total: campaigns.length,
          completed: campaigns.filter((c) => c.status === "Completed").length,
          upcoming: campaigns.filter((c) => c.status === "Upcoming").length,
          cancelled: campaigns.filter((c) => c.status === "Cancelled").length,
          totalRegistrations: totalReg,
          totalAttendance: totalAtt,
          attendanceRate: totalReg > 0 ? Math.round((totalAtt / totalReg) * 100) : 88
        },
        monthlyTrends: [
          { month: "May 2026", registrations: 45, attendance: 40 },
          { month: "Jun 2026", registrations: 70, attendance: 62 },
          { month: "Jul 2026", registrations: 95, attendance: 84 },
          { month: "Aug 2026", registrations: 120, attendance: 105 },
          { month: "Sep 2026", registrations: 150, attendance: 138 },
          { month: "Oct 2026", registrations: 185, attendance: 165 }
        ],
        resourceMetrics: {
          totalResources: resources.length,
          totalViews: resources.reduce((acc, r) => acc + (r.viewsCount || 0), 0),
          totalDownloads: resources.reduce((acc, r) => acc + (r.downloadsCount || 0), 0)
        }
      };
    }
  },

  downloadReportsCSV: () => {
    const campaigns = adminService.getLocalCampaigns();
    const articles = adminService.getLocalArticles();
    const resources = adminService.getLocalResources();

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "=== PUBLIC HEALTH CAMPAIGNS SUMMARY ===\n";
    csvContent += "ID,Name,Type,Date,Venue,Status,Capacity,Registrations,Attendance\n";
    campaigns.forEach((c) => {
      csvContent += `"${c.id}","${c.name}","${c.campaignType}","${c.date}","${c.venue}","${c.status}",${c.capacity},${c.registrationsCount || 0},${c.attendanceCount || 0}\n`;
    });

    csvContent += "\n=== PUBLIC HEALTH ARTICLES ===\n";
    csvContent += "ID,Title,Category,Author,Publication Date,Status,Views\n";
    articles.forEach((a) => {
      csvContent += `"${a.id}","${a.title}","${a.category}","${a.author}","${a.publicationDate}","${a.status}",${a.viewsCount || 0}\n`;
    });

    csvContent += "\n=== HEALTH RESOURCE LIBRARY ===\n";
    csvContent += "ID,Title,Category,Resource Type,Upload Date,Status,Views,Downloads\n";
    resources.forEach((r) => {
      csvContent += `"${r.id}","${r.title}","${r.category}","${r.resourceType}","${r.uploadDate}","${r.status}",${r.viewsCount || 0},${r.downloadsCount || 0}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `public_health_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  // -------------------------------------------------------------------------
  // 6. TRAINER INVITATION & CLINICAL SPECIALISTS
  // -------------------------------------------------------------------------
  getTrainers: async () => {
    try {
      const res = await axios.get(`${API_BASE}/trainers`, { timeout: 2500 });
      return res.data.trainers || [];
    } catch (e) {
      return dataStore.getDoctors() || [];
    }
  },

  inviteTrainer: async (payload) => {
    try {
      const res = await axios.post(`${API_BASE}/trainers/invite`, payload, { timeout: 4000 });
      return res.data;
    } catch (err) {
      const detail = err.response?.data?.detail || err.message;
      throw new Error(detail);
    }
  }
};

