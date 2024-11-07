import LoginSignup from "../LoginSignup/LoginSignup";
import { ProfileCard} from "./ProfileCard";
import { EventCard } from "./EventCard";
import { NavBar } from "../NavBar/NavBar";
import { User,Event} from "../../types/types";
import { exampleUser,exampleEventList } from "../../constants/constants";
import "./UserProfile.css"
export const UserProfile = () => {
    const user = exampleUser as User;
    const events = exampleEventList as Event[];
    return (
        <div className="appContainer">
            
            <div className="navbarContainer">
                <NavBar />
            </div>
            <div className="userProfile">
                <div className="profileCardContainer">
                    <ProfileCard user={user} />
                </div>
                <div className = "pastEventContainer">
                    <div className = "textContainer">
                        <h2>My Past Events</h2>
                    </div>
                    <div className = "eventCardContainer">
                        <EventCard user = {user} events = {events}/>
                    </div>
                </div>  
                
            </div>
        </div>
    );
};