import { Event, User, RSVP} from '../../types/types';
import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

interface EventCardProps {
    user: User;
    events: Event[];
}
export const EventCard: React.FC<EventCardProps> = ({ user,events}) =>{
    const today = new Date();
    
    return(
    <Card sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',overflowY: 'auto'}}>
        
        <CardContent className="event-details-column">
            {events.map((event) => (
                <div className="event-info" onClick={() => {console.log(event.club_id)}}>
                    <div className="event-time">
                        {event.begin_time.toLocaleDateString([], { year: 'numeric', month: '2-digit', day: '2-digit' })}
                    </div>
                    <div className="event-details">
                        <p className="event-title">{event.title}</p>
                        <p className="event-club-location">{event.club_id}, {event.location}</p>
                    </div>
                </div>
            ))}

          
        </CardContent>
    </Card>
    );

};