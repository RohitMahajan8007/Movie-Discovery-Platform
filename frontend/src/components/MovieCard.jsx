import React from "react";
import { Link } from "react-router-dom";

const MovieCard = ({ movie }) => {
  const isTv = movie.media_type === "tv" || !movie.title;
  const title = movie.title || movie.name || "Unknown Title";
  const date = movie.release_date || movie.first_air_date || "";
  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Poster";

  return (
    <Link to={`/${isTv ? "tv" : "movie"}/${movie.id}`} className="movie-card">
      <img src={imageUrl} alt={title} className="movie-poster" loading="lazy" />
      <div className="movie-info">
        <h3 className="movie-title" title={title}>
          {title}
        </h3>
        <p className="movie-date">
          {date ? new Date(date).getFullYear() : "N/A"} •{" "}
          {isTv ? "TV Show" : "Movie"}
        </p>
      </div>
    </Link>
  );
};

export default MovieCard;
