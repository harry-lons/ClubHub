import { Club, Event, RSVP } from "../../types/types";
import { useNavigate } from "react-router-dom";
import { exampleEventList } from "../../constants/constants";
import { useState, useEffect, useContext } from "react";
import "./Events.css";
import { Grid, FormGroup, FormControlLabel, Checkbox, Button } from '@mui/material';
import { NavBar } from "../NavBar/NavBar";
import { fetchEvents, fetchEventById, fetchRSVPEvents } from "../../utils/event-utils";
import { fetchClubById } from "../../utils/club-utils";
import { fetchRSVP } from "../../utils/RSVP-utils";
import { AuthContext } from "../../context/AuthContext";

const Events: React.FC = () => {
    const navigate = useNavigate();
    const [renderedEvents, setRenderedEvents] = useState<Record<string, [string, Event][]>> ();
    const [eventsList, setEventsList] = useState<Record<string, [string, Event][]>> ();
    const [rsvpEventsList, setRsvpEventsList] = useState<Record<string, [string, Event][]>> ();
    const [followedEventsList, setFollowedEventsList] = useState<Record<string, [string, Event][]>> ();
    const [combinedEventsList, setCombinedEventsList] = useState<Record<string, [string, Event][]>> ();
    const [rendering, setRendering] = useState(true);
    const context = useContext(AuthContext);
    const [checked, setChecked] = useState({
        RSVP: false,
        Followed: true,
      });
    const {RSVP, Followed} = checked;

    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async () => {
        // Load Followed Events List
        try {
            console.log("Followed");
            const followedList = await fetchEvents();
            const result = await processEvents(followedList);
            setFollowedEventsList(result);
            setRenderedEvents(result);
        } catch (err: any) {
            console.error("Error loading RSVP event list:", err.message);
        }
        // Load Total Events List
        try {
            console.log("Events");
            const eventsList = await fetchEvents();
            const result = await processEvents(eventsList);
            setEventsList(result);
        } catch (err: any) {
            console.error("Error loading event list:", err.message);
        }
        // Load RSVP Events List
        try {
            console.log("RSVP");
            const rsvpList = await fetchRSVPEvents(context.token);
            const result = await processEvents(rsvpList);
            setRsvpEventsList(result);
        } catch (err: any) {
            console.error("Error loading RSVP event list:", err.message);
        }
        // Load RSVP and Followed Events List
        try {
            console.log("RSVP/Followed");
            const rsvpList = await fetchRSVPEvents(context.token);
            const followedList = await fetchEvents();
            const result = await processEvents(rsvpList.concat(followedList));
            setCombinedEventsList(result);
        } catch (err: any) {
            console.error("Error loading RSVP event list:", err.message);
        }
    }

    const processEvents = async (events: Event[]): Promise<Record<string, [string, Event][]>> => {
        const result = await events.reduce(async (accPromise, event) => {
            const acc = await accPromise;
            const dateKey = event.begin_time.toDateString();
            const club = await fetchClubById(event.club_id);
    
            if (!acc[dateKey]) {
              acc[dateKey] = [];
            }
            acc[dateKey].push([club.name, event]);
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

    const handleLoadLogIn = () => {
        navigate('/');
    }; 

    const handleCheck = (check: any) => {
        setRendering(true);
        setChecked({...checked, [check.target.name]: check.target.checked,});
    };

    //Check the filter to load the correct list
    if (!RSVP && !Followed && rendering) {
        setRenderedEvents(eventsList);
        setRendering(false);
    }
    if (RSVP && !Followed && rendering) {
        setRenderedEvents(rsvpEventsList);
        setRendering(false);
    }
    if (!RSVP && Followed && rendering) {
        setRenderedEvents(followedEventsList);
        setRendering(false);
    }
    if (RSVP && Followed && rendering) {
        setRenderedEvents(combinedEventsList);
        setRendering(false);
    }
    
    if (context.token === "") {
        // Show Log in Button for when there is no token
        return (
            <div style={{width: "100%"}}>
                <div className="background"/>
                <div className="navbar-container">
                    <NavBar />
                </div>
                <h1 style={{color: "white"}}>Please Log In to See All Events</h1>
                <Button variant="contained" onClick={(handleLoadLogIn)} id='logsign-submit-button'>LOG IN</Button>
            </div>
        )
    }
    else {
        // Event List not loaded properly
        if (renderedEvents === undefined) {
            return (
                <div style={{width: "100%"}}>
                    <div className="background"/>
                    <div className="navbar-container">
                        <NavBar />
                    </div>
                    <h1 style={{color: "white"}}>Loading Events...</h1>
                </div>
            )
        }
        // Real screen
        else {
            // Loaded Events List
            return (
                <div style={{width: "100%"}}>
                    <div className="background"/>
                    <Grid container rowSpacing={4} className="events-list-container">
                        <div className="navbar-container">
                            <NavBar />
                        </div>
                        <Grid item xs={9.5} sx={{display: 'flex', justifyContent: 'flex-end'}}>
                            <FormGroup>
                                <FormControlLabel 
                                    control={
                                        <Checkbox checked={RSVP} onChange={handleCheck} sx={{color: 'white', '&.Mui-checked': {color: 'white',},}} name="RSVP"/>
                                    } 
                                    label="RSVP Events" 
                                    sx={{color: 'white', '& .MuiFormControlLabel-label': {color: 'white'}}
                                } />
                            </FormGroup>
                        </Grid>
                        <Grid item xs={.2}/>
                        <Grid item xs={2.3}>
                            <FormGroup>
                                <FormControlLabel 
                                    control={
                                        <Checkbox checked={Followed} onChange={handleCheck} sx={{color: 'white', '&.Mui-checked': {color: 'white',},}} name="Followed"/>
                                    } 
                                    label="Followed Events" 
                                    sx={{color: 'white', '& .MuiFormControlLabel-label': {color: 'white'}}
                                } />
                            </FormGroup>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container rowSpacing={4} className="events-list">
                                {Object.entries(renderedEvents).map(([date, events]) => (
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
}

export default Events;