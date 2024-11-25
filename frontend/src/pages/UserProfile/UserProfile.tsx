import LoginSignup from "../LoginSignup/LoginSignup";
import { ProfileCard} from "./ProfileCard";
import { EventCard } from "./EventCard";
import { NavBar } from "../NavBar/NavBar";
import { User,Event} from "../../types/types";
import { exampleUser,exampleEventList } from "../../constants/constants";
import React, { useContext, useState,useEffect } from "react"
import "./UserProfile.css"
import { fetchPastEvents, fetchRSVPEvents } from "../../utils/event-utils";
import { AuthContext } from "../../context/AuthContext";
export const UserProfile = () => {
    const user = exampleUser as User;
    const [events, setEvents] = useState<Event[]>([]);
    const context = useContext(AuthContext);
    useEffect(() => {
        console.log(context.token, context.accountType, context.id);
    }, []);
    const token = context.token;

    useEffect(() => {
        if(!token) return;
        loadEvent();
    }, [token]);

    const loadEvent = async () => {
        try {
            const PastEvents = await fetchRSVPEvents(token); 
            //FILTER
            setEvents(PastEvents);
        } catch (err: any) {
            console.error("Error loading event:", err.message);
        }
    };
    return (
        <div className="userProfilePageContainer">
            
            <div className="navbarContainer">
                <NavBar />
            </div>
            <div className="userProfile">
                <div className="profileCardContainer">
                    <ProfileCard user={user} />
                </div>
                <div className = "pastEventContainer">
                    <div className = "textContainer">
                        <h3>My Past Events</h3>
                    </div>
                    <div className = "eventCardContainer">
                        <EventCard user = {user} events = {events}/>
                    </div>
                </div>     
            </div>
        </div>
    );
};