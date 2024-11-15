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

export const fetchFollowedClubList = async (token: string): Promise<Club[]> => {

    const response = await fetch(`${API_BASE_URL}/followedClubs`, { //NOTICE CHANGE
        method: "GET",
        headers: {
            "Authorization" : `Bearer ${token}`
        }
    })

    if (!response.ok) {
        throw new Error("Failed to fetch clubs")
    }    

    const clubs: Club[] = await response.json();
    return clubs;
};
export const fetchClubList = async (): Promise<Club[]> => {//RETURN ALL exiting clubs

    const response = await fetch(`${API_BASE_URL}/clubs`, { //NOTICE CHANGE
        method: "GET"
    })

    if (!response.ok) {
        throw new Error("Failed to fetch clubs")
    }    

	const clubs: Club[] = await response.json();
    return clubs;
};
export const createClub = async (token: string,club: Club): Promise<boolean> => {
	const response = await fetch(`${API_BASE_URL}/club`, {
    	method: "POST",
    	headers: {
        	"Content-Type": "application/json",
			"Authorization" : `Bearer ${token}`
    	},
    	body: JSON.stringify(club),
	});
	if (!response.ok) {
    	throw new Error("Failed to create club");
	}
	const result = await response.json();
	return result;
};