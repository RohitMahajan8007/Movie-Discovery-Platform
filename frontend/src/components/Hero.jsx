import React, { useState, useEffect } from "react";
import { Play, Info, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Hero = ({ movies }) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!movies || movies.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [movies]);

  if (!movies || movies.length === 0) return null;

  const currentMovie = movies[currentIndex];
  const backdropUrl = `https://image.tmdb.org/t/p/original${currentMovie.backdrop_path}`;

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % movies.length);
  const prevSlide = () =>
    setCurrentIndex((prev) => (prev === 0 ? movies.length - 1 : prev - 1));

  return (
    <div className="hero-carousel">
      {movies.map((movie, index) => (
        <div
          key={movie.id}
          className={`hero-slide ${index === currentIndex ? "active" : ""}`}
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(10,10,10,1) 100%), url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
          }}
        >
          <div className="hero-content">
            <h1 className="hero-title">{movie.title || movie.name}</h1>
            <p className="hero-overview">
              {movie.overview?.length > 200
                ? movie.overview.substring(0, 200) + "..."
                : movie.overview}
            </p>
            <div className="hero-btns">
              <button
                className="btn-primary"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "12px 25px",
                }}
                onClick={() => navigate(`/movie/${movie.id}`)}
              >
                <Play fill="currentColor" size={20} /> Play
              </button>
              <button
                className="btn-primary"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "12px 25px",
                  background: "rgba(109, 109, 110, 0.7)",
                  color: "white",
                }}
                onClick={() => navigate(`/movie/${movie.id}`)}
              >
                <Info size={20} /> More Info
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button className="carousel-control prev" onClick={prevSlide}>
        <ChevronLeft size={40} />
      </button>
      <button className="carousel-control next" onClick={nextSlide}>
        <ChevronRight size={40} />
      </button>

      {/* Indicators */}
      <div className="carousel-indicators">
        {movies.map((_, index) => (
          <div
            key={index}
            className={`indicator ${index === currentIndex ? "active" : ""}`}
            onClick={() => setCurrentIndex(index)}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Hero;
