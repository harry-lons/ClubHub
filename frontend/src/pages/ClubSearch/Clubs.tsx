import React, { useState, useEffect, useContext } from "react";
import { NavBar } from "../common/NavBar";
import { useNavigate } from "react-router-dom";
import { fetchClubList } from "../../utils/club-utils";
import { getFollowed } from "../../utils/follow-utils";
import { Club } from "../../types/types";
import LoadingSpinner from "../common/LoadingSpinner";
import ClubCard from "./ClubCard";
import { AuthContext } from "../../context/AuthContext";
import "./Clubs.css";

const Clubs: React.FC = () => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [followedClubs, setFollowedClubs] = useState<Set<string>>(new Set());
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const filteredClubs = clubs.filter((club) =>
    club.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const clubList = await fetchClubList();
        setClubs(clubList);

        const followedList = await getFollowed(token);
        setFollowedClubs(new Set(followedList));
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const goToClubProfile = (clubId: string) => {
    navigate(`/clubDetail/${clubId}`);
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
            {filteredClubs.map((club) => (
              <ClubCard
                key={club.id}
                club={club}
                followStatus={followedClubs.has(club.id)}
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
