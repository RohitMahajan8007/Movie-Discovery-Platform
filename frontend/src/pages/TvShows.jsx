import React, { useEffect, useState } from "react";
import { getPopularTvShows } from "../api/tmdb";
import MovieCard from "../components/MovieCard";
import { SkeletonCard } from "../components/Skeleton";

const TvShows = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTv = async () => {
      try {
        const res = await getPopularTvShows();
        setMovies(res.data.results);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTv();
  }, []);

  if (loading)
    return (
      <div style={{ padding: "40px 0" }}>
        <h1 style={{ marginBottom: "30px", fontSize: "2.5rem" }}>TV Shows</h1>
        <div className="movie-grid">
          {[...Array(10)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );

  return (
    <div>
      <h1 style={{ marginBottom: "30px", fontSize: "2.5rem" }}>TV Shows</h1>
      <div className="movie-grid">
        {movies.map((show) => (
          <MovieCard key={show.id} movie={{ ...show, media_type: "tv" }} />
        ))}
      </div>
    </div>
  );
};

export default TvShows;
