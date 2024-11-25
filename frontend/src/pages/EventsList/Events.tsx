import { Club, Event } from "../../types/types";
import { useParams, useNavigate } from "react-router-dom";
import { exampleEventList } from "../../constants/constants";
import { useState, useEffect, useContext } from "react";
import "./Events.css";
import { Grid, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import { NavBar } from "../NavBar/NavBar";
import { fetchEvents, fetchEventById, fetchRSVPEvents } from "../../utils/event-utils";
import { fetchClubById, fetchClubList } from "../../utils/club-utils";
import { fetchRSVP } from "../../utils/RSVP-utils";
import { AuthContext } from "../../context/AuthContext";

const Events: React.FC = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState(exampleEventList);
    const [eventList, setEventList] = useState<Record<string, [string, Event][]>> ();
    const context = useContext(AuthContext);

    useEffect(() => {
        loadEvents();
    }, []);
    
    const loadEvents = async () => {
        try {
            console.log("RSVP");
            const clubList = await fetchClubList();
            const rsvpList = await fetchRSVPEvents(context.token);
            const result = await processEvents(rsvpList, rsvpList, clubList);
            setRsvpEventsList(result);
            // Load All other lists and compare with RSVP
            // Load Total Events List
            try {
                console.log("Events");
                const eventsList = await fetchEvents();
                const result = await processEvents(eventsList, rsvpList, clubList);
                setEventsList(result);
            } catch (err: any) {
                console.error("Error loading event list:", err.message);
            }
            // Load Followed Events List
            try {
                console.log("Followed");
                const followedList = (await fetchEvents()).slice(2,7);
                const result = await processEvents(followedList, rsvpList, clubList);
                setFollowedEventsList(result);
                setRenderedEvents(result);
                // Load RSVP and Followed Events List
                try {
                    console.log("RSVP/Followed");
                    const combinedList = Array.from(new Map(rsvpList.concat(followedList).map(event => [event.id, event])).values());
                    const result = await processEvents(combinedList, rsvpList, clubList);
                    setCombinedEventsList(result);
                } catch (err: any) {
                    console.error("Error loading RSVP/Followed event list:", err.message);
                }
            } catch (err: any) {
                console.error("Error loading Followed event list:", err.message);
            }
        } catch (err: any) {
            console.error("Error loading event list:", err.message);
        }
    }

    const processEvents = async (events: Event[], rsvp: Event[], clubs: Club[]): Promise<Record<string, [string, Event, boolean][]>> => {
        const result = await events.reduce(async (accPromise, event) => {
            const acc = await accPromise;
            const dateKey = event.begin_time.toDateString();
            const club = clubs.find(club => club.id === event.club_id)
    
            if (!acc[dateKey]) {
              acc[dateKey] = [];
            }
            if (club === undefined) {
                if (rsvp.find(rsvpEvent => rsvpEvent.id === event.id)) {
                    acc[dateKey].push(["No Club Found", event, true]);
                }
                else {
                    acc[dateKey].push(["No Club Found", event, false]);
                }
            }
            else {
                if (rsvp.find(rsvpEvent => rsvpEvent.id === event.id)) {
                    acc[dateKey].push([club.name, event, true]);
                }
                else {
                    acc[dateKey].push([club.name, event, false]);
                }
            }
            acc[dateKey].sort((a,b) => {
                return a[1].begin_time.getTime() - b[1].begin_time.getTime();
            });
        
            return acc;
        }, Promise.resolve({} as Record<string, [string, Event][]>));
        
        return result;
    }

    const goToDetailPage = (event_id: string) => {
        navigate(`/events/${event_id}`);
    }

    //Old method to process event list, keeping for placeholder
    const groupedEvents = events.reduce((acc: Record<string, [string, Event][]>, event: any) => {
        const dateKey = event.begin_time.toDateString();
        if (!acc[dateKey]) {
        acc[dateKey] = [];
        }
        acc[dateKey].push([event.club_id,event]);
        acc[dateKey].sort((a,b) => {
            return a[1].begin_time.getTime() - b[1].begin_time.getTime();
        });
        return acc;
    }, {});

    //Placeholder screen for when no access to backend
    if (eventList === undefined) {
        return (
            <div style={{width: "100%"}}>
                <div className="background"/>
                <Grid container rowSpacing={4} className="events-list-container">
                    <div className="navbar-container">
                        <NavBar />
                    </div>
                    <Grid item xs={9.5} sx={{display: 'flex', justifyContent: 'flex-end'}}>
                        <FormGroup>
                            <FormControlLabel control={<Checkbox sx={{color: 'white', '&.Mui-checked': {color: 'white',},}}/>} label="RSVP Events" sx={{color: 'white', '& .MuiFormControlLabel-label': {color: 'white'}}} />
                        </FormGroup>
                    </Grid>
                    <Grid item xs={.2}/>
                    <Grid item xs={2.3}>
                        <FormGroup>
                            <FormControlLabel control={<Checkbox sx={{color: 'white', '&.Mui-checked': {color: 'white',},}}/>} label="Followed Events" sx={{color: 'white', '& .MuiFormControlLabel-label': {color: 'white'}}} />
                        </FormGroup>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container rowSpacing={4} className="events-list">
                            {Object.entries(groupedEvents).map(([date, events]) => (
                                <Grid item xs={12} key={date} className="event-item">
                                    <div className="event-date-column">
                                        <h3>{date}</h3>
                                    </div >
                                    <div className="event-details-column">
                                        {events.map((event) => (
                                            <div className="event-info" key={event[1].id}>
                                                <div className="event-time">
                                                    {event[1].begin_time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                                <div className="event-details">
                                                    <p className="event-title" onClick={()=>goToDetailPage(event[1].id)}>{event[1].title}</p>
                                                    <p className="event-club-location">{event[0]}, {event[1].location}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
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
                    <Grid item xs={9.5} sx={{display: 'flex', justifyContent: 'flex-end'}}>
                        <FormGroup>
                            <FormControlLabel control={<Checkbox sx={{color: 'white', '&.Mui-checked': {color: 'white',},}}/>} label="RSVP Events" sx={{color: 'white', '& .MuiFormControlLabel-label': {color: 'white'}}} />
                        </FormGroup>
                    </Grid>
                    <Grid item xs={.2}/>
                    <Grid item xs={2.3}>
                        <FormGroup>
                            <FormControlLabel control={<Checkbox sx={{color: 'white', '&.Mui-checked': {color: 'white',},}}/>} label="Followed Events" sx={{color: 'white', '& .MuiFormControlLabel-label': {color: 'white'}}} />
                        </FormGroup>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container rowSpacing={4} className="events-list">
                            {Object.entries(eventList).map(([date, events]) => (
                                <Grid item xs={12} key={date} className="event-item">
                                    <div className="event-date-column">
                                        <h3>{date}</h3>
                                    </div >
                                    <div className="event-details-column">
                                        {events.map((event) => (
                                            <div className="event-info" key={event[1].id}>
                                                <div className="event-time">
                                                    {event[1].begin_time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                                <div className="event-details">
                                                    <p className="event-title" onClick={()=>goToDetailPage(event[1].id)}>{event[1].title}</p>
                                                    <p className="event-club-location">{event[0]}, {event[1].location}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        );
    };
}

export default Events;