import React, { useState } from 'react';
import { NavBar } from "../NavBar/NavBar";
import { useParams, useNavigate } from "react-router-dom";
import './Clubs.css';

const exampleClubList = [
    { clubName: 'Future Innovators Society', description: 'Future Innovators Society Description...', logoColor: '#a850ba' },
    { clubName: 'Urban Gardeners Network', description: 'Urban Gardeners Network Description...', logoColor: '#15e688' },
    { clubName: 'Club 3', description: 'All about Club 3 ...', logoColor: 'blue' },
    { clubName: 'Club 4', description: 'All about Club 4 ...', logoColor: 'yellow' },
    { clubName: 'Clubert 4', description: 'All about Clubert 4 ...', logoColor: 'magenta' },
    { clubName: 'Clubert 4.5', description: 'All about Clubert 4.5 ...', logoColor: '#faae66' },
    { clubName: 'Club 5', description: 'All about Club 5...', logoColor: 'red' },
    { clubName: 'Club 6', description: 'All about Club 6...', logoColor: 'pink' },
    { clubName: 'Club 7', description: 'All about Club 7...', logoColor: 'cyan' },
    { clubName: 'Club 8', description: 'All about Club 8...', logoColor: '#a7f542' },
    { clubName: 'Club 9', description: 'All about Club 9...', logoColor: 'orange' },
    { clubName: 'Club 10', description: 'All about Club 10...Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', logoColor: 'yellow' },
];

const Clubs: React.FC = () => {
    const [clubs, setClubs] = useState(exampleClubList);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const filteredClubs = clubs.filter(club => 
        club.clubName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const goToClubProfile = (club_id : string) => {
        navigate(`/club/detail/${club_id}}`);
    }
    return (
        <div className="clubs-list-container">
            <div className="sticky-header">
                <div className="navbar-container">
                    <NavBar />
                </div>

                <div className="search-bar">
                    <input
                        type="text"
                        placeholder=" Search for Clubs and Organizations"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
            <div className="clubs-list-container">
                <div className="clubs-list">
                    {filteredClubs.map((club, index) => (
                        <div key={index} className="club-card">
                            <div className="club-logo" style={{ backgroundColor: club.logoColor }}></div>
                            <div className="club-details">
                                {/* After you change the club type to the real type, modify the content in goToClubProfile to be club.id */}
                                <p className="club-name" onClick = {()=>goToClubProfile("1")}>{club.clubName}</p>

                            </div>
                            <p className="club-description">{club.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Clubs;
