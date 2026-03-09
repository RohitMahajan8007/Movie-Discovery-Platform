import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import backendApi from "../api/backend";

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errorMsg, setErrorMsg] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    if (isRegister) {
      try {
        await backendApi.post("/auth/register", formData);
        // Auto-login after registration
        const result = await dispatch(
          loginUser({ email: formData.email, password: formData.password }),
        );
        if (!result.error) {
          navigate("/");
        }
      } catch (err) {
        setErrorMsg(err.response?.data?.error || "Registration failed");
      }
    } else {
      const result = await dispatch(
        loginUser({ email: formData.email, password: formData.password }),
      );
      if (!result.error) {
        navigate("/");
      }
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "70vh",
      }}
    >
      <div
        style={{
          background: "var(--card-bg)",
          padding: "40px",
          borderRadius: "20px",
          width: "100%",
          maxWidth: "400px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
          {isRegister ? "Create Account" : "Welcome Back"}
        </h2>
        {(error || errorMsg) && (
          <p
            style={{
              color: "#ef4444",
              marginBottom: "20px",
              textAlign: "center",
            }}
          >
            {error || errorMsg}
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "20px" }}
        >
          {isRegister && (
            <input
              type="text"
              placeholder="Username"
              className="search-input"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            className="search-input"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="search-input"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />
          <button
            type="submit"
            className="btn-primary"
            disabled={status === "loading"}
          >
            {status === "loading"
              ? "Processing..."
              : isRegister
                ? "Sign Up"
                : "Log In"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "20px", opacity: 0.8 }}>
          {isRegister ? "Already have an account? " : "Don't have an account? "}
          <span
            onClick={() => setIsRegister(!isRegister)}
            style={{
              color: "var(--primary-color)",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            {isRegister ? "Log in" : "Sign up"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
