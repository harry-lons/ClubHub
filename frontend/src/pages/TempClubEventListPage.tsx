import React from 'react';
import { useNavigate } from 'react-router-dom';

export const TempClubEventListPage= ()=> {
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate('/club/addEvent');
    };

    return (
        <div>
            Temporary club-side event list page for testing create/edit event
            <button onClick={handleNavigate}>Go to Create Event Form</button>
        </div>
    );
}