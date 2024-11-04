import React, { useState, useEffect } from 'react';
import { Event } from '../../types/types';

const MyComponent: React.FC<Event> = (currentEvent: Event) => {

    // Effect hook
    useEffect(() => {
        console.log('Component mounted');
    });

    return (
        <div className="event-detail">
            <div className="Description">{currentEvent.summary}</div>
            <div className="Time">{currentEvent.time.toString()}</div>
            <div className="Location">{currentEvent.location}</div>
            <div className="EventType">{currentEvent.type}</div>
        </div>
    );
};

export default MyComponent;
