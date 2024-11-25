import { API_BASE_URL } from "../constants/constants";
import { User } from "../types/types";

export const fetchUser = async (token: string): Promise<User> => {
    try {
        const response = await fetch(`${API_BASE_URL}/user/whoami/`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`Error fetching user info: ${response.statusText}`);
        }

        const user = await response.json(); // Assuming the response is the `User` model
        return user;
    } catch (error) {
        console.error("Failed to fetch user info:", error);
        throw error;
    }
};