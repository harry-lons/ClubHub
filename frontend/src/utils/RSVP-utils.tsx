import { API_BASE_URL } from "../constants/constants"
import { RSVP,User } from "../types/types"
// Function to create an expense in the backend. Method: POST
export const createRSVP = async (token: string,rsvp: RSVP): Promise<boolean> => {
	const response = await fetch(`${API_BASE_URL}/RSVP`, {
    	method: "POST",
    	headers: {
        	"Content-Type": "application/json",
			"Authorization" : `Bearer ${token}`
    	},
    	body: JSON.stringify(rsvp),
	});
	if (!response.ok) {
    	throw new Error("Failed to create RSVP");
	}
	return response.json();
};

// Function to delete an expense in the backend. Method: DELETE
export const deleteRSVP = async (token:string,event_id: string): Promise<boolean> => { //id should be event-id
	const response = await fetch(`${API_BASE_URL}/RSVP/${event_id}`, { // url need to be changed 
    	method: "DELETE",
		headers:{
			"Authorization" : `Bearer ${token}`
		}
	});
	if (!response.ok) {
    	throw new Error("Failed to delete RSVP");
	}
	return response.json();
};
// fetch all RSVP by a certain user
// Function to get all expenses from the backend. Method: GET
export const fetchRSVP = async (token:string): Promise<RSVP[]> => { 
	const response = await fetch(`${API_BASE_URL}/rsvp/`, { //NOTICE CHANGE
        method: "GET",
        headers: {
            "Authorization" : `Bearer ${token}`
        }
    })
	if (!response.ok) {
    	throw new Error('Failed to fetch RSVP');
	}

	// Parsing the response to get the data
	let rsvpList = response.json().then((jsonResponse) => {
    	console.log("data in fetchExpenses", jsonResponse);
    	return jsonResponse.data;
	});

	console.log("response in fetch RSVPs", rsvpList);
	return rsvpList;
};
// fetch all attendees to a certain event
export const fetchCurrentAttendees = async(event_id:number): Promise<User[]> =>{
	const response = await fetch(`${API_BASE_URL}/RSVP/Attendees/${event_id}`, { //NOTICE CHANGE
        method: "GET"
    })
	if (!response.ok) {
    	throw new Error('Failed to fetch current Attendees');
	}

	// Parsing the response to get the data
	let attendeeList = response.json().then((jsonResponse) => {
    	console.log("data in fetch attendees", jsonResponse);
    	return jsonResponse.data;
	});

	console.log("response in fetchExpenses", attendeeList);
	return attendeeList;
}