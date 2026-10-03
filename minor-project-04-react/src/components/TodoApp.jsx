import React, { useState } from "react";
import { Plus, Pencil, Trash2, Search, CalendarDays, CheckCircle2, Circle } from "lucide-react";
import Modal from "./Modal.jsx";

const EMPTY_FORM = { title: "", details: "", priority: "Medium", dueDate: "" };
const FILTERS = ["All", "Pending", "Completed"];
const today = () => new Date().toISOString().slice(0, 10);

// ---- Form used for both "New task" and "Edit task" ----
function TaskForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial);
  const { title, details, priority, dueDate } = form;
  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({ ...form, title: title.trim(), details: details.trim() });
  };

  return (
    <form className="form" onSubmit={submit}>
      <label>
        Task title
        <input name="title" value={title} onChange={update} placeholder="e.g. Finish React project" autoFocus required />
      </label>
      <label>
        Details
        <textarea name="details" value={details} onChange={update} rows={3} placeholder="Add any extra notes (optional)" />
      </label>
      <div className="row">
        <label>
          Priority
          <select name="priority" value={priority} onChange={update}>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </label>
        <label>
          Due date
          <input type="date" name="dueDate" value={dueDate} onChange={update} />
        </label>
      </div>
      <div className="actions">
        <button type="button" className="btn" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn primary">Save task</button>
      </div>
    </form>
  );
}

// ---- One task in the list ----
function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const { title, details, priority, dueDate, completed } = task;
  const overdue = !completed && dueDate && dueDate < today();

  return (
    <li className={`card task ${completed ? "done" : ""}`}>
      <button className="check" onClick={onToggle} aria-label={completed ? "Mark as pending" : "Mark as completed"}>
        {completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
      </button>

      <div className="task-body">
        <h3>{title}</h3>
        {details && <p>{details}</p>}
        <div className="chips">
          <span className={`chip ${completed ? "chip-done" : "chip-pending"}`}>
            {completed ? "Completed" : "Pending"}
          </span>
          <span className={`chip prio-${priority.toLowerCase()}`}>{priority} priority</span>
          {dueDate && (
            <span className={`chip ${overdue ? "chip-overdue" : ""}`}>
              <CalendarDays size={13} /> {overdue ? "Overdue: " : "Due "}{dueDate}
            </span>
          )}
        </div>
      </div>

      <div className="task-actions">
        <button className="icon-btn" onClick={onEdit} aria-label="Edit task"><Pencil size={18} /></button>
        <button className="icon-btn danger" onClick={onDelete} aria-label="Delete task"><Trash2 size={18} /></button>
      </div>
    </li>
  );
}

// ---- Page ----
export default function TodoApp({ tasks, setTasks }) {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const editingTask = tasks.find((t) => t.id === editingId);

  const openNew = () => { setEditingId(null); setModalOpen(true); };
  const openEdit = (id) => { setEditingId(id); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditingId(null); };

  const saveTask = (data) => {
    if (editingId) {
      setTasks(tasks.map((t) => (t.id === editingId ? { ...t, ...data } : t)));
    } else {
      setTasks([{ id: Date.now(), ...data, completed: false, createdAt: Date.now() }, ...tasks]);
    }
    closeModal();
  };

  const toggleTask = (id) => setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  const deleteTask = (id) => {
    if (window.confirm("Delete this task?")) setTasks(tasks.filter((t) => t.id !== id));
  };

  const visible = tasks
    .filter((t) => (filter === "All" ? true : filter === "Completed" ? t.completed : !t.completed))
    .filter((t) => `${t.title} ${t.details}`.toLowerCase().includes(search.toLowerCase()));

  const counts = {
    All: tasks.length,
    Pending: tasks.filter((t) => !t.completed).length,
    Completed: tasks.filter((t) => t.completed).length,
  };

  return (
    <section>
      <header className="page-head">
        <div>
          <h2>To-Do List</h2>
          <p className="muted">Add, edit and finish your tasks.</p>
        </div>
        <button className="btn primary" onClick={openNew}><Plus size={18} /> New task</button>
      </header>

      <div className="toolbar">
        <div className="search">
          <Search size={18} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tasks" />
        </div>
        <div className="tabs">
          {FILTERS.map((f) => (
            <button key={f} className={`tab ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>
              {f} ({counts[f]})
            </button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="empty">
          <p>{tasks.length === 0 ? "No tasks yet." : "No tasks match this view."}</p>
          {tasks.length === 0 && <button className="btn primary" onClick={openNew}>Add your first task</button>}
        </div>
      ) : (
        <ul className="list">
          {visible.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={() => toggleTask(task.id)}
              onEdit={() => openEdit(task.id)}
              onDelete={() => deleteTask(task.id)}
            />
          ))}
        </ul>
      )}

      {modalOpen && (
        <Modal title={editingId ? "Edit task" : "New task"} onClose={closeModal}>
          <TaskForm
            initial={editingTask ? { ...EMPTY_FORM, ...editingTask } : EMPTY_FORM}
            onSave={saveTask}
            onCancel={closeModal}
          />
        </Modal>
      )}
    </section>
  );
}
