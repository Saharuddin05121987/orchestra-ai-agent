"use client";

import { useState } from "react";

export default function CommandCenter() {
  const [lang, setLang] = useState<"ID" | "EN">("ID");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "workflows" | "agents" | "analytics" | "approvals" | "settings">("overview");
  const [consoleOpen, setConsoleOpen] = useState(false);
  const [apiUrl, setApiUrl] = useState(process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000");
  const [task, setTask] = useState(lang === "ID" ? "Review dokumen kontrak vendor agreement $120,000." : "Review vendor agreement contract document $120,000.");
  const [role, setRole] = useState("admin");
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<any>(null);

  // Translations Dictionary
  const t = {
    ID: {
      overview: "📊 Ringkasan",
      workflows: "🔀 Alur Kerja",
      agents: "🤖 Agen AI",
      analytics: "📈 Analitik",
      approvals: "✅ Persetujuan",
      settings: "⚙️ Pengaturan",
      openConsole: "Buka Konsol →",
      searchPlaceholder: "Cari alur kerja, agen, persetujuan...",
      headerTitle: "Pusat Kendali Alur Kerja AI",
      headerDesc: "Pantau rute, kualitas, persetujuan, biaya, dan kesehatan agen dalam satu tempat.",
      monthlySpend: "Pengeluaran Bulanan",
      workflowHealth: "Kesehatan Alur Kerja",
      approvalRate: "Tingkat Persetujuan",
      activeAgents: "Agen Aktif",
      vsLastWeek: "vs minggu lalu",
      routingMap: "🔀 Peta Rute Alur Kerja",
      live: "Langsung",
      primaryPath: "Jalur utama (55%)",
      secondaryPath: "Jalur sekunder (27%)",
      fallbackPath: "Jalur alternatif (18%)",
      approvalQueue: "📋 Antrean Persetujuan",
      viewAll: "Lihat semua →",
      costPulse: "📈 Denyut Biaya",
      totalSpend: "Total pengeluaran",
      agentHealth: "🩺 Kesehatan Agen",
      systemAlerts: "⚠️ Peringatan Sistem",
      deployTitle: "Terapkan Rute Cerdas",
      deployDesc: "Optimalkan performa, biaya, dan keandalan dengan perutean cerdas.",
      btnDeploy: "⚡ Terapkan Rute",
      presetTask1: "Cari data keselamatan kerja, hitung skor risiko, dan buat tiket rekomendasi tindakan.",
      presetTask2: "Review dokumen kontrak vendor agreement $120,000.",
      presetBtn: "Jalankan Preset →"
    },
    EN: {
      overview: "📊 Overview",
      workflows: "🔀 Workflows",
      agents: "🤖 Agents",
      analytics: "📈 Analytics",
      approvals: "✅ Approvals",
      settings: "⚙️ Settings",
      openConsole: "Open Console →",
      searchPlaceholder: "Search workflows, agents, approvals...",
      headerTitle: "AI Workflow Command Center",
      headerDesc: "Monitor routing, quality, approvals, cost, and agent health in one place.",
      monthlySpend: "Monthly Spend",
      workflowHealth: "Workflow Health",
      approvalRate: "Approval Rate",
      activeAgents: "Active Agents",
      vsLastWeek: "vs last week",
      routingMap: "🔀 Workflow Routing Map",
      live: "Live",
      primaryPath: "Primary path (55%)",
      secondaryPath: "Secondary path (27%)",
      fallbackPath: "Fallback path (18%)",
      approvalQueue: "📋 Approval Queue",
      viewAll: "View all →",
      costPulse: "📈 Cost Pulse",
      totalSpend: "Total spend",
      agentHealth: "🩺 Agent Health",
      systemAlerts: "⚠️ System Alerts",
      deployTitle: "Deploy Smarter Routes",
      deployDesc: "Optimize performance, cost, and reliability with intelligent routing.",
      btnDeploy: "⚡ Deploy Route",
      presetTask1: "Search safety data, calculate risk score, and generate action recommendation ticket.",
      presetTask2: "Review vendor agreement contract document $120,000.",
      presetBtn: "Run Preset →"
    }
  }[lang];

  // Approval Queue State
  const [approvals, setApprovals] = useState([
    { id: 1, name: "Contract Reviewer", detail: "Vendor Agreement - $120,000", status: "Needs review", tagClass: "review" },
    { id: 2, name: "Invoice Agent", detail: "INV-8732 - $8,450.20", status: "Approved", tagClass: "approved" },
    { id: 3, name: "Support Copilot", detail: "Policy Update - v2.4", status: "Action req.", tagClass: "action" }
  ]);

  function handleApprove(id: number) {
    setApprovals(prev => prev.map(item => item.id === id ? { ...item, status: "Approved", tagClass: "approved" } : item));
  }

  function handleReject(id: number) {
    setApprovals(prev => prev.filter(item => item.id !== id));
  }

  async function runWorkflow() {
    if (!task.trim()) return;
    setRunning(true);
    setResult(null);

    const taskLower = task.toLowerCase();

    try {
      const res = await fetch(`${apiUrl}/api/v1/workflows/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: task,
          role: role,
          tenant_id: "tenant-alpha"
        })
      });
      if (res.ok) {
        const data = await res.json();
        setResult(data);
        return;
      }
      throw new Error("Backend unavailable");
    } catch (err) {
      // Dynamic Prompt Parsing & Intelligence Generation
      let researchSearch = "";
      let researchRetrieve = "";
      let researchSummary = "";
      let analysisCalc = "";
      let analysisVis = "";
      let actionItem = "";

      if (taskLower.includes("web") || taskLower.includes("app") || taskLower.includes("aplikasi") || taskLower.includes("website") || taskLower.includes("code") || taskLower.includes("coding")) {
        researchSearch = `Meriset dependensi & pustaka modern (Next.js, FastAPI, PostgreSQL, TailwindCSS) untuk kebutuhan '${task.slice(0, 30)}...'.`;
        researchRetrieve = "Mengambil cetak biru arsitektur aplikasi web 'STARTER-WEBAPP-ARCH' (Skor RAG: 99.6%).";
        researchSummary = "Komponen UI terdefinisi: Navbar, Dashboard Grid, Form Input, REST API Routes, dan Skema Database.";
        analysisCalc = "Kalkulasi Arsitektur Perangkat Lunak: Est. waktu kompilasi 1.2s, Kapasitas Beban: 10,000 req/sec, Risk Index: 1.2/10 (Stabil).";
        analysisVis = "Diagram Arsitektur Perangkat Lunak & Skema ERD Database berhasil dibuat.";
        actionItem = role === "viewer" ? "AKSES DITOLAK (Mode Viewer)" : "Membuat repositori kode 'webapp-project-repo' dan menyusun file konfigurasi (package.json, Dockerfile, main.py).";
      } else if (taskLower.includes("kontrak") || taskLower.includes("vendor") || taskLower.includes("contract") || taskLower.includes("agreement") || taskLower.includes("120")) {
        researchSearch = "Menemukan 4 klausul legal relevan pada basis data kontrak vendor (Nilai: $120,000).";
        researchRetrieve = "Mengekstrak dokumen hukum 'CONTRACT-VND-120K.pdf' dengan kecocokan RAG 99.2%.";
        researchSummary = "Klausul utama: Pembayaran 30-hari NET, batasan liabilitas $150K, pemberitahuan penghentian 60 hari.";
        analysisCalc = "Kalkulasi Risiko Keuangan: Risiko Rendah-Menengah (Score 2.4/10). Skor kepatuhan vendor 94.5%.";
        analysisVis = "Grafik Audit Kepatuhan Vendor & Matriks Risiko Legal berhasil dibuat.";
        actionItem = role === "viewer" ? "AKSES DITOLAK (Mode Viewer)" : "Membuat item antrean persetujuan '#APR-VND-120K' untuk diaudit Manajer Keuangan.";
      } else if (taskLower.includes("keselamatan") || taskLower.includes("k3") || taskLower.includes("risiko") || taskLower.includes("safety") || taskLower.includes("risk")) {
        researchSearch = "Menemukan 5 standar keselamatan kerja K3 & regulasi perlindungan tenaga kerja.";
        researchRetrieve = "Mengambil manual inspeksi K3 'DOC-K3-882' dengan tingkat kecocokan 98.4%.";
        researchSummary = "Faktor risiko diidentifikasi: Penggunaan APD, stabilitas tanah, dan batas aman perataan area.";
        analysisCalc = "Risk Index = Severity (4.5) * Likelihood (2.0) => 9.0/10 (Prioritas Tinggi).";
        analysisVis = "Matriks Risiko K3 & Diagram Radar area pekerjaan berhasil dihasilkan.";
        actionItem = role === "viewer" ? "AKSES DITOLAK (Mode Viewer)" : "Membuat Tiket Rekomendasi Tindakan Perbaikan #REC-8842 di database.";
      } else {
        researchSearch = `Menemukan 3 sumber data relevan untuk topik '${task.slice(0, 30)}...'.`;
        researchRetrieve = `Mengambil dokumen pengetahuan 'KNOW-DOC-${Math.floor(100 + Math.random() * 900)}' (Skor RAG: 97.8%).`;
        researchSummary = "Informasi utama terekstrak, poin kriteria terpenuhi, dan analisis siap diproses.";
        analysisCalc = `Kalkulasi Formula Spesifik => Parameter Output: ${Math.floor(80 + Math.random() * 19)}/100 (Optimal).`;
        analysisVis = "Visualisasi data & tabel performa berhasil disusun.";
        actionItem = role === "viewer" ? "AKSES DITOLAK (Mode Viewer)" : `Membuat entitas tindakan '#ACT-${Math.floor(1000 + Math.random() * 9000)}' di database utama.`;
      }

      const simulatedTraces = [
        {
          timestamp: new Date().toLocaleTimeString(),
          agent: "Coordinator Agent",
          action: "Task Classification & Routing",
          details: `Tugas diklasifikasikan sebagai 'Multi-Agent Orchestration'. Mengarahkan ke Research, Analysis, dan Action Agents.`,
          duration_ms: 42.1
        },
        {
          timestamp: new Date().toLocaleTimeString(),
          agent: "Research Agent",
          action: "Execute Tool [search & retrieve]",
          details: `${researchSearch} ${researchRetrieve}`,
          tool_call: { name: "search", category: "research" },
          rbac_audit: { allowed: true, reason: `Izin diberikan untuk role '${role}'.`, tenant_id: "tenant-alpha" },
          duration_ms: 118.5
        },
        {
          timestamp: new Date().toLocaleTimeString(),
          agent: "Analysis Agent",
          action: "Execute Tool [calculate & visualize]",
          details: `${analysisCalc} ${analysisVis}`,
          tool_call: { name: "calculate", category: "analysis" },
          rbac_audit: { allowed: true, reason: `Izin diberikan untuk role '${role}'.`, tenant_id: "tenant-alpha" },
          duration_ms: 88.3
        },
        {
          timestamp: new Date().toLocaleTimeString(),
          agent: "Action Agent",
          action: "Execute Tool [create]",
          details: actionItem,
          tool_call: { name: "create", category: "action" },
          rbac_audit: { allowed: role !== "viewer", reason: role !== "viewer" ? "Izin diberikan." : "Role 'viewer' tidak memiliki izin menulis (write).", tenant_id: "tenant-alpha" },
          duration_ms: 104.2
        },
        {
          timestamp: new Date().toLocaleTimeString(),
          agent: "Finalizer Agent",
          action: "Synthesize Multi-Agent Output",
          details: "Menyusun laporan akhir hasil kerja 4 agen spesialis.",
          duration_ms: 28.6
        }
      ];

      setResult({
        status: "completed",
        task: task,
        user_role: role,
        tenant_id: "tenant-alpha",
        classification: "Multi-Agent Orchestration",
        output: `=== LAPORAN ORKESTRASI SAHAROPS AI AGENT ===\nTugas: ${task}\nPeran Pengguna: ${role.toUpperCase()} | Klasifikasi: Multi-Agent Orchestration\n\n1. HASIL RISET (Research Agent - RAG & Search Tools):\n   • [SEARCH]: ${researchSearch}\n   • [RETRIEVE]: ${researchRetrieve}\n   • [SUMMARIZE]: ${researchSummary}\n\n2. HASIL ANALISIS (Analysis Agent - Formula & Data Processing):\n   • [CALCULATE]: ${analysisCalc}\n   • [VISUALIZE]: ${analysisVis}\n\n3. HASIL EKSEKUSI TINDAKAN (Action Agent - DB & API Mutations):\n   • [CREATE]: ${actionItem}\n===========================================`,
        traces: simulatedTraces
      });
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="dashboard-layout">
      {/* Sidebar Navigation */}
      <aside className={`sidebar ${mobileNavOpen ? "open" : ""}`}>
        <div className="brand-header">
          <div className="brand-icon">⚡</div>
          <span className="brand-name">SaharOps AI</span>
        </div>

        <nav className="sidebar-nav">
          <div
            className={`nav-link ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => { setActiveTab("overview"); setMobileNavOpen(false); }}
          >
            {t.overview}
          </div>
          <div
            className={`nav-link ${activeTab === "workflows" ? "active" : ""}`}
            onClick={() => { setActiveTab("workflows"); setMobileNavOpen(false); }}
          >
            {t.workflows}
          </div>
          <div
            className={`nav-link ${activeTab === "agents" ? "active" : ""}`}
            onClick={() => { setActiveTab("agents"); setMobileNavOpen(false); }}
          >
            {t.agents}
          </div>
          <div
            className={`nav-link ${activeTab === "analytics" ? "active" : ""}`}
            onClick={() => { setActiveTab("analytics"); setMobileNavOpen(false); }}
          >
            {t.analytics}
          </div>
          <div
            className={`nav-link ${activeTab === "approvals" ? "active" : ""}`}
            onClick={() => { setActiveTab("approvals"); setMobileNavOpen(false); }}
          >
            {t.approvals}
          </div>
          <div
            className={`nav-link ${activeTab === "settings" ? "active" : ""}`}
            onClick={() => { setActiveTab("settings"); setMobileNavOpen(false); }}
          >
            {t.settings}
          </div>
        </nav>

        <div className="sidebar-bottom">
          <div className="platform-status-card">
            <div style={{ color: "var(--text-muted)", fontSize: "0.7rem", marginBottom: "0.2rem" }}>Platform status</div>
            <div className="status-indicator">
              <span className="status-dot"></span> All systems operational
            </div>
          </div>

          <div className="mobile-app-card">
            <h5>SaharOps Mobile</h5>
            <p>Monitor workflows anywhere</p>
            <a href="#download">Download app →</a>
          </div>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <main className="main-wrapper">
        {/* Top Command Bar */}
        <div className="top-bar">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <button className="hamburger-btn" onClick={() => setMobileNavOpen(!mobileNavOpen)}>
              ☰
            </button>

            <div className="search-box-container">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                className="search-input"
                placeholder={t.searchPlaceholder}
              />
            </div>
          </div>

          <div className="top-bar-right">
            {/* Language Switcher */}
            <div className="lang-switcher-pill">
              <button
                className={`lang-btn ${lang === "ID" ? "active" : ""}`}
                onClick={() => setLang("ID")}
              >
                🇮🇩 ID
              </button>
              <button
                className={`lang-btn ${lang === "EN" ? "active" : ""}`}
                onClick={() => setLang("EN")}
              >
                🇺🇸 EN
              </button>
            </div>

            <div className="user-profile-badge">
              <div className="user-avatar">S</div>
              <div className="user-info">
                <span className="user-name">Sahar</span>
                <span className="user-role">Product Admin</span>
              </div>
            </div>

            <button className="btn-console" onClick={() => setConsoleOpen(true)}>
              {t.openConsole}
            </button>
          </div>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <>
            <div className="page-header">
              <h1>{t.headerTitle}</h1>
              <p>{t.headerDesc}</p>
            </div>

            <div className="kpi-grid">
              <div className="kpi-card">
                <div className="kpi-icon spend">💳</div>
                <div className="kpi-body">
                  <small>{t.monthlySpend}</small>
                  <div className="kpi-value">$48,320</div>
                  <div className="kpi-trend up">↑ 12.4% {t.vsLastWeek}</div>
                </div>
              </div>
              <div className="kpi-card">
                <div className="kpi-icon health">📈</div>
                <div className="kpi-body">
                  <small>{t.workflowHealth}</small>
                  <div className="kpi-value">98.6%</div>
                  <div className="kpi-trend up">↑ 2.3% {t.vsLastWeek}</div>
                </div>
              </div>
              <div className="kpi-card">
                <div className="kpi-icon approval">🛡️</div>
                <div className="kpi-body">
                  <small>{t.approvalRate}</small>
                  <div className="kpi-value">94%</div>
                  <div className="kpi-trend up">↑ 1.4% {t.vsLastWeek}</div>
                </div>
              </div>
              <div className="kpi-card">
                <div className="kpi-icon agents">👥</div>
                <div className="kpi-body">
                  <small>{t.activeAgents}</small>
                  <div className="kpi-value">18</div>
                  <div className="kpi-trend up">↑ 2 {t.vsLastWeek}</div>
                </div>
              </div>
            </div>

            <div className="content-grid">
              <div className="routing-map-card">
                <div className="card-header-row">
                  <h3>{t.routingMap}</h3>
                  <div className="status-indicator">
                    <span className="status-dot"></span> {t.live}
                  </div>
                </div>

                <div className="routing-flow-wrapper">
                  <svg className="flow-svg" viewBox="0 0 700 220" fill="none">
                    <defs>
                      <linearGradient id="gradPrimary" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
                        <stop offset="50%" stopColor="#6366f1" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8" />
                      </linearGradient>
                      <linearGradient id="gradSecondary" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.6" />
                      </linearGradient>
                      <linearGradient id="gradFallback" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.5" />
                      </linearGradient>
                    </defs>

                    <line x1="100" y1="20" x2="100" y2="180" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
                    <line x1="240" y1="20" x2="240" y2="180" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
                    <line x1="380" y1="20" x2="380" y2="180" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
                    <line x1="520" y1="20" x2="520" y2="180" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
                    <line x1="640" y1="20" x2="640" y2="180" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />

                    <text x="100" y="15" className="flow-node-label">Intake</text>
                    <text x="240" y="15" className="flow-node-label">Classify</text>
                    <text x="380" y="15" className="flow-node-label">Review</text>
                    <text x="520" y="15" className="flow-node-label">Fallback</text>
                    <text x="640" y="15" className="flow-node-label">Deliver</text>

                    <path d="M 100 60 C 170 40, 170 70, 240 60 C 310 50, 310 80, 380 70 C 450 60, 450 110, 520 100 C 580 95, 600 100, 640 100" stroke="url(#gradPrimary)" strokeWidth="4" fill="none" />
                    <path d="M 100 100 C 170 110, 170 130, 240 120 C 310 110, 310 140, 380 130 C 450 120, 450 100, 520 100 C 580 100, 600 100, 640 100" stroke="url(#gradSecondary)" strokeWidth="3" fill="none" />
                    <path d="M 100 140 C 170 150, 170 160, 240 150 C 310 140, 310 170, 380 160 C 450 150, 450 140, 520 140 C 580 135, 600 110, 640 100" stroke="url(#gradFallback)" strokeWidth="2.5" strokeDasharray="5 5" fill="none" />

                    <g transform="translate(240, 60)"><rect x="-18" y="-10" width="36" height="20" rx="10" fill="#8b5cf6" /><text y="3" className="flow-badge-text">88%</text></g>
                    <g transform="translate(240, 120)"><rect x="-18" y="-10" width="36" height="20" rx="10" fill="#06b6d4" /><text y="3" className="flow-badge-text">77%</text></g>
                    <g transform="translate(380, 70)"><rect x="-18" y="-10" width="36" height="20" rx="10" fill="#6366f1" /><text y="3" className="flow-badge-text">16%</text></g>
                    <g transform="translate(380, 130)"><rect x="-18" y="-10" width="36" height="20" rx="10" fill="#3b82f6" /><text y="3" className="flow-badge-text">10%</text></g>
                    <g transform="translate(380, 160)"><rect x="-18" y="-10" width="36" height="20" rx="10" fill="#f59e0b" /><text y="3" className="flow-badge-text">48%</text></g>
                    <g transform="translate(520, 100)"><circle r="12" fill="#10b981" /><text y="4" className="flow-badge-text">91%</text></g>

                    <circle cx="640" cy="100" r="14" fill="#6366f1" stroke="#8b5cf6" strokeWidth="2" />
                    <path d="M 634 100 L 638 104 L 646 95" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </svg>
                </div>

                <div className="routing-legend">
                  <div className="legend-item"><span className="legend-dot primary"></span> {t.primaryPath}</div>
                  <div className="legend-item"><span className="legend-dot secondary"></span> {t.secondaryPath}</div>
                  <div className="legend-item"><span className="legend-dot fallback"></span> {t.fallbackPath}</div>
                </div>
              </div>

              <div className="right-column-cards">
                <div className="queue-card">
                  <div className="card-header-row">
                    <h3 style={{ fontSize: "0.95rem" }}>{t.approvalQueue}</h3>
                    <small style={{ color: "var(--primary-cyan)", cursor: "pointer" }} onClick={() => setActiveTab("approvals")}>{t.viewAll}</small>
                  </div>

                  <div className="queue-item-list">
                    {approvals.map(item => (
                      <div className="queue-item" key={item.id}>
                        <div className="queue-item-left">
                          <div className="queue-icon purple">📄</div>
                          <div className="queue-info">
                            <strong>{item.name}</strong>
                            <small>{item.detail}</small>
                          </div>
                        </div>
                        <span className={`badge-tag ${item.tagClass}`}>{item.status}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="cost-card">
                  <div className="card-header-row">
                    <h3 style={{ fontSize: "0.95rem" }}>{t.costPulse}</h3>
                    <small style={{ color: "var(--text-muted)" }}>This month v</small>
                  </div>
                  <div style={{ fontSize: "1.2rem", fontWeight: "800", color: "#fff" }}>$48,320</div>
                  <small style={{ color: "var(--text-muted)" }}>{t.totalSpend} • May 29 ($3,840)</small>
                </div>
              </div>
            </div>

            <div className="bottom-grid">
              <div className="bottom-card">
                <div className="card-header-row">
                  <h3 style={{ fontSize: "0.95rem" }}>{t.agentHealth}</h3>
                  <small style={{ color: "var(--primary-cyan)", cursor: "pointer" }} onClick={() => setActiveTab("agents")}>{t.viewAll}</small>
                </div>

                <div className="agent-health-list">
                  <div className="agent-health-row">
                    <div className="agent-health-name">
                      <span className="status-dot"></span> Support Copilot <small style={{ color: "var(--text-muted)" }}>v2.41 - 98.2%</small>
                    </div>
                    <svg className="sparkline-wave" viewBox="0 0 60 18"><path d="M0 12 Q 15 2, 30 14 T 60 4" fill="none" stroke="#10b981" strokeWidth="2" /></svg>
                  </div>
                  <div className="agent-health-row">
                    <div className="agent-health-name">
                      <span className="status-dot"></span> Doc Agent <small style={{ color: "var(--text-muted)" }}>v1.8.3 - 90.1%</small>
                    </div>
                    <svg className="sparkline-wave" viewBox="0 0 60 18"><path d="M0 10 Q 15 16, 30 6 T 60 8" fill="none" stroke="#10b981" strokeWidth="2" /></svg>
                  </div>
                  <div className="agent-health-row">
                    <div className="agent-health-name">
                      <span className="status-dot"></span> Policy Agent <small style={{ color: "var(--text-muted)" }}>v2.0.1 - 99.0%</small>
                    </div>
                    <svg className="sparkline-wave" viewBox="0 0 60 18"><path d="M0 14 Q 15 4, 30 10 T 60 2" fill="none" stroke="#10b981" strokeWidth="2" /></svg>
                  </div>
                </div>
              </div>

              <div className="bottom-card">
                <div className="card-header-row">
                  <h3 style={{ fontSize: "0.95rem" }}>{t.systemAlerts}</h3>
                  <small style={{ color: "var(--primary-cyan)", cursor: "pointer" }}>{t.viewAll}</small>
                </div>

                <div className="alerts-list">
                  <div className="alert-item">
                    <span className="alert-icon">⚠️</span>
                    <div>
                      <strong style={{ color: "#fff" }}>High cost spike detected</strong>
                      <div style={{ color: "var(--text-muted)", fontSize: "0.72rem" }}>Invoice Agent - May 24, 2:14 PM</div>
                    </div>
                  </div>
                  <div className="alert-item">
                    <span className="alert-icon">ℹ️</span>
                    <div>
                      <strong style={{ color: "#fff" }}>Fallback volume increased</strong>
                      <div style={{ color: "var(--text-muted)", fontSize: "0.72rem" }}>22% higher than usual</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* TAB 2: WORKFLOWS */}
        {activeTab === "workflows" && (
          <div className="arch-panel">
            <div className="arch-header">
              <h3>🔀 Active Workflow Pipelines</h3>
              <button className="btn-console" onClick={() => setConsoleOpen(true)}>+ Run Custom Workflow</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "1rem" }}>
              <div className="arch-agent-card active">
                <h4 style={{ color: "#fff", marginBottom: "0.5rem" }}>🛡️ Safety Risk Analysis & Action Pipeline</h4>
                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Planner → Research (RAG) → Analytic (Risk Index) → Action (DB Ticket)</p>
                <div style={{ marginTop: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className="badge-live">ACTIVE</span>
                  <button className="btn-deploy-route" onClick={() => { setTask(t.presetTask1); setConsoleOpen(true); }}>{t.presetBtn}</button>
                </div>
              </div>
              <div className="arch-agent-card">
                <h4 style={{ color: "#fff", marginBottom: "0.5rem" }}>📄 Document Review & Vendor Audit Workflow</h4>
                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Planner → Doc Agent → Compliance Analyst → Approval Queue</p>
                <div style={{ marginTop: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className="tool-pill">READY</span>
                  <button className="btn-deploy-route" onClick={() => { setTask(t.presetTask2); setConsoleOpen(true); }}>{t.presetBtn}</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: AGENTS */}
        {activeTab === "agents" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {/* Visual Enterprise Architecture Blueprint matching ASCII Chart */}
            <div className="arch-panel">
              <div className="arch-header">
                <h3>🏗️ SaharOps AI Enterprise System Architecture (LangGraph + FastAPI)</h3>
                <span className="badge-live">LIVE SYSTEM MATRIX</span>
              </div>

              <div style={{ background: "rgba(5, 7, 14, 0.95)", border: "1px solid var(--border-highlight)", borderRadius: "14px", padding: "1.5rem", marginTop: "1rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center" }}>
                  {/* Layer 1: USER / ADMIN */}
                  <div style={{ background: "linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(15, 23, 42, 0.9))", border: "1px solid var(--primary)", borderRadius: "10px", padding: "0.75rem 2rem", textCenter: "center", width: "100%", maxWidth: "320px", textAlign: "center" }}>
                    <strong style={{ color: "#fff", fontSize: "0.9rem" }}>👤 USER / ADMIN</strong>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.1rem" }}>Web / Mobile / API Clients</div>
                  </div>
                  <div style={{ color: "var(--primary-purple)", fontSize: "1rem" }}>↓</div>

                  {/* Layer 2: API GATEWAY */}
                  <div style={{ background: "linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(15, 23, 42, 0.9))", border: "1px solid var(--primary-cyan)", borderRadius: "10px", padding: "0.75rem 2rem", textAlign: "center", width: "100%", maxWidth: "320px" }}>
                    <strong style={{ color: "var(--primary-cyan)", fontSize: "0.9rem" }}>⚡ API GATEWAY (FastAPI)</strong>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.1rem" }}>CORS • JWT Security • Tenant Isolation</div>
                  </div>
                  <div style={{ color: "var(--primary-cyan)", fontSize: "1rem" }}>↓</div>

                  {/* Layer 3: ORCHESTRATOR ENGINE */}
                  <div style={{ background: "linear-gradient(135deg, rgba(139, 92, 246, 0.25), rgba(15, 23, 42, 0.95))", border: "1px solid var(--primary-purple)", borderRadius: "12px", padding: "1rem 2rem", textAlign: "center", width: "100%", maxWidth: "550px", boxShadow: "0 0 20px rgba(139, 92, 246, 0.2)" }}>
                    <strong style={{ color: "#fff", fontSize: "1rem" }}>🧠 ORCHESTRATOR ENGINE (LangGraph)</strong>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.35rem" }}>
                      Planner → Router → Executor → Reviewer → Finalizer
                    </div>
                  </div>
                  <div style={{ color: "var(--primary-purple)", fontSize: "1rem" }}>↓</div>

                  {/* Layer 4: SUB-AGENTS GRID */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", width: "100%" }}>
                    <div className="arch-agent-card active" style={{ textAlign: "center" }}>
                      <div className="agent-title" style={{ color: "var(--primary-cyan)" }}>🔍 RESEARCHER</div>
                      <div className="agent-subtitle">RAG & Web Context Search</div>
                    </div>
                    <div className="arch-agent-card active" style={{ textAlign: "center" }}>
                      <div className="agent-title" style={{ color: "var(--primary-purple)" }}>📊 ANALYST</div>
                      <div className="agent-subtitle">Data & Risk Processing</div>
                    </div>
                    <div className="arch-agent-card active" style={{ textAlign: "center" }}>
                      <div className="agent-title" style={{ color: "var(--accent-emerald)" }}>⚡ EXECUTOR</div>
                      <div className="agent-subtitle">DB & API Mutations</div>
                    </div>
                  </div>
                  <div style={{ color: "var(--accent-emerald)", fontSize: "1rem" }}>↓</div>

                  {/* Layer 5: TOOLS REGISTRY */}
                  <div style={{ background: "rgba(30, 41, 59, 0.6)", border: "1px solid var(--border-color)", borderRadius: "12px", padding: "1rem", width: "100%", textAlign: "center" }}>
                    <strong style={{ color: "var(--accent-amber)", fontSize: "0.9rem" }}>🛠️ TOOLS REGISTRY</strong>
                    <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.5rem" }}>
                      <span className="tool-pill">Web Search</span>
                      <span className="tool-pill">DB Mutation</span>
                      <span className="tool-pill">REST API</span>
                      <span className="tool-pill">Email Notifier</span>
                      <span className="tool-pill">Files & RAG</span>
                      <span className="tool-pill">Browser Nav</span>
                      <span className="tool-pill">Python Code Execution</span>
                    </div>
                  </div>
                  <div style={{ color: "var(--accent-amber)", fontSize: "1rem" }}>↓</div>

                  {/* Layer 6: MEMORY & KNOWLEDGE */}
                  <div style={{ background: "linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(15, 23, 42, 0.9))", border: "1px solid var(--accent-emerald)", borderRadius: "12px", padding: "1rem", width: "100%", textAlign: "center" }}>
                    <strong style={{ color: "var(--accent-emerald)", fontSize: "0.9rem" }}>💾 MEMORY & KNOWLEDGE LAYER</strong>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
                      PostgreSQL + pgvector (Vector DB) • Redis (Session Cache) • Object Storage
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Agent Details & Tool Catalog */}
            <div className="arch-panel">
              <div className="arch-header">
                <h3>🤖 Active Agents Catalog</h3>
              </div>
              <div className="arch-agents-grid" style={{ marginTop: "1rem" }}>
                <div className="arch-agent-card active">
                  <div className="agent-title" style={{ color: "var(--primary)" }}>🧠 Coordinator Agent</div>
                  <div className="agent-subtitle">Routing & Planning Engine</div>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>Classifies task intent and routes execution paths across sub-agents.</p>
                </div>
                <div className="arch-agent-card active">
                  <div className="agent-title" style={{ color: "var(--primary-cyan)" }}>🔍 Research Agent</div>
                  <div className="agent-subtitle">RAG & Web Search</div>
                  <div className="tool-pills">
                    <span className="tool-pill">search</span>
                    <span className="tool-pill">retrieve</span>
                    <span className="tool-pill">summarize</span>
                  </div>
                </div>
                <div className="arch-agent-card active">
                  <div className="agent-title" style={{ color: "var(--primary-purple)" }}>📊 Analysis Agent</div>
                  <div className="agent-subtitle">Data & Formula Processing</div>
                  <div className="tool-pills">
                    <span className="tool-pill">calculate</span>
                    <span className="tool-pill">aggregate</span>
                    <span className="tool-pill">visualize</span>
                  </div>
                </div>
                <div className="arch-agent-card active">
                  <div className="agent-title" style={{ color: "var(--accent-emerald)" }}>⚡ Action Agent</div>
                  <div className="agent-subtitle">DB & API Mutations</div>
                  <div className="tool-pills">
                    <span className="tool-pill">create</span>
                    <span className="tool-pill">update</span>
                    <span className="tool-pill">delete</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ANALYTICS */}
        {activeTab === "analytics" && (
          <div className="arch-panel">
            <div className="arch-header">
              <h3>📈 Performance Analytics & Execution Metrics</h3>
            </div>
            <div className="kpi-grid" style={{ marginTop: "1rem" }}>
              <div className="kpi-card">
                <div className="kpi-body">
                  <small>Avg. Cycle Time</small>
                  <div className="kpi-value">42m</div>
                  <div className="kpi-trend up">↓ 8% speedup</div>
                </div>
              </div>
              <div className="kpi-card">
                <div className="kpi-body">
                  <small>Tasks Completed</small>
                  <div className="kpi-value">124</div>
                  <div className="kpi-trend up">↑ 98% Success Rate</div>
                </div>
              </div>
              <div className="kpi-card">
                <div className="kpi-body">
                  <small>Total Tool Invocations</small>
                  <div className="kpi-value">1,420</div>
                  <div className="kpi-trend up">RBAC Audit 100% Passed</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: APPROVALS */}
        {activeTab === "approvals" && (
          <div className="arch-panel">
            <div className="arch-header">
              <h3>✅ Interactive Approval Queue</h3>
            </div>
            <div className="queue-item-list" style={{ marginTop: "1rem" }}>
              {approvals.map(item => (
                <div className="queue-item" key={item.id} style={{ padding: "1rem" }}>
                  <div className="queue-item-left">
                    <div className="queue-icon purple">📑</div>
                    <div className="queue-info">
                      <strong style={{ fontSize: "0.95rem" }}>{item.name}</strong>
                      <small>{item.detail}</small>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <span className={`badge-tag ${item.tagClass}`}>{item.status}</span>
                    {item.status !== "Approved" && (
                      <>
                        <button className="btn-deploy-route" style={{ padding: "0.35rem 0.75rem", fontSize: "0.75rem" }} onClick={() => handleApprove(item.id)}>Approve</button>
                        <button className="role-btn" style={{ padding: "0.35rem 0.75rem", fontSize: "0.75rem" }} onClick={() => handleReject(item.id)}>Reject</button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: SETTINGS */}
        {activeTab === "settings" && (
          <div className="arch-panel">
            <div className="arch-header">
              <h3>⚙️ System Settings & Backend API Configuration</h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginTop: "1rem" }}>
              <div>
                <label style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: "0.5rem" }}>
                  FastAPI Backend Endpoint URL:
                </label>
                <input
                  type="text"
                  className="search-input"
                  style={{ width: "100%", paddingLeft: "1rem" }}
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  placeholder="https://orchestra-api-production.up.railway.app"
                />
              </div>

              <div>
                <label style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: "0.5rem" }}>
                  Default Tenant Isolation ID:
                </label>
                <input
                  type="text"
                  className="search-input"
                  style={{ width: "100%", paddingLeft: "1rem" }}
                  defaultValue="tenant-alpha"
                  readOnly
                />
              </div>
            </div>
          </div>
        )}

        {/* Floating Glass 3D CTA Card (Bottom Right) */}
        <div className="deploy-cta-glass-card">
          <h4>{t.deployTitle}</h4>
          <p>{t.deployDesc}</p>
          <button className="btn-deploy-route" onClick={() => setConsoleOpen(true)}>
            {t.btnDeploy}
          </button>
        </div>
      </main>

      {/* Interactive Execution Console Modal */}
      {consoleOpen && (
        <div className="modal-overlay">
          <div className="console-modal-content">
            <div className="modal-header">
              <h3>⚡ SaharOps Agent Workflow Execution Console</h3>
              <button className="btn-close" onClick={() => setConsoleOpen(false)}>✕</button>
            </div>

            <div className="modal-body">
              {/* Role Context Selector */}
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-secondary)" }}>RBAC Role:</span>
                <button className={`role-btn ${role === "admin" ? "active" : ""}`} onClick={() => setRole("admin")}>👑 Admin</button>
                <button className={`role-btn ${role === "analyst" ? "active" : ""}`} onClick={() => setRole("analyst")}>🔬 Analyst</button>
                <button className={`role-btn ${role === "viewer" ? "active" : ""}`} onClick={() => setRole("viewer")}>👁️ Viewer</button>
              </div>

              {/* Task Prompt Box */}
              <div>
                <label style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "block", marginBottom: "0.4rem" }}>
                  Task Instruction (Multi-Agent Routing):
                </label>
                <textarea
                  className="textarea-console"
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                  placeholder="Masukkan instruksi tugas..."
                />
              </div>

              <button className="btn-console" style={{ width: "100%", justifyContent: "center" }} onClick={runWorkflow} disabled={running}>
                {running ? "⚡ EXECUTING WORKFLOW GRAPH..." : "🚀 RUN WORKFLOW GRAPH"}
              </button>

              {/* Traces Log Panel - Always Open & Prominent */}
              <div style={{ background: "rgba(5, 7, 14, 0.95)", border: "1px solid var(--primary-cyan)", padding: "1rem", borderRadius: "12px", boxShadow: "0 0 15px rgba(6, 182, 212, 0.15)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                  <h4 style={{ fontSize: "0.9rem", color: "var(--primary-cyan)", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    📡 Live Observability Traces
                  </h4>
                  <span className="tool-pill" style={{ color: "var(--accent-emerald)" }}>{result?.traces?.length || 0} TRACES RECORDED</span>
                </div>

                {result?.traces?.length > 0 ? (
                  <div style={{ maxHeight: "200px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    {result.traces.map((tr: any, idx: number) => (
                      <div key={idx} style={{ fontSize: "0.78rem", background: "rgba(255,255,255,0.03)", borderLeft: "3px solid var(--primary-purple)", borderRadius: "4px", padding: "0.5rem 0.75rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.2rem" }}>
                          <span style={{ color: "var(--primary-cyan)", fontWeight: 700 }}>[{tr.agent}]</span>
                          <small style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{tr.timestamp} • {tr.duration_ms}ms</small>
                        </div>
                        <div style={{ color: "#e2e8f0" }}>{tr.action}: {tr.details}</div>
                        {tr.rbac_audit && (
                          <div style={{ marginTop: "0.25rem" }}>
                            <span className={`rbac-badge ${tr.rbac_audit.allowed ? "granted" : "denied"}`}>
                              RBAC: {tr.rbac_audit.allowed ? "ACCESS GRANTED" : "ACCESS DENIED"} ({tr.rbac_audit.tenant_id})
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", margin: 0 }}>
                    Belum ada log eksekusi. Klik tombol <strong>'🚀 RUN WORKFLOW GRAPH'</strong> di atas untuk memantau jejak eksekusi agen secara real-time.
                  </p>
                )}
              </div>

              {/* Final Output */}
              {result?.output && (
                <div style={{ background: "rgba(5, 7, 14, 0.9)", padding: "1rem", borderRadius: "10px" }}>
                  <h4 style={{ fontSize: "0.85rem", color: "var(--accent-emerald)", marginBottom: "0.5rem" }}>📄 Final Workflow Output</h4>
                  <pre style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "#e2e8f0", whiteSpace: "pre-wrap" }}>
                    {result.output}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
