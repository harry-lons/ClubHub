import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom'; // Required for `useNavigate`
import Clubs from './Clubs';

describe('Clubs Component', () => {
  test('rendering the search bar', () => {
    render(
      <BrowserRouter>
        <Clubs />
      </BrowserRouter>
    );
    expect(screen.getByPlaceholderText(/Search for Clubs and Organizations/i)).toBeInTheDocument();
  });
});

  test('rendering club cards', () => {
    render(
      <BrowserRouter>
        <Clubs />
      </BrowserRouter>
    );
    expect(screen.getByText('Future Innovators Society')).toBeInTheDocument();
    expect(screen.getByText('Urban Gardeners Network')).toBeInTheDocument();
  });

  test('filters clubs based on search input', () => {
    render(
      <BrowserRouter>
        <Clubs />
      </BrowserRouter>
    );

    const searchBar = screen.getByPlaceholderText(/Search for Clubs and Organizations/i);
    fireEvent.change(searchBar, { target: { value: 'Literary' } });

    expect(screen.getByText('The Literary Society')).toBeInTheDocument();
    expect(screen.queryByText('Future Innovators Society')).not.toBeInTheDocument();
  });


  test('filtering clubs correctly regardless of case sensitivity', () => {
    render(
      <BrowserRouter>
        <Clubs />
      </BrowserRouter>
    );
  
    const searchBar = screen.getByPlaceholderText(/Search for Clubs and Organizations/i);
    
    // Simulate typing in lowercase
    fireEvent.change(searchBar, { target: { value: 'future' } });
    expect(screen.getByText('Future Innovators Society')).toBeInTheDocument();
  
    // Simulate typing in uppercase
    fireEvent.change(searchBar, { target: { value: 'FUTURE' } });
    expect(screen.getByText('Future Innovators Society')).toBeInTheDocument();
  });
  
  test('shows no results message when no clubs match the search query', () => {
    render(
      <BrowserRouter>
        <Clubs />
      </BrowserRouter>
    );
  
    const searchBar = screen.getByPlaceholderText(/Search for Clubs and Organizations/i);
    
    // Simulating typing a non-matching query
    fireEvent.change(searchBar, { target: { value: 'NonExistentClub' } });
    
    // Checking that no clubs are displayed
    expect(screen.queryByText('Future Innovators Society')).not.toBeInTheDocument();
    expect(screen.queryByText('Urban Gardeners Network')).not.toBeInTheDocument();
  });
  


  


