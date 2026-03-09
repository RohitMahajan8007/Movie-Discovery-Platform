import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchFavorites, toggleFavorite } from "../redux/slices/authSlice";
import backendApi from "../api/backend";
import { Link } from "react-router-dom";

const Favorites = () => {
  const dispatch = useDispatch();
  const { user, favorites } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user && favorites.length === 0) {
      dispatch(fetchFavorites());
    }
  }, [dispatch, user, favorites.length]);

  const removeFav = async (tmdbId) => {
    try {
      await dispatch(toggleFavorite({ action: "remove", tmdbId })).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h2>
          Please{" "}
          <Link to="/login" style={{ color: "var(--primary-color)" }}>
            login
          </Link>{" "}
          to view favorites.
        </h2>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ marginTop: "20px", fontSize: "2rem" }}>Your Favorites</h1>
      {favorites.length === 0 ? (
        <p style={{ marginTop: "20px" }}>
          You haven't added any favorites yet.
        </p>
      ) : (
        <div className="movie-grid">
          {favorites.map((movie) => (
            <div
              key={movie.tmdbId}
              className="movie-card"
              style={{ position: "relative" }}
            >
              <Link to={`/movie/${movie.tmdbId}`}>
                <img
                  src={
                    movie.posterPath || "https://via.placeholder.com/500x750"
                  }
                  alt={movie.title}
                  className="movie-poster"
                />
              </Link>
              <div
                className="movie-info"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Link to={`/movie/${movie.tmdbId}`} style={{ flex: 1 }}>
                  <h3 className="movie-title">{movie.title}</h3>
                </Link>
                <button
                  onClick={() => removeFav(movie.tmdbId)}
                  style={{
                    color: "#ef4444",
                    fontSize: "1.2rem",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                  }}
                  title="Remove"
                >
                  ✖
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
