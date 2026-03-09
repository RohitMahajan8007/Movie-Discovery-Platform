import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTrending } from "../redux/slices/movieSlice";
import MovieCard from "../components/MovieCard";
import Hero from "../components/Hero";
import { SkeletonCard, SkeletonHero } from "../components/Skeleton";

const Home = () => {
  const dispatch = useDispatch();
  const { trending, status, page, hasMore } = useSelector(
    (state) => state.movies,
  );

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchTrending(1));
    }
  }, [status, dispatch]);

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 1 >=
      document.documentElement.scrollHeight
    ) {
      if (status !== "loading" && hasMore) {
        dispatch(fetchTrending(page + 1));
      }
    }
  }, [status, hasMore, page, dispatch]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  if (status === "loading" && page === 1) {
    return (
      <div className="home-container">
        <SkeletonHero />
        <div className="content-section" style={{ padding: "0 4%" }}>
          <div className="movie-grid">
            {[...Array(10)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <Hero movies={trending.slice(0, 5)} />

      <div className="content-section" style={{ padding: "0 4%" }}>
        <h2
          style={{
            margin: "30px 0 20px 0",
            fontSize: "1.8rem",
            fontWeight: "600",
            color: "white",
          }}
        >
          Trending Now
        </h2>

        <div className="movie-grid">
          {trending.slice(5).map((movie) => (
            <MovieCard key={`${movie.id}-${movie.media_type}`} movie={movie} />
          ))}
        </div>

        {status === "loading" && (
          <div className="movie-grid">
            {[...Array(5)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
