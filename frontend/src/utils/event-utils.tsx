import { API_BASE_URL } from "../constants/constants"
import { Event } from "../types/types"

export const fetchEventById = async (eventId: number): Promise<Event> => {

    const response = await fetch(`${API_BASE_URL}/event/${eventId}`)
    

    if (!response.ok) {
        throw new Error("Failed to fetch event")
    }    

    const event: Event = await response.json();
    
    if (event.begin_time) {
        event.begin_time = new Date(event.begin_time);  // Convert to Date object
    }

    if (event.end_time) {
        event.end_time = new Date(event.end_time);  // Convert to Date object
    }

    return event;
};