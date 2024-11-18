import { API_BASE_URL } from "../constants/constants"
import { Follow } from "../types/types"
// Function to create an expense in the backend. Method: POST
export const createFollow = async (token: string,follow: Follow): Promise<boolean> => {
	const response = await fetch(`${API_BASE_URL}/Follow`, {
    	method: "POST",
    	headers: {
        	"Content-Type": "application/json",
			"Authorization" : `Bearer ${token}`
    	},
    	body: JSON.stringify(follow),
	});
	if (!response.ok) {
    	throw new Error("Failed to create Follow");
	}
	return response.json();
};


// Function to delete an expense in the backend. Method: DELETE
export const deleteFollow = async (token:string,club_id: string): Promise<boolean> => { //id should be event-id
	const response = await fetch(`${API_BASE_URL}/RSVP/${club_id}`, { // url need to be changed 
    	method: "DELETE",
		headers:{
			"Authorization" : `Bearer ${token}`
		}
	});
	if (!response.ok) {
    	throw new Error("Failed to delete Follow");
	}
	return response.json();
};