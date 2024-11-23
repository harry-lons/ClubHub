import { StringLiteral } from "typescript";

export type Event =
{
	id: string;
	title: string;
	club_id : string;
	location: string;
	begin_time: Date;
	end_time: Date;
	recurrence: [ boolean, number, Date|null ];
	summary: string;
	pictures: { [key: string]: string };
	type: EventType[];
	capacity: Number | null;
	// rsvp_count: string;
};

export type EventType = 
    | "social"
    | "workshop"
    | "networking"
    | "fundraiser"
    | "competition"
    | "seminar"
    | "communityService"
    | "cultural"
    | "recreational"
    | "generalMeeting"
    | "academic"
    | "orientation"
    | "careerDevelopment"
    | "volunteering"
    | "panel"
    | "celebration"
    | "sports"
    | "arts"
    | "training"
    | "research"
    | "food";

export type RSVP = 
{
	user_id: string;
	event_id: string;
};
export type Follow = {
	user_id: string;
	club_id: string;
}

export type User = 
{
	id: string;
	username: string;
	first_name: string;
	last_name: string;
	followed_clubs: string[];//id of clubs
};

export type Club =
{
	id : string;
	name: string;
	description: string;
	board_members: string[];
	contact_email: string | string[];
};