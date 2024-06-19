import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Loader from '../../components/Loader/Loader';
import BackArrow from '../../assets/BackArrow.svg';
import ParticipationIcon from '../../assets/ParticipationIcon.svg';
import DeadlineIcon from '../../assets/DeadlineIcon.svg';
import CallendarIcon from '../../assets/CallendarIcon.svg';
import LocationIcon from '../../assets/LocationIcon.svg';
import TrophyIcon from '../../assets/TrophyIcon.svg';
import CashIcon from '../../assets/CashIcon.svg';
import CertificateIcon from '../../assets/CertificateIcon.svg';
import RupeesIcon from '../../assets/RupeesIcon.svg';
import './eventdetails.css';
import parser from 'html-react-parser';
import { useSelector } from 'react-redux';

function EventDetails() {
    const [isLoading, setIsLoading] = useState(true)
    const { eventId } = useParams()
    const [eventDetails, setEventDetails] = useState(null)
    const [eventRounds, setEventRounds] = useState([])
    const [eventPrizes, setEventPrizes] = useState([])

    const { userType } = useSelector((state) => state.user)

    const navigate = useNavigate()

    function getMonthAbbreviation(monthIndex) {
        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
        return months[monthIndex]
    }

    function formatDate(dateString) {
        const date = new Date(dateString)
        const day = date.getDate().toString().padStart(2, '0')
        const monthAbbreviation = getMonthAbbreviation(date.getMonth())
        const year = date.getFullYear().toString().slice(2)
        return `${day} ${monthAbbreviation} ${year}`
    }

    function formatTime(dateString) {
        const date = new Date(dateString)
        let hours = date.getHours()
        const minutes = date.getMinutes().toString().padStart(2, '0')
        const ampm = hours >= 12 ? 'pm' : 'am'
        hours = hours % 12
        hours = hours ? 12 : 0
        return `${hours}:${minutes} ${ampm}`
    }

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const eventResponse = await axios.get(`http://localhost:3000/api/upcomingevent/event/${eventId}`);

                const sortedRounds = eventResponse.data.rounds.sort((a, b) => {
                    const dateA = new Date(a.roundDate).setHours(0, 0, 0, 0)
                    const dateB = new Date(b.roundDate).setHours(0, 0, 0, 0)
                    if (dateA < dateB) return -1
                    if (dateA > dateB) return 1
                    const startTimeA = new Date(a.roundDate).setHours(new Date(a.startTime).getHours(), new Date(a.startTime).getMinutes())
                    const startTimeB = new Date(b.roundDate).setHours(new Date(b.startTime).getHours(), new Date(b.startTime).getMinutes())
                    return startTimeA - startTimeB;
                });

                setEventDetails(eventResponse.data)
                setEventRounds(sortedRounds)
                setEventPrizes(eventResponse.data.prizes)
            } catch (error) {
                console.error('Error fetching event:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchEvent()
    }, [eventId])

    const handleRegisterNow = () => {
        navigate(`/register/${eventId}`)
    }

    if (isLoading) {
        return <Loader message={'Fetching details'} />
    }

    return (
        <div className={userType == null ? 'main-content' : ''}>
            <div className='event-title-container'>
                <img src={BackArrow} className='back-arrow' onClick={() => navigate(-1)} alt="Back" />
                <h1 className='event-title'>{eventDetails.eventTitle}</h1>
            </div>
            <div className='header-information'>
                <img src={ParticipationIcon} className='primary-detail-icon' alt="Participation" />
                <p><b>Team size:</b> {eventDetails.participation}</p>
            </div>
            <div className='header-information' style={{ color: '#BA5A54' }}>
                <img src={DeadlineIcon} className='primary-detail-icon' alt="Deadline" />
                <p><b>Registration Deadline:</b> {formatDate(eventDetails.registrationDeadline)} • {formatTime(eventDetails.registrationDeadline)}</p>
            </div>
            <h1 className='section-header'>Event description</h1>
            <div className='event-detail'>
                {parser(eventDetails.eventDescription)}
            </div>
            <h1 className='section-header'>Event details</h1>
            <h1 className='section-subheader'>Date and time</h1>
            <div className='event-cards-container'>
                {eventRounds.map((round, index) => (
                    <div className='round-card' key={index}>
                        <h3 className='round-name'>{round.roundName}</h3>
                        <div className='round-details'>
                            <div className='card-detail'>
                                <img src={CallendarIcon} className='card-detail-icon' alt="Calendar" />
                                <div className='date-time'>
                                    <p>{formatDate(round.roundDate)}</p>
                                    <p>{`${formatTime(round.startTime)} to ${formatTime(round.endTime)}`}</p>
                                </div>
                            </div>
                            <div className='card-detail'>
                                <img src={LocationIcon} className='card-detail-icon' alt="Location" />
                                <p>{round.roundLocation}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {eventPrizes.length > 0 && <h1 className='section-subheader'>Rewards and prizes</h1>}
            <div className='event-cards-container'>
                {eventPrizes.map((prize, index) => (
                    <div className='round-card' key={index}>
                        <h3 className='round-name'>{prize.positionName}</h3>
                        <div className='round-details'>
                            {prize.trophy && (
                                <div className='card-detail'>
                                    <img src={TrophyIcon} className='card-detail-icon' alt="Trophy" />
                                    <p>Trophy</p>
                                </div>
                            )}
                            {prize.cashPrize && (
                                <div className='card-detail'>
                                    <img src={CashIcon} className='card-detail-icon' alt="Cash" />
                                    <p style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                        <img src={RupeesIcon} className='prize-money-icon' alt="Rupees" />
                                        {prize.cashPrizeAmt}
                                    </p>
                                </div>
                            )}
                            {prize.certificate && (
                                <div className='card-detail'>
                                    <img src={CertificateIcon} className='card-detail-icon' alt="Certificate" />
                                    <p>Certificate</p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            {eventDetails.registrationsOpen && (
                <>
                    <div className='registration'>
                        <h2>Registration:</h2>
                        {eventDetails.registrationFees === 'Free' ? (
                            <h2 style={{ color: 'var(--siteGreen)' }}>{eventDetails.registrationFees}</h2>
                        ) : (
                            <h2 style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'black' }}>
                                <img src={RupeesIcon} className='prize-money-icon' alt="Rupees" />
                                {eventDetails.registrationFees}
                            </h2>
                        )}
                    </div>
                    <button className='register-now' onClick={handleRegisterNow}>Register now</button>
                </>
            )}
        </div>
    );
}

export default EventDetails;
