import React, { useEffect, useState } from 'react';
import './profile.css';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import axiosInstance from '../../axiosinstance';
import UpdateUserModal from '../../components/Modal/UpdateUserModal';
import { signOut } from '../../redux/userSlice';
import Loader from '../../components/Loader/Loader';

function Profile() {
    const [open, setOpen] = useState(false);
    const { currentUser } = useSelector((state) => state.user);
    const [width, setWidth] = useState(window.innerWidth);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [myRegistations, setMyRegistrations] = useState(null)
    const [myApplications, setMyApplications] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleLogout = async () => {
        try {
            await axiosInstance.post('/auth/user/logout');
            dispatch(signOut());
        } catch (error) {
            console.error('Error during logout: ', error);
        }
    }

    useEffect(() => {
        const fetchInfo = async () => {
            try {
                const info = await axiosInstance.get('/user/getspecificuser')
                
                setMyRegistrations(info.data.user.registrations)
                setMyApplications(info.data.user.applications)
            } catch (error) {
                console.error('Error during logout: ', error);
            } finally {
                setIsLoading(false)
            }
        }
        fetchInfo()
    }, [])

    if (isLoading) {
        return <Loader message="Loading profile" />
    }

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    function formatDateString(dateString) {
        const date = new Date(dateString);
        const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('en-GB', options);
    }

    const { fname = '', lname = '', phone = '', email = '', collegeRegistration = '' } = currentUser.user || {};

    // console.log(myRegistations)

    return (
        <main>
            {open && <UpdateUserModal handleClose={handleClose} />}
            <h1 className='user-name'>
                {fname} {lname} <button className='signout' onClick={handleLogout}>Sign out</button>
            </h1>
            <section className='user-details'>
                <p className='user-detail'><b>Phone:</b> {phone}</p>
                {width > 768 && <div className='user-detail-divider'></div>}
                <p className='user-detail'><b>Email:</b> {email}</p>
                {width > 768 && <div className='user-detail-divider'></div>}
                <p className='user-detail'><b>College registration:</b> {collegeRegistration}</p>
                <button className='edit-details' onClick={handleOpen}>Edit details</button>
            </section>

            <section className='detail-section'>
                <h2>Club applications</h2>
                {myApplications.length > 0 ?
                    (
                        <div>
                            {myApplications.map((application, index) => {
                                const status = application.applicationStatus
                                let color
                                if(status === 'Pending') color ='lightgray'
                                if(status === 'Accepted') color ='var(--siteGreen)'
                                if(status === 'Rejected') color ='orangered'
                                return (
                                    <div key={index} className='club-application-card'>
                                        <div className='club-applied-to'>
                                            <div className='club-logo'><img src={application.club.clubLogo} /></div>
                                            <h3>{application.club.clubName}</h3>
                                        </div>
                                        <h3 className='my-application-status' style={{backgroundColor: color}}>{application.applicationStatus}</h3>
                                    </div>
                                )
                            })}
                        </div>
                    ) :
                    (
                        <div className='empty-detail'>
                            <p>You haven't applied for any clubs</p>
                            <button className='find-detail'>
                                <NavLink to='/' className='NavLink' state={{ scrollTo: 'explore-clubs' }}>
                                    Find clubs you're interested in
                                </NavLink>
                            </button>
                        </div>
                    )
                }
            </section>

            <section className='detail-section'>
                <h2>Event registrations</h2>
                {myRegistations.length > 0 ?
                    (
                        <div className='event-registrations-container'>
                            {myRegistations.map((registration, index) => {
                                const eventStartDate = registration.event.eventStartDate
                                return (
                                    <div key={index}
                                        className='event-registration-card'
                                        onClick={() => navigate(`/event/${registration.event._id}`)}
                                    >
                                        <div className='event-main-details'>
                                            <h3>{registration.event.eventTitle}</h3>
                                            <p>{formatDateString(eventStartDate)}</p>
                                        </div>
                                        <div className='club-logo'><img src={registration.event.club.clubLogo} /></div>
                                    </div>
                                )
                            })}
                        </div>
                    ) :
                    (
                        <div className='empty-detail'>
                            <p>You haven't registered for any events</p>
                            <button className='find-detail'>
                                <NavLink to='/upcomingevents' className='NavLink'>
                                    Find events you're interested in
                                </NavLink>
                            </button>
                        </div>
                    )
                }
            </section>
        </main>
    );
}

export default Profile;
