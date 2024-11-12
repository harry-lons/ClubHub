import { API_BASE_URL } from "../constants/constants"
import { Event } from "../types/types"

export const fetchEventList = async (): Promise<Event[]> => {
    const response = await fetch(`${API_BASE_URL}/events`, {
    	method: "GET",
    	headers: {
        	"Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VybmFtZTEifQ.urVQ06SKGSMSzHpCzFL62RjPXQTtfYLfBJwwH5VToE8"
    	},
	});

    if (!response.ok) {
        throw new Error("Failed to fetch event list")
    }    

    const eventlist = (await response.json()).events;

    for (let i = 0; i < eventlist.length; i++) {
        let event = eventlist[i];
        if (event.begin_time) {
            eventlist[i].begin_time = new Date(event.begin_time);  // Convert to Date object
        }
    
        if (event.end_time) {
            eventlist[i].end_time = new Date(event.end_time);  // Convert to Date object
        }
    }

    return eventlist;
};