import React, { useState } from "react";
import { LayoutDashboard, ListTodo, StickyNote } from "lucide-react";
import useLocalStorage from "./hooks/useLocalStorage.js";
import Dashboard from "./components/Dashboard.jsx";
import TodoApp from "./components/TodoApp.jsx";
import NotesApp from "./components/NotesApp.jsx";

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "todo", label: "To-Do List", icon: ListTodo },
  { id: "notes", label: "Notes", icon: StickyNote },
];

export default function App() {
  const [page, setPage] = useState("dashboard");
  // State lives here so every page shares the same data.
  const [tasks, setTasks] = useLocalStorage("focusnest.tasks.v2", []);
  const [notes, setNotes] = useLocalStorage("focusnest.notes.v2", []);

  return (
    <div className="shell">
      <aside className="nav">
        <h1 className="brand">FocusNest</h1>
        <p className="brand-sub">Study &amp; Life Organizer</p>
        <nav>
          {NAV.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`nav-btn ${page === id ? "active" : ""}`}
              onClick={() => setPage(id)}
            >
              <Icon size={20} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="main">
        {page === "dashboard" && (
          <Dashboard tasks={tasks} setTasks={setTasks} notes={notes} goTo={setPage} />
        )}
        {page === "todo" && <TodoApp tasks={tasks} setTasks={setTasks} />}
        {page === "notes" && <NotesApp notes={notes} setNotes={setNotes} />}
      </main>
    </div>
  );
}
