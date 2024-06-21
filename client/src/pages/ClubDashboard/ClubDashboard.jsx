import './clubdashboard.css'
import { useDispatch, useSelector } from "react-redux"
import UpdateClubPrimary from '../../components/Modal/UpdateClubPrimary'
import { useEffect, useState } from 'react';
import axiosInstance from '../../axiosinstance';
import { signOut } from '../../redux/userSlice';
import { useNavigate } from 'react-router-dom';

function ClubDashboard() {
  const [open, setOpen] = useState(false);
  const { currentUser } = useSelector((state) => state.user)
  const club = currentUser.user
  const dispatch = useDispatch()
  const [upcomingEvents, setUpcomingEvents] = useState([])
  const navigate = useNavigate()
  const [clubDetails, setClubDetails] = useState(null)

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
        const response = await axiosInstance.get('/club/getupcomingevents')
        const clubDetails = await axiosInstance.get('/club/get-club')
        setClubDetails(clubDetails.data)
        console.log(clubDetails.data)
        setUpcomingEvents(response.data.upcomingEvents)
      } catch (error) {
        console.error('Error fetching events:', error)
      } finally {
      }
    };

    fetchEvents()
  }, [])

  // console.log(club._id)

  const handleDivClick = (eventId) => {
    navigate(`/event-management/${eventId}`)
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
          <button className='edit-details' onClick={() => navigate(`/club/application-form/${club._id}`)}>Edit recruitment form</button>
        </div>
      </section>
    </div>
  )
}

export default ClubDashboard