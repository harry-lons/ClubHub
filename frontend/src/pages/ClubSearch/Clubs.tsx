import React, { useState, useEffect } from "react";
import { NavBar } from "../common/NavBar";
import { useNavigate } from "react-router-dom";
import { fetchClubList } from "../../utils/club-utils";
import { Club } from "../../types/types";
import LoadingSpinner from "../common/LoadingSpinner";
import ClubCard from "./ClubCard"; // Import the ClubCard component
import "./Clubs.css";

const Clubs: React.FC = () => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [following, setFollowing] = useState<string[]>([]);

  const filteredClubs = clubs.filter((club) =>
    club.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const clubList = await fetchClubList();
        setClubs(clubList);
      } catch (error) {
        console.error("Error fetching clubs:", error);
        setError("Failed to fetch clubs.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const goToClubProfile = (clubId: string) => {
    navigate(`/clubDetail/${clubId}`);
  };

  const toggleFollow = (clubName: string) => {
    setFollowing((prev) =>
      prev.includes(clubName)
        ? prev.filter((name) => name !== clubName)
        : [...prev, clubName]
    );
  };

  return (
    <div className="clubs-list-container">
      <div className="sticky-header">
        <div className="navbar-container">
          <NavBar />
        </div>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for Clubs and Organizations"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="clubs-list-container">
          {error && <p className="error">{error}</p>}
          <div className="clubs-list">
            {Array.isArray(filteredClubs) &&
              filteredClubs.length > 0 &&
              filteredClubs.map((club, index) => (
                <ClubCard
                  key={club.id}
                  club={club}
                  goToClubProfile={goToClubProfile}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Clubs;