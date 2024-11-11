import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginSignup from './pages/LoginSignup/LoginSignup';
import Events from './pages/Events';
import DetailedEvent from './pages/DetailedEvent/DetailedEvent';
import { AddEventForm } from './pages/AddEventForm/AddEventForm';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import './App.css';
import { AuthProvider } from './context/AuthContext'
import { NavBar } from './pages/NavBar/NavBar';
import { UserProfile } from './pages/UserProfile/UserProfile';

function App() {
  return (
    <AuthProvider>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<LoginSignup which="LOG IN"/>} />
            <Route path="/login" element={<LoginSignup which="LOG IN"/>} />
            <Route path="/signup" element={<LoginSignup which="SIGN UP" />} />
            <Route path="/club/login" element={<LoginSignup which="CLUB LOG IN" />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<DetailedEvent />} />
            <Route path="/club/addEvent" element={<AddEventForm/>} />
            <Route path="/navbar" element={<NavBar/>} />
            <Route path="/profile" element={<UserProfile/>} /> {/* Test Route */}
          </Routes>
        </div>
      </Router>
      </LocalizationProvider>
    </AuthProvider>

  );
}

export default App;
