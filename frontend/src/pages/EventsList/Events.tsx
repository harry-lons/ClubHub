import { Event } from "../../types/types";
import { dummyEventsList } from "../../constants/constants";
import { useState } from "react";
import "./Events.css";
import { Grid, Card, CardContent, Typography } from '@mui/material';

const MyComponent: React.FC = () => {
    const [events,Setevents] = useState(dummyEventsList);

    return (
        <div className="events-list-container">
            {events.map((event) => (
                <div className="events-list">
                    <div className="event-date">
                        <h3>{event.time.toDateString()}</h3>
                        <h3>{event.time.toLocaleTimeString()}</h3>
                    </div>
                    <div className="event-info">       
                        <h3>{event.title}</h3>
                        <p>{event.club_id} {event.location}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MyComponent;