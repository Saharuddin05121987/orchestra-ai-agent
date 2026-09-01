"use client";

import { useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function CommandCenter() {
  const [consoleOpen, setConsoleOpen] = useState(false);
  const [task, setTask] = useState("Cari data keselamatan kerja, hitung skor risiko, dan buat tiket rekomendasi tindakan.");
  const [role, setRole] = useState("admin");
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<any>(null);

  async function runWorkflow() {
    if (!task.trim()) return;
    setRunning(true);
    setResult(null);

    try {
      const res = await fetch(`${API}/api/v1/workflows/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: task,
          role: role,
          tenant_id: "tenant-alpha"
        })
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({
        status: "error",
        output: "Gagal terhubung ke API Orchestra Engine. Pastikan backend server berjalan di port 8000."
      });
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand-header">
          <div className="brand-icon">⚡</div>
          <span className="brand-name">AetherOps</span>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-link active">📊 Overview</div>
          <div className="nav-link">🔀 Workflows</div>
          <div className="nav-link">🤖 Agents</div>
          <div className="nav-link">📈 Analytics</div>
          <div className="nav-link">✅ Approvals</div>
          <div className="nav-link">⚙️ Settings</div>
        </nav>

        <div className="sidebar-bottom">
          <div className="platform-status-card">
            <div style={{ color: "var(--text-muted)", fontSize: "0.7rem", marginBottom: "0.2rem" }}>Platform status</div>
            <div className="status-indicator">
              <span className="status-dot"></span> All systems operational
            </div>
          </div>

          <div className="mobile-app-card">
            <h5>ModelOps Mobile</h5>
            <p>Monitor workflows anywhere</p>
            <a href="#download">Download app →</a>
          </div>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <main className="main-wrapper">
        {/* Top Command Bar */}
        <div className="top-bar">
          <div className="search-box-container">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search workflows, agents, approvals..."
            />
          </div>

          <div className="top-bar-right">
            <div className="user-profile-badge">
              <div className="user-avatar">S</div>
              <div className="user-info">
                <span className="user-name">Sahar</span>
                <span className="user-role">Product Admin</span>
              </div>
            </div>

            <button className="btn-console" onClick={() => setConsoleOpen(true)}>
              Open Console →
            </button>
          </div>
        </div>

        {/* Page Header */}
        <div className="page-header">
          <h1>AI Workflow Command Center</h1>
          <p>Monitor routing, quality, approvals, cost, and agent health in one place.</p>
        </div>

        {/* 4 KPI Stat Cards */}
        <div className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-icon spend">💳</div>
            <div className="kpi-body">
              <small>Monthly Spend</small>
              <div className="kpi-value">$48,320</div>
              <div className="kpi-trend up">↑ 12.4% vs last week</div>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon health">📈</div>
            <div className="kpi-body">
              <small>Workflow Health</small>
              <div className="kpi-value">98.6%</div>
              <div className="kpi-trend up">↑ 2.3% vs last week</div>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon approval">🛡️</div>
            <div className="kpi-body">
              <small>Approval Rate</small>
              <div className="kpi-value">94%</div>
              <div className="kpi-trend up">↑ 1.4% vs last week</div>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon agents">👥</div>
            <div className="kpi-body">
              <small>Active Agents</small>
              <div className="kpi-value">18</div>
              <div className="kpi-trend up">↑ 2 vs last week</div>
            </div>
          </div>
        </div>

        {/* Main Content Split Grid */}
        <div className="content-grid">
          {/* Left: Workflow Routing Map */}
          <div className="routing-map-card">
            <div className="card-header-row">
              <h3>🔀 Workflow routing map</h3>
              <div className="status-indicator">
                <span className="status-dot"></span> Live
              </div>
            </div>

            {/* SVG Routing Map Node Network */}
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

                {/* Vertical Stage Line Guides */}
                <line x1="100" y1="20" x2="100" y2="180" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
                <line x1="240" y1="20" x2="240" y2="180" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
                <line x1="380" y1="20" x2="380" y2="180" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
                <line x1="520" y1="20" x2="520" y2="180" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
                <line x1="640" y1="20" x2="640" y2="180" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />

                {/* Stage Labels */}
                <text x="100" y="15" className="flow-node-label">Intake</text>
                <text x="240" y="15" className="flow-node-label">Classify</text>
                <text x="380" y="15" className="flow-node-label">Review</text>
                <text x="520" y="15" className="flow-node-label">Fallback</text>
                <text x="640" y="15" className="flow-node-label">Deliver</text>

                {/* Wavy Ribbon Paths */}
                <path d="M 100 60 C 170 40, 170 70, 240 60 C 310 50, 310 80, 380 70 C 450 60, 450 110, 520 100 C 580 95, 600 100, 640 100" stroke="url(#gradPrimary)" strokeWidth="4" fill="none" />
                <path d="M 100 100 C 170 110, 170 130, 240 120 C 310 110, 310 140, 380 130 C 450 120, 450 100, 520 100 C 580 100, 600 100, 640 100" stroke="url(#gradSecondary)" strokeWidth="3" fill="none" />
                <path d="M 100 140 C 170 150, 170 160, 240 150 C 310 140, 310 170, 380 160 C 450 150, 450 140, 520 140 C 580 135, 600 110, 640 100" stroke="url(#gradFallback)" strokeWidth="2.5" strokeDasharray="5 5" fill="none" />

                {/* Node Percentage Badges */}
                <g transform="translate(240, 60)"><rect x="-18" y="-10" width="36" height="20" rx="10" fill="#8b5cf6" /><text y="3" className="flow-badge-text">88%</text></g>
                <g transform="translate(240, 120)"><rect x="-18" y="-10" width="36" height="20" rx="10" fill="#06b6d4" /><text y="3" className="flow-badge-text">77%</text></g>
                <g transform="translate(380, 70)"><rect x="-18" y="-10" width="36" height="20" rx="10" fill="#6366f1" /><text y="3" className="flow-badge-text">16%</text></g>
                <g transform="translate(380, 130)"><rect x="-18" y="-10" width="36" height="20" rx="10" fill="#3b82f6" /><text y="3" className="flow-badge-text">10%</text></g>
                <g transform="translate(380, 160)"><rect x="-18" y="-10" width="36" height="20" rx="10" fill="#f59e0b" /><text y="3" className="flow-badge-text">48%</text></g>
                <g transform="translate(520, 100)"><circle r="12" fill="#10b981" /><text y="4" className="flow-badge-text">91%</text></g>

                {/* Final Deliver Check Icon */}
                <circle cx="640" cy="100" r="14" fill="#6366f1" stroke="#8b5cf6" strokeWidth="2" />
                <path d="M 634 100 L 638 104 L 646 95" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
            </div>

            <div className="routing-legend">
              <div className="legend-item"><span className="legend-dot primary"></span> Primary path (55%)</div>
              <div className="legend-item"><span className="legend-dot secondary"></span> Secondary path (27%)</div>
              <div className="legend-item"><span className="legend-dot fallback"></span> Fallback path (18%)</div>
            </div>
          </div>

          {/* Right: Approval Queue & Cost Pulse */}
          <div className="right-column-cards">
            <div className="queue-card">
              <div className="card-header-row">
                <h3 style={{ fontSize: "0.95rem" }}>📋 Approval queue</h3>
                <small style={{ color: "var(--primary-cyan)", cursor: "pointer" }}>View all →</small>
              </div>

              <div className="queue-item-list">
                <div className="queue-item">
                  <div className="queue-item-left">
                    <div className="queue-icon purple">📑</div>
                    <div className="queue-info">
                      <strong>Contract Reviewer</strong>
                      <small>Vendor Agreement - $120,000</small>
                    </div>
                  </div>
                  <span className="badge-tag review">Needs review</span>
                </div>

                <div className="queue-item">
                  <div className="queue-item-left">
                    <div className="queue-icon blue">🧾</div>
                    <div className="queue-info">
                      <strong>Invoice Agent</strong>
                      <small>INV-8732 - $8,450.20</small>
                    </div>
                  </div>
                  <span className="badge-tag approved">Approved</span>
                </div>

                <div className="queue-item">
                  <div className="queue-item-left">
                    <div className="queue-icon amber">🎧</div>
                    <div className="queue-info">
                      <strong>Support Copilot</strong>
                      <small>Policy Update - v2.4</small>
                    </div>
                  </div>
                  <span className="badge-tag action">Action req.</span>
                </div>
              </div>
            </div>

            <div className="cost-card">
              <div className="card-header-row">
                <h3 style={{ fontSize: "0.95rem" }}>📈 Cost pulse</h3>
                <small style={{ color: "var(--text-muted)" }}>This month v</small>
              </div>
              <div style={{ fontSize: "1.2rem", fontWeight: "800", color: "#fff" }}>$48,320</div>
              <small style={{ color: "var(--text-muted)" }}>Total spend • May 29 ($3,840)</small>
            </div>
          </div>
        </div>

        {/* Bottom Grid Cards */}
        <div className="bottom-grid">
          {/* Agent Health */}
          <div className="bottom-card">
            <div className="card-header-row">
              <h3 style={{ fontSize: "0.95rem" }}>🩺 Agent health</h3>
              <small style={{ color: "var(--primary-cyan)", cursor: "pointer" }}>View all →</small>
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

          {/* System Alerts */}
          <div className="bottom-card">
            <div className="card-header-row">
              <h3 style={{ fontSize: "0.95rem" }}>⚠️ System alerts</h3>
              <small style={{ color: "var(--primary-cyan)", cursor: "pointer" }}>View all →</small>
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

        {/* Floating Glass 3D CTA Card (Bottom Right) */}
        <div className="deploy-cta-glass-card">
          <h4>Deploy smarter routes</h4>
          <p>Optimize performance, cost, and reliability with intelligent routing.</p>
          <button className="btn-deploy-route" onClick={() => setConsoleOpen(true)}>
            ⚡ Deploy Route
          </button>
        </div>
      </main>

      {/* Interactive Execution Console Modal */}
      {consoleOpen && (
        <div className="modal-overlay">
          <div className="console-modal-content">
            <div className="modal-header">
              <h3>⚡ Orchestra Agent Workflow Execution Console</h3>
              <button className="btn-close" onClick={() => setConsoleOpen(false)}>✕</button>
            </div>

            <div className="modal-body">
              {/* Role Context Selector */}
              <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
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

              {/* Traces Log */}
              {result?.traces?.length > 0 && (
                <div style={{ background: "rgba(5, 7, 14, 0.9)", padding: "1rem", borderRadius: "10px", maxHeight: "250px", overflowY: "auto" }}>
                  <h4 style={{ fontSize: "0.85rem", color: "var(--primary-cyan)", marginBottom: "0.5rem" }}>📡 Live Observability Traces</h4>
                  {result.traces.map((tr: any, idx: number) => (
                    <div key={idx} style={{ fontSize: "0.78rem", borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "0.35rem 0" }}>
                      <span style={{ color: "var(--primary-purple)", fontWeight: 700 }}>[{tr.agent}]</span> {tr.action}: {tr.details} <small style={{ color: "var(--text-muted)" }}>({tr.duration_ms}ms)</small>
                    </div>
                  ))}
                </div>
              )}

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
