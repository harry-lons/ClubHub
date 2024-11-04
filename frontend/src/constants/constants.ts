import { Event, Club } from "../types/types";

export const exampleEvent = {
	id: "001",
    title: "Example Event Title",
	club_id : "001",
	location: "Geisel",
	begin_time: new Date(2024, 11, 1, 10, 0, 0),
    end_time: new Date(2024, 11, 1, 11, 0, 0),
    recurrence: [false, 0, null] as [boolean, number, Date | null],
	summary: "This is an event summary.",
	details: { image: "flyer.jpg", description: "This is an event description."},
	type: "Social"
}

export const exampleClub =
{
	id : "001",
	name: "Example Club Name",
	board_members: ["Member 1"],
	contact_email: ["contact@example.com"]
};