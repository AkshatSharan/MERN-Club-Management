import React from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar/Navbar'
import Home from './pages/Home/Home';
import UpcomingEvents from './pages/UpcomingEvents/UpcomingEvents';
import EventDetails from './pages/EventDetails/EventDetails';

function App() {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offsetTop = element.offsetTop;
      window.scrollTo({
        top: offsetTop - 30,
        behavior: 'smooth'
      });
    }
  }

  return (
    <Router>
      <Navbar scrollToSection={scrollToSection} />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home scrollToSection={scrollToSection} />} />
          <Route path="/upcomingevents" element={<UpcomingEvents />} />
          <Route path="/event/:eventId" element={<EventDetails />} />
        </Routes>
      </main>
    </Router>
  )
}

export default App
