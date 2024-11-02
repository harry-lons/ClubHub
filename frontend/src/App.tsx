import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginSignup from './pages/LoginSignup.tsx';
import Events from './pages/Events.tsx';
import DetailedEvent from './pages/DetailedEvent.tsx';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginSignup />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<DetailedEvent />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
