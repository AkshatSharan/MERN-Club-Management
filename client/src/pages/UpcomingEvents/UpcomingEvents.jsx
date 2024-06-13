import React, { useEffect, useState } from 'react';
import './upcomingevents.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader/Loader';

function UpcomingEvents() {
    const [upcomingEventClubs, setUpcomingEventClubs] = useState([]);
    const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
    const [expandedEventDescription, setExpandedEventDescription] = useState({});
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setViewportWidth(width);
            if (width < 629) {
                setExpandedEventDescription(true);
            } else {
                setExpandedEventDescription(false);
            }
        };

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/club/getallclubswithupcomingevents');
                setUpcomingEventClubs(response.data);
            } catch (error) {
                console.error('Error fetching clubs:', error);
            } finally {
                setIsLoading(false)
            }
        };

        fetchEvents();
    }, []);

    const monthOrder = [
        'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
        'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
    ];

    const eventsByMonth = upcomingEventClubs.reduce((acc, club) => {
        club.upcomingEvents.forEach(event => {
            const date = new Date(event.eventStartDate);
            const month = date.toLocaleString('default', { month: 'long' }).toUpperCase();
            const year = date.getFullYear();
            const key = `${month} ${year}`;
            acc[key] = acc[key] || [];
            acc[key].push({ club, event });
        });
        return acc;
    }, {});

    Object.keys(eventsByMonth).forEach(month => {
        eventsByMonth[month].sort((a, b) => new Date(a.event.eventStartDate) - new Date(b.event.eventStartDate));
    });

    const sortedMonths = Object.keys(eventsByMonth).sort((a, b) => {
        const [monthA, yearA] = a.split(' ');
        const [monthB, yearB] = b.split(' ');

        if (yearA !== yearB) {
            return yearA - yearB;
        }

        return monthOrder.indexOf(monthA) - monthOrder.indexOf(monthB);
    });

    const handleReadMore = (event, index) => {
        event.stopPropagation();
        setExpandedEventDescription((prevExpandedDescription) => {
            return {
                ...prevExpandedDescription,
                [index]: !prevExpandedDescription[index]
            };
        });
    }

    const navigate = useNavigate()

    const handleDivClick = (eventId) => {
        navigate(`/event/${eventId}`)
    }

    if (isLoading) {
        return (
            <Loader message={"Listing events"} />
        )
    }

    return (
        <>
            <div className='events-header-container'>
                <h1 className='upcoming-events-title'>Upcoming events</h1>
                <h2 className='upcoming-events-subtitle'>Click on an event name to find out more</h2>
            </div>
            <section className='upcoming-events-container'>
                {sortedMonths.map((month, index) => (
                    <div className='month-section' key={index}>
                        <h1 className='month-title'>{month}</h1>
                        {eventsByMonth[month].map((eventData, eventIndex) => {
                            const smallEventDescription = eventData.event.eventDescription.substring(0, 250)
                            const bigEventDescription = eventData.event.eventDescription
                            return (
                                <div className='upcoming-event-card' key={eventIndex} onClick={() => handleDivClick(eventData.event._id)}>
                                    <div className='upcoming-event-card-properties'>
                                        <div className='upcoming-event-schedule-detail'>
                                            <p className='upcoming-event-day'>
                                                {new Date(eventData.event.eventStartDate).toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}
                                            </p>
                                            <p className='upcoming-event-date'>
                                                {new Date(eventData.event.eventStartDate).toLocaleDateString('en-US', { day: 'numeric' })}
                                            </p>
                                        </div>
                                        <div className='upcoming-event-details'>
                                            <h1 className='upcoming-event-title'>{eventData.event.eventTitle}</h1>
                                            {viewportWidth > 629 && <p className='upcoming-event-description'>{eventData.event.eventDescription}</p>}
                                        </div>
                                        <div className='event-organizer'>
                                            <div className='organizer-logo'><img src={eventData.club.clubLogo} alt='Organizer Logo' /></div>
                                            <h2>{eventData.club.clubName}</h2>
                                        </div>
                                    </div>
                                    {(viewportWidth < 629 && !expandedEventDescription[eventIndex]) && <p className='upcoming-event-description'>{smallEventDescription}<button className='read-more' onClick={(event) => handleReadMore(event, eventIndex)}>...read more</button></p>}
                                    {(viewportWidth < 629 && expandedEventDescription[eventIndex]) && <p className='upcoming-event-description'>{bigEventDescription}<button className='read-more' onClick={(event) => handleReadMore(event, eventIndex)}>read less</button></p>}
                                </div>
                            )
                        })}
                    </div>
                ))}
            </section>
        </>
    );
}

export default UpcomingEvents;
