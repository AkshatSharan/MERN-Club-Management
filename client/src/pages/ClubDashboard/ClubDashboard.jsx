import './clubdashboard.css'
import { useDispatch, useSelector } from "react-redux"
import UpdateClubPrimary from '../../components/Modal/UpdateClubPrimary'
import { useEffect, useState } from 'react';
import axiosInstance from '../../axiosinstance';
import { signOut } from '../../redux/userSlice';
import { useNavigate } from 'react-router-dom';
import { Switch } from '@mui/material';
import Loader from '../../components/Loader/Loader';

function ClubDashboard() {
  const [open, setOpen] = useState(false);
  const { currentUser } = useSelector((state) => state.user)
  const club = currentUser.user
  const [upcomingEvents, setUpcomingEvents] = useState([])
  const [pastEvents, setPastEvents] = useState([])
  const [clubDetails, setClubDetails] = useState(null)
  const [applicationCount, setApplicationCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const extractDayInfo = (dateString) => {
    const date = new Date(dateString);

    const dayOfWeek = date.toLocaleString('default', { weekday: 'short' })

    const dayOfMonth = date.getDate()

    return { dayOfWeek, dayOfMonth }
  }


  const handleLogout = async () => {
    try {
      await axiosInstance.post('/auth/club/logout')
      dispatch(signOut());
    } catch (error) {
      console.error('Error during logout: ', error)
    }
  }

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const clubDetails = await axiosInstance.get('/club/get-club')
        setClubDetails(clubDetails.data)

        const pendingCount = clubDetails.data.applications.reduce((count, applicationForm) => {
          return applicationForm.applicationStatus === 'Pending' ? count + 1 : count
        }, 0)

        setApplicationCount(pendingCount)

        setPastEvents(clubDetails.data.pastEvents)
        setUpcomingEvents(clubDetails.data.upcomingEvents)
      } catch (error) {
        console.error('Error fetching events:', error)
      } finally {
        setIsLoading(false)
      }
    };

    fetchEvents()
  }, [])

  const handleDivClick = (eventId) => {
    navigate(`/event-management/${eventId}`)
  }

  if (isLoading) {
    return <Loader message="Fetching dashboard" />
  }

  const handleApplicationStatusToggle = async () => {
    try {
      const response = await axiosInstance.put('/club/toggle-recruiting')
      const newRecruitingStatus = response.data.recruiting
      setClubDetails({
        ...clubDetails, recruiting: newRecruitingStatus
      })
    } catch (error) {
      console.error('Error updating event:', error);
    }
  }

  return (
    <div>
      {open && <UpdateClubPrimary handleClose={handleClose} />}
      <div className="club-primary">
        <button className='signout-club' onClick={handleLogout}>Signout</button>
        <div className="club-logo"><img src={club.clubLogo} /></div>
        <h1 className='club-name'>{club.clubName}</h1>
        <button className='edit-details' onClick={handleOpen}>Edit</button>
      </div>

      <section className='dashboard-management'>
        <h2 className='dashboard-section-header'>Club page management</h2>
        <div className='club-page-management-actions-container'>
          <button className='club-page-management-action'>View club page</button>
          <button className='club-page-management-action'>Edit club page</button>
        </div>
      </section>

      <section className='dashboard-management'>
        <h2 className='dashboard-section-header'>Upcoming events</h2>
        <div className='events-container'>
          {upcomingEvents.length > 0 &&
            upcomingEvents.map((event, index) => {
              const { dayOfWeek, dayOfMonth } = extractDayInfo(event.eventStartDate)
              return (
                <div key={index} className='event-card' onClick={() => handleDivClick(event._id)}>
                  <div className='event-date'>
                    <h2>{dayOfMonth}</h2>
                    <h2>{dayOfWeek.toUpperCase()}</h2>
                  </div>
                  <h3>{event.eventTitle}</h3>
                </div>
              )
            })}
        </div>
        <button className='edit-details' style={{ backgroundColor: 'var(--siteGreen)' }} onClick={() => navigate('/create-event')}>Create event</button>
      </section>

      <section className='dashboard-management'>
        <h2 className='dashboard-section-header'>Recruitments</h2>
        <div className='applications-management-buttons'>
          <button className='edit-details big-container' onClick={()=> navigate('/application-management')}>
            <h3>{applicationCount}</h3>
            <h3>Pending applications</h3>
            <p style={{ marginBottom: 0 }}>Click to manage</p>
          </button>
          <div className='application-changes'>
            <div className='application-status'>
              <b>Form status: </b>
              Close
              <Switch checked={clubDetails.recruiting} onClick={handleApplicationStatusToggle} />
              Open
            </div>
            <button className='edit-details' style={{ width: '100%' }} onClick={() => navigate(`/club/application-form/${club._id}`)}>Edit recruitment form</button>
          </div>
        </div>
      </section>

      <section className='dashboard-management'>
        <h2 className='dashboard-section-header'>Past events</h2>
        <div className='events-container'>
          {pastEvents.length > 0 &&
            pastEvents.map((event, index) => {
              const { dayOfWeek, dayOfMonth } = extractDayInfo(event.eventStartDate)
              return (
                <div key={index} className='event-card' onClick={() => navigate(`/past/${event._id}`)}>
                  <div className='event-date'>
                    <h2>{dayOfMonth}</h2>
                    <h2>{dayOfWeek.toUpperCase()}</h2>
                  </div>
                  <h3>{event.eventTitle}</h3>
                </div>
              )
            })}
        </div>
      </section>
    </div>
  )
}

export default ClubDashboard