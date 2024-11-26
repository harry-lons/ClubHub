import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ClubProfile.css";
import { exampleClub, exampleClubEventList } from "../../constants/constants"; 
import { NavBar } from "../NavBar/NavBar";

interface ClubProfileProps {
    which?: string; // If the prop is optional
}

const ClubProfile: React.FC<ClubProfileProps> = ({ which }) => {
  const { id } = useParams<{ id: string }>(); // Get the club ID    
  const navigate = useNavigate();

  



  // Use the `exampleClub` and filter `exampleClubEventList` based on club ID
  const club = exampleClub;
  const clubEvents = exampleClubEventList.filter((event) => event.club_id === id);

    return(
        
        <div style={{ width: "100%" }}>
            <div className="background">
                <div className="navbar-container">
                    <NavBar />
                </div>
            </div>
        </div>
               
               
       

    );



};

export default ClubProfile;



//   return (
//     <div className="club-profile-container">
//       {/* Club Information */}
//       <div className="club-info">
//         <div className="club-logo" />
//         <h2>{club.name}</h2>
//         <p>Edit</p>
//         <p>1234 Followers</p>
//         <p>Contact Information</p>
//         <p>{club.contact_email}</p>
//       </div>

//       {/* Board Members */}
//       <div className="club-board-members">
//         <h3>Board Members</h3>
//         <ul>
//           {club.board_members.map((member, index) => (
//             <li key={index}>
//               <span>{member}</span>
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* About Us */}
//       <div className="club-about">
//         <h3>About Us</h3>
//         <p>{club.description}</p>
//       </div>

//       {/* Events */}
//       <div className="club-events">
//         <h3>Upcoming Events</h3>
//         {clubEvents.length > 0 ? (
//           <ul>
//             {clubEvents.map((event) => (
//               <li key={event.id}>
//                 <h4>{event.title}</h4>
//                 <p>{event.summary}</p>
//                 <p>
//                   <strong>Location:</strong> {event.location}
//                 </p>
//                 <p>
//                   <strong>Time:</strong> {new Date(event.begin_time).toLocaleString()} -{" "}
//                   {new Date(event.end_time).toLocaleString()}
//                 </p>
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p>No upcoming events for this club.</p>
//         )}
//       </div>
//     </div>
//   );