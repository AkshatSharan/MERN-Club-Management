import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './eventdetails.css'
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Loader from '../../components/Loader/Loader';
import BackArrow from '../../assets/BackArrow.svg'
import ParticipationIcon from '../../assets/ParticipationIcon.svg'
import DeadlineIcon from '../../assets/DeadlineIcon.svg'
import CallendarIcon from '../../assets/CallendarIcon.svg'
import LocationIcon from '../../assets/LocationIcon.svg'
import TrophyIcon from '../../assets/TrophyIcon.svg'
import CashIcon from '../../assets/CashIcon.svg'
import CertificateIcon from '../../assets/CertificateIcon.svg'
import RupeesIcon from '../../assets/RupeesIcon.svg'

function EventDetails(props) {
    const [isLoading, setIsLoading] = useState(true)
    const { eventId } = useParams()
    const [eventDetails, setEventDetails] = useState(null)
    const [eventRounds, setEventRound] = useState(null)
    const [eventPrizes, setEventPrizes] = useState(null)

    const navigate = useNavigate()

    function getMonthAbbreviation(monthIndex) {
        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        return months[monthIndex];
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const monthAbbreviation = getMonthAbbreviation(date.getMonth());
        const year = date.getFullYear().toString().slice(2);
        return `${day} ${monthAbbreviation} ${year}`;
    }

    function formatTime(dateString) {
        const date = new Date(dateString);
        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12;
        return `${hours}:${minutes} ${ampm}`;
    }


    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const event = await axios.get(`http://localhost:3000/api/upcomingevent/event/${eventId}`)
                const rounds = await axios.get(`http://localhost:3000/api/upcomingevent/round/eventrounds/${eventId}`)
                const prizes = await axios.get(`http://localhost:3000/api/upcomingevent/prize/eventprizes/${eventId}`)

                const sortedRounds = rounds.data.sort((a, b) => {
                    const dateA = new Date(a.roundDate).setHours(0, 0, 0, 0);
                    const dateB = new Date(b.roundDate).setHours(0, 0, 0, 0);

                    if (dateA < dateB) return -1;
                    if (dateA > dateB) return 1;

                    const startTimeA = new Date(a.roundDate).setHours(new Date(a.startTime).getHours(), new Date(a.startTime).getMinutes());
                    const startTimeB = new Date(b.roundDate).setHours(new Date(b.startTime).getHours(), new Date(b.startTime).getMinutes());

                    return startTimeA - startTimeB;
                })

                setEventDetails(event.data)
                setEventRound(sortedRounds)
                setEventPrizes(prizes.data)
            } catch (error) {
                console.error('Error fetching event:', error)
            } finally {
                setIsLoading(false)
            }
        };

        fetchEvent()
    }, [eventId])

    if (isLoading) {
        return (
            <Loader />
        )
    }

    return (
        <div>
            <div>
                <div className='event-title-container'>
                    <img src={BackArrow} className='back-arrow' onClick={() => navigate(-1)} />
                    <h1 className='event-title'>{eventDetails.eventTitle}</h1>
                </div>
            </div>
            <div className='header-information'>
                <img src={ParticipationIcon} className='primary-detail-icon' />
                <p><b>Team size:</b> {eventDetails.participation}</p>
            </div>
            <div className='header-information' style={{ color: '#BA5A54' }}>
                <img src={DeadlineIcon} className='primary-detail-icon' />
                <p><b>Registration Deadline:</b> {formatDate(eventDetails.registrationDeadline)} • {formatTime(eventDetails.registrationDeadline)}</p>
            </div>

            <h1 className='section-header'>Event description</h1>
            <p className='event-detail'>{eventDetails.eventDescription}</p>

            <h1 className='section-header'>Event details</h1>

            <h1 className='section-subheader'>Date and time</h1>
            <div className='event-cards-contianer'>
                {eventRounds.map((round, index) => (
                    <div className='round-card' key={index}>
                        <h3 className='round-name'>{round.roundName}</h3>
                        <div className='round-details'>
                            <div className='card-detail'>
                                <img src={CallendarIcon} className='card-detail-icon' />
                                <div className='date-time'>
                                    <p>{formatDate(round.roundDate)}</p>
                                    <p>{`${formatTime(round.startTime)} to ${formatTime(round.endTime)}`}</p>
                                </div>
                            </div>
                            <div className='card-detail'>
                                <img src={LocationIcon} className='card-detail-icon' />
                                <p>{round.roundLocation}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {eventDetails.prizes.length > 0 &&
                <>
                    <h1 className='section-subheader'>Rewards and prizes</h1>
                    <div className='event-cards-contianer'>
                        {eventPrizes.map((prize, index) => (
                            <div className='round-card' key={index}>
                                <h3 className='round-name'>{prize.positionName}</h3>
                                <div className='round-details'>
                                    {prize.trophy &&
                                        <div className='card-detail'>
                                            <img src={TrophyIcon} className='card-detail-icon' />
                                            <p>Trophy</p>
                                        </div>
                                    }
                                    {prize.cashPrize &&
                                        <div className='card-detail'>
                                            <img src={CashIcon} className='card-detail-icon' />
                                            <p style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                                <img src={RupeesIcon} className='prize-money-icon' />
                                                {prize.cashPrizeAmt}
                                            </p>
                                        </div>
                                    }
                                    {prize.certificate &&
                                        <div className='card-detail'>
                                            <img src={CertificateIcon} className='card-detail-icon' />
                                            <p>Certificate</p>
                                        </div>
                                    }
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            }
            <div className='registration'>
                <h2>Registration:</h2> {eventDetails.registrationFees === 'Free' ?
                    <h2 style={{color: 'var(--siteGreen)'}}>{eventDetails.registrationFees}</h2>
                    :
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: 5, color:'black' }}>
                        <img src={RupeesIcon} className='prize-money-icon' />
                        {eventDetails.registrationFees}
                    </h2>
                }
            </div>
            <button className='register-now'>Register now</button>
        </div>
    );
}

export default EventDetails;
