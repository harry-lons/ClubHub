import { Event } from "../../types/types";
import { dummyEventsList } from "../../constants/constants";
import { useState } from "react";
import "./Events.css";
import { Grid, Card, CardContent, Typography } from '@mui/material';

const MyComponent: React.FC = () => {
    const [events,Setevents] = useState(dummyEventsList);

    const groupedEvents = events.reduce((acc: Record<string, Event[]>, event: any) => {
        const dateKey = event.time.toDateString();
        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }
        acc[dateKey].push(event);
        return acc;
    }, {});
    
    return (
        <div className="events-list-container">
            <div className="events-list">
                {Object.entries(groupedEvents).map(([date, events]) => (
                    <div key={date} className="event-item">
                        <div className="event-date-column">
                            <h3>{date}</h3>
                        </div >
                        <div className="event-details-column">
                            {events.map((event) => (
                                <div className="event-info">
                                    <div className="event-time">
                                        {event.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    <div className="event-details">
                                        <p className="event-title">{event.title}</p>
                                        <p className="event-club-location">{event.club_id}, {event.location}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
                
        </div>
    );
};

export default MyComponent;