import { BrowserRouter, Router, Routes, Route } from 'react-router-dom';
import { LoginSignup } from './pages/LoginSignup';
import { Events } from './pages/Events/Events';
import { DetailedEvent } from './pages/DetailedEvent';
import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
          <Route path="/" element={<LoginSignup />} />
          <Route path="/login" element={<LoginSignup />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<DetailedEvent id="1" club_id="Club A" title="Club A Meeting" location="Price Center" time={new Date( 2024, 10, 4, 18, 30, 0, 0)} summary="text" details={["1"]} type="event"/>} />
      </Routes>
    </div>
  );
}

export default App;
