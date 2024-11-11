import { Event } from "../../types/types";
import { exampleEventList } from "../../constants/constants";
import { useState } from "react";
import "./Events.css";
import { Grid, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import { NavBar } from "../NavBar/NavBar";
import { fetchEventById } from "../../utils/event-utils";
import { fetchClubById } from "../../utils/club-utils";

const Events: React.FC = () => {
    const [events,setEvents] = useState(exampleEventList);

    const groupedEvents = events.reduce((acc: Record<string, Event[]>, event: any) => {
        const dateKey = event.begin_time.toDateString();
        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }
        acc[dateKey].push(event);
        return acc;
    }, {});
    
    return (
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
                                    <div className="event-info" onClick={() => {console.log(event.club_id)}}>
                                        <div className="event-time">
                                            {event.begin_time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                        <div className="event-details">
                                            <p className="event-title">{event.title}</p>
                                            <p className="event-club-location">{event.club_id}, {event.location}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Grid>
                    ))}
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Events;