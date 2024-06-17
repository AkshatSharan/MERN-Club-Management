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

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

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
        setUpcomingEvents(response.data.upcomingEvents)
      } catch (error) {
        console.error('Error fetching events:', error)
      } finally {
      }
    };

    fetchEvents()
  }, [])

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
            upcomingEvents.map((event, index) => (
              <div key={index} className='event-card'>
                <h3>{event.eventTitle}</h3>
              </div>
            ))}
        </div>
        <button className='edit-details' style={{backgroundColor: 'var(--siteGreen)'}} onClick={() => navigate('/create-event')}>Create event</button>
      </section>
    </div>
  )
}

export default ClubDashboard