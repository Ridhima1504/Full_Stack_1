import React, { useEffect, useMemo, useState } from "react";
import { CheckSquare, FileText, LayoutDashboard, Menu, Moon, Sun } from "lucide-react";
import TodoApp from "./components/TodoApp";
import NotesApp from "./components/NotesApp";

const starterTodos = [
  {
    id: 1,
    title: "Finish React project",
    dueDate: new Date().toISOString().slice(0, 10),
    completed: false
  },
  {
    id: 2,
    title: "Review JavaScript array methods",
    dueDate: "",
    completed: true
  }
];

const starterNotes = [
  {
    id: 1,
    title: "React Hooks",
    content: "useState manages component state. useEffect handles side effects such as localStorage updates.",
    category: "Study",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    title: "Project Ideas",
    content: "Build small projects regularly to improve component design and JavaScript logic.",
    category: "Ideas",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

function readStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [todos, setTodos] = useState(() => readStorage("focusnest-todos", starterTodos));
  const [notes, setNotes] = useState(() => readStorage("focusnest-notes", starterNotes));
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("focusnest-theme") === "dark");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("focusnest-todos", JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem("focusnest-notes", JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? "dark" : "light";
    localStorage.setItem("focusnest-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const completed = todos.filter((todo) => todo.completed).length;
  const pending = todos.length - completed;

  const navigate = (page) => {
    setActivePage(page);
    setMenuOpen(false);
  };

  const dashboard = useMemo(() => ({
    totalTasks: todos.length,
    completed,
    pending,
    totalNotes: notes.length
  }), [todos, notes, completed, pending]);

  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">F</div>
          <div>
            <h1>FocusNest</h1>
            <span>Study & Life Organizer</span>
          </div>
        </div>

        <nav className="nav-menu">
          <button className={activePage === "dashboard" ? "nav-item active" : "nav-item"} onClick={() => navigate("dashboard")}>
            <LayoutDashboard size={19} /> Dashboard
          </button>
          <button className={activePage === "tasks" ? "nav-item active" : "nav-item"} onClick={() => navigate("tasks")}>
            <CheckSquare size={19} /> To-Do List
          </button>
          <button className={activePage === "notes" ? "nav-item active" : "nav-item"} onClick={() => navigate("notes")}>
            <FileText size={19} /> Notes
          </button>
        </nav>

        <div className="sidebar-card">
          <span className="mini-label">PROJECT 04</span>
          <strong>Stay organized.</strong>
          <p>Plan tasks, capture ideas, and keep everything in one simple workspace.</p>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button className="icon-button mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Open menu">
            <Menu size={22} />
          </button>

          <div>
            <p className="eyebrow">YOUR WORKSPACE</p>
            <h2>{activePage === "dashboard" ? "Good to see you 👋" : activePage === "tasks" ? "Your To-Do List" : "Your Notes"}</h2>
          </div>

          <button className="icon-button" onClick={() => setDarkMode(!darkMode)} aria-label="Toggle theme">
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </header>

        <section className="content">
          {activePage === "dashboard" && (
            <Dashboard stats={dashboard} navigate={navigate} />
          )}

          {activePage === "tasks" && (
            <TodoApp todos={todos} setTodos={setTodos} />
          )}

          {activePage === "notes" && (
            <NotesApp notes={notes} setNotes={setNotes} />
          )}
        </section>
      </main>
    </div>
  );
}

function Dashboard({ stats, navigate }) {
  return (
    <div className="dashboard">
      <section className="hero-card">
        <div>
          <span className="hero-tag">FOCUS MODE</span>
          <h3>Small steps.<br />Big progress.</h3>
          <p>Use your workspace to manage everyday tasks and keep important ideas close.</p>
          <button className="primary-button" onClick={() => navigate("tasks")}>
            Open my tasks <CheckSquare size={18} />
          </button>
        </div>
        <div className="hero-shape">
          <span>✦</span>
          <span>✓</span>
          <span>✎</span>
        </div>
      </section>

      <div className="stats-grid">
        <StatCard label="Total Tasks" value={stats.totalTasks} icon={<CheckSquare />} />
        <StatCard label="Completed" value={stats.completed} icon={<span>✓</span>} />
        <StatCard label="Pending" value={stats.pending} icon={<span>◷</span>} />
        <StatCard label="Notes" value={stats.totalNotes} icon={<FileText />} />
      </div>

      <section className="dashboard-grid">
        <div className="info-card">
          <div className="section-heading">
            <div>
              <span className="eyebrow">PROJECT REQUIREMENTS</span>
              <h3>What this app demonstrates</h3>
            </div>
          </div>
          <div className="feature-list">
            {[
              "Functional React components",
              "Props and state management",
              "useState and useEffect hooks",
              "Conditional and list rendering",
              "LocalStorage persistence",
              "Responsive component-based UI"
            ].map((item) => (
              <div className="feature-row" key={item}>
                <span className="check-dot">✓</span>{item}
              </div>
            ))}
          </div>
        </div>

        <div className="info-card accent-card">
          <span className="eyebrow">QUICK START</span>
          <h3>Need to capture something?</h3>
          <p>Create a task for something you need to do or save an idea as a note.</p>
          <div className="quick-buttons">
            <button onClick={() => navigate("tasks")} className="secondary-button">+ New task</button>
            <button onClick={() => navigate("notes")} className="secondary-button">+ New note</button>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div>
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
    </div>
  );
}
