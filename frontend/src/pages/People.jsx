import React, { useEffect, useState } from "react";
import { getPopularPeople } from "../api/tmdb";
import { User } from "lucide-react";
import { SkeletonCard } from "../components/Skeleton";

const People = () => {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const res = await getPopularPeople();
        setPeople(res.data.results);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPeople();
  }, []);

  if (loading)
    return (
      <div style={{ padding: "40px 0" }}>
        <h1 style={{ marginBottom: "30px", fontSize: "2.5rem" }}>
          Popular People
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
      <h1 style={{ marginBottom: "30px", fontSize: "2.5rem" }}>
        Popular People
      </h1>
      <div
        className="movie-grid"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))" }}
      >
        {people.map((person) => (
          <div
            key={person.id}
            className="movie-card"
            style={{ textAlign: "center" }}
          >
            {person.profile_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w500${person.profile_path}`}
                alt={person.name}
                className="movie-poster"
                style={{
                  borderRadius: "50%",
                  width: "150px",
                  height: "150px",
                  margin: "20px auto",
                  objectFit: "cover",
                  border: "3px solid var(--primary-color)",
                }}
              />
            ) : (
              <div
                style={{
                  width: "150px",
                  height: "150px",
                  borderRadius: "50%",
                  background: "var(--card-bg)",
                  margin: "20px auto",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <User size={60} opacity={0.3} />
              </div>
            )}
            <div className="movie-info">
              <h3 style={{ fontSize: "1.1rem", marginBottom: "5px" }}>
                {person.name}
              </h3>
              <p style={{ fontSize: "0.8rem", opacity: 0.6 }}>
                {person.known_for_department}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default People;
