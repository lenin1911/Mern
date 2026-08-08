import { useState, useRef } from "react";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import "./Dashboard.css";

/* ─── Helpers ─────────────────────────────────────────────────────────── */
let _id = 100;
const uid = () => `id-${++_id}`;

const LABEL_COLORS = [
  { id: "l1", color: "#61bd4f", name: "Green" },
  { id: "l2", color: "#f2d600", name: "Yellow" },
  { id: "l3", color: "#ff9f1a", name: "Orange" },
  { id: "l4", color: "#eb5a46", name: "Red" },
  { id: "l5", color: "#c377e0", name: "Purple" },
  { id: "l6", color: "#0079bf", name: "Blue" },
];

/* ─── Initial Data ────────────────────────────────────────────────────── */
const INITIAL_COLUMNS = [
  {
    id: "col-1",
    title: "To Do",
    cards: [
      {
        id: "card-1",
        text: "Design new onboarding flow",
        labels: ["l1", "l6"],
        members: ["AL", "BK"],
        due: "Aug 12",
        dueOverdue: false,
      },
      {
        id: "card-2",
        text: "Write API documentation",
        labels: ["l6"],
        members: ["CJ"],
        due: null,
        dueOverdue: false,
      },
      {
        id: "card-3",
        text: "Set up CI/CD pipeline",
        labels: ["l3"],
        members: [],
        due: "Aug 8",
        dueOverdue: true,
      },
    ],
  },
  {
    id: "col-2",
    title: "In Progress",
    cards: [
      {
        id: "card-4",
        text: "Implement authentication module",
        labels: ["l4"],
        members: ["AL"],
        due: "Aug 10",
        dueOverdue: false,
      },
      {
        id: "card-5",
        text: "Refactor database schema",
        labels: ["l2", "l3"],
        members: ["BK", "CJ"],
        due: null,
        dueOverdue: false,
      },
    ],
  },
  {
    id: "col-3",
    title: "In Review",
    cards: [
      {
        id: "card-6",
        text: "Homepage redesign",
        labels: ["l5"],
        members: ["AL", "BK"],
        due: "Aug 9",
        dueOverdue: true,
      },
    ],
  },
  {
    id: "col-4",
    title: "Done",
    cards: [
      {
        id: "card-7",
        text: "Project kickoff meeting",
        labels: ["l1"],
        members: ["CJ"],
        due: "Jul 30",
        dueOverdue: false,
      },
      {
        id: "card-8",
        text: "Stakeholder alignment doc",
        labels: [],
        members: ["AL", "BK", "CJ"],
        due: null,
        dueOverdue: false,
      },
      {
        id: "card-9",
        text: "Initial wireframes approved",
        labels: ["l6", "l1"],
        members: ["BK"],
        due: "Jul 25",
        dueOverdue: false,
      },
    ],
  },
];

/* ─── Member Avatar ───────────────────────────────────────────────────── */
const MEMBER_COLORS = {
  AL: "#0052cc",
  BK: "#00875a",
  CJ: "#bf2600",
};

function Avatar({ initials, size = 24 }) {
  return (
    <span
      className="trello-avatar"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.4,
        background: MEMBER_COLORS[initials] || "#5e6c84",
      }}
      title={initials}
    >
      {initials}
    </span>
  );
}

