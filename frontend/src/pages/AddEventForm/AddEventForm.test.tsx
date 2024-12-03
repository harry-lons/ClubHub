import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter,useParams,useNavigate } from 'react-router-dom';
import {AddEventForm} from './AddEventForm';
import * as eventUtils from '../../utils/event-utils';
import { AuthContext } from '../../context/AuthContext';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import userEvent from '@testing-library/user-event';


jest.mock('../../utils/event-utils', () => ({
    createEvent: jest.fn(),
  }));
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn(),
    useNavigate: jest.fn(),
}));

describe('Add Event Form', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

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

    test('rendering basic components', async () => {
        render(
            <AuthContext.Provider value={mockAuthContext}>
                <BrowserRouter>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <AddEventForm />
                    </LocalizationProvider>
                </BrowserRouter>
            </AuthContext.Provider>
        );

          expect(screen.getByRole('heading', { name: /Event Name/i })).toBeInTheDocument();
          expect(screen.getByRole('heading', { name: /Event Type/i })).toBeInTheDocument();
          expect(screen.getByRole('heading', { name: /Event Location/i })).toBeInTheDocument();
          expect(screen.getByRole('heading', { name: /Capacity/i })).toBeInTheDocument();
          expect(screen.getByRole('heading', { name: /Event Description/i })).toBeInTheDocument();
          expect(screen.getByRole('button', { name: /Submit Event/i })).toBeInTheDocument();
    });

    test('rendering event recurring options', async () => {
        render(
            <AuthContext.Provider value={mockAuthContext}>
                <BrowserRouter>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <AddEventForm />
                    </LocalizationProvider>
                </BrowserRouter>
            </AuthContext.Provider>
        );
        const recurringSwitch = screen.getByLabelText(/Event Recurring/i);
        expect(recurringSwitch).toBeInTheDocument();

        fireEvent.click(recurringSwitch);

        expect(screen.getByLabelText(/Stop Date/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Frequency/i)).toBeInTheDocument();

    });

    test('entering event name', async () => {
        render(
            <AuthContext.Provider value={mockAuthContext}>
                <BrowserRouter>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <AddEventForm />
                    </LocalizationProvider>
                </BrowserRouter>
            </AuthContext.Provider>
        );

        const eventNameInput = screen.getByTestId('event-name-input').querySelector('input') as HTMLInputElement;
        await userEvent.type(eventNameInput, 'Test Event');
        await waitFor(() => expect(eventNameInput.value).toBe('Test Event'));
    });

    test('entering event location', async () => {
        render(
            <AuthContext.Provider value={mockAuthContext}>
                <BrowserRouter>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <AddEventForm />
                    </LocalizationProvider>
                </BrowserRouter>
            </AuthContext.Provider>
        );

        const eventLocationInput = screen.getByTestId('event-location-input').querySelector('input') as HTMLInputElement;
        await userEvent.type(eventLocationInput, 'Test Location');
        await waitFor(() => expect(eventLocationInput.value).toBe('Test Location'));
    });

    test('submitting event', async () => {
        const mockNavigate = jest.fn();
        (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
        (eventUtils.createEvent as jest.Mock).mockResolvedValue('1');
        const mockCreateEvent = eventUtils.createEvent as jest.Mock;
        mockCreateEvent.mockResolvedValue('newEventId');

        render(
            <AuthContext.Provider value={mockAuthContext}>
                <BrowserRouter>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <AddEventForm />
                    </LocalizationProvider>
                </BrowserRouter>
            </AuthContext.Provider>
        );

        const eventNameInput = screen.getByTestId('event-name-input').querySelector('input') as HTMLInputElement;
        await userEvent.type(eventNameInput, 'Test Event');
        await waitFor(() => expect(eventNameInput.value).toBe('Test Event'));

        const eventLocationInput = screen.getByTestId('event-location-input').querySelector('input') as HTMLInputElement;
        await userEvent.type(eventLocationInput, 'Test Location');
        await waitFor(() => expect(eventLocationInput.value).toBe('Test Location'));

        const submitButton = screen.getByRole('button', { name: /Submit Event/i });
        expect(submitButton).toBeInTheDocument();

        fireEvent.click(submitButton);

        const expectedEventData = {
            id: "0",
            title: 'Test Event',
            club_id: mockAuthContext.id,
            location: 'Test Location',
            begin_time: expect.any(Date),
            end_time: expect.any(Date),
            recurrence: false,
            recurrence_type: expect.any(Number),
            stop_date: expect.any(Date),
            summary: "",
            pictures: [],
            type: [],
            capacity: null
        };

        expect(mockCreateEvent).toHaveBeenCalledWith(mockAuthContext.token, expectedEventData);
    });
});