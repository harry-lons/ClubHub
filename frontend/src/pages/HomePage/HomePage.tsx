import { Event, User, RSVP} from '../../types/types';
import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useNavigate } from "react-router-dom";
import { NavBar } from '../NavBar/NavBar';
import './HomePage.css';

export const HomePage = () =>{
    const navigate = useNavigate();
    const web_description = "SoCalSocial is designed to simplify and personalize event discovery for UCSD students by centralizing event information in one platform. It aims to reduce information overload from flyers, social media, and invites by offering a tailored experience. Features such as personalized calendars, recurring event tracking, club affiliations, and easy sharing through QR codes ensure students can focus on events that matter to them while fostering campus engagement and community connections";
    const web_title = "SoCalSocial: Your Personalized Hub for UCSD Events";
    return(<div className = "HomePageContainer">
        <div className="navbarContainer">
                <NavBar />
        </div>
        <div className = "web-identity-container">
            <h1>{web_title}</h1>
            <p>{web_description}</p>
        </div>
        <h2>Tips for Getting Started 🤩</h2>
        <div className = "web-instruction-container">
            <div className = "web-clubs-container">
                <h3>Let's Start by Exploring Clubs That Match Your Interests 😻</h3>
                <p>Tutorials waiting to be written at the end of Sprint 5</p>
            </div>
            <div className = "web-events-container">
                <h3>Next Step: RSVP to Events from Your Favorite Clubs!</h3>
                <p>Tutorials waiting to be written at the end of Sprint 5</p>
            </div>
                
            <div className = "web-profile-container">
                <h3>Update Your Profile to Stay Connected with Friends!</h3>
                <p>Tutorials waiting to be written at the end of Sprint 5</p>
            </div>
            <p>You are ready ✌️</p>
        </div>
        <h2>Latest Updates on Our Progress</h2>
        <div className = "web-updates-container">
           <div className = "web-update-4">
            <h3>Sprint 4</h3>
            <p>Things waiting to be filled</p>
           </div>
        </div>
        
    </div>);
}