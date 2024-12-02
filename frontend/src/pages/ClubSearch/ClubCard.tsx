import React from "react";
import { Club } from "../../types/types";
import FollowButton from "../ClubDetail/FollowButton";

interface ClubCardProps {
  club: Club;
  followStatus: boolean;
  goToClubProfile: (clubId: string) => void;
}

const ClubCard: React.FC<ClubCardProps> = ({ club, followStatus, goToClubProfile }) => {
  const [follow, setFollow] = React.useState<boolean>(followStatus);

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
      <FollowButton
        follow={follow}
        setFollow={setFollow}
        club_id={club.id}
        showMessages={false} // Ensure showMessages is false
      />
    </div>
  );
};

export default ClubCard;
