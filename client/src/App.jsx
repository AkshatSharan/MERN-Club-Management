import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import UpcomingEvents from './pages/UpcomingEvents/UpcomingEvents';
import EventDetails from './pages/EventDetails/EventDetails';
import Signup from './pages/AuthPage/Signup';
import Signin from './pages/AuthPage/Signin';
import StudentPrivateRoute from './components/StudentPrivateRoute';
import Profile from './pages/Profile/Profile';
import ClubPrivateRoute from './components/ClubPrivateRoute';
import ClubDashboard from './pages/ClubDashboard/ClubDashboard';
import { useSelector } from 'react-redux';

function AppContent() {
  const location = useLocation();
  const {userType} = useSelector((state)=> state.user)

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offsetTop = element.offsetTop;
      window.scrollTo({
        top: offsetTop - 30,
        behavior: 'smooth'
      });
    }
  };

  const isAuthPage = userType == null ? true: false;

  return (
    <>
      {!isAuthPage && <Navbar scrollToSection={scrollToSection} />}
      <main className={`main-content ${isAuthPage ? 'no-margin' : ''}`}>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />

          {userType == null && <Route path="/" element={<Signin />} />}

          <Route element={<ClubPrivateRoute />}>
            {userType === 'club' && <Route path='/' element={<ClubDashboard />} />}
          </Route>

          <Route element={<StudentPrivateRoute />}>
            {userType === 'student' && <Route path="/" element={<Home scrollToSection={scrollToSection} />} />}
            <Route path="/upcomingevents" element={<UpcomingEvents />} />
            <Route path='/profile' element={<Profile />} />
          </Route>
          <Route path="/event/:eventId" element={<EventDetails />} />

        </Routes>
      </main>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App; // Ensure you have this line to export the App component as the default export
