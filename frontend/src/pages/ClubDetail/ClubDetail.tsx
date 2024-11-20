import React, { useContext, useState,useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom";
import { Event, Club, RSVP, User} from "../../types/types";
import {exampleClub, exampleUsers, exampleEventList } from "../../constants/constants";
import { TextField, Button, MenuItem, Typography } from '@mui/material';
import {AuthContext} from "../../context/AuthContext"
import { fetchClubEvents} from "../../utils/event-utils";
import { createFollow, deleteFollow } from "../../utils/follow-utils";
import { fetchClubById } from "../../utils/club-utils";
import { Follow } from "../../types/types";
import {Alert, Box,List,ListItem,ListItemText,AccordionDetails,Accordion,AccordionSummary} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import "./ClubDetail.css";

interface ClubDetailProps {
    which: string; 
}
const ClubDetail: React.FC<ClubDetailProps> = ({which}) => {
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
    const [follow, setFollow] = useState(false);
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
    const FollowButton : React.FC = () => {
        const toggleFollow = async () => {
            setFollow(!rsvp);
            if (!follow) {
                const newFollow: Follow = {
                    user_id: userId,
                    club_id: id as string
                };
                const successful = await createFollow(token,newFollow);
                if(successful){
                    <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
                        You have successfully Followed this club! We're very happy to have you here!
                    </Alert>
                }else{
                    <Alert severity="error">Follow Action unsuccessful please contact webpage administrator</Alert>
                }
            } else {
                const successful = await deleteFollow(token,id as string);
                if(successful){
                    <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
                        You have successfully canceled RSVP to this event!
                    </Alert>
                }else{
                    <Alert severity="error">Cancel RSVP unsuccessful please contact webpage administrator</Alert>
                }
            }
        }
        return (
            <Button className="follow-button" variant="contained" onClick={toggleFollow}>
                {rsvp? 'unFOLLOW' : 'FOLLOW' }
            </Button>
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
                    {which == "USER" && <FollowButton/>}
                    
                </div>
                <div className = "club-description-container">
                    <p className="club-description">{club.description}</p>
                </div>
            </div>

            <div className="club-board">
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <h3>Board Members</h3>
                </AccordionSummary>
                <AccordionDetails>
                    <List style={{ height: '300px', overflowY: 'auto' }}>
                        {club.board_members.map((member) => (
                            <ListItem key={member}>
                            <ListItemText primary={<Typography>{member}</Typography>} />
                            </ListItem>
                    ))}
                    </List>
                </AccordionDetails>
                </Accordion>
            </div>

            <div className="club-contact">
                <h3>Contact Information</h3>
                {Array.isArray(club.contact_email) ? (
                    club.contact_email.map((email, index) => <p key={index}>{email}</p>)
                    ) : (
                        <p>{club.contact_email}</p>
                    )}
            </div>

            
            <div className="club-events-container">
                <Accordion defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <h3>Upcoming Events</h3>
                    </AccordionSummary>
                    <AccordionDetails>
                        <List style={{ height: '400px', overflowY: 'auto' }}>
                            {nextEvents.map(event => (
                                <ListItem key={event.id} style={{backgroundColor: '#f3e5f5', margin: '8px 0', borderRadius: '8px', padding: '16px',}}>
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