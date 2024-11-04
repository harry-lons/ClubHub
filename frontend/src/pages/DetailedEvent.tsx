import { Event } from "../types/types";

export const DetailedEvent = (currentEvent: Event) => {
    return (
        <div className="event-detail">
            <div className="Description">{currentEvent.summary}</div>
            <div className="Time">{currentEvent.time.toString()}</div>
            <div className="Location">{currentEvent.location}</div>
            <div className="EventType">{currentEvent.type}</div>
        </div>
    );
};