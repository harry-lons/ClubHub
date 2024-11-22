import { Club, Event, RSVP } from "../../types/types";
import { useNavigate } from "react-router-dom";
import { exampleEventList } from "../../constants/constants";
import { useState, useEffect, useContext } from "react";
import "./Events.css";
import { Grid, FormGroup, FormControlLabel, Checkbox, Button } from '@mui/material';
import { NavBar } from "../NavBar/NavBar";
import { fetchEvents, fetchEventById } from "../../utils/event-utils";
import { fetchClubById } from "../../utils/club-utils";
import { fetchRSVP } from "../../utils/RSVP-utils";
import { AuthContext } from "../../context/AuthContext";

const Events: React.FC = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState<Event[]> ([]);
    const [eventList, setEventList] = useState<Record<string, [string, Event][]>> ();
    const context = useContext(AuthContext);
    const [checked, setChecked] = useState({
        RSVP: false,
        Followed: true,
      });
    const {RSVP, Followed} = checked;
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadEvents();
    }, [events]);

    const loadEvents = async () => {
        try {
            console.log(events);
            const result = await processEvents(events);
            setEventList(result);
        } catch (err: any) {
            console.error("Error loading event list:", err.message);
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

    const handleLogIn = () => {
        navigate('/');
    };

    const handleCheck = (check: any) => {
        setChecked({...checked, [check.target.name]: check.target.checked,});
    };

    const getEvents = async () => {
        console.log("Events");
        setEvents(exampleEventList);
        setLoading(false);
    }

    const getRSVP = async () => {
        console.log("RSVP");
        try {
            const rsvpIDList = await fetchRSVP(context.token);
            const rsvpList = await rsvpIDList.reduce(async (accPromise, id) => {
                const acc: Event[] = await accPromise;
                try {
                    const event = await fetchEventById(Number(id));
                    acc.push(event);
                } catch (err: any) {
                    console.error("Error fetching event by ID", err.message);
                }
        
                return acc;
            }, Promise.resolve([] as Event[]));
            setEvents(rsvpList);
        } catch (err: any) {
            console.error("Error loading RSVP list:", err.message);
        }
        setLoading(false);
    }

    const getFollowed = async () => {
        console.log("Followed");
        try {
            const followedList = await fetchEvents(context.token);
            setEvents(followedList);
        } catch (err: any) {
            console.error("Error loading followed list:", err.message);
        }
        setLoading(false);
    }

    const getRSVPFollowed = async () => {
        console.log("RSVP/Followed");
        try {
            const followedList = await fetchEvents(context.token);
            const rsvpIDList = await fetchRSVP(context.token);
            const rsvpList = await rsvpIDList.reduce(async (accPromise, id) => {
                const acc: Event[] = await accPromise;
                try {
                    const event = await fetchEventById(Number(id));
                    acc.push(event);
                } catch (err: any) {
                    console.error("Error fetching event by ID", err.message);
                }
        
                return acc;
            }, Promise.resolve([] as Event[]));
            const combinedList = followedList.concat(rsvpList);
            setEvents(combinedList);
        } catch (err: any) {
            console.error("Error loading followed list:", err.message);
        }
        setLoading(false);
    }

    //Check the filter to load the correct list
    if (!RSVP && !Followed) {
        if (loading) {
            getEvents();
        }
    }
    if (RSVP && !Followed) {
        if (loading) {
            getRSVP();
        }
    }
    if (!RSVP && Followed) {
        if (loading) {
            getFollowed();
        }
    }
    if (RSVP && Followed) {
        if (loading) {
            getRSVPFollowed();
        }
    }
    
    if (context.token === "") {
        // Show Log in Button for when there is no token
        return (
            // Log in Button for when there is no token
            // 
            // <div style={{width: "100%"}}>
            //     <div className="background"/>
            //     <div className="navbar-container">
            //         <NavBar />
            //     </div>
            //     <h1 style={{color: "white"}}>Please Log In to See All Events</h1>
            //     <Button variant="contained" onClick={(handleLogIn)} id='logsign-submit-button'>LOG IN</Button>
            // </div>

            <div style={{width: "100%"}}>
                <div className="background"/>
                <div className="navbar-container">
                    <NavBar />
                </div>
                <h1 style={{color: "white"}}>Please Log In to See All Events</h1>
                <Button variant="contained" onClick={(handleLogIn)} id='logsign-submit-button'>LOG IN</Button>
            </div>
        )
    }
    else {
        // Screen to display while events are loading
        if (eventList === undefined) {
            return (
                <div style={{width: "100%"}}>
                    <div className="background"/>
                    <div className="navbar-container">
                        <NavBar />
                    </div>
                    <h1 style={{color: "white"}}>Loading Events</h1>
                </div>
            )
        }
        // Real screen from backend access
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
                                <FormControlLabel 
                                    control={
                                        <Checkbox checked={RSVP} onChange={handleCheck} onClick={() => setLoading(true)} sx={{color: 'white', '&.Mui-checked': {color: 'white',},}} name="RSVP"/>
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
                                        <Checkbox checked={Followed} onChange={handleCheck} onClick={() => setLoading(true)} sx={{color: 'white', '&.Mui-checked': {color: 'white',},}} name="Followed"/>
                                    } 
                                    label="Followed Events" 
                                    sx={{color: 'white', '& .MuiFormControlLabel-label': {color: 'white'}}
                                } />
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
}

export default Events;