/* ─── Navbar ──────────────────────────────────────────────────────────── */
function Navbar({ user, onLogout }) {
  const name = user?.displayName || user?.email?.split("@")[0] || "User";
  const initials = name.slice(0, 2).toUpperCase();
  const [searchVal, setSearchVal] = useState("");

  return (
    <header className="trello-navbar">
      {/* Left */}
      <div className="trello-navbar-left">
        <button className="trello-nav-icon-btn" title="Toggle sidebar" aria-label="Toggle sidebar">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <rect y="2" width="16" height="2" rx="1" />
            <rect y="7" width="16" height="2" rx="1" />
            <rect y="12" width="16" height="2" rx="1" />
          </svg>
        </button>

        <div className="trello-logo">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect width="20" height="20" rx="3" fill="white" fillOpacity="0.3" />
            <rect x="3" y="3" width="6" height="12" rx="1.5" fill="white" />
            <rect x="11" y="3" width="6" height="8" rx="1.5" fill="white" />
          </svg>
          <span className="trello-logo-text">Taskly</span>
        </div>

        <div className="trello-nav-links">
          <button className="trello-nav-link">
            Workspaces <span className="trello-nav-caret">▾</span>
          </button>
          <button className="trello-nav-link">
            Recent <span className="trello-nav-caret">▾</span>
          </button>
          <button className="trello-nav-link">
            Starred <span className="trello-nav-caret">▾</span>
          </button>
          <button className="trello-nav-link trello-nav-link--hidden-md">
            Templates <span className="trello-nav-caret">▾</span>
          </button>
          <button className="trello-create-btn">
            <span>+</span> Create
          </button>
        </div>
      </div>

      {/* Center – search */}
      <div className="trello-navbar-center">
        <div className="trello-search-wrap">
          <svg className="trello-search-icon" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="5.5" cy="5.5" r="4.5" stroke="currentColor" strokeWidth="1.5" />
            <line x1="9.5" y1="9.5" x2="13" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            className="trello-search-input"
            type="text"
            placeholder="Search"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
          />
        </div>
      </div>

      {/* Right */}
      <div className="trello-navbar-right">
        <button className="trello-nav-icon-btn" title="Notifications" aria-label="Notifications">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 16a2 2 0 002-2H6a2 2 0 002 2zm6-5c-.8-.9-2-2.3-2-6a4 4 0 00-8 0c0 3.7-1.2 5.1-2 6v1h12v-1z" />
          </svg>
        </button>
        <button className="trello-nav-icon-btn" title="Help" aria-label="Help">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 12a1 1 0 110-2 1 1 0 010 2zm1-4.5h-2V8a2 2 0 114 0c0 1.1-.7 1.7-1.3 2.2-.4.3-.7.6-.7.8z" />
          </svg>
        </button>
        <button
          className="trello-user-avatar-btn"
          title={name}
          onClick={onLogout}
          aria-label={`Logged in as ${name}, click to log out`}
        >
          {initials}
        </button>
      </div>
    </header>
  );
}

/* ─── Board Header Bar ────────────────────────────────────────────────── */
function BoardHeaderBar({ boardTitle, editingTitle, draft, onChange, onBlur, onKeyDown, onClick, titleRef }) {
  return (
    <div className="trello-board-header-bar">
      {/* Left group */}
      <div className="trello-board-header-left">
        {editingTitle ? (
          <input
            ref={titleRef}
            className="trello-board-title-input"
            value={draft}
            onChange={onChange}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
          />
        ) : (
          <h1 className="trello-board-title" onClick={onClick} title="Click to edit">
            {boardTitle}
          </h1>
        )}

        <button className="trello-hdr-icon-btn" title="Star board" aria-label="Star this board">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M7 1l1.545 3.13L12 4.635l-2.5 2.435.59 3.44L7 8.87l-3.09 1.64L4.5 7.07 2 4.635l3.455-.505L7 1z"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className="trello-hdr-sep" />

        <button className="trello-hdr-text-btn" title="Change visibility" aria-label="Board visibility">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="currentColor" style={{ marginRight: 4 }}>
            <path d="M6.5 1C3.46 1 1 3.46 1 6.5S3.46 12 6.5 12 12 9.54 12 6.5 9.54 1 6.5 1zm0 2a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0 7.5c-1.875 0-3.53-.96-4.5-2.4.022-1.49 3-2.31 4.5-2.31s4.478.82 4.5 2.31c-.97 1.44-2.625 2.4-4.5 2.4z" />
          </svg>
          Workspace
        </button>

        <div className="trello-hdr-sep" />

        {/* Member avatars */}
        <div className="trello-hdr-members">
          {["AL", "BK", "CJ"].map((m) => (
            <Avatar key={m} initials={m} size={28} />
          ))}
          <button className="trello-hdr-share-members" title="Invite to board">
            Share
          </button>
        </div>
      </div>

      {/* Right group */}
      <div className="trello-board-header-right">
        <button className="trello-hdr-text-btn" aria-label="Filter cards">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="currentColor" style={{ marginRight: 4 }}>
            <path d="M1 2h11l-4 5v4l-3-1.5V7L1 2z" />
          </svg>
          Filters
        </button>
        <div className="trello-hdr-sep" />
        <button className="trello-hdr-text-btn" aria-label="Power-Ups">
          ⚡ Power-Ups
        </button>
        <button className="trello-hdr-text-btn" aria-label="Automation">
          🤖 Automation
        </button>
        <div className="trello-hdr-sep" />
        <button className="trello-hdr-text-btn trello-hdr-menu-btn" aria-label="Show board menu">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="currentColor" style={{ marginRight: 4 }}>
            <rect x="1" y="2" width="11" height="1.5" rx=".75" />
            <rect x="1" y="5.75" width="11" height="1.5" rx=".75" />
            <rect x="1" y="9.5" width="11" height="1.5" rx=".75" />
          </svg>
          Show menu
        </button>
      </div>
    </div>
  );
}

