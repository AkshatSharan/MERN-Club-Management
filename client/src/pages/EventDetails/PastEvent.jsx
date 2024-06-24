import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../axiosinstance";
import Loader from "../../components/Loader/Loader";
import { Switch } from '@mui/material';
import * as XLSX from 'xlsx';
import SortUpDown from '../../assets/SortUpDown.svg';
import CompleteConfirmation from "../../components/Modal/CompleteConfirmation";

function PastEvent() {
    const { eventId } = useParams();
    const [event, setEvent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [registrationsOpen, setRegistrationsOpen] = useState(null);
    const [registrationsData, setRegistrationsData] = useState([]);
    const [sortedData, setSortedData] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const [completeEventClick, setCompleteEventClick] = useState(false);
    const [deleteEventClick, setDeleteEventClick] = useState(false);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const eventResponse = await axiosInstance.get(`/upcomingevent/past-event/${eventId}`);
                setEvent(eventResponse.data);
                setRegistrationsOpen(eventResponse.data.registrationsOpen);
                setRegistrationsData(eventResponse.data.registrations);
                setSortedData(eventResponse.data.registrations);
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
            const toggleResponse = await axiosInstance.post(`/upcomingevent/change-reg/${eventId}`);
            setRegistrationsOpen(toggleResponse.data.event.registrationsOpen);
        } catch (error) {
            console.error('Error updating event:', error);
        }
    }

    const handleExportToExcel = () => {
        const worksheetData = sortedData.map(registration => {
            const registrationData = {
                Registration: registration.student.collegeRegistration,
                Name: `${registration.student.fname} ${registration.student.lname}`,
                Phone: registration.student.phone
            };

            // Map each question to its corresponding answer
            event.registrationForm[0].questions.forEach(question => {
                const answer = registration.responses.find(response => response.question === question._id)?.answer || '-'
                registrationData[question.question] = Array.isArray(answer) ? answer.join(', ') : answer
            })

            registrationData.Attended = registration.attended ? 'Yes' : 'No'
            return registrationData;
        })

        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations")

        XLSX.writeFile(workbook, `${event?.eventTitle || 'Event'}_registrations.xlsx`)
    }

    const handelEditFormClick = () => {
        navigate(`/registration-form/${eventId}`)
    }

    const formatAnswers = (answers) => {
        return Array.isArray(answers) ? answers.join(', ') : answers
    };

    const handleSort = (key) => {
        let direction = 'asc'
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc'
        }

        const sortedArray = [...sortedData].sort((a, b) => {
            const getValue = (obj, key) => key.split('.').reduce((o, i) => o[i], obj)
            const valueA = getValue(a, key)
            const valueB = getValue(b, key)

            if (valueA < valueB) {
                return direction === 'asc' ? -1 : 1
            }
            if (valueA > valueB) {
                return direction === 'asc' ? 1 : -1
            }
            return 0
        });

        setSortedData(sortedArray)
        setSortConfig({ key, direction })
    };

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase()
        setSearchQuery(query)
        const filteredData = registrationsData.filter(registration =>
            registration.student.collegeRegistration.toLowerCase().includes(query)
        )
        setSortedData(filteredData)
    };

    const handleAttendanceChange = async (registrationId, value) => {
        try {
            await axiosInstance.put(`upcomingevent/update-attendance/${registrationId}`, { attended: value });
            setSortedData(prevData =>
                prevData.map(registration =>
                    registration._id === registrationId ? { ...registration, attended: value } : registration
                )
            )
        } catch (error) {
            console.error('Error updating attendance:', error)
        }
    }

    const viewEventPage = () => {
        navigate(`/event/${eventId}`)
    }

    const completeEvent = async () => {
        try {
            await axiosInstance.post(`/upcomingevent/transfer-event/${eventId}`)
            navigate('/')
        } catch (error) {
            console.error('Error transferring event:', error);
        }
    }

    const deleteEvent = async () => {
        try {
            await axiosInstance.delete(`/upcomingevent/delete-past-event/${eventId}`)
            navigate('/')
        } catch (error) {
            console.error('Error transferring event:', error);
        }
    }

    if (isLoading) {
        return <Loader message='Fetching event' />;
    }

    if (!event) {
        return <div>Error fetching event. Please try again later.</div>;
    }
    const handleCloseComplete = () => {
        setCompleteEventClick(false)
    }

    const handleOpenDelete = () => {
        setDeleteEventClick(true)
    }
    const handleCloseDelete = () => {
        setDeleteEventClick(false)
    }

    return (
        <div>
            {completeEventClick && <CompleteConfirmation message="Are you sure the event is complete?" handleClose={handleCloseComplete} action={completeEvent} />}
            {deleteEventClick && <CompleteConfirmation message="Are you sure you want to delete this event?" handleClose={handleCloseDelete} action={deleteEvent} />}
            <div className="event-management-header">
                <h1><u>{event.eventTitle}</u></h1>
                <div className="event-info-management">
                    <button className="edit-details" style={{ backgroundColor: 'orangered' }} onClick={handleOpenDelete}>Delete</button>
                </div>
            </div>
            <div className="event-info-management">
                <button className="edit-details " style={{ backgroundColor: 'var(--siteBlue)' }} onClick={viewEventPage}>View event page</button>
            </div>

            <section className="event-registration-form">
                <h2 className="management-section-header">Registrations</h2>
                <input
                    type="text"
                    placeholder="Search by registration number"
                    value={searchQuery}
                    onChange={handleSearch}
                    className="search-input"
                />
                <button onClick={handleExportToExcel} className="export-button">Export to Excel</button>
                {event.registrationForm.map((form, index) => (
                    <div key={index} className="table-container">
                        <table className="registration-table">
                            <thead>
                                <tr>
                                    <th>
                                        <div className="header-items">
                                            Registration
                                            <button className="sorting-icon" onClick={() => handleSort('student.collegeRegistration')}>
                                                <img className="sorting-icon" src={SortUpDown} alt="Sort" />
                                            </button>
                                        </div>
                                    </th>
                                    <th>
                                        <div className="header-items">
                                            Name
                                            <button className="sorting-icon" onClick={() => handleSort('student.fname')}>
                                                <img className="sorting-icon" src={SortUpDown} alt="Sort" />
                                            </button>
                                        </div>
                                    </th>
                                    <th>
                                        <div className="header-items">
                                            Phone
                                            <button onClick={() => handleSort('student.phone')}>
                                                <img className="sorting-icon" src={SortUpDown} alt="Sort" />
                                            </button>
                                        </div>
                                    </th>
                                    {form.questions.map((question, qIndex) => (
                                        <th key={qIndex}>
                                            {question.question}
                                        </th>
                                    ))}
                                    <th>Attended</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedData.length > 0 ?
                                    sortedData.map((registration) => {
                                        return (
                                            <tr key={registration._id}>
                                                <td>{registration.student.collegeRegistration}</td>
                                                <td>{registration.student.fname} {registration.student.lname}</td>
                                                <td>{registration.student.phone}</td>
                                                {form.questions.map((question, qIndex) => (
                                                    <td key={qIndex}>
                                                        {formatAnswers(registration.responses.find(response => response.question === question._id)?.answer)}
                                                    </td>
                                                ))}
                                                <td>
                                                    <select
                                                        defaultValue={registration.attended || ''}
                                                        className="question-type-select"
                                                        onChange={(e) => handleAttendanceChange(registration._id, e.target.value)}
                                                    >
                                                        <option value="" disabled>Select</option>
                                                        <option value="yes">Yes</option>
                                                        <option value="no">No</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        )
                                    })
                                    :
                                    <tr>
                                        <td colSpan={form.questions.length + 4} className="no-results">No registrations found.</td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                ))}
            </section>
        </div>
    );
}

export default PastEvent;
