import { API_BASE_URL } from "../constants/constants"
import { Event } from "../types/types"

export const fetchEventList = async (): Promise<Event[]> => {

    const response = await fetch(`${API_BASE_URL}/events`)
    

    if (!response.ok) {
        throw new Error("Failed to fetch event")
    }    

    const eventlist: Event[] = await response.json();

    return eventlist;
};