import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import {
  Search,
  Popcorn,
  User,
  Settings,
  LogOut,
  Heart,
  Clock,
  LayoutDashboard,
} from "lucide-react";

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // Real-time Search with Debouncing
  useEffect(() => {
    if (!searchTerm.trim()) return;

    const delayDebounceFn = setTimeout(() => {
      navigate(`/search?q=${searchTerm}`);
    }, 500); // 500ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, navigate]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${searchTerm}`);
      setSearchTerm("");
      setShowSearch(false);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div
        className="container"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Link
          to="/"
          className="logo"
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
          <Popcorn size={28} /> MOVIEMAX
        </Link>

        <div className="nav-links">
          <Link to="/" className={isActive("/") ? "active" : ""}>
            Home
          </Link>
          <Link to="/" className={isActive("/") ? "active" : ""}>
            Trending
          </Link>
          <Link to="/popular" className={isActive("/popular") ? "active" : ""}>
            Popular
          </Link>
          <Link
            to="/tv-shows"
            className={isActive("/tv-shows") ? "active" : ""}
          >
            TV Shows
          </Link>
          <Link to="/people" className={isActive("/people") ? "active" : ""}>
            People
          </Link>
          <Link to="/media" className={isActive("/media") ? "active" : ""}>
            Media
          </Link>
          {user?.role === "admin" && (
            <Link
              to="/admin"
              className={isActive("/admin") ? "active" : ""}
              style={{ color: "var(--accent-color)", fontWeight: "bold" }}
            >
              Admin Panel
            </Link>
          )}
        </div>

        <div className="nav-actions">
          {showSearch ? (
            <form
              onSubmit={handleSearch}
              style={{
                display: "flex",
                alignItems: "center",
                background: "var(--card-bg)",
                borderRadius: "20px",
                padding: "0 15px",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              <input
                autoFocus
                type="text"
                placeholder="Search..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onBlur={() => !searchTerm && setShowSearch(false)}
                style={{
                  border: "none",
                  background: "transparent",
                  width: "150px",
                }}
              />
              <button type="submit">
                <Search size={18} color="var(--text-color)" />
              </button>
            </form>
          ) : (
            <button
              className="search-icon-btn"
              onClick={() => setShowSearch(true)}
            >
              <Search size={22} />
            </button>
          )}

          {user ? (
            <div className="profile-menu">
              <div className="profile-avatar">
                {user?.username ? (
                  user.username.charAt(0).toUpperCase()
                ) : (
                  <User size={20} />
                )}
              </div>
              <div className="profile-dropdown">
                <div
                  style={{
                    padding: "10px 15px",
                    fontWeight: "bold",
                    fontSize: "0.9rem",
                    color: "var(--primary-color)",
                  }}
                >
                  Hi, {user?.username || "User"}
                </div>
                <div className="dropdown-divider"></div>
                <Link to="/favorites" className="dropdown-item">
                  <Heart size={18} /> Favorites
                </Link>
                <Link to="/history" className="dropdown-item">
                  <Clock size={18} /> History
                </Link>
                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    className="dropdown-item"
                    style={{ color: "var(--accent-color)" }}
                  >
                    <LayoutDashboard size={18} /> Admin Dashboard
                  </Link>
                )}
                <Link to="/settings" className="dropdown-item">
                  <Settings size={18} /> Settings
                </Link>
                <div className="dropdown-divider"></div>
                <button
                  className="dropdown-item"
                  onClick={() => dispatch(logout())}
                  style={{ width: "100%", color: "#ef4444" }}
                >
                  <LogOut size={18} /> Logout
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="btn-primary">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
