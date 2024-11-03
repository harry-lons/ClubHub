import { BrowserRouter, Router, Routes, Route } from 'react-router-dom';
import { LoginSignup } from './pages/LoginSignup';
import { Events } from './pages/Events';
import { DetailedEvent } from './pages/DetailedEvent';
import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
          <Route path="/" element={<LoginSignup />} />
          <Route path="/login" element={<LoginSignup />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<DetailedEvent />} />
      </Routes>
    </div>
  );
}

export default App;
