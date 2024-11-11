import { API_BASE_URL } from "../constants/constants"
import { RSVP } from "../types/types"
// Function to create an expense in the backend. Method: POST
export const createRSVP = async (rsvp: RSVP): Promise<boolean> => {
	const response = await fetch(`${API_BASE_URL}/RSVP`, {
    	method: "POST",
    	headers: {
        	"Content-Type": "application/json",
    	},
    	body: JSON.stringify(rsvp),
	});
	if (!response.ok) {
    	throw new Error("Failed to create expense");
	}
	return response.json();
};

// Function to delete an expense in the backend. Method: DELETE
export const deleteRSVP = async (id: string): Promise<boolean> => { //id should be event-id
	const response = await fetch(`${API_BASE_URL}/RSVP/${id}`, { // url need to be changed 
    	method: "DELETE",
	});
	if (!response.ok) {
    	throw new Error("Failed to delete expense");
	}
	return response.json();
};

// Function to get all expenses from the backend. Method: GET
export const fetchRSVP = async (): Promise<RSVP[]> => { 
	const response = await fetch(`${API_BASE_URL}/RSVP`);
	if (!response.ok) {
    	throw new Error('Failed to fetch expenses');
	}

	// Parsing the response to get the data
	let expenseList = response.json().then((jsonResponse) => {
    	console.log("data in fetchExpenses", jsonResponse);
    	return jsonResponse.data;
	});

	console.log("response in fetchExpenses", expenseList);
	return expenseList;
};