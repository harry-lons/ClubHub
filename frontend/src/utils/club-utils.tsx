import { API_BASE_URL } from "../constants/constants"
import { Club} from "../types/types"


// Function to get the club information from the backend. Method: GET

export const fetchClubById = async (id: string): Promise<Club> => {
	const response = await fetch(`${API_BASE_URL}/club?club_id=${id}`);
	if (!response.ok) {
    	throw new Error('Failed to fetch expenses');
	}

	const club: Club = await response.json();

	console.log("response in fetchClub", club);
	return club;
};