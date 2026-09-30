import { useMemo, useState } from "react";
import { BookOpen, Edit3, FileText, Plus, Search, Tag, Trash2, X } from "lucide-react";

const categories = ["All", "Study", "Ideas", "Personal", "Work"];

export default function NotesApp({ notes, setNotes }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  const filteredNotes = useMemo(() => {
    const query = search.toLowerCase().trim();

    return notes.filter((note) => {
      const matchesSearch =
        !query ||
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query);

      const matchesCategory =
        category === "All" || note.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [notes, search, category]);

  const saveNote = (noteData) => {
    const now = new Date().toISOString();

    if (editingNote) {
      setNotes((current) =>
        current.map((note) =>
          note.id === editingNote.id
            ? { ...note, ...noteData, updatedAt: now }
            : note
        )
      );
    } else {
      setNotes((current) => [
        {
          id: Date.now(),
          ...noteData,
          createdAt: now,
          updatedAt: now
        },
        ...current
      ]);
    }

    setEditingNote(null);
    setShowForm(false);
  };

  const deleteNote = (id) => {
    setNotes((current) => current.filter((note) => note.id !== id));
  };

  return (
    <div className="page-stack">
      <div className="page-intro">
        <div>
          <span className="eyebrow">IDEA VAULT</span>
          <h3>Keep your thoughts organized.</h3>
          <p>Search your notes, group them by category, and edit them anytime.</p>
        </div>
        <button className="primary-button" onClick={() => { setEditingNote(null); setShowForm(true); }}>
          New note <Plus size={18} />
        </button>
      </div>

      <div className="notes-toolbar">
        <div className="search-box">
          <Search size={18} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search your notes..."
          />
        </div>

        <div className="category-scroll">
          {categories.map((item) => (
            <button
              key={item}
              className={category === item ? "category-button selected" : "category-button"}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {filteredNotes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><FileText size={23} /></div>
          <h4>No notes found</h4>
          <p>Try another search or create a new note.</p>
        </div>
      ) : (
        <div className="notes-grid">
          {filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onEdit={() => { setEditingNote(note); setShowForm(true); }}
              onDelete={() => deleteNote(note.id)}
            />
          ))}
        </div>
      )}

      {showForm && (
        <NoteForm
          note={editingNote}
          onSave={saveNote}
          onClose={() => { setShowForm(false); setEditingNote(null); }}
        />
      )}
    </div>
  );
}

function NoteCard({ note, onEdit, onDelete }) {
  return (
    <article className="note-card">
      <div className="note-card-top">
        <span className={`note-category ${note.category.toLowerCase()}`}>
          <Tag size={13} /> {note.category}
        </span>
        <div className="item-actions">
          <button className="action-button" onClick={onEdit} aria-label="Edit note"><Edit3 size={16} /></button>
          <button className="action-button danger" onClick={onDelete} aria-label="Delete note"><Trash2 size={16} /></button>
        </div>
      </div>

      <div className="note-icon"><BookOpen size={18} /></div>
      <h4>{note.title}</h4>
      <p>{note.content}</p>

      <div className="note-footer">
        <span>Updated {formatRelative(note.updatedAt)}</span>
      </div>
    </article>
  );
}

function NoteForm({ note, onSave, onClose }) {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [category, setCategory] = useState(note?.category || "Study");

  const submit = (event) => {
    event.preventDefault();

    if (!title.trim() || !content.trim()) return;

    onSave({
      title: title.trim(),
      content: content.trim(),
      category
    });
  };

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="note-modal" onMouseDown={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="eyebrow">{note ? "EDIT NOTE" : "NEW NOTE"}</span>
            <h3>{note ? "Update your note" : "Capture an idea"}</h3>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close"><X size={20} /></button>
        </div>

        <form onSubmit={submit} className="note-form">
          <label>
            Title
            <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Note title" autoFocus />
          </label>

          <label>
            Category
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              {categories.slice(1).map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>

          <label>
            Content
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="Write your thoughts here..."
              rows="7"
            />
          </label>

          <div className="modal-actions">
            <button type="button" className="secondary-button" onClick={onClose}>Cancel</button>
            <button type="submit" className="primary-button">Save note <Plus size={17} /></button>
          </div>
        </form>
      </div>
    </div>
  );
}

function formatRelative(dateString) {
  const difference = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(difference / 60000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short"
  });
}
