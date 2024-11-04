export type Event =
{
	id: string;
	club_id : string;
	title: string;
	location: string;
	time: Date;
	summary: string;
	details: { [key: string]: any };
	type: string;
};

export type RSVP = 
{
	user_id: string;
	event_id: string;
};

export type User = 
{
	id: string;
	username: string;
	first_name: string;
	last_name: string;
	followed_clubs: string[];
};

export type Club =
{
	id : string;
	name: string;
	board_members: string[];
	contact_email: string[];
};
