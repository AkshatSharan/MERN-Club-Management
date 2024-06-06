import React from 'react'
import './upcomingevents.css'
import sampleData from '../../sampledata'

function UpcomingEvents() {
    const eventsByMonth = sampleData.reduce((acc, club) => {
        if (club.upcomingEvent) {
            const month = club.eventMonth;
            acc[month] = acc[month] || [];
            acc[month].push(club);
        }
        return acc;
    }, {});

    Object.keys(eventsByMonth).forEach(month => {
        eventsByMonth[month].sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));
    });

    return (
        <>
            <div className='events-header-container'>
                <h1 className='upcoming-events-title'>Upcoming events</h1>
                <h2 className='upcoming-events-subtitle'>Click on an event to find out more</h2>
            </div>
            <section className='upcoming-events-container'>
                {Object.entries(eventsByMonth).map(([month, clubs], index) => (
                    <div className='month-section' key={index}>
                        <h1 className='month-title'>{month}</h1>
                        {clubs.map((club, clubIndex) => (
                            <div className='upcoming-event-card' key={clubIndex}>
                                <div className='upcoming-event-schedule-detail'>
                                    <p className='upcoming-event-day'>
                                        {club.eventDay}
                                    </p>
                                    <p className='upcoming-event-date'>
                                        {club.eventDate}
                                    </p>
                                </div>
                                <div className='upcoming-event-details'>
                                    <p className='upcoming-event-time'>{club.eventTime}</p>
                                    <h1 className='upcoming-event-title'>{club.eventTitle}</h1>
                                    <p className='upcoming-event-description'>{club.eventDescription}</p>
                                </div>
                                <div className='event-organizer'>
                                    <img src={club.clubLogo} className='organizer-logo'/>
                                    <h2>{club.clubName}</h2>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </section>
        </>
    )
}

export default UpcomingEvents
