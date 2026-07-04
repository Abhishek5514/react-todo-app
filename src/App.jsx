import { useEffect, useState } from "react";
import {
  ClipboardList,
  Search,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  Clock3,
  ListTodo,
} from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import "./App.css";

function App() {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const savedTodos = JSON.parse(localStorage.getItem("todos"));

    if (savedTodos) {
      setTodos(savedTodos);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);



function handleAdd() {
   if (task.trim() === "") {
    toast.error("Please enter a task");
    return;
  }
    if (editId !== null) {
      const updatedTodos = todos.map((todo) =>
        todo.id === editId
          ? {
              ...todo,
              text: task,
            }
          : todo
      );

      setTodos(updatedTodos);
      toast.success("Todo Updated");
      setTask("");
      setEditId(null);
      return;
    }

    const newTodo = {
      id: Date.now(),
      text: task,
      completed: false,
    };

    setTodos([...todos, newTodo]);
    toast.success("Todo Added Successfully");
    setTask("");
  }

  function handleDelete(id) {
    const updatedTodos = todos.filter((todo) => todo.id !== id);

    setTodos(updatedTodos);

    toast.success("Todo Deleted");

    if (editId === id) {
      setEditId(null);
      setTask("");
    }
  }

  function handleEdit(todo) {
    setTask(todo.text);
    setEditId(todo.id);
  }

  function toggleComplete(id) {
    const updatedTodos = todos.map((todo) =>
      todo.id === id
        ? {
            ...todo,
            completed: !todo.completed,
          }
        : todo
    );

    setTodos(updatedTodos);

    toast.success("Todo Status Updated");
  }

  function clearAll() {
    if (todos.length === 0) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete all todos?"
    );

    if (confirmDelete) {
      setTodos([]);
      setTask("");
      setEditId(null);
      toast.success("All Todos Cleared");
    }
  }

  const total = todos.length;

  const completed = todos.filter(
    (todo) => todo.completed
  ).length;

  const pending = total - completed;

  return (
    <div className="app">

      <Toaster position="top-right" />

      <div className="todo-container">

        <h1 className="title">
          <ClipboardList size={34} />
          Todo App
        </h1>

        <div className="input-box">

          <input
            
            type="text"
            placeholder="Enter your task..."
            value={task}
            onChange={(e) => setTask(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAdd();
              }
            }}
          />

          <button onClick={handleAdd}>
            <Plus size={18} />
            <span>
              {editId !== null ? "Update" : "Add"}
            </span>
          </button>

        </div>

        <div className="search-wrapper">

          <Search
            size={18}
            className="search-icon"
          />

          <input
            type="text"
            placeholder="Search Todo..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="search-box"
          />

        </div>

        <div className="filter-buttons">

  <button
    className={filter === "all" ? "active" : ""}
    onClick={() => setFilter("all")}
  >
    All
  </button>

  <button
    className={filter === "completed" ? "active" : ""}
    onClick={() => setFilter("completed")}
  >
    Completed
  </button>

  <button
    className={filter === "pending" ? "active" : ""}
    onClick={() => setFilter("pending")}
  >
    Pending
  </button>

</div>
        <div className="counter">

          <div className="card total-card">
            <ListTodo size={22} />
            <h3>Total</h3>
            <span>{total}</span>
          </div>

          <div className="card complete-card">
            <CheckCircle2 size={22} />
            <h3>Completed</h3>
            <span>{completed}</span>
          </div>

          <div className="card pending-card">
            <Clock3 size={22} />
            <h3>Pending</h3>
            <span>{pending}</span>
          </div>

        </div>

        <ul className="todo-list">

          {todos.length === 0 ? (
            <p className="empty">
              No Todo Found
            </p>
          ) : (

            todos
              .filter((todo) =>
                todo.text
                  .toLowerCase()
                  .includes(search.toLowerCase())
              )
              .filter((todo) => {
                if (filter === "completed")
                  return todo.completed;

                if (filter === "pending")
                  return !todo.completed;

                return true;
              })
              .map((todo) => (
                                <li className="todo-item" key={todo.id}>

                  <div className="left">

                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleComplete(todo.id)}
                    />

                    <span
                      className={
                        todo.completed
                          ? "completed"
                          : ""
                      }
                    >
                      {todo.text}
                    </span>

                  </div>

                  <div className="button-group">

                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(todo)}
                    >
                      <Pencil size={16} />
                      <span>Edit</span>
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(todo.id)}
                    >
                      <Trash2 size={16} />
                      <span>Delete</span>
                    </button>

                  </div>

                </li>

              ))

          )}

        </ul>

        {todos.length > 0 && (

          <button
            className="clear-btn"
            onClick={clearAll}
          >
            <Trash2 size={18} />
            <span>Clear All</span>
          </button>

        )}

        <footer className="footer">

          <ClipboardList size={18} />

          <span>
            Stay Organized • Build Better Habits
          </span>

        </footer>
              </div>

    </div>
  );
}
export default App;


