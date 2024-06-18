import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../axiosinstance";
import axios from "axios";
import Loader from "../../components/Loader/Loader";
import { Switch } from '@mui/material';
import './eventmanagement.css'

function EventManagement() {
    const { eventId } = useParams()
    const [event, setEvent] = useState(null)
    const [isLoading, setIsLoading] = useState(true);
    const [registrationsOpen, setRegistrationsOpen] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const eventResponse = await axios.get(`http://localhost:3000/api/upcomingevent/event/${eventId}`);
                setEvent(eventResponse.data)
                setRegistrationsOpen(eventResponse.data.registrationsOpen)
            } catch (error) {
                console.error('Error fetching event:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEvent();
    }, [eventId]);

    const handleFormStatusToggle = async () => {
        try {
            const toggleRespone = await axiosInstance.post(`/upcomingevent/change-reg/${eventId}`)
            setRegistrationsOpen(toggleRespone.data.event.registrationsOpen)
            console.log(toggleRespone.data.event.registrationsOpen)
        } catch (error) {
            console.error('Error updating event:', error);
        }
    }

    const handelEditFormClick = () => {
        navigate(`/registration-form/${eventId}`)
    }

    if (isLoading) {
        return <Loader message='Fetching event' />
    }

    if (!event) {
        return <p>No event found.</p>;
    }

    return (
        <div>
            <h1><u>{event.eventTitle}</u></h1>
            <section className="event-registration-form">
                <h2 className="management-section-header">Registrations</h2>
                <div className="toggle-form-state">
                    <h3>Close</h3>
                    <Switch checked={registrationsOpen} onClick={handleFormStatusToggle} />
                    <h3>Open</h3>
                </div>
                <button className="edit-details" onClick={handelEditFormClick}>Edit form</button>
            </section>
        </div>
    )
}

export default EventManagement