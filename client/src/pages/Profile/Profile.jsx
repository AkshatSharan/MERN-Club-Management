import React, { useEffect, useState } from 'react'
import './profile.css'
import { useSelector } from 'react-redux'

function Profile() {
    const { currentUser } = useSelector((state) => state.user)
    const [width, setWidth] = useState(window.innerWidth)

    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth)
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    })

    return (
        <>
            <h1 className='user-name'>{currentUser.fname + ' ' + currentUser.lname}</h1>
            <section className='user-details'>
                <p className='user-detail'><b>Phone:</b> {currentUser.phone}</p>
                {width > 768 && <div className='user-detail-divider'></div>}
                <p className='user-detail'><b>Email:</b> {currentUser.email}</p>
                {width > 768 && <div className='user-detail-divider'></div>}
                <p className='user-detail'><b>College registration:</b> {currentUser.collegeRegistration}</p>
                <button className='edit-details'>Edit details</button>
            </section>
            <section className='club-applications'>
                <h2>Club applications</h2>
                {currentUser.applications && currentUser.applications.length > 0 ?
                    <>

                    </>
                    :
                    <div className='empty-detail'>
                        <p>You haven't applied for any clubs</p>
                        <button className='find-detail'>Find clubs you're interested in</button>
                    </div>
                }
            </section>

            <section className='club-applications'>
                <h2>Event registrations</h2>
                {currentUser.registrations && currentUser.registrations.length > 0 ?
                    <>

                    </>
                    :
                    <div className='empty-detail'>
                        <p>You haven't registered for any events</p>
                        <button className='find-detail'>Find events you're interested in</button>
                    </div>
                }
            </section>
        </>
    )
}

export default Profile