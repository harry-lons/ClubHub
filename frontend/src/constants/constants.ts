import { Event, Club,User,EventType } from "../types/types";
export const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;
export const exampleEvent = {
	id: "001",
  title: "Creative Writing Workshop: Unleash Your Imagination!",
	club_id : "001",
	location: "Geisel",
	begin_time: new Date(2024, 11, 1, 10, 0, 0),
  end_time: new Date(2024, 11, 1, 11, 0, 0),
  recurrence: false,
  recurrence_type: null,
  stop_date: null,
	summary: "Join us for an engaging and inspiring Creative Writing Workshop hosted by The Literary Society! Whether you're a seasoned writer or just starting your journey, this workshop is designed to spark your creativity and help you develop your writing skills. Participants will explore various writing prompts, learn about character development, and receive constructive feedback on their work. This is a fantastic opportunity to meet fellow writers, share ideas, and enhance your craft in a supportive environment. Bring your favorite notebook and pen, and let your imagination run wild! Refreshments will be provided. Reserve your spot today!",
	pictures: ["flyer.jpg"],
	type: ["social", "workshop"] as EventType[],
    capacity: 50
}
export const emptyEvent = {
	id: "",
  title: "",
	club_id : "",
	location: "",
	begin_time: new Date(2024, 11, 1, 10, 0, 0),
  end_time: new Date(2024, 11, 1, 11, 0, 0),
  recurrence: false,
  recurrence_type: null,
  stop_date: null,
	summary: "",
	pictures: [],
	type: [] as EventType[],
  capacity: null
}
export const emptyUser: User[] = [

];
export const exampleUsers: User[] = [
    {
      id: "1",
      username: "johndoe",
      first_name: "John",
      last_name: "Doe",
      followed_clubs: ["001", "002", "003"],
    },
    {
      id: "2",
      username: "janesmith",
      first_name: "Jane",
      last_name: "Smith",
      followed_clubs: ["001", "004"],
    },
    {
      id: "3",
      username: "alicebrown",
      first_name: "Alice",
      last_name: "Brown",
      followed_clubs: ["002", "003"],
    },
    {
      id: "4",
      username: "bobjohnson",
      first_name: "Bob",
      last_name: "Johnson",
      followed_clubs: ["003", "004"],
    },
    {
      id: "5",
      username: "emilywhite",
      first_name: "Emily",
      last_name: "White",
      followed_clubs: ["001"],
    },{
        id: "6",
        username: "michaelscott",
        first_name: "Michael",
        last_name: "Scott",
        followed_clubs: ["105", "106"],
      },
      {
        id: "7",
        username: "angelamartin",
        first_name: "Angela",
        last_name: "Martin",
        followed_clubs: ["101", "107"],
      },
      {
        id: "8",
        username: "dwightschrute",
        first_name: "Dwight",
        last_name: "Schrute",
        followed_clubs: ["102", "103", "108"],
      },
      {
        id: "9",
        username: "stanleyhudson",
        first_name: "Stanley",
        last_name: "Hudson",
        followed_clubs: ["103"],
      },
      {
        id: "10",
        username: "phyllisvance",
        first_name: "Phyllis",
        last_name: "Vance",
        followed_clubs: ["104", "109"],
      },
      {
        id: "11",
        username: "jimhalpert",
        first_name: "Jim",
        last_name: "Halpert",
        followed_clubs: ["101", "110"],
      },
      {
        id: "12",
        username: "pambeesly",
        first_name: "Pam",
        last_name: "Beesly",
        followed_clubs: ["105", "102"],
      },
      {
        id: "13",
        username: "ryanhoward",
        first_name: "Ryan",
        last_name: "Howard",
        followed_clubs: ["106", "107"],
      },
      {
        id: "14",
        username: "kellykapoor",
        first_name: "Kelly",
        last_name: "Kapoor",
        followed_clubs: ["108", "109"],
      }
  ];

export const emptyClub =
{
	id : "",
	name: "",
	board_members: [""],
	contact_email: [""],
  description: ""
}
export const exampleClub =
{
	id : "001",
	name: "The Literary Society",
	board_members: ["Vivian Wang", "Shengqi Wu", "Harry", "Allen", "Peter", "George", "Ali", "Allison"],
	contact_email: ["contact@example.com"],
  description: "The Literary Society is a vibrant community dedicated to the love of literature, fostering an environment where members can explore, discuss, and celebrate the written word. Led by a passionate team, including the dedicated board member Member 1, the club serves as a hub for book enthusiasts, writers, and creatives alike.For inquiries or more information, feel free to reach out to us at contact@example.com. Join us to connect with like-minded individuals, participate in engaging events, and deepen your appreciation for the world of literature!"
};
export const exampleRSVPList = {

};
export const emptyEventList: Event[] = [];

