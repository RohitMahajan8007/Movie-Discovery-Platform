import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import backendApi from "../api/backend";
import {
  Plus,
  Trash2,
  Edit,
  Users,
  Film,
  LayoutDashboard,
  PlusCircle,
} from "lucide-react";

const AdminPanel = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("movies");
  const [movies, setMovies] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteType, setDeleteType] = useState("movie"); // "movie" or "user"
  const [formData, setFormData] = useState({
    title: "",
    posterUrl: "",
    description: "",
    releaseDate: "",
    trailerUrl: "",
    genre: "",
    category: "Movies",
  });

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
    } else {
      fetchData();
    }
  }, [user, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === "movies") {
        const res = await backendApi.get("/movies");
        setMovies(res.data);
      } else {
        const res = await backendApi.get("/users");
        setUsers(res.data);
      }
    } catch (err) {
      console.error("Admin Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditId(null);
    setFormData({
      title: "",
      posterUrl: "",
      description: "",
      releaseDate: "",
      trailerUrl: "",
      genre: "",
      category: "Movies",
    });
    setShowModal(true);
  };

  const openEditModal = (movie) => {
    setEditId(movie._id);
    setFormData({
      title: movie.title,
      posterUrl: movie.posterUrl,
      description: movie.description,
      releaseDate: movie.releaseDate ? movie.releaseDate.substring(0, 10) : "",
      trailerUrl: movie.trailerUrl,
      genre: movie.genre,
      category: movie.category,
    });
    setShowModal(true);
  };

  const handleSubmitMovie = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await backendApi.put(`/movies/${editId}`, formData);
      } else {
        await backendApi.post("/movies", formData);
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      alert("Failed to save movie");
    }
  };

  const confirmDelete = (item, type = "movie") => {
    setDeleteTarget(item);
    setDeleteType(type);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      if (deleteTarget) {
        if (deleteType === "movie") {
          await backendApi.delete(`/movies/${deleteTarget._id}`);
        } else {
          await backendApi.delete(`/users/${deleteTarget._id}`);
        }
        setShowDeleteModal(false);
        setDeleteTarget(null);
        fetchData();
      }
    } catch (err) {
      alert("Failed to delete " + deleteType);
    }
  };

  const handleToggleBan = async (u) => {
    try {
      if (u.role === "admin") return alert("Cannot ban admin");
      await backendApi.put(`/users/ban/${u._id}`);
      fetchData();
    } catch (err) {
      alert("Failed to update user status");
    }
  };

  return (
    <div style={{ padding: "40px 0" }}>
      <div
        style={{
          display: "flex",
          gap: "20px",
          alignItems: "center",
          marginBottom: "40px",
        }}
      >
        <LayoutDashboard size={32} color="var(--primary-color)" />
        <h1 style={{ fontSize: "2.5rem" }}>Admin Dashboard</h1>
      </div>

      <div style={{ display: "flex", gap: "15px", marginBottom: "30px" }}>
        <button
          className={activeTab === "movies" ? "btn-primary" : "btn-primary"}
          style={{
            background: activeTab === "movies" ? "" : "var(--card-bg)",
            border:
              activeTab === "movies" ? "" : "1px solid rgba(255,255,255,0.1)",
          }}
          onClick={() => setActiveTab("movies")}
        >
          <Film size={18} style={{ marginRight: "8px" }} /> Manage Movies
        </button>
        <button
          className={activeTab === "users" ? "btn-primary" : "btn-primary"}
          style={{
            background: activeTab === "users" ? "" : "var(--card-bg)",
            border:
              activeTab === "users" ? "" : "1px solid rgba(255,255,255,0.1)",
          }}
          onClick={() => setActiveTab("users")}
        >
          <Users size={18} style={{ marginRight: "8px" }} /> Manage Users
        </button>
        {activeTab === "movies" && (
          <button
            className="btn-primary"
            style={{ marginLeft: "auto", background: "#22c55e" }}
            onClick={openAddModal}
          >
            <Plus size={18} /> Add New Movie
          </button>
        )}
      </div>

      {loading ? (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      ) : activeTab === "movies" ? (
        <div
          style={{
            background: "var(--card-bg)",
            borderRadius: "15px",
            overflow: "hidden",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
            }}
          >
            <thead style={{ background: "rgba(255,255,255,0.05)" }}>
              <tr>
                <th style={{ padding: "15px" }}>Title</th>
                <th style={{ padding: "15px" }}>Category</th>
                <th style={{ padding: "15px" }}>Release Date</th>
                <th style={{ padding: "15px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {movies.map((movie) => (
                <tr
                  key={movie._id}
                  style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
                >
                  <td style={{ padding: "15px" }}>{movie.title}</td>
                  <td style={{ padding: "15px" }}>{movie.category}</td>
                  <td style={{ padding: "15px" }}>
                    {movie.releaseDate
                      ? new Date(movie.releaseDate).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td style={{ padding: "15px", display: "flex", gap: "10px" }}>
                    <button
                      style={{ color: "#3b82f6" }}
                      onClick={() => openEditModal(movie)}
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      style={{ color: "#ef4444" }}
                      onClick={() => confirmDelete(movie)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {movies.length === 0 && (
            <div style={{ padding: "40px", textAlign: "center" }}>
              <p style={{ opacity: 0.5, marginBottom: "10px" }}>
                No custom movies found in the database.
              </p>
              <button className="btn-primary" onClick={openAddModal}>
                Add your first movie
              </button>
            </div>
          )}
        </div>
      ) : (
        <div
          style={{
            background: "var(--card-bg)",
            borderRadius: "15px",
            overflow: "hidden",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
            }}
          >
            <thead style={{ background: "rgba(255,255,255,0.05)" }}>
              <tr>
                <th style={{ padding: "15px" }}>Username</th>
                <th style={{ padding: "15px" }}>Email</th>
                <th style={{ padding: "15px" }}>Role</th>
                <th style={{ padding: "15px" }}>Status</th>
                <th style={{ padding: "15px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u._id}
                  style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
                >
                  <td style={{ padding: "15px" }}>{u.username}</td>
                  <td style={{ padding: "15px" }}>{u.email}</td>
                  <td style={{ padding: "15px" }}>
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: "4px",
                        background:
                          u.role === "admin"
                            ? "var(--primary-color)"
                            : "rgba(255,255,255,0.1)",
                        fontSize: "0.8rem",
                      }}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: "15px" }}>
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: "4px",
                        background: u.isBanned ? "#ef4444" : "#22c55e",
                        fontSize: "0.8rem",
                      }}
                    >
                      {u.isBanned ? "Banned" : "Active"}
                    </span>
                  </td>
                  <td style={{ padding: "15px", display: "flex", gap: "10px" }}>
                    <button
                      style={{ color: u.isBanned ? "#22c55e" : "#eab308" }}
                      onClick={() => handleToggleBan(u)}
                      title={u.isBanned ? "Unban User" : "Ban User"}
                    >
                      {u.isBanned ? "U" : "B"}
                    </button>
                    <button
                      style={{ color: "#ef4444" }}
                      onClick={() => confirmDelete(u, "user")}
                      title="Delete User"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Movie Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 2000,
          }}
        >
          <div
            style={{
              background: "var(--card-bg)",
              padding: "30px",
              borderRadius: "20px",
              width: "100%",
              maxWidth: "600px",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <h2 style={{ marginBottom: "20px" }}>
              {editId ? "Edit Movie" : "Add Custom Movie"}
            </h2>
            <form
              onSubmit={handleSubmitMovie}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
              }}
            >
              <div style={{ gridColumn: "span 2" }}>
                <label>Movie Title</label>
                <input
                  style={{ width: "100%", marginTop: "5px" }}
                  className="search-input"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label>Genre</label>
                <input
                  style={{ width: "100%", marginTop: "5px" }}
                  className="search-input"
                  value={formData.genre}
                  onChange={(e) =>
                    setFormData({ ...formData, genre: e.target.value })
                  }
                />
              </div>
              <div>
                <label>Category</label>
                <select
                  style={{ width: "100%", marginTop: "5px", height: "45px" }}
                  className="search-input"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                >
                  <option value="Movies">Movies</option>
                  <option value="TV Shows">TV Shows</option>
                </select>
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <label>Poster Image URL</label>
                <input
                  style={{ width: "100%", marginTop: "5px" }}
                  className="search-input"
                  value={formData.posterUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, posterUrl: e.target.value })
                  }
                  placeholder="https://..."
                />
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <label>Trailer YouTube Link</label>
                <input
                  style={{ width: "100%", marginTop: "5px" }}
                  className="search-input"
                  value={formData.trailerUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, trailerUrl: e.target.value })
                  }
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <label>Description</label>
                <textarea
                  style={{
                    width: "100%",
                    marginTop: "5px",
                    height: "100px",
                    borderRadius: "15px",
                    background: "var(--bg-color)",
                    color: "white",
                    padding: "15px",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                ></textarea>
              </div>
              <div
                style={{
                  gridColumn: "span 2",
                  display: "flex",
                  gap: "15px",
                  marginTop: "10px",
                }}
              >
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ flex: 1 }}
                >
                  {editId ? "Update Movie" : "Save Movie"}
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  style={{ flex: 1, background: "#ef4444" }}
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 3000,
          }}
        >
          <div
            style={{
              background: "var(--card-bg)",
              padding: "40px",
              borderRadius: "20px",
              textAlign: "center",
              maxWidth: "450px",
              border: "1px solid rgba(239, 68, 68, 0.3)",
            }}
          >
            <div style={{ color: "#ef4444", marginBottom: "20px" }}>
              <Trash2 size={60} />
            </div>
            <h2 style={{ marginBottom: "15px" }}>Are you sure?</h2>
            <p style={{ opacity: 0.8, marginBottom: "30px" }}>
              Do you really want to delete{" "}
              <strong>
                "
                {deleteType === "movie"
                  ? deleteTarget?.title
                  : deleteTarget?.username}
                "
              </strong>
              ? This action cannot be undone.
            </p>
            <div style={{ display: "flex", gap: "15px" }}>
              <button
                className="btn-primary"
                style={{ flex: 1, background: "#ef4444" }}
                onClick={handleDelete}
              >
                Yes, Delete it
              </button>
              <button
                className="btn-primary"
                style={{ flex: 1, background: "rgba(255,255,255,0.1)" }}
                onClick={() => setShowDeleteModal(false)}
              >
                No, Keep it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
