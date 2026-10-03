import React, { useState } from "react";
import { Plus, CheckCircle2, Clock, StickyNote } from "lucide-react";

export default function Dashboard({ tasks, setTasks, notes, goTo }) {
  const [quickTitle, setQuickTitle] = useState("");

  const done = tasks.filter((t) => t.completed).length;
  const pending = tasks.length - done;
  const percent = tasks.length ? Math.round((done / tasks.length) * 100) : 0;

  const upNext = tasks
    .filter((t) => !t.completed)
    .sort((a, b) => (a.dueDate || "9999").localeCompare(b.dueDate || "9999"))
    .slice(0, 5);
  const recentNotes = [...notes].sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 3);

  const quickAdd = (e) => {
    e.preventDefault();
    const title = quickTitle.trim();
    if (!title) return;
    setTasks([
      { id: Date.now(), title, details: "", priority: "Medium", dueDate: "", completed: false, createdAt: Date.now() },
      ...tasks,
    ]);
    setQuickTitle("");
  };

  return (
    <section>
      <header className="page-head">
        <div>
          <h2>Welcome back</h2>
          <p className="muted">
            {pending === 0 ? "Nothing pending. Add a task to get started." : `${pending} task${pending > 1 ? "s" : ""} left to finish.`}
          </p>
        </div>
      </header>

      <div className="stats">
        <div className="stat"><span className="stat-num">{tasks.length}</span><span>Total tasks</span></div>
        <div className="stat"><span className="stat-num">{pending}</span><span>Pending</span></div>
        <div className="stat"><span className="stat-num">{done}</span><span>Completed</span></div>
        <div className="stat"><span className="stat-num">{notes.length}</span><span>Notes</span></div>
      </div>

      <div className="progress" aria-label={`${percent}% complete`}>
        <div className="progress-bar" style={{ width: `${percent}%` }} />
      </div>
      <p className="muted small">{percent}% of your tasks are done</p>

      <form className="quick" onSubmit={quickAdd}>
        <input
          value={quickTitle}
          onChange={(e) => setQuickTitle(e.target.value)}
          placeholder="Quick add a task and press Enter"
        />
        <button className="btn primary" type="submit"><Plus size={18} /> Add</button>
      </form>

      <div className="two-col">
        <div className="panel">
          <div className="panel-head">
            <h3>Up next</h3>
            <button className="link" onClick={() => goTo("todo")}>Open To-Do List</button>
          </div>
          {upNext.length === 0 ? (
            <p className="muted">No pending tasks.</p>
          ) : (
            <ul className="mini-list">
              {upNext.map((t) => (
                <li key={t.id}>
                  <Clock size={16} />
                  <span>{t.title}</span>
                  {t.dueDate && <small>{t.dueDate}</small>}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="panel">
          <div className="panel-head">
            <h3>Recent notes</h3>
            <button className="link" onClick={() => goTo("notes")}>Open Notes</button>
          </div>
          {recentNotes.length === 0 ? (
            <p className="muted">No notes yet.</p>
          ) : (
            <ul className="mini-list">
              {recentNotes.map((n) => (
                <li key={n.id}>
                  <StickyNote size={16} />
                  <span>{n.title}</span>
                  <small>{n.category}</small>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
