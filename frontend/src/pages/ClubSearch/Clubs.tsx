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
                style={{ backgroundColor: club.logo || "#ccc" }}
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




//old code

// import React, { useState } from "react";
// import { NavBar } from "../NavBar/NavBar";
// import { useNavigate } from "react-router-dom";
// import "./Clubs.css";

// const exampleClubList = [
//   { clubName: "Future Innovators Society", description: "Future Innovators Society Description...", logoColor: "#a850ba" },
//   { clubName: "Urban Gardeners Network", description: "Urban Gardeners Network Description...", logoColor: "#15e688" },
//   { clubName: "The Literary Society", description: "The Literary Society is a vibrant community dedi...", logoColor: "blue" },
//   { clubName: "Club 4", description: "All about Club 4 ...Lorem ipsum dolor sit amet,  est laborum.", logoColor: "yellow" },
//   { clubName: "Clubert 4", description: "All about Clubert 4 ...", logoColor: "magenta" },
//   { clubName: "Clubert 4.5", description: "All about Clubert 4.5 ...", logoColor: "#faae66" },
//   { clubName: "Club 5", description: "All about Club 5...", logoColor: "red" },
//   { clubName: "Club 6", description: "All about Club 6...Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", logoColor: "pink" },
//   { clubName: "Club 7", description: "All about Club 7...", logoColor: "cyan" },
//   { clubName: "Club 8", description: "All about Club 8...", logoColor: "#a7f542" },
//   { clubName: "Club 9", description: "All about Club 9...", logoColor: "orange" },
//   { clubName: "Club 10", description: "All about Club 10...Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", logoColor: "yellow" },
// ];

// const Clubs: React.FC = () => {
//   const [clubs, setClubs] = useState(exampleClubList);
//   const [searchQuery, setSearchQuery] = useState("");
//   const navigate = useNavigate();
//   const [following, setFollowing] = useState<string[]>([]);

//   const filteredClubs = clubs.filter((club) =>
//     club.clubName.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const goToClubProfile = (club_id: string) => {
//     navigate(`/clubDetail/${club_id}`);
//   };

//   const toggleFollow = (clubName: string) => {
//     setFollowing((prev) =>
//       prev.includes(clubName)
//         ? prev.filter((name) => name !== clubName)
//         : [...prev, clubName]
//     );
//   };

//   return (
//     <div className="clubs-list-container">
//       <div className="sticky-header">
//         <div className="navbar-container">
//           <NavBar />
//         </div>

//         <div className="search-bar">
//           <input
//             type="text"
//             placeholder="Search for Clubs and Organizations"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </div>
//       </div>
//       <div className="clubs-list-container">
//         <div className="clubs-list">
//           {filteredClubs.map((club, index) => (
//             <div key={index} className="club-card">
//               <div className="club-logo" style={{ backgroundColor: club.logoColor }}></div>
//               <div className="club-details">
//                 <p className="club-name" onClick={() => goToClubProfile("1")}>
//                   {club.clubName}
//                 </p>
//                 <p className="club-description">
//                   {club.description.length > 600
//                     ? `${club.description.slice(0, 100)}...`
//                     : club.description}
//                 </p>
//               </div>
//               <button className="follow-button" onClick={() => toggleFollow(club.clubName)}>
//                 {following.includes(club.clubName) ? "Unfollow" : "Follow"}
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Clubs;

