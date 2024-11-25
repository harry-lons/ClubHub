import { Event } from "../../types/types";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { exampleClubEventList, exampleRSVPList } from "../../constants/constants";
import { Grid, Button, Card, CardContent } from '@mui/material';
import { NavBar } from "../NavBar/NavBar";
import { fetchRSVPEvents } from "../../utils/event-utils";
import { AuthContext } from "../../context/AuthContext";
import "./ClubEventList.css";

interface ClubEventListProps {
    which?: string;
}

const ClubEventList: React.FC<ClubEventListProps> = ({ which }) => {
    const navigate = useNavigate();
    const [eventList, setEventList] = useState<Record<string, [string, Event][]>>();
    const { id: club_id } = useParams<{ id: string }>(); // Get the club's ID from the route
    const { token } = useContext(AuthContext); // Retrieve the token from AuthContext

    useEffect(() => {
        const loadEvents = async () => {
            try {
                const eList = await fetchRSVPEvents(token).catch(() => exampleClubEventList); // Pass token here

                // Filter events to only include those created by the current club
                const filteredEvents = eList.filter(event => event.club_id === club_id);

                // Group events by date and set the state
                const groupedEvents = groupEventsByDate(filteredEvents);
                setEventList(groupedEvents);
            } catch (error) {
                console.error("Error loading events:", error);
            }
        };

        loadEvents();
    }, [club_id, token]);
 
    const groupEventsByDate = (events: Event[]): Record<string, [string, Event][]> => {
        return events.reduce((acc, event) => {
            // Get the month name (e.g., "January")
            const month = event.begin_time.toLocaleString("default", { month: "long" });
    
            // Ensure the month key exists in the accumulator
            acc[month] = acc[month] || [];
    
            // Add the event to the appropriate month group with a placeholder club name
            acc[month].push(["Unknown Club", event]);
    
            // Sort events within the month by date and time
            acc[month].sort((a, b) => a[1].begin_time.getTime() - b[1].begin_time.getTime());
    
            return acc;
        }, {} as Record<string, [string, Event][]>);
    };
    
    const goToDetailPage = (event_id: string) => {
        navigate(`/events/${event_id}`);
    }
    
    const handleDelete = (eventId: string) => console.log("Delete event:", eventId);
    const handleEdit = (eventId: string) => console.log("Edit event:", eventId);
    
    //Placeholder screen for when no access to backend
    if (eventList === undefined) {
        return (
            <div style={{width: "100%"}}>
                <div className="background"/>
                <Grid container rowSpacing={4} className="events-list-container">
                    <div className="navbar-container">
                        <NavBar />
                    </div>
                    <div className="events-created-header-container">
                        <h1 className="header-title">Events Created</h1>
                    </div>
                    <Grid item xs={12}>
                        <Grid container rowSpacing={4} className="events-list">
                            {Object.entries(eventList || {}).map(([month, events]) => (
                                <Grid item xs={12} key={month} className="month-row">
                                    <h2>{month}</h2>
                                    <div className="event-cards-row">
                                        {(events as [string, Event][]).map(([clubName, event]) => (
                                        <Card key={event.id} className="event-card">
                                            <CardContent>
                                                <h3>{event.title}</h3>
                                                <p>{event.location}</p>
                                                <p>{event.begin_time.toLocaleDateString()}</p> 
                                                <p>{event.begin_time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                <p>{exampleRSVPList[event.id] || 0} RSVPs</p>
                                                <div className="button-container">
                                                    <Button className="edit-button" variant="contained" onClick={() => handleEdit(event.id)}>
                                                        Edit
                                                    </Button>
                                                    <Button className="delete-button" variant="contained" onClick={() => handleDelete(event.id)}>
                                                        Delete
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                    </div >
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        );
    }


    //Real screen from backend access
    else {
        return (
            <div style={{width: "100%"}}>
                <div className="background"/>
                <Grid container rowSpacing={4} className="events-list-container">
                    <div className="navbar-container">
                        <NavBar />
                    </div>
                    <div className="events-created-header-container">
                        <h1 className="header-title">Events Created</h1>
                        <Button className="add-event-button" variant="contained" 
                                onClick={() => navigate(`/clubs/${club_id}/add-event`)} >
                                + Add Event
                        </Button>
                    </div>
                    <Grid item xs={12}>
                        <Grid container rowSpacing={4} className="events-list">
                            {Object.entries(eventList || {}).map(([month, events]) => (
                                <Grid item xs={12} key={month} className="month-row">
                                    <h2>{month}</h2>
                                    <div className="event-cards-row">
                                        {(events as [string, Event][]).map(([clubName, event]) => (
                                        <Card key={event.id} className="event-card">
                                            <CardContent>
                                            <h3>{event.title}</h3>
                                                <p>{event.location}</p>
                                                <p>{`${event.begin_time.toLocaleDateString()} at ${event.begin_time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}</p>
                                                <p>{exampleRSVPList[event.id] || 0} RSVPed</p>
                                                <div className="event-buttons">
                                                    <Button className="edit-button" variant="contained" onClick={() => handleEdit(event.id)}>
                                                        Edit
                                                    </Button>
                                                    <Button className="delete-button" variant="contained" onClick={() => handleDelete(event.id)}>
                                                        Delete
                                                    </Button>
                                                </div>

                                               
                                            </CardContent>
                                        </Card>
                                    ))}
                                      <hr className="month-divider"></hr>
                                    </div >
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        );
    };    
}

export default ClubEventList;
