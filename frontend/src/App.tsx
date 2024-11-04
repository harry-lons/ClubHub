import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginSignup from './pages/LoginSignup/LoginSignup';
import Events from './pages/Events';
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
          {/* <Route path="/events/:id" element={<DetailedEvent />} /> */}
          <Route path="/events-detail-example" element={<DetailedEvent />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
