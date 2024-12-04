import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter,useParams,useNavigate } from 'react-router-dom';
import DetailedEvent from './DetailedEvent';
import * as eventUtils from '../../utils/event-utils';
import * as clubUtils from '../../utils/club-utils';
import * as RSVPUtils from '../../utils/RSVP-utils';
import { Event,Club,User,EventType } from "../../types/types";
import { AuthContext } from '../../context/AuthContext';
import { fetchCurrentAttendees } from '../../utils/RSVP-utils';
import { cleanup,act } from '@testing-library/react';


jest.mock('../../utils/event-utils');
jest.mock('../../utils/club-utils');
jest.mock('../../utils/RSVP-utils', () => ({
    createRSVP: jest.fn(),
    deleteRSVP: jest.fn(),
    fetchRSVP: jest.fn(),
    fetchCurrentAttendees: jest.fn(),
  }));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn(),
    useNavigate: jest.fn(),
  }));

  
describe('User-side DetailedEvent Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
      jest.spyOn(eventUtils, 'fetchEventById').mockResolvedValue({
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
	  });
      jest.spyOn(clubUtils, 'fetchClubById').mockResolvedValue({
		  id : "001",
	    name: "The Literary Society",
	    board_members: [],
	    contact_email: ["contact@example.com"],
      description: "The Literary Society is a vibrant community dedicated to the love of literature, fostering an environment where members can explore, discuss, and celebrate the written word. Led by a passionate team, including the dedicated board member Member 1, the club serves as a hub for book enthusiasts, writers, and creatives alike.For inquiries or more information, feel free to reach out to us at contact@example.com. Join us to connect with like-minded individuals, participate in engaging events, and deepen your appreciation for the world of literature!"
	  });
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    test('calling fetchEventById', async () => {
        (useParams as jest.Mock).mockReturnValue({ id: '1' });
      render(
        <BrowserRouter>
          <DetailedEvent which="USER" />
        </BrowserRouter>
      );
      await waitFor(() => expect(eventUtils.fetchEventById).toHaveBeenCalled());
    });

    test('rendering event title', async () => {
        (useParams as jest.Mock).mockReturnValue({ id: '1' });
      render(
        <BrowserRouter>
          <DetailedEvent which="USER" />
        </BrowserRouter>
      );
      const titleElement = await screen.findByText(
        'Creative Writing Workshop: Unleash Your Imagination!'
      );
      expect(titleElement).toBeInTheDocument();
    });

    test('calling fetchClubById', async () => {
        (useParams as jest.Mock).mockReturnValue({ id: '1' });
      render(
        <BrowserRouter>
          <DetailedEvent which="USER" />
        </BrowserRouter>
      );
      await waitFor(() => expect(clubUtils.fetchClubById).toHaveBeenCalled());
    });

    test('rendering club name', async () => {
        (useParams as jest.Mock).mockReturnValue({ id: '1' });
      render(
        <BrowserRouter>
          <DetailedEvent which="USER" />
        </BrowserRouter>
      );
      const clubNameElement = await screen.findByText(
        'The Literary Society'
      );
      expect(clubNameElement).toBeInTheDocument();
    });

    test('initializing RSVP button for not RSVPed', async () => {
        (useParams as jest.Mock).mockReturnValue({ id: '1' });

        const mockAuthContext = {
          token: 'fake-token',
          id: '123',
          accountType: 'user',
          setToken: jest.fn(),
          setAccountType: jest.fn(),
          setId: jest.fn(),
          removeToken: jest.fn(),
          saveAuthenticationData: jest.fn()
        };

        (RSVPUtils.fetchRSVP as jest.Mock).mockResolvedValue([]);

        render(
          <AuthContext.Provider value={mockAuthContext}>
            <BrowserRouter>
              <DetailedEvent which="USER" />
            </BrowserRouter>
          </AuthContext.Provider>
        );
    
        const rsvpButton = await waitFor(() => screen.getByRole('button', { name: /RSVP/i }));
        expect(rsvpButton).toBeInTheDocument();
        expect(rsvpButton).toHaveTextContent('RSVP');
    });

    test('initializing RSVP button for RSVPed', async () => {
        (useParams as jest.Mock).mockReturnValue({ id: '1' });

        const mockAuthContext = {
          token: 'fake-token',
          id: '123',
          accountType: 'user',
          setToken: jest.fn(),
          setAccountType: jest.fn(),
          setId: jest.fn(),
          removeToken: jest.fn(),
          saveAuthenticationData: jest.fn()
        };

        (RSVPUtils.fetchRSVP as jest.Mock).mockResolvedValue([
            { user_id: '123', event_id: '1' },
        ]);

        render(
          <AuthContext.Provider value={mockAuthContext}>
            <BrowserRouter>
              <DetailedEvent which="USER" />
            </BrowserRouter>
          </AuthContext.Provider>
        );
    
        const rsvpButton = await waitFor(() => screen.getByRole('button', { name: /Cancel RSVP/i }));
        expect(rsvpButton).toBeInTheDocument();
        expect(rsvpButton).toHaveTextContent('Cancel RSVP');
    });

    test('clicking RSVP button', async () => {
        (useParams as jest.Mock).mockReturnValue({ id: '1' });
    
        const mockAuthContext = {
          token: 'fake-token',
          id: '123',
          accountType: 'user',
          setToken: jest.fn(),
          setAccountType: jest.fn(),
          setId: jest.fn(),
          removeToken: jest.fn(),
          saveAuthenticationData: jest.fn()
        };

        (RSVPUtils.fetchRSVP as jest.Mock).mockResolvedValue([]);
        (RSVPUtils.createRSVP as jest.Mock).mockResolvedValue(true);
    
        render(
          <AuthContext.Provider value={mockAuthContext}>
            <BrowserRouter>
              <DetailedEvent which="USER" />
            </BrowserRouter>
          </AuthContext.Provider>
        );
    
        const rsvpButton = await waitFor(() => screen.getByRole('button', { name: /RSVP/i }));
        expect(rsvpButton).toBeInTheDocument();
        expect(rsvpButton).toHaveTextContent('RSVP');
        
        fireEvent.click(rsvpButton);

        const updatedButton = await waitFor(() => screen.getByRole('button', { name: /Cancel RSVP/i }));
        expect(updatedButton).toBeInTheDocument();
        expect(updatedButton).toHaveTextContent('Cancel RSVP');
    });

    test('clicking cancel RSVP button', async () => {
        (useParams as jest.Mock).mockReturnValue({ id: '1' });
    
        const mockAuthContext = {
          token: 'fake-token',
          id: '123',
          accountType: 'user',
          setToken: jest.fn(),
          setAccountType: jest.fn(),
          setId: jest.fn(),
          removeToken: jest.fn(),
          saveAuthenticationData: jest.fn()
        };
        
        (RSVPUtils.fetchRSVP as jest.Mock).mockResolvedValue([
            { user_id: '123', event_id: '1' },
        ]);
        (RSVPUtils.deleteRSVP as jest.Mock).mockResolvedValue(true);
    
        render(
          <AuthContext.Provider value={mockAuthContext}>
            <BrowserRouter>
              <DetailedEvent which="USER" />
            </BrowserRouter>
          </AuthContext.Provider>
        );

        const rsvpButton = await waitFor(() => screen.getByRole('button', { name: /Cancel RSVP/i }));
        expect(rsvpButton).toBeInTheDocument();
        expect(rsvpButton).toHaveTextContent('Cancel RSVP');
    
        fireEvent.click(rsvpButton);
        
        const updatedButton = await waitFor(() => screen.getByRole('button', { name: /RSVP/i }));
        expect(updatedButton).toBeInTheDocument();
        expect(updatedButton).toHaveTextContent('RSVP');
      });
  });

  describe('Club-side DetailedEvent Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
      jest.spyOn(eventUtils, 'fetchEventById').mockResolvedValue({
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
	  });
      jest.spyOn(clubUtils, 'fetchClubById').mockResolvedValue({
		  id : "001",
	    name: "The Literary Society",
	    board_members: [],
	    contact_email: ["contact@example.com"],
      description: "The Literary Society is a vibrant community dedicated to the love of literature, fostering an environment where members can explore, discuss, and celebrate the written word. Led by a passionate team, including the dedicated board member Member 1, the club serves as a hub for book enthusiasts, writers, and creatives alike.For inquiries or more information, feel free to reach out to us at contact@example.com. Join us to connect with like-minded individuals, participate in engaging events, and deepen your appreciation for the world of literature!"
	  });
    jest.spyOn(clubUtils, 'fetchClubWho').mockResolvedValue({
		  id : "001",
	    name: "The Literary Society",
	    board_members: [],
	    contact_email: ["contact@example.com"],
      description: "The Literary Society is a vibrant community dedicated to the love of literature, fostering an environment where members can explore, discuss, and celebrate the written word. Led by a passionate team, including the dedicated board member Member 1, the club serves as a hub for book enthusiasts, writers, and creatives alike.For inquiries or more information, feel free to reach out to us at contact@example.com. Join us to connect with like-minded individuals, participate in engaging events, and deepen your appreciation for the world of literature!"
	  });
    (fetchCurrentAttendees as jest.Mock).mockResolvedValue([
      {
        id: '123',
        username: 'johndoe',
        first_name: 'John',
        last_name: 'Doe',
        followed_clubs: ['001', '002'],
      },
      {
        id: '456',
        username: 'janesmith',
        first_name: 'Jane',
        last_name: 'Smith',
        followed_clubs: ['001'],
      },
    ]);
    (useParams as jest.Mock).mockReturnValue({ id: '1' });
    });
  
    afterEach(() => {
      jest.clearAllMocks();
      cleanup();
    });
  
    test('calling fetchEventById', async () => {
      render(
        <BrowserRouter>
          <DetailedEvent which="CLUB" />
        </BrowserRouter>
      );
      await waitFor(() => expect(eventUtils.fetchEventById).toHaveBeenCalled());
    });

    test('rendering event title', async () => {
      render(
        <BrowserRouter>
          <DetailedEvent which="CLUB" />
        </BrowserRouter>
      );
      const titleElement = await screen.findByText(
        'Creative Writing Workshop: Unleash Your Imagination!'
      );
      expect(titleElement).toBeInTheDocument();
    });

    test('calling fetchClubById', async () => {
      render(
        <BrowserRouter>
          <DetailedEvent which="CLUB" />
        </BrowserRouter>
      );
      await waitFor(() => expect(clubUtils.fetchClubById).toHaveBeenCalled());
    });

    test('rendering club name', async () => {
      render(
        <BrowserRouter>
          <DetailedEvent which="CLUB" />
        </BrowserRouter>
      );
      const clubNameElement = await screen.findByText(
        'The Literary Society'
      );
      expect(clubNameElement).toBeInTheDocument();
    });

    test('rendering Edit button', async () => {

        const mockAuthContext = {
          token: 'fake-token',
          id: '001',
          accountType: 'club',
          setToken: jest.fn(),
          setAccountType: jest.fn(),
          setId: jest.fn(),
          removeToken: jest.fn(),
          saveAuthenticationData: jest.fn()
        };

        await act(async () => {
          render(
            <AuthContext.Provider value={mockAuthContext}>
              <BrowserRouter>
                <DetailedEvent which="CLUB" />
              </BrowserRouter>
            </AuthContext.Provider>
          );
        });

        const editButton = await waitFor(() => screen.getByRole('button', { name: /Edit/i }));
        expect(editButton).toBeInTheDocument();
        expect(editButton).toHaveTextContent('Edit');
    });

    test('clicking Edit button', async () => {
        const mockNavigate = jest.fn();
        (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

        const mockAuthContext = {
          token: 'fake-token',
          id: '001',
          accountType: 'club',
          setToken: jest.fn(),
          setAccountType: jest.fn(),
          setId: jest.fn(),
          removeToken: jest.fn(),
          saveAuthenticationData: jest.fn()
        };
    
        await act(async () => {
          render(
            <AuthContext.Provider value={mockAuthContext}>
              <BrowserRouter>
                <DetailedEvent which="CLUB" />
              </BrowserRouter>
            </AuthContext.Provider>
          );
        });

        const editButton = await waitFor(() => screen.getByRole('button', { name: /Edit/i }));
        expect(editButton).toBeInTheDocument();
        expect(editButton).toHaveTextContent('Edit');
        
        fireEvent.click(editButton);
        expect(mockNavigate).toHaveBeenCalledWith(`/club/editEvent/1`);
    });
  });
  