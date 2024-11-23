import { StringLiteral } from "typescript";

export type Event =
{
	id: string;
	title: string;
	club_id : string;
	location: string;
	begin_time: Date;
	end_time: Date;
	recurrence: boolean;
	recurrence_type: Number | null;
	stop_date: Date|null;
	summary: string;
	pictures: string[];
	type: EventType[];
	capacity: Number | null;
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

export type signupInfo = 
{
	email: string;
	password: string;
}

// Extend signupInfo for user-specific signup
export type userSignup = signupInfo & {
    first_name: string;
    last_name: string;
};

// Extend signupInfo for club-specific signup
export type clubSignup = signupInfo & {
    name: string;
};

export type signupResponse =
{
	success: boolean;
	detail: string;
}

export type loginResponse = 
{
	success: boolean,
    token: string,
    detail: string,
};

export type login =
{
	email: string,
	password: string,
}