import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import "./Dashboard.css";

/* ─── Icons ───────────────────────────────────────────────────────────── */
const IconReports = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);
const IconLibrary = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
  </svg>
);
const IconPeople = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
  </svg>
);
const IconActivities = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const IconGetStarted = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);
const IconSettings = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
  </svg>
);
const IconChevron = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const IconArrowUp = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="18 15 12 9 6 15" />
  </svg>
);
const IconLogout = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

/* ─── Sparkline SVG ───────────────────────────────────────────────────── */
function Sparkline({ points, color = "#4f8ef7", height = 36 }) {
  const w = 110;
  const h = height;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const xs = points.map((_, i) => (i / (points.length - 1)) * w);
  const ys = points.map((v) => h - ((v - min) / range) * (h - 6) - 3);
  const d = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x},${ys[i]}`).join(" ");
  const fill = `${d} L${w},${h} L0,${h} Z`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`sg-${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fill} fill={`url(#sg-${color.replace("#","")})`} />
      <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ─── Activity Bar Chart ──────────────────────────────────────────────── */
function ActivityChart() {
  const months = ["JAN", "FEB", "MAR", "APR"];
  const values = [180, 290, 220, 380];
  const max = Math.max(...values);
  return (
    <div className="db-activity-chart">
      <div className="db-bar-group">
        {values.map((v, i) => (
          <div key={i} className="db-bar-col">
            <div className="db-bar-wrap">
              <div className="db-bar" style={{ height: `${(v / max) * 100}%` }} />
            </div>
            <span className="db-bar-label">{months[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Stat Card ───────────────────────────────────────────────────────── */
function StatCard({ label, value, sub, sparkPoints, sparkColor, wide }) {
  return (
    <div className={`db-stat-card${wide ? " db-stat-card--wide" : ""}`}>
      <span className="db-stat-label">{label}</span>
      <div className="db-stat-body">
        <span className="db-stat-value">{value}</span>
        {sub && <span className="db-stat-sub">{sub}</span>}
      </div>
      {sparkPoints && (
        <div className="db-stat-spark">
          <Sparkline points={sparkPoints} color={sparkColor} />
        </div>
      )}
    </div>
  );
}

/* ─── Topic Row ───────────────────────────────────────────────────────── */
function TopicRow({ name, pct, color, img }) {
  return (
    <div className="db-topic-row">
      <div className="db-topic-thumb" style={{ background: color + "22" }}>
        <span style={{ fontSize: 18 }}>{img}</span>
      </div>
      <div className="db-topic-info">
        <span className="db-topic-name">{name}</span>
        <div className="db-topic-bar-wrap">
          <div className="db-topic-bar" style={{ width: `${pct}%`, background: color }} />
        </div>
      </div>
      <span className="db-topic-pct" style={{ color }}>{pct}% Correct</span>
    </div>
  );
}

/* ─── Leaderboard Row ─────────────────────────────────────────────────── */
function LeaderRow({ rank, name, sub, score }) {
  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const avatarColors = ["#4f8ef7", "#f7694f", "#4fcf7a", "#c47af7", "#f7b24f"];
  const bg = avatarColors[rank % avatarColors.length];
  return (
    <div className="db-leader-row">
      <div className="db-leader-left">
        <span className="db-leader-rank">{rank}</span>
        <span className="db-leader-avatar" style={{ background: bg }}>{initials}</span>
        <div className="db-leader-info">
          <span className="db-leader-name">{name}</span>
          <span className="db-leader-sub">{sub}</span>
        </div>
      </div>
      <div className="db-leader-right">
        <span className="db-leader-score">{score}</span>
        <span className="db-leader-up"><IconArrowUp /></span>
      </div>
    </div>
  );
}

/* ─── Sidebar ─────────────────────────────────────────────────────────── */
function Sidebar({ active, setActive, onLogout }) {
  const mainNav = [
    { key: "reports", label: "Reports", icon: <IconReports /> },
    { key: "library", label: "Library", icon: <IconLibrary /> },
    { key: "people", label: "People", icon: <IconPeople /> },
    { key: "activities", label: "Activities", icon: <IconActivities /> },
  ];
  const supportNav = [
    { key: "getstarted", label: "Get Started", icon: <IconGetStarted /> },
    { key: "settings", label: "Settings", icon: <IconSettings /> },
  ];

  return (
    <aside className="db-sidebar">
      {/* Logo */}
      <div className="db-sidebar-logo">
        <span className="db-logo-text">Taskly</span>
        <span className="db-logo-dot" />
      </div>

      {/* Main nav */}
      <nav className="db-sidebar-nav">
        {mainNav.map((item) => (
          <button
            key={item.key}
            className={`db-nav-item${active === item.key ? " db-nav-item--active" : ""}`}
            onClick={() => setActive(item.key)}
          >
            <span className="db-nav-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* Support */}
      <div className="db-sidebar-section-label">Support</div>
      <nav className="db-sidebar-nav">
        {supportNav.map((item) => (
          <button
            key={item.key}
            className={`db-nav-item${active === item.key ? " db-nav-item--active" : ""}`}
            onClick={() => setActive(item.key)}
          >
            <span className="db-nav-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* Logout at bottom */}
      <div className="db-sidebar-footer">
        <button className="db-logout-btn" onClick={onLogout}>
          <IconLogout /> Log out
        </button>
      </div>
    </aside>
  );
}

/* ─── Reports Page ────────────────────────────────────────────────────── */
function ReportsPage() {
  const [timeframe, setTimeframe] = useState("All-time");
  const [people, setPeople] = useState("All");

  const weakTopics = [
    { name: "Food Safety", pct: 74, color: "#f7694f", img: "🍔" },
    { name: "Compliance Basics Procedures", pct: 52, color: "#f7b24f", img: "📋" },
    { name: "Company Networking", pct: 36, color: "#f7694f", img: "🌐" },
  ];
  const strongTopics = [
    { name: "Covid Protocols", pct: 97, color: "#4fcf7a", img: "😷" },
    { name: "Cyber Security", pct: 94, color: "#4fcf7a", img: "🔒" },
    { name: "Social Media Policy", pct: 91, color: "#4f8ef7", img: "📱" },
  ];
  const userLeaders = [
    { rank: 1, name: "Jesse Thomas", sub: "637 Points · 98% Correct", score: 1 },
    { rank: 2, name: "Maria Santos", sub: "580 Points · 95% Correct", score: 2 },
    { rank: 3, name: "Kenji Watanabe", sub: "544 Points · 93% Correct", score: 3 },
  ];
  const groupLeaders = [
    { rank: 1, name: "Houston Facility", sub: "52 Points · 97% Correct", score: 1 },
    { rank: 2, name: "Austin Team", sub: "48 Points · 94% Correct", score: 2 },
    { rank: 3, name: "NYC Office", sub: "41 Points · 91% Correct", score: 3 },
  ];

  return (
    <main className="db-main">
      {/* Page Header */}
      <div className="db-page-header">
        <h1 className="db-page-title">Reports</h1>
      </div>

      {/* Filters */}
      <div className="db-filters">
        <div className="db-filter-select">
          <span className="db-filter-label">Timeframe:</span>
          <select
            className="db-filter-control"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
          >
            <option>All-time</option>
            <option>Last 30 days</option>
            <option>Last 7 days</option>
            <option>This month</option>
          </select>
          <IconChevron />
        </div>
        <div className="db-filter-select">
          <span className="db-filter-label">People:</span>
          <select
            className="db-filter-control"
            value={people}
            onChange={(e) => setPeople(e.target.value)}
          >
            <option>All</option>
            <option>My Team</option>
            <option>Managers</option>
          </select>
          <IconChevron />
        </div>
      </div>

      {/* Top stat cards */}
      <div className="db-stats-row">
        <StatCard label="Active Users" value="27" sub="/80" />
        <StatCard label="Questions Answered" value="3,298" />
        <StatCard label="Av. Session Length" value="2m 34s" />
        <div className="db-stat-card db-stat-card--chart">
          <span className="db-stat-label">Activity</span>
          <ActivityChart />
        </div>
      </div>

      {/* Knowledge stat cards */}
      <div className="db-stats-row db-stats-row--knowledge">
        <StatCard
          label="Starting Knowledge"
          value="64%"
          sparkPoints={[40, 38, 45, 42, 55, 50, 60, 58, 64]}
          sparkColor="#4f8ef7"
        />
        <StatCard
          label="Current Knowledge"
          value="86%"
          sparkPoints={[60, 65, 63, 70, 72, 75, 80, 82, 86]}
          sparkColor="#4f8ef7"
        />
        <StatCard
          label="Knowledge Gain"
          value="+34%"
          sparkPoints={[5, 8, 12, 10, 18, 22, 25, 28, 34]}
          sparkColor="#4fcf7a"
        />
      </div>

      {/* Topics + Leaderboards */}
      <div className="db-bottom-grid">
        {/* Weakest Topics */}
        <div className="db-card">
          <h3 className="db-card-title">Weakest Topics</h3>
          <div className="db-topic-list">
            {weakTopics.map((t) => (
              <TopicRow key={t.name} {...t} />
            ))}
          </div>
        </div>

        {/* Strongest Topics */}
        <div className="db-card">
          <h3 className="db-card-title">Strongest Topics</h3>
          <div className="db-topic-list">
            {strongTopics.map((t) => (
              <TopicRow key={t.name} {...t} />
            ))}
          </div>
        </div>

        {/* User Leaderboard */}
        <div className="db-card">
          <h3 className="db-card-title">User Leaderboard</h3>
          <div className="db-leader-list">
            {userLeaders.map((l) => (
              <LeaderRow key={l.rank} {...l} />
            ))}
          </div>
        </div>

        {/* Groups Leaderboard */}
        <div className="db-card">
          <h3 className="db-card-title">Groups Leaderboard</h3>
          <div className="db-leader-list">
            {groupLeaders.map((l) => (
              <LeaderRow key={l.rank} {...l} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

/* ─── Placeholder Pages ───────────────────────────────────────────────── */
function PlaceholderPage({ title }) {
  return (
    <main className="db-main db-placeholder">
      <h1 className="db-page-title">{title}</h1>
      <p className="db-placeholder-text">This section is coming soon.</p>
    </main>
  );
}

/* ─── Dashboard Root ──────────────────────────────────────────────────── */
function Dashboard({ user }) {
  const [activeNav, setActiveNav] = useState("reports");
  const handleLogout = async () => { await signOut(auth); };

  const pages = {
    reports: <ReportsPage />,
    library: <PlaceholderPage title="Library" />,
    people: <PlaceholderPage title="People" />,
    activities: <PlaceholderPage title="Activities" />,
    getstarted: <PlaceholderPage title="Get Started" />,
    settings: <PlaceholderPage title="Settings" />,
  };

  return (
    <div className="db-root">
      <Sidebar active={activeNav} setActive={setActiveNav} onLogout={handleLogout} />
      {pages[activeNav] || <ReportsPage />}
    </div>
  );
}

export default Dashboard;
