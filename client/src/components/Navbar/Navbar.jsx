import React, { useEffect, useState } from 'react'
import './navbar.css'
import { NavLink } from "react-router-dom";
import NotificationBell from '../../assets/NotificationBell.svg'
import Hamburger from '../../assets/Hamburger.svg'
import CloseMenu from '../../assets/CloseMenu.svg'

function Navbar({ scrollToSection }) {
    const [menuOpen, setMenuOpen] = useState(false);

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
                        <li className='nav-item-desktop desktop-item'><NavLink to='/' className='NavLink'>Home</NavLink></li>
                        <li className='nav-item-desktop desktop-item'><NavLink to='/upcomingevents' className='NavLink'>Events</NavLink></li>
                        <li className='nav-item-desktop desktop-item'>
                            <NavLink to='/' className='NavLink' state={{ scrollTo: 'explore-clubs' }} >Clubs</NavLink>
                        </li>
                        <li className='nav-item-desktop desktop-item'><NavLink to='/' className='NavLink'>Profile</NavLink></li>
                    </ul>
                    <img src={NotificationBell} id='notification-icon' height={30} />
                    {menuOpen ?
                        <img src={CloseMenu} height={30} id='closemenu' onClick={toggleMenu} />
                        :
                        <img src={Hamburger} height={30} id='hamburger' onClick={toggleMenu} />
                    }
                </div>
            </nav>
            {menuOpen &&
                <ul className='nav-items-list-mobile'>
                    <li className='nav-item-mobile'><NavLink to='/' className='NavLink' onClick={toggleMenu}>Home</NavLink></li>
                    <li className='nav-item-mobile'><NavLink to='/upcomingevents' className='NavLink' onClick={toggleMenu}>Events</NavLink></li>
                    <li className='nav-item-mobile'><NavLink to='/' className='NavLink' onClick={toggleMenu} state={{ scrollTo: 'explore-clubs' }}>Clubs</NavLink></li>
                    <li className='nav-item-mobile'><NavLink to='/' className='NavLink' onClick={toggleMenu}>Profile</NavLink></li>
                </ul>
            }
        </>
    )
}

export default Navbar