/* ─── Card Label ──────────────────────────────────────────────────────── */
function CardLabel({ labelId }) {
  const label = LABEL_COLORS.find((l) => l.id === labelId);
  if (!label) return null;
  return (
    <span
      className="trello-card-label"
      style={{ background: label.color }}
      title={label.name}
    />
  );
}

/* ─── Card ────────────────────────────────────────────────────────────── */
function Card({ card, colId, onDragStart, onDragEnd, isDragging }) {
  const hasFooter = card.members.length > 0 || card.due;

  return (
    <div
      className={`trello-card${isDragging ? " trello-card--dragging" : ""}`}
      draggable
      onDragStart={(e) => onDragStart(e, card.id, colId)}
      onDragEnd={onDragEnd}
    >
      {/* Labels row */}
      {card.labels.length > 0 && (
        <div className="trello-card-labels">
          {card.labels.map((lid) => (
            <CardLabel key={lid} labelId={lid} />
          ))}
        </div>
      )}

      {/* Card text */}
      <span className="trello-card-text">{card.text}</span>

      {/* Footer: due date + members */}
      {hasFooter && (
        <div className="trello-card-footer">
          <div className="trello-card-footer-left">
            {card.due && (
              <span className={`trello-card-due${card.dueOverdue ? " trello-card-due--overdue" : ""}`}>
                <svg width="11" height="11" viewBox="0 0 11 11" fill="currentColor">
                  <path d="M5.5 1a4.5 4.5 0 100 9 4.5 4.5 0 000-9zm.5 5H4V3h1v2.5H6V6z" />
                </svg>
                {card.due}
              </span>
            )}
          </div>
          <div className="trello-card-footer-right">
            {card.members.map((m) => (
              <Avatar key={m} initials={m} size={22} />
            ))}
          </div>
        </div>
      )}

      {/* Quick-edit pencil (shows on hover) */}
      <button className="trello-card-edit-btn" title="Quick edit" aria-label="Quick edit card">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
          <path d="M8.5.5l3 3-7 7H1.5v-3l7-7zm0 1.41L10.09 3.5 9 4.59 7.41 3 8.5 1.91zM2.5 8.09l5-5L9 4.59l-5 5V8.09H2.5v.5z" />
        </svg>
      </button>
    </div>
  );
}

