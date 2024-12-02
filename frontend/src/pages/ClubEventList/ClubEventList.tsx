import { Event } from "../../types/types";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { exampleClubEventList, exampleRSVPList } from "../../constants/constants";
import { Grid, Button, Card, CardContent } from '@mui/material';
import { deleteEvent, fetchClubEvents, fetchRSVPEvents } from "../../utils/event-utils";
import { AuthContext } from "../../context/AuthContext";
import "./ClubEventList.css";
import { ClubNavBar } from "../common/ClubNavBar";
import LoadingSpinner from "../common/LoadingSpinner";

interface ClubEventListProps {
    which?: string;
}

const ClubEventList: React.FC<ClubEventListProps> = ({ which }) => {
    const navigate = useNavigate();
    const [eventList, setEventList] = useState<Record<string, [string, Event][]>>();
    const [loading, setLoading] = useState(true);
    const { token, id } = useContext(AuthContext); // Retrieve the token from AuthContext

    useEffect(() => {
        const loadEvents = async () => {
            try {
                const eList = await fetchClubEvents(id).catch(() => exampleClubEventList); // Pass token here

                // Group events by date and set the state
                const groupedEvents = groupEventsByDate(eList);
                setEventList(groupedEvents);
            } catch (error) {
                console.error("Error loading events:", error);
            } finally {
                setLoading(false);
            }
        };

        loadEvents();
    }, []);

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
        navigate(`/club/events/${event_id}`);
    }

    const handleDelete = (eventId: string) => deleteEvent(token, Number(eventId));
    const handleEdit = (eventId: string) => navigate(`/club/editEvent/${eventId}`);

    const scrollRow = (rowId: string, direction: "left" | "right") => {
        const row = document.getElementById(rowId);
        if (row) {
            const scrollAmount = 300; // Adjust to match card widths and gaps
            row.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
        }
    };

    if (eventList === undefined) {
        return (
            <div style={{ width: "100%" }}>
                <div className="background" />

                <Grid container rowSpacing={4} className="events-list-container">
                    <div className="navbar-container">
                        <ClubNavBar />
                    </div>
                    <div className="events-created-header-container">
                        <h1 className="header-title">Events Created</h1>
                    </div>
                    {
                        loading ?
                            <LoadingSpinner />
                            :
                            <Grid item xs={12}>
                                <Grid container rowSpacing={4} className="events-list">
                                    {Object.entries(eventList || {}).map(([month, events]) => (
                                        <Grid item xs={12} key={month} className="month-row">
                                            <h2>{month}</h2>
                                            <div className="event-cards-container">
                                                <button
                                                    className="arrow-button left"
                                                    onClick={() => scrollRow(`${month}-row`, "left")}
                                                >
                                                    &#8249;
                                                </button>
                                                <div id={`${month}-row`} className="event-cards-row">
                                                    {(events as [string, Event][]).map(([clubName, event]) => (
                                                        <Card key={event.id} className="event-card">
                                                            <CardContent>
                                                                <h3 onClick={() => goToDetailPage(event.id)}>{event.title}</h3>
                                                                <p>{event.location}</p>
                                                                <p>{event.begin_time.toLocaleDateString()}</p>
                                                                <p>{event.begin_time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                                <p>{exampleRSVPList[event.id] || 0} RSVPs</p>
                                                                <div className="event-buttons">
                                                                    <Button className="edit-club-button" variant="contained" onClick={() => handleEdit(event.id)}>
                                                                        Edit
                                                                    </Button>
                                                                    <Button className="delete-club-button" variant="contained" onClick={() => handleDelete(event.id)}>
                                                                        Delete
                                                                    </Button>
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    ))}
                                                </div>
                                                <button
                                                    className="arrow-button right"
                                                    onClick={() => scrollRow(`${month}-row`, "right")}
                                                >
                                                    &#8250;
                                                </button>
                                            </div>
                                            <hr className="month-divider"></hr>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Grid>
                    }
                </Grid>
            </div>
        );
    }

    return (
        <div style={{ width: "100%" }}>
            <div className="background" />
            <Grid container rowSpacing={4} className="events-list-container">
                <div className="navbar-container">
                    <ClubNavBar />
                </div>
                <div className="events-created-header-container">
                    <h1 className="header-title">Events Created</h1>
                    <Button className="add-event-button" variant="contained" onClick={() => navigate(`/club/addEvent`)}>+ Add Event</Button>
                </div>
                <Grid item xs={12}>
                    <Grid container rowSpacing={4} className="events-list">
                        {Object.entries(eventList || {}).map(([month, events]) => (
                            <Grid item xs={12} key={month} className="month-row">
                                <h2>{month}</h2>
                                <div className="event-cards-container">
                                    <button className="arrow-button left" onClick={() => scrollRow(`${month}-row`, "left")}>&#8249;</button>
                                    <div id={`${month}-row`} className="event-cards-row">
                                        {(events as [string, Event][]).map(([clubName, event]) => (
                                            <Card key={event.id} className="event-card">
                                                <CardContent>
                                                    <h3 onClick={() => goToDetailPage(event.id)}>{event.title}</h3>
                                                    <p>{event.location}</p>
                                                    <p>{`${event.begin_time.toLocaleDateString()} at ${event.begin_time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}</p>
                                                    <p>{exampleRSVPList[event.id] || 0} RSVPed</p>
                                                    <div className="event-buttons">
                                                        <Button className="edit-club-button" variant="contained" onClick={() => handleEdit(event.id)}>
                                                            Edit
                                                        </Button>
                                                        <Button className="delete-club-button" variant="contained" onClick={() => handleDelete(event.id)}>
                                                            Delete
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                    <button className="arrow-button right" onClick={() => scrollRow(`${month}-row`, "right")}>&#8250;</button>
                                </div>
                            </Grid>

                        ))}

                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
};

export default ClubEventList;
