import React, { useContext, useState,useEffect } from "react"
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import { useParams, useNavigate } from "react-router-dom";
import { Event, Club, RSVP, User} from "../../types/types";
import { exampleEvent, exampleClub, exampleUsers, exampleEventList } from "../../constants/constants";
import { TextField, Button, MenuItem, Typography } from '@mui/material';
import {AuthContext} from "../../context/AuthContext"
import { fetchClubEvents, fetchEventById, fetchPastEvents } from "../../utils/event-utils";
import { fetchClubById } from "../../utils/club-utils";
import exampleFlyer from "../../constants/flyer.jpg";
import {Alert, Box,List,ListItem,ListItemButton,ListItemText,AccordionDetails,Accordion,AccordionSummary} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import "./ClubDetail.css";
const ClubDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>(); //should be club id
    const navigate = useNavigate();
    const {token} = useContext(AuthContext);
    // const { userId } = useContext(AuthContext);
    const [club, setClub] = useState<Club> (exampleClub);
    const [rsvp, setRsvp] = useState(false);
    const userId = "001";
    const [attendees, setAttendees] = useState<User[]>(exampleUsers);
    const [pastEvents,setPastEvents] = useState<Event[]>(exampleEventList);
    const [nextEvents,setNextEvents] = useState<Event[]>(exampleEventList);

    useEffect(() => {
        if (!id) return;
        loadEvent();
        loadClub();
    }, [id]);

    const loadEvent = async () => {
        try {
            const event_ = await fetchClubEvents(Number(id)); // Convert id to a number
            const past: Event[] = [];
            const next: Event[] = [];
            const now = new Date();

            // Loop through the events and categorize them
            event_.forEach((event) => {
            if (event.end_time > now) {
                next.push(event); // Add to nextEvents if the event is upcoming
            } else {
                past.push(event); // Add to pastEvents if the event is in the past
            }
        });
        // Update the state
        setNextEvents(next);
        setPastEvents(past);
        } catch (err: any) {
            console.error("Error loading event:", err.message);
        }
    };
    

    const loadClub = async () => {
        try {
            const club_ = await fetchClubById(id as string); // Convert id to a number
            setClub(club_);
        } catch (err: any) {
            console.error("Error loading club:", err.message);
        }
    };
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
    const goToDetailPage = (event_id: string) =>{
        navigate(`/events/${event_id}`);
    }
    return (
        <div id="club-detail-container">
            <div className="club-detail-header">
                <BackButton />
            </div>

            <div className="club-identity-container">
                <div className="club-name-container">
                    <h2>{club.name}</h2>
                    <p className="club-description">{club.description}</p>
                </div>

                <div className="club-board">
                    <h3>Board Members</h3>
                    {/* Waiting to be Implemented, related to privacy */}
                </div>

                <div className="club-contact">
                    <h3>Contact Information</h3>
                    {Array.isArray(club.contact_email) ? (
                        club.contact_email.map((email, index) => <p key={index}>{email}</p>)
                    ) : (
                        <p>{club.contact_email}</p>
                    )}
                </div>
            </div>

            <div className="club-events-container">
                <Accordion defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <h3>Upcoming Events</h3>
                    </AccordionSummary>
                    <AccordionDetails>
                        <List style={{ height: '400px', overflowY: 'auto' }}>
                            {nextEvents.map(event => (
                                <ListItem
                                    key={event.id}
                                    style={{
                                        backgroundColor: '#f3e5f5',
                                        margin: '8px 0',
                                        borderRadius: '8px',
                                        padding: '16px',
                                    }}
                                >
                                    <ListItemText primary={
                                        <Typography onClick={() => goToDetailPage(event.id)} className="club-event-clickable-title">
                                                {event.title}
                                        </Typography>} 
                                            secondary={event.summary} />
                                </ListItem>
                            ))}
                        </List>
                    </AccordionDetails>
                </Accordion>

                <Accordion defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <h3>Past Events</h3>
                    </AccordionSummary>
                    <AccordionDetails>
                        <List style={{ height: '400px', overflowY: 'auto' }}>
                            {pastEvents.map(event => (
                                <ListItem
                                    key={event.id}
                                    style={{
                                        backgroundColor: '#f3e5f5',
                                        margin: '8px 0',
                                        borderRadius: '8px',
                                        padding: '16px',
                                    }}
                                >
                                    <ListItemText primary={
                                            <Typography
                                                onClick={() => goToDetailPage(event.id)}
                                                className="club-event-clickable-title"
                                            >
                                                {event.title}
                                            </Typography>
                                        }
                                        secondary={event.summary} />
                                </ListItem>
                            ))}
                        </List>
                    </AccordionDetails>
                </Accordion>
            </div>
        </div>
    );
};

export default ClubDetail;