/* ─── Column ──────────────────────────────────────────────────────────── */
function Column({
  column,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  draggingCardId,
  onAddCard,
  onColumnTitleChange,
}) {
  const [addingCard, setAddingCard] = useState(false);
  const [newCardText, setNewCardText] = useState("");
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(column.title);
  const titleInputRef = useRef(null);
  const cardInputRef = useRef(null);

  const handleTitleClick = () => {
    setEditingTitle(true);
    setTimeout(() => titleInputRef.current?.select(), 0);
  };
  const handleTitleBlur = () => {
    setEditingTitle(false);
    const t = titleDraft.trim();
    if (t) onColumnTitleChange(column.id, t);
    else setTitleDraft(column.title);
  };
  const handleTitleKey = (e) => {
    if (e.key === "Enter") titleInputRef.current?.blur();
    if (e.key === "Escape") { setTitleDraft(column.title); setEditingTitle(false); }
  };

  const handleAddCardOpen = () => {
    setAddingCard(true);
    setTimeout(() => cardInputRef.current?.focus(), 0);
  };
  const handleAddCardSubmit = () => {
    const t = newCardText.trim();
    if (t) { onAddCard(column.id, t); setNewCardText(""); }
    setAddingCard(false);
  };
  const handleAddCardKey = (e) => {
    if (e.key === "Enter") handleAddCardSubmit();
    if (e.key === "Escape") { setAddingCard(false); setNewCardText(""); }
  };

  return (
    <div
      className="trello-column"
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, column.id)}
    >
      {/* Column header */}
      <div className="trello-column-header">
        {editingTitle ? (
          <input
            ref={titleInputRef}
            className="trello-column-title-input"
            value={titleDraft}
            onChange={(e) => setTitleDraft(e.target.value)}
            onBlur={handleTitleBlur}
            onKeyDown={handleTitleKey}
          />
        ) : (
          <h3 className="trello-column-title" onClick={handleTitleClick}>
            {column.title}
          </h3>
        )}
        <button className="trello-column-menu" title="List actions" aria-label="List actions">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <circle cx="8" cy="3" r="1.5" />
            <circle cx="8" cy="8" r="1.5" />
            <circle cx="8" cy="13" r="1.5" />
          </svg>
        </button>
      </div>

      {/* Cards list */}
      <div className="trello-cards-list">
        {column.cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            colId={column.id}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            isDragging={draggingCardId === card.id}
          />
        ))}
      </div>

      {/* Add card */}
      {addingCard ? (
        <div className="trello-add-card-form">
          <textarea
            ref={cardInputRef}
            className="trello-add-card-textarea"
            placeholder="Enter a title for this card…"
            value={newCardText}
            onChange={(e) => setNewCardText(e.target.value)}
            onKeyDown={handleAddCardKey}
            rows={3}
          />
          <div className="trello-add-card-actions">
            <button className="trello-add-card-submit" onClick={handleAddCardSubmit}>
              Add card
            </button>
            <button
              className="trello-add-card-cancel"
              onClick={() => { setAddingCard(false); setNewCardText(""); }}
            >
              ✕
            </button>
          </div>
        </div>
      ) : (
        <button className="trello-add-card-btn" onClick={handleAddCardOpen}>
          <span className="trello-add-icon">+</span> Add a card
        </button>
      )}
    </div>
  );
}

