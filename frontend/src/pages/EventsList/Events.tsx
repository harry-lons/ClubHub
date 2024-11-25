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
    const [renderedEvents, setRenderedEvents] = useState<Record<string, [string, Event, boolean][]>> ();
    const [eventsList, setEventsList] = useState<Record<string, [string, Event, boolean][]>> ();
    const [rsvpEventsList, setRsvpEventsList] = useState<Record<string, [string, Event, boolean][]>> ();
    const [followedEventsList, setFollowedEventsList] = useState<Record<string, [string, Event, boolean][]>> ();
    const [combinedEventsList, setCombinedEventsList] = useState<Record<string, [string, Event, boolean][]>> ();
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
        // Load RSVP Events List
        try {
            console.log("RSVP");
            // const rsvpList = await fetchEvents();
            const rsvpList = await fetchRSVPEvents(context.token);
            const result = await processEvents(rsvpList, rsvpList);
            setRsvpEventsList(result);
            // Load All other lists and compare with RSVP
            // Load Followed Events List
            try {
                console.log("Followed");
                const followedList = await fetchEvents();
                const result = await processEvents(followedList, rsvpList);
                setFollowedEventsList(result);
                setRenderedEvents(result);
            } catch (err: any) {
                console.error("Error loading RSVP event list:", err.message);
            }
            // Load Total Events List
            try {
                console.log("Events");
                const eventsList = await fetchEvents();
                const result = await processEvents(eventsList, rsvpList);
                setEventsList(result);
            } catch (err: any) {
                console.error("Error loading event list:", err.message);
            }
            // Load RSVP and Followed Events List
            try {
                console.log("RSVP/Followed");
                const rsvpList = await fetchRSVPEvents(context.token);
                const followedList = await fetchEvents();
                const result = await processEvents(rsvpList.concat(followedList), rsvpList);
                setCombinedEventsList(result);
            } catch (err: any) {
                console.error("Error loading RSVP/Followed event list:", err.message);
            }
        } catch (err: any) {
            console.error("Error loading RSVP event list:", err.message);
        }
    }

    const processEvents = async (events: Event[], rsvp: Event[]): Promise<Record<string, [string, Event, boolean][]>> => {
        const result = await events.reduce(async (accPromise, event) => {
            const acc = await accPromise;
            const dateKey = event.begin_time.toDateString();
            const club = await fetchClubById(event.club_id);
    
            if (!acc[dateKey]) {
              acc[dateKey] = [];
            }
            if (rsvp.find(rsvpEvent => rsvpEvent.id === event.id)) {
                acc[dateKey].push([club.name, event, true]);
            }
            else {
                acc[dateKey].push([club.name, event, false]);
            }
            acc[dateKey].sort((a,b) => {
                return a[1].begin_time.getTime() - b[1].begin_time.getTime();
            });

            return acc;
        }, Promise.resolve({} as Record<string, [string, Event, boolean][]>));
        
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
                                    label="Followed Clubs" 
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
                                                        <p className="event-club-location">
                                                            Club: {event[0]}&emsp;Location: {event[1].location}
                                                        </p>
                                                    </div>
                                                    <div className="event-rsvpd">
                                                        {event[2] ? "I'm Going!" : ""}
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