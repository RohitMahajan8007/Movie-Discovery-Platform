import React from "react";

const SkeletonCard = () => {
  return (
    <div className="movie-card" style={{ cursor: "default" }}>
      <div className="skeleton skeleton-card"></div>
      <div style={{ padding: "15px" }}>
        <div className="skeleton skeleton-text"></div>
        <div className="skeleton skeleton-subtext"></div>
      </div>
    </div>
  );
};

const SkeletonHero = () => {
  return <div className="skeleton skeleton-hero"></div>;
};

export { SkeletonCard, SkeletonHero };
