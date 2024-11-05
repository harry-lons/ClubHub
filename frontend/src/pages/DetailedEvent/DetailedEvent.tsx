import React, { useContext, useState,useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom";
import { Event } from "../../types/types";
import { Club } from "../../types/types";
import { exampleEvent, exampleClub } from "../../constants/constants";
import { TextField, Button, MenuItem } from '@mui/material';
import "./DetailedEvent.css"
import {AuthContext} from "../../context/AuthContext"
import { fetchEventById } from "../../utils/event-details-utils";
import { fetchClubById } from "../../utils/club-utils";
import exampleFlyer from "../../constants/flyer.jpg";


const DetailedEvent: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const authContext = useContext(AuthContext);
    
    const [event, setEvent] = useState<Event> (exampleEvent);
    const [club, setClub] = useState<Club> (exampleClub);

    useEffect(() => {
        if (!id) return;
        loadEvent();
        loadClub();
    }, [id]);

    const loadEvent = async () => {
        try {
            const event_ = await fetchEventById(Number(id)); // Convert id to a number
            setEvent(event_);
        } catch (err: any) {
            console.error("Error loading event:", err.message);
        }
    };
    
    

    const loadClub = async () => {
        try {
            const club_ = await fetchClubById(event.club_id); // Convert id to a number
            setClub(club_);
        } catch (err: any) {
            console.error("Error loading club:", err.message);
        }
    };

    const handleTime = (begin_time: Date, end_time: Date) => {

        const byear = begin_time.getFullYear();
        const bmonth = begin_time.getMonth() + 1;
        const bday = begin_time.getDate();
        const bhours = begin_time.getHours().toString().padStart(2, '0');
        const bminutes = begin_time.getMinutes().toString().padStart(2, '0');

        const eyear = end_time.getFullYear();
        const emonth = end_time.getMonth() + 1;
        const eday = end_time.getDate();
        const ehours = end_time.getHours().toString().padStart(2, '0');
        const eminutes = end_time.getMinutes().toString().padStart(2, '0');

        if (byear == eyear && bmonth == emonth && bday == eday) {
            return (<p>{byear}-{bmonth}-{bday} {bhours}:{bminutes} to {ehours}:{eminutes}</p>);
        } else {
            return (<p>{byear}-{bmonth}-{bday} {bhours}:{bminutes} to {eyear}-{emonth}-{eday} {ehours}:{eminutes}</p>)
        }
    }
    const recurrenceDescription = (interval: number) =>{
        switch (interval){
            case 0:
                return "weekly";
            case 1:
                return "every other week";
            case 2:
                return "monthly";
            default:
                return "custom interval";
        }
    }
    const handleRecur = (recurrence: [ boolean, number, Date|null])=>{
        if(!recurrence[0]){
            return (<p>Not a recurring event.</p >);
        }else{
            return(<p>Yes. Recur {recurrenceDescription(recurrence[1])}. End Date {recurrence[2]?.getFullYear()}-{recurrence[2]?.getMonth()}-{recurrence[2]?.getDate()}</p >);
        }
    }

    const handleFollowClick = (event_id: string)=>{

    }
    // const handleAttendees = (event_id: string) =>{
    // implement after database is set
    // //search through the same event_id
    // //try to represent the list in a nice way
    // }



    const BackButton: React.FC = () => {
        const handleBack = () => {
        navigate(-1); // Navigates to the previous page
        };

        return (
        <button onClick={handleBack} className="back-button">
            &lt;
        </button>
        );
    };

    const RSVPButton : React.FC = () => {
        return (
            <Button variant="contained" style={{ backgroundColor: '#43BD28', color: '#FFFFFF' }} onClick={()=>handleFollowClick}>RSVP</Button>
        );
    };
    
    return (
        <div id="event-detail-container">
            <div className="event-detail-header">
                <BackButton />
            </div>
            <div className="event-identity-container">
                <div className="event-title-container">
                        <div className="event-title">
                            <h2>{event.title}</h2>
                        </div>
                        <RSVPButton />
                </div>
                <div className="event-club">
                    <p>From {club.name}</p>
                </div>
                
            </div>
            <div className="event-info-container">
                <div className="event-description">
                    <h3>Description</h3>
                    <p>{event.summary}</p >
                </div>
                <div className="event-type">
                    <h3>Type</h3>
                    <p>{event.type}</p >
                </div>
                <div className="event-location">
                    <h3>Location</h3>
                    <p>{event.location}</p >
                </div>
                <div className="event-time">
                    <h3>Date & Time</h3>
                    {handleTime(event.begin_time, event.end_time)}
                </div>
                <div className="event-recurring">
                    <h3>Recurring</h3>
                    {handleRecur(event.recurrence)}
                </div>
                <div className="event-pictures">
                    <h3>Pictures</h3>
                    <img src={exampleFlyer} className="event-picture"/>
                </div>
                <div className = "event-contact">
                    <h3>Contact Information</h3>
                    {Array.isArray(club.contact_email) ? (
                        club.contact_email.map((email, index) => (
                        <p key={index}>{email}</p>
                        ))
                    ) : (
                    <p>{club.contact_email}</p>
                    )}
                </div>
                <div className="event-attendees"></div>
                
                <div></div>
            </div>
        </div>
    );
    };


export default DetailedEvent;