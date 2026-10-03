import React, { useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import Modal from "./Modal.jsx";

const CATEGORIES = ["General", "Study", "Personal", "Ideas"];
const EMPTY_FORM = { title: "", content: "", category: "General" };

const formatTime = (ms) =>
  new Date(ms).toLocaleString([], { dateStyle: "medium", timeStyle: "short" });

function NoteForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial);
  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    if (!form.title.trim() && !form.content.trim()) return;
    onSave({ ...form, title: form.title.trim() || "Untitled note" });
  };

  return (
    <form className="form" onSubmit={submit}>
      <label>
        Title
        <input name="title" value={form.title} onChange={update} placeholder="Note title" autoFocus />
      </label>
      <label>
        Category
        <select name="category" value={form.category} onChange={update}>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </label>
      <label>
        Note
        <textarea name="content" value={form.content} onChange={update} rows={7} placeholder="Write your note here..." />
      </label>
      <div className="actions">
        <button type="button" className="btn" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn primary">Save note</button>
      </div>
    </form>
  );
}

function NoteCard({ note, onEdit, onDelete }) {
  return (
    <article className="card note">
      <div className="note-top">
        <span className="chip">{note.category}</span>
        <div className="task-actions">
          <button className="icon-btn" onClick={onEdit} aria-label="Edit note"><Pencil size={18} /></button>
          <button className="icon-btn danger" onClick={onDelete} aria-label="Delete note"><Trash2 size={18} /></button>
        </div>
      </div>
      <h3>{note.title}</h3>
      <p className="note-text">{note.content}</p>
      <small className="muted">
        {note.updatedAt !== note.createdAt ? "Edited " : "Created "}
        {formatTime(note.updatedAt)}
      </small>
    </article>
  );
}

export default function NotesApp({ notes, setNotes }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const editingNote = notes.find((n) => n.id === editingId);

  const openNew = () => { setEditingId(null); setModalOpen(true); };
  const openEdit = (id) => { setEditingId(id); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditingId(null); };

  const saveNote = (data) => {
    const now = Date.now();
    if (editingId) {
      setNotes(notes.map((n) => (n.id === editingId ? { ...n, ...data, updatedAt: now } : n)));
    } else {
      setNotes([{ id: now, ...data, createdAt: now, updatedAt: now }, ...notes]);
    }
    closeModal();
  };

  const deleteNote = (id) => {
    if (window.confirm("Delete this note?")) setNotes(notes.filter((n) => n.id !== id));
  };

  const visible = notes
    .filter((n) => category === "All" || n.category === category)
    .filter((n) => `${n.title} ${n.content}`.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <section>
      <header className="page-head">
        <div>
          <h2>Notes</h2>
          <p className="muted">Capture ideas and study material.</p>
        </div>
        <button className="btn primary" onClick={openNew}><Plus size={18} /> New note</button>
      </header>

      <div className="toolbar">
        <div className="search">
          <Search size={18} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search notes" />
        </div>
        <div className="tabs">
          {["All", ...CATEGORIES].map((c) => (
            <button key={c} className={`tab ${category === c ? "active" : ""}`} onClick={() => setCategory(c)}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="empty">
          <p>{notes.length === 0 ? "No notes yet." : "No notes match your search."}</p>
          {notes.length === 0 && <button className="btn primary" onClick={openNew}>Write your first note</button>}
        </div>
      ) : (
        <div className="grid">
          {visible.map((note) => (
            <NoteCard key={note.id} note={note} onEdit={() => openEdit(note.id)} onDelete={() => deleteNote(note.id)} />
          ))}
        </div>
      )}

      {modalOpen && (
        <Modal title={editingId ? "Edit note" : "New note"} onClose={closeModal}>
          <NoteForm
            initial={editingNote ? { ...EMPTY_FORM, ...editingNote } : EMPTY_FORM}
            onSave={saveNote}
            onCancel={closeModal}
          />
        </Modal>
      )}
    </section>
  );
}
