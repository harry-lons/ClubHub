import React, { useContext, useState,useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom";
import { Event, Club, RSVP, User} from "../../types/types";
import {exampleClub, exampleUsers, exampleEventList, emptyClub, emptyEventList } from "../../constants/constants";
import {AuthContext} from "../../context/AuthContext"
import { fetchClubEvents} from "../../utils/event-utils";
import { createFollow, deleteFollow, fetchFollowers, fetchFollowStatus } from "../../utils/follow-utils";
import { fetchClubById } from "../../utils/club-utils";
import { Follow } from "../../types/types";
import {Alert, Box,List,ListItem,ListItemText,AccordionDetails,Accordion,AccordionSummary} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Backdrop, CircularProgress, Button,Typography } from "@mui/material";
import "./ClubDetail.css";

interface ClubDetailProps {
    which: string; 
}
const ClubDetail: React.FC<ClubDetailProps> = ({which}) => {
   
    const { id } = useParams<{ id: string }>(); //should be club id
    const navigate = useNavigate();
    const context = useContext(AuthContext);
    useEffect(() => {
        console.log(context.token, context.accountType, context.id);
    }, []);
    const userId = context.id;
    const token = context.token;
    console.log("Account Type: ", context.accountType);
    const [club, setClub] = useState<Club> (emptyClub);
    const [follower, setFollower] = useState<User[]>(exampleUsers);
    const [pastEvents,setPastEvents] = useState<Event[]>(emptyEventList);
    const [nextEvents,setNextEvents] = useState<Event[]>(emptyEventList);
    const [follow, setFollow] = useState(false);
    const [loading, setLoading] = useState(true); // New loading state
    const [numFollowers,setNumFollowers] = useState(0);
    useEffect(() => {
        if (!id) return;
        loadEvent();
        loadClub();
        if(context.accountType === "user") loadFollowStatus();
        if(context.accountType === "club") loadFollowerList();
    }, [id]);

    const loadEvent = async () => {
        try {
            const event_ = await fetchClubEvents(id as String); // Convert id to a number
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
        }finally {
            setLoading(false); // Set loading state to false once done
        }
    };
    const loadFollowStatus = async () => {
        try {
            // ! bug RSVPList is undefined
            // ! bug RSVPList is undefined
            const status = await fetchFollowStatus(token,id as string); // Convert id to a number
            setFollow(status as boolean);
        } catch (err: any) {
            console.error("Error loading Follow Status:", err.message);
        }
    };
    const loadFollowerList = async()=>{
        try{
            const followers_ = await fetchFollowers(token);
            setFollower(followers_);
            setNumFollowers(follower.length)
        }catch(err: any){
            console.error("Error in loading Follower List",err.message)
        }
    }
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
        const [alert, setAlert] = useState<{ message: string; severity: 'success' | 'error' | null }>({
            message: '',
            severity: null,
        });
        const toggleFollow = async () => {
            setFollow(!follow);
            if (!follow) {
                const newFollow: Follow = {
                    user_id: userId,
                    club_id: id as string,
                };
    
                const successful = await createFollow(token, newFollow);
                console.log("followed: ", successful)
                if (successful) {
                    setAlert({
                        message: "You have successfully followed this club! We're very happy to have you here!",
                        severity: 'success',
                    });
                } else {
                    setAlert({
                        message: 'Follow action unsuccessful. Please contact the webpage administrator.',
                        severity: 'error',
                    });
                }
            } else {
                const successful = await deleteFollow(token, id as string);
                console.log("unfollowed: ", successful)
                if (successful) {
                    setAlert({
                        message: 'You have successfully unfollowed this club!',
                        severity: 'success',
                    });
                } else {
                    setAlert({
                        message: 'Unfollow action unsuccessful. Please contact the webpage administrator.',
                        severity: 'error',
                    });
                }
            }
            console.log(alert.message)
            // Automatically hide the alert after 3 seconds
            setTimeout(() => {
                setAlert({ message: '', severity: null });
            }, 3000); // 3000ms = 3 seconds
        }
        
        return (
            <>
            {alert.severity && (
                <Alert
                    icon={<CheckIcon fontSize="inherit" />}
                    severity={alert.severity}
                    onClose={() => setAlert({ message: '', severity: null })} // Allow closing the alert
                >
                    {alert.message}
                </Alert>
            )}
            <Button className="follow-button" variant="contained" onClick={toggleFollow}>
                {follow? 'unFOLLOW' : 'FOLLOW' }
            </Button>
            </>
        );
    };
    const goToDetailPage = (event_id: string) =>{
        navigate(`/events/${event_id}`);
    }
    return (
        <div id="club-detail-container">
            
            {/* Backdrop for loading */}
            <Backdrop
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading} // Backdrop visible when loading is true
            >
                <CircularProgress color="inherit" />
            </Backdrop>

            <div className="club-detail-header">
                <BackButton />
            </div>

            <div className="club-identity-container">
                <div className="club-name-container">
                    <h2>{club.name}</h2>
                    {context.accountType === "user" && <FollowButton/>}
                    
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
                {club.board_members.length === 0 ? (
                <Typography style={{ textAlign: 'center', margin: '16px 0' }}>
                    No Board Members Listed
                </Typography>
            ) : (
                <List
                    style={{
                        height: club.board_members.length < 10 ? 'auto' : '300px', // Adjust height dynamically
                        overflowY: club.board_members.length < 10 ? 'visible' : 'auto', // Avoid scrollbars for short lists
                    }}
                >
                    {club.board_members.map((member) => (
                        <ListItem key={member}>
                            <ListItemText primary={<Typography>{member}</Typography>} />
                        </ListItem>
                    ))}
                </List>
            )}
                </AccordionDetails>
                </Accordion>
            </div>
            {context.accountType === "club" &&
            <div className="club-follower">
                <Accordion sx={{ marginTop: 2}}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <h3>Club Followers {numFollowers}</h3>
                </AccordionSummary>
                <AccordionDetails>
                {numFollowers === 0 ? (
                <Typography style={{ textAlign: 'center', margin: '16px 0' }}>
                    No Followers
                </Typography>
            ) : (
                <List
                    style={{
                        height: numFollowers < 10 ? 'auto' : '300px', // Adjust height dynamically
                        overflowY: numFollowers < 10 ? 'visible' : 'auto', // Avoid scrollbars for short lists
                    }}
                >
                    {follower.map((member) => (
                        <ListItem key={member.id}>
                            <ListItemText primary={<Typography>{member.first_name} {member.last_name}</Typography>} />
                        </ListItem>
                    ))}
                </List>
            )}
                </AccordionDetails>
                </Accordion>
            </div>
}

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
                        <List style = {{maxHeight:'400px', overflowY: 'auto'}}>
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
                        <List style = {{maxHeight:'400px', overflowY: 'auto'}}>
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
