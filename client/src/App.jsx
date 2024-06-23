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
import CreateEvent from './pages/CreateEvent/CreateEvent';
import EventManagement from './pages/EventManagement/EventManagement';
import RegistrationFormAdmin from './pages/RegistrationForm/RegistrationFormAdmin';
import RegistrationPage from './pages/RegistrationPage/RegistrationPage';
import UpdateEvent from './pages/UpdateEvent/UpdateEvent';
import ApplicationFormAdmin from './pages/ApplicationForm/ApplicationFormAdmin';
import ApplicationFormUser from './pages/ApplicationForm/ApplicationFormUser';
import PastEvent from './pages/EventDetails/PastEvent';

function AppContent() {
  const location = useLocation();
  const { userType } = useSelector((state) => state.user)

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

  const isAuthPage = userType == null ? true : false;

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
            <Route path='/create-event' element={<CreateEvent />} />
            <Route path='/event-management/:eventId' element={<EventManagement />} />
            <Route path='/registration-form/:eventId' element={<RegistrationFormAdmin />} />
            <Route path='update-event/:eventId' element={<UpdateEvent />} />
            <Route path="/club/application-form/:clubId" element={<ApplicationFormAdmin />} />
            <Route path='/past/:eventId' element={<PastEvent />} />
          </Route>

          <Route element={<StudentPrivateRoute />}>
            {userType === 'student' && <Route path="/" element={<Home scrollToSection={scrollToSection} />} />}
            <Route path="/upcomingevents" element={<UpcomingEvents />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/register/:eventId' element={<RegistrationPage />} />
            <Route path='/apply/:clubId' element={<ApplicationFormUser />} />
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
