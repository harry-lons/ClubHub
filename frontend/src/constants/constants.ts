import { Event, Club,User } from "../types/types";
export const API_BASE_URL = "http://localhost:8000";
export const exampleEvent = {
	id: "001",
    title: "Creative Writing Workshop: Unleash Your Imagination!",
	club_id : "001",
	location: "Geisel",
	begin_time: new Date(2024, 11, 1, 10, 0, 0),
    end_time: new Date(2024, 11, 1, 11, 0, 0),
    recurrence: [false, 0, null] as [boolean, number, Date | null],
	summary: "Join us for an engaging and inspiring Creative Writing Workshop hosted by The Literary Society! Whether you're a seasoned writer or just starting your journey, this workshop is designed to spark your creativity and help you develop your writing skills. Participants will explore various writing prompts, learn about character development, and receive constructive feedback on their work. This is a fantastic opportunity to meet fellow writers, share ideas, and enhance your craft in a supportive environment. Bring your favorite notebook and pen, and let your imagination run wild! Refreshments will be provided. Reserve your spot today!",
	pictures: { image: "flyer.jpg" },
	type: "Social"
}

export const exampleClub =
{
	id : "001",
	name: "The Literary Society",
	board_members: ["Member 1"],
	contact_email: ["contact@example.com"]
};
export const exampleUser = {
	id : "001",
	username: "abababa",
	first_name: "Diana",
	last_name: "Wu",
	followed_clubs: ["001","002"]
};