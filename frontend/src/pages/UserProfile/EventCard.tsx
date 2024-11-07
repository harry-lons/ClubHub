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
    <Card sx={{ width: 1000, height: 640, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',overflowY: 'auto'}}>
        
        <CardContent>
          {/* Add Navigate for Each Event */}

          
        </CardContent>
    </Card>
    );

};