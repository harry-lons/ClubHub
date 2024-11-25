import React, { useState, useEffect } from "react";
import { NavBar } from "../NavBar/NavBar";
import { useNavigate } from "react-router-dom";
import { fetchClubList } from "../../utils/club-utils"
import { Club } from "../../types/types";
import "./Clubs.css";

const Clubs: React.FC = () => {
  const [clubs, setClubs] = useState<Club[]>([]); // Store the list of clubs
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const navigate = useNavigate();
  const [following, setFollowing] = useState<string[]>([]);

  const filteredClubs = clubs.filter((club) =>
    club.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Fetch data whenever the search query changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const clubList = await fetchClubList();
        await setClubs(clubList);
      } catch (error) {
        console.error("Error fetching clubs:", error);
      }
    };
  
    fetchData();
  }, []);

  const goToClubProfile = (club_id: string) => {
    navigate(`/clubDetail/${club_id}`);
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

      <div className="clubs-list-container">
        {loading && <p>Loading...</p>} {/* Show loading spinner */}
        {error && <p className="error">{error}</p>} {/* Show error message */}
        <div className="clubs-list">
        {Array.isArray(filteredClubs) && filteredClubs.length > 0 && (filteredClubs.map((club, index) => (
            <div key={index} className="club-card">
              <div
                className="club-logo"
                style={{ backgroundColor: "#ccc" }}
              ></div>
              <div className="club-details">
                <p className="club-name" onClick={() => goToClubProfile(club.id)}>
                  {club.name}
                </p>
                <p className="club-description">
                  {club.description?.length > 100
                    ? `${club.description.slice(0, 100)}...`
                    : club.description}
                </p>
              </div>
              <button
                className="follow-button"
                onClick={() => toggleFollow(club.name)}
              >
                {following.includes(club.name) ? "Unfollow" : "Follow"}
              </button>
            </div>
          )))}
        </div>
      </div>
    </div>
  );
};

export default Clubs;
