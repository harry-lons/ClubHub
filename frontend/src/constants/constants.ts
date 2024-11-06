import { Event, Club } from "../types/types";
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

export const dummyEventsList = [
	{
		id: "001",
		title: "Event Name 1",
		club_id : "Club 1",
		location: "CSE Building",
		begin_time: new Date("2024-10-28T17:00:00"),
		end_time: new Date("2024-10-28T18:00:00"),
		recurrence: [false, 0, null] as [boolean, number, Date | null],
		summary: "text",
		pictures: {},
		type: "Social",
	},
	{
		id: "002",
		title: "Event Name 2",
		club_id : "Club 2",
		location: "Price Center",
		begin_time: new Date("2024-10-28T18:00:00"),
		end_time: new Date("2024-10-28T19:00:00"),
		recurrence: [false, 0, null] as [boolean, number, Date | null],
		summary: "text",
		pictures: {},
		type: "Social",
	},
	{
		id: "003",
		title: "Event Name 3",
		club_id : "Club 3",
		location: "Geisel",
		begin_time: new Date("2024-10-29T18:00:00"),
		end_time: new Date("2024-10-29T19:00:00"),
		recurrence: [false, 0, null] as [boolean, number, Date | null],
		summary: "text",
		pictures: {},
		type: "Social",
	},
	{
		id: "004",
		title: "Event Name 4",
		club_id : "Club 4",
		location: "Library",
		begin_time: new Date("2024-10-30T18:30:00"),
		end_time: new Date("2024-10-30T19:30:00"),
		recurrence: [false, 0, null] as [boolean, number, Date | null],
		summary: "text",
		pictures: {},
		type: "Social",
	},
	{
		id: "005",
		title: "Event Name 5",
		club_id : "Club 5",
		location: "Student Center",
		begin_time: new Date("2024-10-30T18:45:00"),
		end_time: new Date("2024-10-30T19:45:00"),
		recurrence: [false, 0, null] as [boolean, number, Date | null],
		summary: "text",
		pictures: {},
		type: "Social",
	},
	{
		id: "006",
		title: "Event Name 6",
		club_id : "Club 6",
		location: "Recreation Center",
		begin_time: new Date("2024-11-01T18:00:00"),
		end_time: new Date("2024-11-01T19:00:00"),
		recurrence: [false, 0, null] as [boolean, number, Date | null],
		summary: "text",
		pictures: {},
		type: "Social",
	},
  ];