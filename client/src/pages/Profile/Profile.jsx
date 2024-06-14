import React, { useEffect, useState } from 'react'
import './profile.css'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, useNavigate } from 'react-router-dom'
import axios from 'axios'
import UpdateUserModal from '../../components/Modal/UpdateUserModal'
import { signOut } from '../../redux/userSlice'
import axiosInstance from '../../axiosinstance'

function Profile() {
    const [open, setOpen] = useState(false)
    const { currentUser } = useSelector((state) => state.user)
    const [width, setWidth] = useState(window.innerWidth)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth)
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    })

    const handleLogout = async () => {
        try {
            await axiosInstance.post('/auth/user/logout');
            dispatch(signOut())
        } catch (error) {
            console.error('Error during logout: ', error);
        }
    }

    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    return (
        <main>
            {open && <UpdateUserModal handleClose={handleClose} />}
            <h1 className='user-name'>{currentUser.fname + ' ' + currentUser.lname} <button className='signout' onClick={handleLogout}>Sign out</button></h1>
            <section className='user-details'>
                <p className='user-detail'><b>Phone:</b> {currentUser.phone}</p>
                {width > 768 && <div className='user-detail-divider'></div>}
                <p className='user-detail'><b>Email:</b> {currentUser.email}</p>
                {width > 768 && <div className='user-detail-divider'></div>}
                <p className='user-detail'><b>College registration:</b> {currentUser.collegeRegistration}</p>

                <button className='edit-details' onClick={handleOpen}>Edit details</button>
            </section>
            <section className='detail-section'>
                <h2>Club applications</h2>
                {currentUser.applications && currentUser.applications.length > 0 ?
                    <>

                    </>
                    :
                    <div className='empty-detail'>
                        <p>You haven't applied for any clubs</p>
                        <button className='find-detail'><NavLink to='/' className='NavLink' state={{ scrollTo: 'explore-clubs' }} >Find clubs you're interested in</NavLink></button>
                    </div>
                }
            </section>

            <section className='detail-section'>
                <h2>Event registrations</h2>
                {currentUser.registrations && currentUser.registrations.length > 0 ?
                    <>

                    </>
                    :
                    <div className='empty-detail'>
                        <p>You haven't registered for any events</p>
                        <button className='find-detail'><NavLink to='/upcomingevents' className='NavLink' >Find events you're interested in</NavLink></button>
                    </div>
                }
            </section>
        </main>
    )
}

export default Profile