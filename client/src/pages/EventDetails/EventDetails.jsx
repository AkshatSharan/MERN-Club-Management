import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Loader from '../../components/Loader/Loader';

function EventDetails() {
    const { eventId } = useParams();
    const [eventDetails, setEventDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/upcomingevent/event/${eventId}`);
                setEventDetails(response.data);
            } catch (error) {
                console.error('Error fetching event:', error);
            } finally {
                setIsLoading(false)
            }
        };

        fetchEvent();
    }, [eventId]);

    if (isLoading) {
        return (
            <Loader />
        )
    }

    return (
        <div>
            <>
                <h1>{eventDetails.eventTitle}</h1>
                <p>{eventDetails.eventDescription}</p>
                <p>Registrations Open: {eventDetails.registrationsOpen ? 'Yes' : 'No'}</p>
                <p>Registration Deadline: {eventDetails.registrationDeadline}</p>
                <p>Event Start Date: {eventDetails.eventStartDate}</p>
            </>
        </div>
    );
}

export default EventDetails;