/* ─── Board ───────────────────────────────────────────────────────────── */
function Board() {
  const [columns, setColumns] = useState(INITIAL_COLUMNS);
  const [boardTitle, setBoardTitle] = useState("Product Roadmap");
  const [editingBoardTitle, setEditingBoardTitle] = useState(false);
  const [boardTitleDraft, setBoardTitleDraft] = useState("Product Roadmap");
  const [addingList, setAddingList] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");
  const boardTitleRef = useRef(null);
  const newListRef = useRef(null);

  const dragCardId = useRef(null);
  const dragSourceColId = useRef(null);
  const [draggingCardId, setDraggingCardId] = useState(null);

  const handleBoardTitleClick = () => {
    setBoardTitleDraft(boardTitle);
    setEditingBoardTitle(true);
    setTimeout(() => boardTitleRef.current?.select(), 0);
  };
  const handleBoardTitleBlur = () => {
    setEditingBoardTitle(false);
    const t = boardTitleDraft.trim();
    if (t) setBoardTitle(t);
    else setBoardTitleDraft(boardTitle);
  };
  const handleBoardTitleKey = (e) => {
    if (e.key === "Enter") boardTitleRef.current?.blur();
    if (e.key === "Escape") { setBoardTitleDraft(boardTitle); setEditingBoardTitle(false); }
  };

  const handleColumnTitleChange = (colId, newTitle) =>
    setColumns((cols) => cols.map((c) => (c.id === colId ? { ...c, title: newTitle } : c)));

  const handleAddCard = (colId, text) => {
    const newCard = { id: uid(), text, labels: [], members: [], due: null, dueOverdue: false };
    setColumns((cols) =>
      cols.map((c) => (c.id === colId ? { ...c, cards: [...c.cards, newCard] } : c))
    );
  };

  const handleAddListOpen = () => {
    setAddingList(true);
    setTimeout(() => newListRef.current?.focus(), 0);
  };
  const handleAddListSubmit = () => {
    const t = newListTitle.trim();
    if (t) { setColumns((cols) => [...cols, { id: uid(), title: t, cards: [] }]); setNewListTitle(""); }
    setAddingList(false);
  };
  const handleAddListKey = (e) => {
    if (e.key === "Enter") handleAddListSubmit();
    if (e.key === "Escape") { setAddingList(false); setNewListTitle(""); }
  };

  const handleDragStart = (e, cardId, colId) => {
    dragCardId.current = cardId;
    dragSourceColId.current = colId;
    setDraggingCardId(cardId);
    e.dataTransfer.effectAllowed = "move";
  };
  const handleDragEnd = () => {
    dragCardId.current = null;
    dragSourceColId.current = null;
    setDraggingCardId(null);
  };
  const handleDragOver = (e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; };
  const handleDrop = (e, targetColId) => {
    e.preventDefault();
    const cardId = dragCardId.current;
    const sourceColId = dragSourceColId.current;
    if (!cardId || sourceColId === targetColId) return;
    setColumns((cols) => {
      let movedCard = null;
      const updated = cols.map((col) => {
        if (col.id === sourceColId) {
          movedCard = col.cards.find((c) => c.id === cardId);
          return { ...col, cards: col.cards.filter((c) => c.id !== cardId) };
        }
        return col;
      });
      return updated.map((col) => {
        if (col.id === targetColId && movedCard) return { ...col, cards: [...col.cards, movedCard] };
        return col;
      });
    });
    dragCardId.current = null;
    dragSourceColId.current = null;
    setDraggingCardId(null);
  };

  return (
    <div className="trello-board">
      <BoardHeaderBar
        boardTitle={boardTitle}
        editingTitle={editingBoardTitle}
        draft={boardTitleDraft}
        onChange={(e) => setBoardTitleDraft(e.target.value)}
        onBlur={handleBoardTitleBlur}
        onKeyDown={handleBoardTitleKey}
        onClick={handleBoardTitleClick}
        titleRef={boardTitleRef}
      />

      <div className="trello-columns-container">
        {columns.map((col) => (
          <Column
            key={col.id}
            column={col}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            draggingCardId={draggingCardId}
            onAddCard={handleAddCard}
            onColumnTitleChange={handleColumnTitleChange}
          />
        ))}

        {addingList ? (
          <div className="trello-add-list-form">
            <input
              ref={newListRef}
              className="trello-add-list-input"
              placeholder="Enter list title…"
              value={newListTitle}
              onChange={(e) => setNewListTitle(e.target.value)}
              onKeyDown={handleAddListKey}
            />
            <div className="trello-add-list-actions">
              <button className="trello-add-list-submit" onClick={handleAddListSubmit}>
                Add list
              </button>
              <button
                className="trello-add-list-cancel"
                onClick={() => { setAddingList(false); setNewListTitle(""); }}
              >
                ✕
              </button>
            </div>
          </div>
        ) : (
          <button className="trello-add-list-btn" onClick={handleAddListOpen}>
            <span className="trello-add-icon">+</span> Add another list
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── Dashboard root ──────────────────────────────────────────────────── */
function Dashboard({ user }) {
  const handleLogout = async () => { await signOut(auth); };

  return (
    <div className="trello-root">
      <Navbar user={user} onLogout={handleLogout} />
      <Board />
    </div>
  );
}

export default Dashboard;
