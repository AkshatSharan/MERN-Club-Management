import React, { useEffect, useState } from 'react'
import './navbar.css'
import { NavLink } from "react-router-dom";
import NotificationBell from '../../assets/NotificationBell.svg'
import Hamburger from '../../assets/Hamburger.svg'
import CloseMenu from '../../assets/CloseMenu.svg'
import { useSelector } from 'react-redux';

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { userType } = useSelector((state) => state.user)

    const toggleMenu = () => {
        setMenuOpen(!menuOpen)
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

    return (
        <>
            <nav id='navbar'>
                <NavLink to='/' className='NavLink'><h1 id='site-title'>ClubConnect</h1></NavLink>
                <div className='nav-items-container'>
                    <ul className='nav-items-list-desktop desktop-item'>
                        <li className='nav-item-desktop desktop-item'><NavLink to='/' className='NavLink'>{userType === 'student' ? 'Home' : 'Dashboard'}</NavLink></li>
                        {userType === 'user' &&
                            <>
                                <li className='nav-item-desktop desktop-item'><NavLink to='/upcomingevents' className='NavLink'>Events</NavLink></li>
                                <li className='nav-item-desktop desktop-item'>
                                    <NavLink to='/' className='NavLink' state={{ scrollTo: 'explore-clubs' }} >Clubs</NavLink>
                                </li>
                                <li className='nav-item-desktop desktop-item'><NavLink to='/profile' className='NavLink'>Profile</NavLink></li>
                            </>
                        }
                    </ul>
                    {userType === 'student' && <img src={NotificationBell} id='notification-icon' height={30} />}
                    {menuOpen ?
                        <img src={CloseMenu} height={30} id='closemenu' onClick={toggleMenu} />
                        :
                        <img src={Hamburger} height={30} id='hamburger' onClick={toggleMenu} />
                    }
                </div>
            </nav>
            {menuOpen &&
                <ul className='nav-items-list-mobile'>
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