import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ClubNavBar } from "../common/ClubNavBar";
import { emptyClub, emptyUsers, exampleClub, exampleClubEventList, exampleUsers } from "../../constants/constants";
import { AuthContext } from "../../context/AuthContext";
import { Club, Event, User } from "../../types/types";
import "./ClubProfile.css";
import { fetchClubById, fetchClubWho } from "../../utils/club-utils";
import { List } from "@mui/material";
import { fetchFollowers } from "../../utils/follow-utils";


interface ClubProfileProps {
    which?: string; // Optional `which` prop
}

export const ClubProfile: React.FC<ClubProfileProps> = ({ which }) => {
    const { id } = useParams<{ id: string }>(); // Get club ID from route params
    const navigate = useNavigate();
    const context = useContext(AuthContext);
    const [clubEvents, setClubEvents] = useState<Event[]>([]);
    //const club = exampleClub; // Example club data
    const [club, setClub] = useState<Club> (emptyClub);
    useEffect(() => {
        console.log(context.token, context.accountType, context.id, which);
    }, [which, context]);
    const [numFollowers,setNumFollowers] = useState(0);
    const [follower, setFollower] = useState<User[]>(emptyUsers);




    const token = context.token;

    useEffect(() => {
        if (!token) return;
        loadEvents();
        loadClubIdentity();
        loadFollowerList();
        //loadClub();
    }, [token]);

    // const loadClub = async () => {
    //     try {
    //         const club_ = await fetchClubById(id as string); // Convert id to a number
    //         setClub(club_);
    //     } catch (err: any) {
    //         console.error("Error loading club:", err.message);
    //     }
    // };
    const loadClubIdentity = async () =>{
        try{
            const owner_ = await fetchClubWho(token);
            setClub(owner_);
        }catch (err:any){
            console.error("Error loading user:", err.message);
        }
    }

    const loadEvents = async () => {
        try {
            const filteredEvents = exampleClubEventList.filter(event => event.club_id === id); // Example filtering
            setClubEvents(filteredEvents);
        } catch (err: any) {
            console.error("Error loading events:", err.message);
        }
    };

    const loadFollowerList = async()=>{
        try{
            const followers_ = await fetchFollowers(token);
            setFollower(followers_);
            console.log("Followers:", follower);
            setNumFollowers(followers_.length)
        }catch(err: any){
            console.error("Error in loading Follower List",err.message)
        }
    }

    const goToEventDetail = (event_id: string) => {
        navigate(`/events/${event_id}`);
    };


    return (
    
        <div style={{ width: "100%" }}>
             <div className="background"> </div>
            <div className="clubProfilePageContainer">
                <div className="navbarContainer"> <ClubNavBar />  </div>

                {/*Club Profile Card Side*/}
                <div className="clubProfileCardContainer">
                    <div className="profileCard" contentEditable="true" suppressContentEditableWarning={true}>
                        {/* Club Logo Placeholder */}
                        <div className="clubLogo" style={{ backgroundColor: "#ccc", borderRadius: "50%" }}>
                            {/* Placeholder */}
                        </div>

                        {/* Club Name */}
                        <h2 className="clubName">{club.name}</h2>

                        <h3 className="followerCount"> {numFollowers} Followers </h3>

                        <hr
                        style={{
                            width: "80%",
                            margin: "10px auto",
                            border: "none",
                            borderTop: "2px solid rgba(255, 255, 255, 0.2)", // Light divider
                            }}
                         />
                        
                        {/* Contact Information */}
                        <div className="contactInfo" contentEditable="true" suppressContentEditableWarning={true}>
                        <p className="contactLabel">Contact Information:</p>
                        <p className="contactEmail">{club.contact_email}</p>
                        </div>
                    </div>
                </div>
            
                <div className="boardMembersSection">
                    <h3 className="sectionTitle">Board Members</h3>

                    {/* Box containing the board members list */}
                    <div className="boardMembersContainer" contentEditable="true" suppressContentEditableWarning={true}>
                    {club.board_members.map((member, index) => (
                        <div key={index} className="boardMember">
                            <p className="boardMemberRole">
                            <span className="memberName"> {member.first_name} {member.last_name}</span>
                            </p>
                            <p className="boardMemberEmail">{member.username}</p>
                        </div>
                        ))}
                    </div>
                </div>

                    
                <div className="aboutUsSection">
                    <h3 className="sectionTitle">About Us</h3>
                    <div className="aboutUsContainer" contentEditable="true" suppressContentEditableWarning={true}>
                        {club.description}
                    </div>
                </div>
            </div>
        </div>
       
    );
};

export default ClubProfile;


