import { useState, useEffect } from "react";
import "./App.css";

interface User {
  _id: string;
  name: string;
}

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch users from backend
  const fetchUsers = () => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data.users));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Add a new user via POST
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ users: [{ name: name.trim() }] }),
      });
      const data = await res.json();
      if (data.success) {
        setName("");
        fetchUsers(); // Refresh the user list
      }
    } catch (error) {
      console.error("Failed to add user:", error);
    }
    setLoading(false);
  };

  // Delete a user via DELETE
  const handleDeleteUser = async (id: string) => {
    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        fetchUsers(); // Refresh the user list
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  return (
    <div className="app">
      <h1 className="title">🌍 Travel Wild</h1>

      <div className="container">
        {/* Left Panel - User List */}
        <div className="panel">
          <h2>👥 Users ({users.length})</h2>
          <ul className="user-list">
            {users.map((user) => (
              <li key={user._id} className="user-item">
                <span>{user.name}</span>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteUser(user._id)}
                >
                  ✕
                </button>
              </li>
            ))}
            {users.length === 0 && (
              <li className="empty">No users yet. Add one!</li>
            )}
          </ul>
        </div>

        {/* Right Panel - Add User Form */}
        <div className="panel">
          <h2>➕ Add User</h2>
          <form onSubmit={handleAddUser} className="add-form">
            <input
              type="text"
              placeholder="Enter name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
            />
            <button type="submit" className="btn" disabled={loading}>
              {loading ? "Adding..." : "Add User"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
