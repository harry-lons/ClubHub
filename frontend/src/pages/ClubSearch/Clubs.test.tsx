import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Clubs from './Clubs';
import * as clubUtils from '../../utils/club-utils'; // Import the module to spy on

jest.mock('../../utils/club-utils'); // Mock the utility module

describe('Clubs Component', () => {
  beforeEach(() => {
    // Use jest.spyOn to mock the fetchClubList function
    jest.spyOn(clubUtils, 'fetchClubList').mockResolvedValue([
      {
        id: '1', name: 'Future Innovators Society', description: 'Innovation enthusiasts',
        board_members: [],
        contact_email: ''
      },
      {
        id: '2', name: 'Urban Gardeners Network', description: 'Community gardening',
        board_members: [],
        contact_email: ''
      },
      {
        id: '3', name: 'The Literary Society', description: 'Book lovers unite',
        board_members: [],
        contact_email: ''
      },
    ]);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  test('rendering the search bar', async () => {
    render(
      <BrowserRouter>
        <Clubs />
      </BrowserRouter>
    );
    expect(screen.getByPlaceholderText(/Search for Clubs and Organizations/i)).toBeInTheDocument();
  });

  test('rendering club cards', async () => {
    render(
      <BrowserRouter>
        <Clubs />
      </BrowserRouter>
    );

    expect(await screen.findByText('Future Innovators Society')).toBeInTheDocument();
    expect(screen.getByText('Urban Gardeners Network')).toBeInTheDocument();
  });

  test('filters clubs based on search input', async () => {
    render(
      <BrowserRouter>
        <Clubs />
      </BrowserRouter>
    );

    const searchBar = screen.getByPlaceholderText(/Search for Clubs and Organizations/i);
    fireEvent.change(searchBar, { target: { value: 'Literary' } });

    expect(await screen.findByText('The Literary Society')).toBeInTheDocument();
    expect(screen.queryByText('Future Innovators Society')).not.toBeInTheDocument();
  });

  test('filtering clubs correctly regardless of case sensitivity', async () => {
    render(
      <BrowserRouter>
        <Clubs />
      </BrowserRouter>
    );

    const searchBar = screen.getByPlaceholderText(/Search for Clubs and Organizations/i);

    fireEvent.change(searchBar, { target: { value: 'future' } });
    expect(await screen.findByText('Future Innovators Society')).toBeInTheDocument();

    fireEvent.change(searchBar, { target: { value: 'FUTURE' } });
    expect(await screen.findByText('Future Innovators Society')).toBeInTheDocument();
  });

  test('shows no results message when no clubs match the search query', async () => {
    render(
      <BrowserRouter>
        <Clubs />
      </BrowserRouter>
    );

    const searchBar = screen.getByPlaceholderText(/Search for Clubs and Organizations/i);

    fireEvent.change(searchBar, { target: { value: 'NonExistentClub' } });

    expect(screen.queryByText('Future Innovators Society')).not.toBeInTheDocument();
    expect(screen.queryByText('Urban Gardeners Network')).not.toBeInTheDocument();
  });
});
