import { API_BASE_URL } from "../constants/constants"
import { Event } from "../types/types"

export const fetchEventById = async (eventId: string): Promise<Event> => {

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
    
    console.log("Event fetched successfully:", event);
    return event;
};
// All events RSVPed by the user
export const fetchRSVPEvents = async (token: string): Promise<Event[]> => {

    const response = await fetch(`${API_BASE_URL}/events`, {
        method: "GET",
        headers: {
            "Authorization" : `Bearer ${token}`
        }
    })

    if (!response.ok) {
        throw new Error("Failed to fetch events")
    }    

    const events: Event[] = await response.json();
    
    events.forEach((event)=>{
        if (event.begin_time) {event.begin_time = new Date(event.begin_time); }
        if (event.end_time) {event.end_time = new Date(event.end_time);}
    })

    return events;
};
//get all upcoming events of a club
export const fetchClubEvents = async (club_id: Number): Promise<Event[]>=>{
    const response = await fetch(`${API_BASE_URL}/events/club/${club_id}`, {
        method: "GET"
    })

    if (!response.ok) {
        throw new Error("Failed to fetch club events")
    }    

    const events: Event[] = await response.json();
    
    events.forEach((event)=>{
        if (event.begin_time) {event.begin_time = new Date(event.begin_time); }
        if (event.end_time) {event.end_time = new Date(event.end_time);}
    })
    return events;

};
//Should implement backend to fit both user and club
export const fetchPastEvents = async (token: string): Promise<Event[]> => {

    const response = await fetch(`${API_BASE_URL}/events/past`, { //NOTICE THIS CHANGE
        method: "GET",
        headers: {
            "Authorization" : `Bearer ${token}`
        }
    })

    if (!response.ok) {
        throw new Error("Failed to fetch upcoming events")
    }    

    const events: Event[] = await response.json();
    
    events.forEach((event)=>{
        if (event.begin_time) {event.begin_time = new Date(event.begin_time); }
        if (event.end_time) {event.end_time = new Date(event.end_time);}
    })

    return events;
};
// Function to create an event in the backend. Method: POST
export const createEvent = async (token: string,event: Event): Promise<string> => {
	const response = await fetch(`${API_BASE_URL}/event`, {
    	method: "POST",
    	headers: {
        	"Content-Type": "application/json",
            "Authorization" : `Bearer ${token}`
    	},
    	body: JSON.stringify(event),
	});
	if (!response.ok) {
    	throw new Error("Failed to create event");
	}
    const event_id:string = await response.json();
	return event_id;
};

export const updateEvent = async (token: string,event: Event): Promise<Event> => {
	const response = await fetch(`${API_BASE_URL}/update/event`, {
    	method: "PATCH",
    	headers: {
        	"Content-Type": "application/json",
            "Authorization" : `Bearer ${token}`
    	},
    	body: JSON.stringify(event),
	});
	if (!response.ok) {
    	throw new Error("Failed to update event");
	}
	return response.json();
};