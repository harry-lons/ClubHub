import { API_BASE_URL } from "../constants/constants"
import { RSVP,User, RSVPInt } from "../types/types"
// Function to create an expense in the backend. Method: POST
export const createRSVP = async (token: string,rsvp: RSVPInt): Promise<boolean> => {
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
		},
		body: JSON.stringify(Number(event_id)),
	});
	if (!response.ok) {
    	throw new Error("Failed to delete RSVP");
	}
	return response.json();
};

export const fetchRSVP = async (token: string): Promise<RSVP[]> => {
    const response = await fetch(`${API_BASE_URL}/RSVP/rsvps`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch RSVP. Status: ${response.status}, Message: ${await response.text()}`);
    }

    const jsonResponse = (await response.json()).rsvps;

    // Log the raw API response
    console.log("Raw API response:", jsonResponse);

    // Handle nested 'data' field if present
    if (jsonResponse && Array.isArray(jsonResponse)) {
        const new_responses = jsonResponse.map((rsvp: any) => ({
            event_id: String(rsvp.event_id),
            user_id: rsvp.user_id,
        }));
		console.log("New response:",new_responses);
		return new_responses;
    }

    // Handle empty response or unexpected structure
    if (!jsonResponse.rsvp) {
        console.warn("No RSVPs found in the response.");
        return []; // Return an empty array if no RSVPs are found
    }

    // If response is still unexpected, throw an error
    throw new Error("Unexpected response structure: RSVP list is not an array.");
};




// fetch all attendees to a certain event
export const fetchCurrentAttendees = async(event_id:number): Promise<User[]> =>{
	const response = await fetch(`${API_BASE_URL}/rsvp/Attendees/${event_id}`, { //NOTICE CHANGE
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