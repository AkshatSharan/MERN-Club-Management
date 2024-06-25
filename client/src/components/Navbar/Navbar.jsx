import React, { useEffect, useState } from 'react'
import './navbar.css'
import { NavLink } from "react-router-dom";
import NotificationBell from '../../assets/NotificationBell.svg'
import Hamburger from '../../assets/Hamburger.svg'
import CloseMenu from '../../assets/CloseMenu.svg'
import { useSelector } from 'react-redux';
import axiosInstance from '../../axiosinstance';
import parser from 'html-react-parser'

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { userType, currentUser } = useSelector((state) => state.user)
    const [notifications, setNotifications] = useState([])
    const [notificationsOpen, setNotificationsOpen] = useState(false)

    const toggleMenu = () => {
        setMenuOpen(!menuOpen)
    }

    const toggleNotifications = () => {
        setNotificationsOpen(!notificationsOpen)
    }

    useEffect(() => {
        function handleResize() {
            if (window.innerWidth < 949) {
                setMenuOpen(false)
            }
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize);
    })

    useEffect(() => {
        const getNotifs = async () => {
            const notifResponse = await axiosInstance.get('/user/notifications')
            setNotifications(notifResponse.data.notifications)
        }

        if (userType === 'student') {
            getNotifs()
        }
    }, [])

    const deleteNotification = async (notificationText) => {
        try {
            await axiosInstance.delete(`/user/delete-notification/${encodeURIComponent(notificationText)}`);

            setNotifications(prevNotifications =>
                prevNotifications.filter(notification => notification !== notificationText)
            );
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    }


    return (
        <>
            <nav id='navbar'>
                <NavLink to='/' className='NavLink'><h1 id='site-title'>ClubConnect</h1></NavLink>
                <div className='nav-items-container'>
                    <ul className='nav-items-list-desktop desktop-item'>
                        <li className='nav-item-desktop desktop-item'><NavLink to={`/club/${currentUser.user._id}`} className='NavLink'>Club page</NavLink></li>
                        {userType === 'club' && <li className='nav-item-desktop desktop-item'><NavLink to='/' className='NavLink'>{userType === 'student' ? 'Home' : 'Dashboard'}</NavLink></li>}
                        {userType === 'student' &&
                            <>
                                <li className='nav-item-desktop desktop-item'><NavLink to='/upcomingevents' className='NavLink'>Events</NavLink></li>
                                <li className='nav-item-desktop desktop-item'>
                                    <NavLink to='/' className='NavLink' state={{ scrollTo: 'explore-clubs' }} >Clubs</NavLink>
                                </li>
                                <li className='nav-item-desktop desktop-item'><NavLink to='/profile' className='NavLink'>Profile</NavLink></li>
                            </>
                        }
                    </ul>
                    {userType === 'student' &&
                        <>
                            <div className='notifications' onClick={toggleNotifications}>
                                <img src={NotificationBell} id='notification-icon' height={30} />
                                {notifications.length > 0 && <div className='notification-alert'></div>}
                            </div>

                            {notificationsOpen &&
                                <div className='notifications-screen'>
                                    {notifications.map((notification, index) =>
                                    (
                                        <div key={index} className='notification'>
                                            <p className='notification-text'>{parser(notification)}</p>
                                            <p className='delete-notification' onClick={() => deleteNotification(notification)}>X</p>
                                        </div>
                                    )
                                    )}
                                </div>
                            }
                        </>
                    }
                    {menuOpen ?
                        <img src={CloseMenu} height={30} id='closemenu' onClick={toggleMenu} />
                        :
                        <img src={Hamburger} height={30} id='hamburger' onClick={toggleMenu} />
                    }
                </div>
            </nav>
            {menuOpen &&
                <ul className='nav-items-list-mobile'>
                    {userType === 'club' && <li className='nav-item-mobile'><NavLink to={`/club/${currentUser.user._id}`} onClick={toggleMenu} className='NavLink'>Club page</NavLink></li>}
                    <li className='nav-item-mobile'><NavLink to='/' className='NavLink' onClick={toggleMenu}>{userType === 'student' ? 'Home' : 'Dashboard'}</NavLink></li>
                    {userType === 'student' &&
                        <>
                            <li className='nav-item-mobile'><NavLink to='/upcomingevents' className='NavLink' onClick={toggleMenu}>Events</NavLink></li>
                            <li className='nav-item-mobile'><NavLink to='/' className='NavLink' onClick={toggleMenu} state={{ scrollTo: 'explore-clubs' }}>Clubs</NavLink></li>
                            <li className='nav-item-mobile'><NavLink to='/profile' className='NavLink' onClick={toggleMenu}>Profile</NavLink></li>
                        </>
                    }
                </ul>
            }
        </>
    )
}

export default Navbar