import LoginSignup from "../LoginSignup/LoginSignup";
import { ProfileCard} from "./ProfileCard";
import { EventCard } from "./EventCard";
import { NavBar } from "../NavBar/NavBar";
import { User,Event} from "../../types/types";
import { exampleUser,exampleEventList } from "../../constants/constants";
import React, { useContext, useState,useEffect } from "react"
import "./UserProfile.css"
import { fetchPastEvents, fetchRSVPEvents } from "../../utils/event-utils";
import { Backdrop, CircularProgress, Button,Typography } from "@mui/material";
import { AuthContext } from "../../context/AuthContext";
import { fetchUser } from "../../utils/user-utils";
export const UserProfile = () => {
    const [user,setUser] = useState<User>(exampleUser);
    const [events, setEvents] = useState<Event[]>([]);
    const context = useContext(AuthContext);
    useEffect(() => {
        console.log(context.token, context.accountType, context.id);
    }, []);
    const token = context.token;

    useEffect(() => {
        if(!token) return;
        loadEvent();
        loadUser();
    }, [token]);

    const loadEvent = async () => {
        const past: Event[] = [];
        const now = new Date();
        try {
            const event_ = await fetchRSVPEvents(token); 
            event_.forEach((event) => {
                if (event.end_time < now)  {
                    past.push(event); // Add to pastEvents if the event is in the past
                }})
            setEvents(past);
        } catch (err: any) {
            console.error("Error loading event:", err.message);
        }
    };
    const loadUser = async () =>{
        try{
            const user_ = await fetchUser(token);
        }catch (err:any){
            console.error("Error loading user:", err.message);
        }
    }
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