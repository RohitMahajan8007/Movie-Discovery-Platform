import React, { useEffect, useState } from "react";
import backendApi from "../api/backend";
import MovieCard from "../components/MovieCard";
import { Clock, Trash2 } from "lucide-react";

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await backendApi.get("/users/history");
        setHistory(res.data);
      } catch (err) {
        console.error("Failed to fetch history");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading)
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );

  return (
    <div style={{ padding: "40px 0" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "15px",
          marginBottom: "30px",
        }}
      >
        <Clock size={32} color="var(--primary-color)" />
        <h1 style={{ fontSize: "2.5rem" }}>Watch History</h1>
      </div>

      {history.length === 0 ? (
        <p style={{ textAlign: "center", opacity: 0.5, marginTop: "50px" }}>
          No history found. Start watching some movies!
        </p>
      ) : (
        <div className="movie-grid">
          {history.map((item) => (
            <div key={item._id} style={{ position: "relative" }}>
              <MovieCard
                movie={{
                  id: item.tmdbId,
                  title: item.title,
                  poster_path: item.posterPath,
                }}
              />
              <div
                style={{ fontSize: "0.8rem", opacity: 0.6, marginTop: "10px" }}
              >
                Watched on: {new Date(item.watchedAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
