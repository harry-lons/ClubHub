import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter,useParams,useNavigate } from 'react-router-dom';
import {AddEventForm} from './AddEventForm';
import * as eventUtils from '../../utils/event-utils';
import { Event,Club,User,EventType } from "../../types/types";
import { AuthContext } from '../../context/AuthContext';
import { cleanup,act } from '@testing-library/react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'; // Import LocalizationProvider
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';


jest.mock('../../utils/event-utils');
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
        saveToken: jest.fn(),
        setAccountType: jest.fn(),
        setId: jest.fn(),
        removeToken: jest.fn(),
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
});