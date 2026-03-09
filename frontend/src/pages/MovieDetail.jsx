import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getMovieDetails, getTvDetails } from "../api/tmdb";
import backendApi from "../api/backend";
import { toggleFavorite, fetchFavorites } from "../redux/slices/authSlice";

const MovieDetail = ({ isTv }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user, favorites } = useSelector((state) => state.auth);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favStatus, setFavStatus] = useState("");
  const [showTrailer, setShowTrailer] = useState(false);

  const isFavorite = favorites.some((fav) => fav.tmdbId === parseInt(id));

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const res = isTv ? await getTvDetails(id) : await getMovieDetails(id);
        const data = res.data;
        setItem(data);

        if (user) {
          backendApi
            .post("/users/history", {
              tmdbId: data.id,
              title: data.title || data.name,
              posterPath: data.poster_path
                ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
                : "",
            })
            .catch(console.error);
        }
      } catch (err) {
        setError("Failed to fetch details");
      } finally {
        setLoading(false);
      }
    };
    if (user && favorites.length === 0) {
      dispatch(fetchFavorites());
    }
    fetchDetails();
  }, [id, isTv, user, dispatch]);

  if (loading)
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  if (error || !item)
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        {error || "Not found"}
      </div>
    );

  const title = item.title || item.name;
  const description = item.overview || "Description not available";
  const imageUrl = item.backdrop_path
    ? `https://image.tmdb.org/t/p/original${item.backdrop_path}`
    : "https://via.placeholder.com/1200x500?text=No+Backdrop";

  const posterUrl = item.poster_path
    ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Poster";

  // Find youtube trailer
  const trailer =
    item.videos?.results.find(
      (vid) => vid.site === "YouTube" && vid.type === "Trailer",
    ) || item.videos?.results.find((vid) => vid.site === "YouTube");

  const handleFavorite = async () => {
    if (!user) {
      setFavStatus("Please login first");
      return;
    }
    try {
      const action = isFavorite ? "remove" : "add";
      await dispatch(
        toggleFavorite({
          action,
          tmdbId: item.id,
          title: title,
          posterPath: posterUrl,
        }),
      ).unwrap();

      setFavStatus(isFavorite ? "Removed!" : "Added!");
      setTimeout(() => setFavStatus(""), 2000);
    } catch (err) {
      setFavStatus("Error updating");
    }
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <div
        style={{
          backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 1) 15%, rgba(15, 23, 42, 0.4) 100%), url(${imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: "60px 40px",
          borderRadius: "20px",
          display: "flex",
          gap: "40px",
          flexWrap: "wrap",
        }}
      >
        <img
          src={posterUrl}
          alt={title}
          style={{
            width: "300px",
            borderRadius: "15px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
          }}
        />
        <div
          style={{
            flex: 1,
            minWidth: "300px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <h1 style={{ fontSize: "3rem", marginBottom: "10px" }}>{title}</h1>
          <p
            style={{
              color: "var(--accent-color)",
              fontSize: "1.2rem",
              marginBottom: "20px",
            }}
          >
            {item.genres?.map((g) => g.name).join(", ")} •{" "}
            {item.vote_average?.toFixed(1)} / 10
          </p>
          <p
            style={{
              fontSize: "1.1rem",
              lineHeight: "1.6",
              marginBottom: "30px",
              opacity: 0.9,
            }}
          >
            {description}
          </p>

          <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
            <button
              onClick={() => setShowTrailer(true)}
              className="btn-primary"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                background: "#ef4444",
              }}
            >
              Watch Trailer
            </button>
            <button
              onClick={handleFavorite}
              className="btn-primary"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                background: isFavorite
                  ? "rgba(255,255,255,0.1)"
                  : "var(--primary-color)",
                border: isFavorite ? "1px solid rgba(255,255,255,0.3)" : "none",
              }}
            >
              {isFavorite ? "♥ Favorite" : "♡ Add to Favorites"}
            </button>
            {favStatus && (
              <span
                style={{ color: "var(--accent-color)", fontWeight: "bold" }}
              >
                {favStatus}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Trailer Modal */}
      {showTrailer && (
        <div
          onClick={() => setShowTrailer(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.95)",
            zIndex: 3000,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ width: "100%", maxWidth: "1000px", position: "relative" }}
          >
            <button
              onClick={() => setShowTrailer(false)}
              style={{
                position: "absolute",
                top: "-40px",
                right: 0,
                color: "white",
                fontSize: "1.5rem",
              }}
            >
              ✕ Close
            </button>

            {trailer ? (
              <div
                style={{
                  position: "relative",
                  paddingBottom: "56.25%",
                  height: 0,
                  overflow: "hidden",
                  borderRadius: "15px",
                }}
              >
                <iframe
                  src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
                  title="Trailer"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                  }}
                ></iframe>
              </div>
            ) : (
              <div
                style={{
                  padding: "60px",
                  background: "var(--card-bg)",
                  borderRadius: "20px",
                  textAlign: "center",
                }}
              >
                <h2 style={{ marginBottom: "10px" }}>Oops!</h2>
                <p style={{ opacity: 0.8 }}>
                  Trailer for this movie is currently unavailable.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetail;
