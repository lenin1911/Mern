import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import "./Dashboard.css";

const MOCK_BOARDS = [
  { id: 1, title: "Product Roadmap", bg: "#0052cc" },
  { id: 2, title: "Design System", bg: "#00875a" },
  { id: 3, title: "Marketing Q3", bg: "#6554c0" },
  { id: 4, title: "Engineering Sprint", bg: "#de350b" },
  { id: 5, title: "Customer Research", bg: "#ff8b00" },
  { id: 6, title: "Hiring Pipeline", bg: "#00a3bf" },
  { id: 7, title: "Bug Tracker", bg: "#403294" },
  { id: 8, title: "Content Calendar", bg: "#006644" },
];

const STARRED = [
  { id: 1, label: "Product Roadmap" },
  { id: 3, label: "Marketing Q3" },
];

const RECENT = [
  { id: 2, label: "Design System" },
  { id: 4, label: "Engineering Sprint" },
  { id: 5, label: "Customer Research" },
];

function Navbar({ user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const name = user?.displayName || user?.email?.split("@")[0] || "User";
  const email = user?.email || "";
  const avatar = name.charAt(0).toUpperCase();

  return (
    <header className="db-navbar">
      <div className="db-nav-left">
        <div className="db-logo">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect width="20" height="20" rx="3" fill="#0052cc"/>
            <rect x="3" y="3" width="6" height="12" rx="1.5" fill="white"/>
            <rect x="11" y="3" width="6" height="8" rx="1.5" fill="white"/>
          </svg>
          <span className="db-logo-text">Taskly</span>
        </div>
        <nav className="db-nav-links">
          <button className="db-nav-btn">Workspaces <span className="db-chevron">▾</span></button>
          <button className="db-nav-btn">Recent <span className="db-chevron">▾</span></button>
          <button className="db-nav-btn">Starred <span className="db-chevron">▾</span></button>
          <button className="db-nav-btn">Templates <span className="db-chevron">▾</span></button>
          <button className="db-nav-create">Create</button>
        </nav>
      </div>

      <div className="db-nav-right">
        <div className="db-search">
          <svg className="db-search-icon" viewBox="0 0 16 16" fill="none">
            <circle cx="6.5" cy="6.5" r="5" stroke="#5e6c84" strokeWidth="1.5"/>
            <path d="M10.5 10.5L14 14" stroke="#5e6c84" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <input type="text" placeholder="Search" className="db-search-input" />
        </div>
        <button className="db-icon-btn" title="Notifications">
          <svg viewBox="0 0 20 20" fill="none" width="18" height="18">
            <path d="M10 2a6 6 0 00-6 6v3l-1.5 2.5h15L16 11V8a6 6 0 00-6-6z" stroke="#5e6c84" strokeWidth="1.5"/>
            <path d="M8.5 17a1.5 1.5 0 003 0" stroke="#5e6c84" strokeWidth="1.5"/>
          </svg>
        </button>
        <button className="db-icon-btn" title="Info">
          <svg viewBox="0 0 20 20" fill="none" width="18" height="18">
            <circle cx="10" cy="10" r="8" stroke="#5e6c84" strokeWidth="1.5"/>
            <path d="M10 9v5M10 7v.5" stroke="#5e6c84" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
        <div className="db-avatar-menu-wrapper">
          <div className="db-avatar-menu" onClick={() => setMenuOpen(!menuOpen)} title="Account">
            <div className="db-avatar">{avatar}</div>
          </div>

          {menuOpen && (
            <>
              <div className="db-dropdown-backdrop" onClick={() => setMenuOpen(false)} />
              <div className="db-profile-dropdown">
                <div className="db-dropdown-header">
                  <span className="db-dropdown-title">ACCOUNT</span>
                  <button className="db-dropdown-close" onClick={() => setMenuOpen(false)}>✕</button>
                </div>

                <div className="db-dropdown-user-info">
                  <div className="db-avatar db-avatar-large">{avatar}</div>
                  <div className="db-user-details">
                    <div className="db-user-name">{name}</div>
                    <div className="db-user-email">{email}</div>
                  </div>
                </div>

                <div className="db-dropdown-divider" />

                <div className="db-dropdown-section">
                  <button className="db-dropdown-item">Profile and visibility</button>
                  <button className="db-dropdown-item">Activity</button>
                  <button className="db-dropdown-item">Cards</button>
                  <button className="db-dropdown-item">Settings</button>
                </div>

                <div className="db-dropdown-divider" />

                <button className="db-dropdown-item db-dropdown-logout" onClick={onLogout}>
                  Log out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function Sidebar({ activeSection, onSection }) {
  const workspaceName = "My Workspace";

  return (
    <aside className="db-sidebar">
      <div className="db-workspace-header">
        <div className="db-workspace-icon">M</div>
        <div>
          <div className="db-workspace-name">{workspaceName}</div>
          <div className="db-workspace-plan">Free</div>
        </div>
        <button className="db-sidebar-toggle">⋮</button>
      </div>

      <nav className="db-sidebar-nav">
        {[
          { id: "boards", label: "Boards", icon: "▦" },
          { id: "members", label: "Members", icon: "👥" },
          { id: "settings", label: "Workspace settings", icon: "⚙" },
        ].map((item) => (
          <button
            key={item.id}
            className={`db-sidebar-item ${activeSection === item.id ? "active" : ""}`}
            onClick={() => onSection(item.id)}
          >
            <span className="db-sidebar-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="db-sidebar-divider" />

      <div className="db-sidebar-section-title">Your boards</div>

      <div className="db-sidebar-group-title">
        <span>★ Starred boards</span>
      </div>
      {STARRED.map((b) => (
        <button key={b.id} className="db-sidebar-board-item">{b.label}</button>
      ))}

      <div className="db-sidebar-group-title" style={{ marginTop: 8 }}>
        <span>🕐 Recently viewed</span>
      </div>
      {RECENT.map((b) => (
        <button key={b.id} className="db-sidebar-board-item">{b.label}</button>
      ))}
    </aside>
  );
}

function BoardCard({ board }) {
  return (
    <div className="db-board-card" style={{ background: board.bg }}>
      <span className="db-board-card-title">{board.title}</span>
      <button className="db-board-star" title="Star board">☆</button>
    </div>
  );
}

function Dashboard({ user }) {
  const [activeSection, setActiveSection] = useState("boards");

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div className="db-root">
      <Navbar user={user} onLogout={handleLogout} />
      <div className="db-body">
        <Sidebar activeSection={activeSection} onSection={setActiveSection} />
        <main className="db-main">
          <h2 className="db-section-heading">
            <span className="db-section-icon">▦</span> Your boards
          </h2>
          <div className="db-boards-grid">
            {MOCK_BOARDS.map((board) => (
              <BoardCard key={board.id} board={board} />
            ))}
            <div className="db-board-card db-board-add">
              <span>Create new board</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
