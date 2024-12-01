import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter,useParams } from 'react-router-dom';
import DetailedEvent from './DetailedEvent';
import * as eventUtils from '../../utils/event-utils'; // Import the module to spy on
import * as clubUtils from '../../utils/club-utils'
import { Event,Club,User,EventType } from "../../types/types";

// Mock the utility module
jest.mock('../../utils/event-utils');
jest.mock('../../utils/event-utils');
// Mock useParams
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn(),
  }));

describe('DetailedEvent Component', () => {
    beforeEach(() => {
      // Use jest.spyOn to mock the fetchEventById function
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
    });
  
    afterEach(() => {
      jest.clearAllMocks(); // Clear mocks after each test
    });
  
    test('calling fetchEventById', async () => {
        (useParams as jest.Mock).mockReturnValue({ id: '1' });
      render(
        <BrowserRouter>
          <DetailedEvent which="USER" />
        </BrowserRouter>
      );
      expect(eventUtils.fetchEventById).toHaveBeenCalled();
    });

    test('rendering the event title', async () => {
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

    test('rendering the event title', async () => {
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
  });
  