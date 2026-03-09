import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { User, Lock, Bell, Palette, ShieldCheck } from "lucide-react";
import { logout } from "../redux/slices/authSlice";

const Settings = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [activeSection, setActiveSection] = useState("profile");

  return (
    <div style={{ padding: "40px 0", minHeight: "80vh" }}>
      <h1 style={{ marginBottom: "40px", fontSize: "2.5rem" }}>Settings</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "250px 1fr",
          gap: "40px",
        }}
      >
        {/* Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <button
            onClick={() => setActiveSection("profile")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "15px",
              borderRadius: "10px",
              background:
                activeSection === "profile"
                  ? "var(--primary-color)"
                  : "var(--card-bg)",
              textAlign: "left",
              border: "none",
              color: "white",
              cursor: "pointer",
            }}
          >
            <User size={20} /> Profile Details
          </button>
          <button
            onClick={() => setActiveSection("security")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "15px",
              borderRadius: "10px",
              background:
                activeSection === "security"
                  ? "var(--primary-color)"
                  : "var(--card-bg)",
              textAlign: "left",
              border: "none",
              color: "white",
              cursor: "pointer",
            }}
          >
            <Lock size={20} /> Password & Security
          </button>
          {user?.role === "admin" && (
            <div
              style={{
                marginTop: "20px",
                padding: "15px",
                background: "rgba(255, 171, 0, 0.1)",
                border: "1px solid var(--accent-color)",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                color: "var(--accent-color)",
              }}
            >
              <ShieldCheck size={20} /> Admin Account
            </div>
          )}
        </div>

        {/* Content Area */}
        <div
          style={{
            background: "var(--card-bg)",
            padding: "40px",
            borderRadius: "20px",
          }}
        >
          {activeSection === "profile" && (
            <div>
              <h2 style={{ marginBottom: "25px" }}>Profile Information</h2>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      opacity: 0.7,
                    }}
                  >
                    Username
                  </label>
                  <input
                    className="search-input"
                    value={user?.username || ""}
                    disabled
                    style={{ width: "100%", cursor: "not-allowed" }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      opacity: 0.7,
                    }}
                  >
                    Email Address
                  </label>
                  <input
                    className="search-input"
                    value={user?.email || ""}
                    disabled
                    style={{ width: "100%", cursor: "not-allowed" }}
                  />
                </div>
                <div style={{ marginTop: "20px" }}>
                  <button
                    className="btn-primary"
                    onClick={() => alert("Update feature coming soon!")}
                  >
                    Update Profile
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSection === "security" && (
            <div>
              <h2 style={{ marginBottom: "25px" }}>Security Settings</h2>
              <p style={{ opacity: 0.6, marginBottom: "20px" }}>
                Change your password to keep your account secure.
              </p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
              >
                <input
                  type="password"
                  placeholder="Current Password"
                  className="search-input"
                  style={{ width: "100%" }}
                />
                <input
                  type="password"
                  placeholder="New Password"
                  className="search-input"
                  style={{ width: "100%" }}
                />
                <button className="btn-primary">Change Password</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
