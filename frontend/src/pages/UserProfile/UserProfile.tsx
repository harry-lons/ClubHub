import LoginSignup from "../LoginSignup/LoginSignup";
import { ProfileCard} from "./ProfileCard";
import { NavBar } from "../NavBar/NavBar";
import { User} from "../../types/types";
import { exampleUser } from "../../constants/constants";
import "./UserProfile.css"
export const UserProfile = () => {
    const user = exampleUser;
    return (
        <div className="appContainer">
            
            <div className="navbarContainer">
                <NavBar />
            </div>
            <div className="userProfile">
                <div className="profileCardContainer">
                    <ProfileCard />
                </div>
                   
                
            </div>
        </div>
    );
};