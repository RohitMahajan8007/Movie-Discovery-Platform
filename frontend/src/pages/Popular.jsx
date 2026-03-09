import React, { useEffect, useState } from "react";
import { getPopularMovies } from "../api/tmdb";
import MovieCard from "../components/MovieCard";
import { SkeletonCard } from "../components/Skeleton";

const Popular = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const res = await getPopularMovies();
        setMovies(res.data.results);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPopular();
  }, []);

  if (loading)
    return (
      <div style={{ padding: "40px 0" }}>
        <h1 style={{ marginBottom: "30px", fontSize: "2.5rem" }}>
          Popular Movies
        </h1>
        <div className="movie-grid">
          {[...Array(10)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );

  return (
    <div>
      <h1 style={{ marginTop: "20px", fontSize: "2rem" }}>Popular Movies</h1>
      <div className="movie-grid">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default Popular;
