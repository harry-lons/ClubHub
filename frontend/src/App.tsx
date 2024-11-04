import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginSignup from './pages/LoginSignup/LoginSignup';
import Events from './pages/EventsList/Events';
import DetailedEvent from './pages/DetailedEvent/DetailedEvent';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginSignup which="LOG IN"/>} />
          <Route path="/login" element={<LoginSignup which="LOG IN"/>} />
          <Route path="/signup" element={<LoginSignup which="SIGN UP" />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<DetailedEvent id="1" club_id="Club A" title="Club A Meeting" location="Price Center" time={new Date( 2024, 10, 4, 18, 30, 0, 0)} summary="text" details={["1"]} type="event"/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
