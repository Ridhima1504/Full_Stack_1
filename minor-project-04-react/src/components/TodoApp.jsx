import { useMemo, useState } from "react";
import { CalendarDays, Check, Edit3, Plus, Trash2, X } from "lucide-react";

export default function TodoApp({ todos, setTodos }) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDate, setEditDate] = useState("");

  const visibleTodos = useMemo(() => {
    if (filter === "completed") return todos.filter((todo) => todo.completed);
    if (filter === "pending") return todos.filter((todo) => !todo.completed);
    return todos;
  }, [todos, filter]);

  const addTodo = (event) => {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) return;

    const newTodo = {
      id: Date.now(),
      title: cleanTitle,
      dueDate,
      completed: false
    };

    setTodos((current) => [newTodo, ...current]);
    setTitle("");
    setDueDate("");
  };

  const toggleTodo = (id) => {
    setTodos((current) =>
      current.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos((current) => current.filter((todo) => todo.id !== id));
  };

  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditTitle(todo.title);
    setEditDate(todo.dueDate);
  };

  const saveEdit = (id) => {
    if (!editTitle.trim()) return;

    setTodos((current) =>
      current.map((todo) =>
        todo.id === id
          ? { ...todo, title: editTitle.trim(), dueDate: editDate }
          : todo
      )
    );

    cancelEdit();
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditDate("");
  };

  return (
    <div className="page-stack">
      <div className="page-intro">
        <div>
          <span className="eyebrow">TASK MANAGER</span>
          <h3>Turn plans into progress.</h3>
          <p>Add, organize, complete, edit, and remove your tasks.</p>
        </div>
        <div className="task-count">{todos.filter((todo) => todo.completed).length}/{todos.length} done</div>
      </div>

      <form className="task-form" onSubmit={addTodo}>
        <div className="input-with-icon">
          <Plus size={19} />
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="What needs to be done?"
            aria-label="Task title"
          />
        </div>

        <div className="date-input">
          <CalendarDays size={18} />
          <input
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
            aria-label="Task due date"
          />
        </div>

        <button className="primary-button" type="submit">
          Add task <Plus size={18} />
        </button>
      </form>

      <div className="toolbar">
        <div className="filter-group">
          {["all", "pending", "completed"].map((item) => (
            <button
              key={item}
              className={filter === item ? "filter-button selected" : "filter-button"}
              onClick={() => setFilter(item)}
            >
              {item[0].toUpperCase() + item.slice(1)}
            </button>
          ))}
        </div>
        <span>{visibleTodos.length} task{visibleTodos.length !== 1 ? "s" : ""}</span>
      </div>

      <div className="todo-list">
        {visibleTodos.length === 0 ? (
          <EmptyTasks filter={filter} />
        ) : (
          visibleTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              editingId={editingId}
              editTitle={editTitle}
              editDate={editDate}
              setEditTitle={setEditTitle}
              setEditDate={setEditDate}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onEdit={startEdit}
              onSave={saveEdit}
              onCancel={cancelEdit}
            />
          ))
        )}
      </div>
    </div>
  );
}

function TodoItem({
  todo,
  editingId,
  editTitle,
  editDate,
  setEditTitle,
  setEditDate,
  onToggle,
  onDelete,
  onEdit,
  onSave,
  onCancel
}) {
  const isEditing = editingId === todo.id;

  return (
    <article className={`todo-item ${todo.completed ? "completed" : ""}`}>
      <button
        className="check-button"
        onClick={() => onToggle(todo.id)}
        aria-label={todo.completed ? "Mark as pending" : "Mark as completed"}
      >
        {todo.completed && <Check size={17} />}
      </button>

      {isEditing ? (
        <div className="edit-area">
          <input value={editTitle} onChange={(event) => setEditTitle(event.target.value)} autoFocus />
          <input type="date" value={editDate} onChange={(event) => setEditDate(event.target.value)} />
        </div>
      ) : (
        <div className="todo-info">
          <h4>{todo.title}</h4>
          <span className={todo.completed ? "status completed-status" : "status"}>
            {todo.completed ? "Completed" : "Pending"}
            {todo.dueDate && ` • Due ${formatDate(todo.dueDate)}`}
          </span>
        </div>
      )}

      <div className="item-actions">
        {isEditing ? (
          <>
            <button className="action-button save" onClick={() => onSave(todo.id)} aria-label="Save task">
              <Check size={17} />
            </button>
            <button className="action-button" onClick={onCancel} aria-label="Cancel edit">
              <X size={17} />
            </button>
          </>
        ) : (
          <>
            <button className="action-button" onClick={() => onEdit(todo)} aria-label="Edit task">
              <Edit3 size={17} />
            </button>
            <button className="action-button danger" onClick={() => onDelete(todo.id)} aria-label="Delete task">
              <Trash2 size={17} />
            </button>
          </>
        )}
      </div>
    </article>
  );
}

function EmptyTasks({ filter }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">✓</div>
      <h4>No {filter === "all" ? "" : filter} tasks</h4>
      <p>Add a task above and start making progress.</p>
    </div>
  );
}

function formatDate(value) {
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}