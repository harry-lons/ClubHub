import FollowButton from "../ClubDetail/FollowButton";
import React, { useEffect, useState, useContext } from "react";
import { Club } from "../../types/types";
import { fetchFollowStatus } from "../../utils/follow-utils";
import { AuthContext } from "../../context/AuthContext";

interface ClubCardProps {
  club: Club;
  goToClubProfile: (clubId: string) => void;
}

const ClubCard: React.FC<ClubCardProps> = ({ club, goToClubProfile }) => {
  const [follow, setFollow] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const { token } = useContext(AuthContext); // Assuming the token is stored in AuthContext

  useEffect(() => {
    const loadFollowStatus = async () => {
      try {
        const status = await fetchFollowStatus(token, club.id);
        setFollow(status as boolean);
      } catch (err: any) {
        console.error("Error loading Follow Status:", err.message);
      } finally {
        setLoading(false);
      }
    };

    loadFollowStatus();
  }, [club.id, token]);

  return (
    <div className="club-card">
      <div className="club-logo" style={{ backgroundColor: "#ccc" }}></div>
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
      {loading ? (
        <p>Loading...</p> // Display a loading message or spinner while fetching the follow status
      ) : (
        <FollowButton follow={follow} setFollow={setFollow} club_id={club.id} showMessages={false} />
      )}
    </div>
  );
};

export default ClubCard;