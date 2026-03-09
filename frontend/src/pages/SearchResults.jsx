import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { searchMulti } from "../api/tmdb";
import MovieCard from "../components/MovieCard";
import { SkeletonCard } from "../components/Skeleton";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  if (loading && page === 1) {
    return (
      <div style={{ padding: "40px 0" }}>
        <h2>Search Results for: {query}</h2>
        <div className="movie-grid">
          {[...Array(10)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  const fetchResults = useCallback(async (q, p, isNewQuery) => {
    if (!q) return;
    setLoading(true);
    try {
      const res = await searchMulti(q, p);
      if (isNewQuery) {
        setResults(res.data.results);
      } else {
        setResults((prev) => [...prev, ...res.data.results]);
      }
      setHasMore(
        res.data.results.length > 0 && res.data.page < res.data.total_pages,
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setPage(1);
    fetchResults(query, 1, true);
  }, [query, fetchResults]);

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 1 >=
      document.documentElement.scrollHeight
    ) {
      if (!loading && hasMore) {
        setPage((p) => {
          const nextPage = p + 1;
          fetchResults(query, nextPage, false);
          return nextPage;
        });
      }
    }
  }, [loading, hasMore, query, fetchResults]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div>
      <h2 style={{ padding: "20px 0" }}>
        Search Results for:{" "}
        <span style={{ color: "var(--primary-color)" }}>{query}</span>
      </h2>
      <div className="movie-grid">
        {results
          .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
          .map((item) => (
            <div key={`${item.id}-${item.media_type}`}>
              {item.media_type === "person" ? (
                <div className="movie-card" style={{ textAlign: "center" }}>
                  <img
                    src={
                      item.profile_path
                        ? `https://image.tmdb.org/t/p/w500${item.profile_path}`
                        : "https://via.placeholder.com/500x750?text=No+Image"
                    }
                    alt={item.name}
                    className="movie-poster"
                    style={{
                      borderRadius: "50%",
                      width: "120px",
                      height: "120px",
                      margin: "20px auto",
                      objectFit: "cover",
                      border: "2px solid var(--primary-color)",
                    }}
                  />
                  <div className="movie-info">
                    <h3 style={{ fontSize: "0.9rem" }}>{item.name}</h3>
                    <p style={{ fontSize: "0.7rem", opacity: 0.6 }}>Actor</p>
                  </div>
                </div>
              ) : (
                <MovieCard movie={item} />
              )}
            </div>
          ))}
      </div>
      {loading && (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      )}
      {!loading && results.length === 0 && (
        <p style={{ textAlign: "center" }}>No results found.</p>
      )}
    </div>
  );
};

export default SearchResults;
