import LoginSignup from "../LoginSignup/LoginSignup";
import { ProfileCard} from "./ProfileCard";
import { EventCard } from "./EventCard";
import { NavBar } from "../NavBar/NavBar";
import { User,Event} from "../../types/types";
import { exampleUser,exampleEventList } from "../../constants/constants";
import React, { useContext, useState,useEffect } from "react"
import "./UserProfile.css"
import { fetchEvents } from "../../utils/event-utils";
export const UserProfile = () => {
    const user = exampleUser as User;
    const events = exampleEventList as Event[];
    
    useEffect(() => {
        loadEvent();
    }, []);

    const loadEvent = async () => {
        try {
            const events = await fetchEvents(); 
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