export const exampleEventList: Event[] = [
	{
		id: "1",
		title: "Creative Writing Workshop: Unleash Your Imagination!",
		club_id : "001",
		location: "Geisel",
		begin_time: new Date(2024, 11, 1, 10, 0, 0),
		end_time: new Date(2024, 11, 1, 11, 0, 0),
    recurrence: false,
    recurrence_type: null,
    stop_date: null,
		summary: "Join us for an engaging and inspiring Creative Writing Workshop hosted by The Literary Society! Whether you're a seasoned writer or just starting your journey, this workshop is designed to spark your creativity and help you develop your writing skills. Participants will explore various writing prompts, learn about character development, and receive constructive feedback on their work. This is a fantastic opportunity to meet fellow writers, share ideas, and enhance your craft in a supportive environment. Bring your favorite notebook and pen, and let your imagination run wild! Refreshments will be provided. Reserve your spot today!",
		pictures: ["flyer.jpg"],
		type: ["social", "workshop"] as EventType[],
        capacity: null
	},{
		id: "2",
		title: "Petting Car Club!",
		club_id : "001",
		location: "Geisel",
		begin_time: new Date(2024, 11, 1, 10, 0, 0),
		end_time: new Date(2024, 11, 1, 11, 0, 0),
    recurrence: false,
    recurrence_type: null,
    stop_date: null,
		summary: "Cats are always so cute! Let's pet them!",
		pictures: [],
		type: ["social", "recreational"] as EventType[],
        capacity: 100
	},
	{
        id: "3",
        title: "Art & Chill: Paint Your Stress Away",
        club_id: "002",
        location: "Student Center",
        begin_time: new Date(2024, 11, 5, 14, 0, 0),
        end_time: new Date(2024, 11, 5, 16, 0, 0),
        recurrence: false,
        recurrence_type: null,
        stop_date: null,
        summary: "Take a break from your busy schedule and join us for a relaxing painting session! Supplies will be provided, and no experience is necessary. Meet new friends, unleash your creativity, and paint away your stress.",
        pictures: [],
        type: ["recreational", "arts"] as EventType[],
        capacity: 100
    },
    {
        id: "4",
        title: "Yoga in the Park",
        club_id: "003",
        location: "Main Quad",
        begin_time: new Date(2024, 11, 10, 9, 0, 0),
        end_time: new Date(2024, 11, 10, 10, 0, 0),
        recurrence: true,
        recurrence_type: 1,
        stop_date: null,
        summary: "Start your morning with a rejuvenating yoga session led by experienced instructors. All skill levels are welcome! Bring your mat and experience the serenity of yoga in the great outdoors.",
        pictures: [],
        type: ["sports"] as EventType[],
        capacity: 100
    },
    {
        id: "5",
        title: "Robotics Club Workshop: Build Your First Robot",
        club_id: "004",
        location: "Engineering Lab",
        begin_time: new Date(2024, 11, 15, 13, 0, 0),
        end_time: new Date(2024, 11, 15, 17, 0, 0),
        recurrence: false,
        recurrence_type: null,
        stop_date: null,
        summary: "Join the Robotics Club for a hands-on workshop where you'll learn the basics of building and programming robots. No experience required. All materials will be provided. Come ready to create!",
        pictures: [],
        type: ["workshop"] as EventType[],
        capacity: 100
    },
    {
        id: "6",
        title: "Cooking Club: Italian Cuisine Night",
        club_id: "005",
        location: "Cafeteria Kitchen",
        begin_time: new Date(2024, 11, 20, 18, 0, 0),
        end_time: new Date(2024, 11, 20, 20, 0, 0),
        recurrence: true,
        recurrence_type: 2,
        stop_date: null,
        summary: "Explore the tastes of Italy with our Cooking Club! Learn how to make classic Italian dishes in a fun, hands-on cooking class. No cooking experience required. Spaces are limited, so sign up now!",
        pictures: [],
        type: ["recreational", "cultural", "social"] as EventType[],
        capacity: 100
    },


];
export const exampleUser = {
	id : "001",
	username: "abababa",
	first_name: "Diana",
	last_name: "Wu",
	followed_clubs: ["001","002"]
};