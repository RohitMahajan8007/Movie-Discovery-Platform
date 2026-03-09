import React, { useEffect, useState } from "react";
import { getTrending } from "../api/tmdb";
import { Image } from "lucide-react";
import { SkeletonCard } from "../components/Skeleton";

const Media = () => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const res = await getTrending();
        setMedia(res.data.results);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMedia();
  }, []);

  if (loading)
    return (
      <div style={{ padding: "40px 0" }}>
        <h1 style={{ marginBottom: "30px", fontSize: "2.5rem" }}>
          Media Gallery
        </h1>
        <div className="movie-grid">
          {[...Array(10)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );

  return (
    <div style={{ padding: "40px 0" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "15px",
          marginBottom: "40px",
        }}
      >
        <Image size={32} color="var(--primary-color)" />
        <h1 style={{ fontSize: "2.5rem" }}>Media Gallery</h1>
      </div>

      <div style={{ columns: "3 250px", columnGap: "20px" }}>
        {media.map((item, index) => (
          <div
            key={item.id}
            className="movie-card"
            style={{
              marginBottom: "20px",
              breakInside: "avoid",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <img
              src={`https://image.tmdb.org/t/p/w500${item.poster_path || item.backdrop_path}`}
              alt={item.title || item.name}
              style={{ width: "100%", display: "block", borderRadius: "15px" }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: "20px",
                background: "linear-gradient(transparent, rgba(0,0,0,0.8))",
                opacity: 0,
                transition: "opacity 0.3s",
              }}
              className="media-overlay"
            >
              <h3 style={{ fontSize: "1rem" }}>{item.title || item.name}</h3>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .movie-card:hover .media-overlay { opacity: 1 !important; }
      `}</style>
    </div>
  );
};

export default Media;
