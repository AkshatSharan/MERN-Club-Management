import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../axiosinstance";
import Loader from "../../components/Loader/Loader";
import { Switch } from '@mui/material';
import * as XLSX from 'xlsx';
import SortUpDown from '../../assets/SortUpDown.svg';
import './eventmanagement.css';

function EventManagement() {
    const { eventId } = useParams();
    const [event, setEvent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [registrationsOpen, setRegistrationsOpen] = useState(null);
    const [registrationsData, setRegistrationsData] = useState([]);
    const [sortedData, setSortedData] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const eventResponse = await axiosInstance.get(`/upcomingevent/event-management/${eventId}`);
                setEvent(eventResponse.data);
                setRegistrationsOpen(eventResponse.data.registrationsOpen);
                setRegistrationsData(eventResponse.data.registrations);
                setSortedData(eventResponse.data.registrations); // Initialize sorted data
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

        XLSX.writeFile(workbook, `${event.eventTitle}_registrations.xlsx`)
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

    const handleAttendanceChange = (registrationId, value) => {
        setSortedData(prevData =>
            prevData.map(registration =>
                registration._id === registrationId ? { ...registration, attended: value } : registration
            )
        )
    }

    const viewEventPage = () => {
        navigate(`/event/${eventId}`)
    }

    if (isLoading) {
        return <Loader message='Fetching event' />;
    }

    return (
        <div>
            <h1><u>{event.eventTitle}</u></h1>
            <div className="event-info-management">
                <button className="edit-details " style={{ backgroundColor: 'var(--siteLightGreen)' }} onClick={viewEventPage}>View event page</button>
                <button className="edit-details " style={{ backgroundColor: 'var(--siteGreen)' }} onClick={() => navigate(`/update-event/${eventId}`)}>Edit event page</button>
            </div>
            <section className="event-registration-form">
                <h2 className="management-section-header">Registration form</h2>
                <div className="toggle-form-state">
                    <h3>Close</h3>
                    <Switch checked={registrationsOpen} onClick={handleFormStatusToggle} />
                    <h3>Open</h3>
                </div>
                <button className="edit-details" onClick={handelEditFormClick}>Edit form</button>
            </section>

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
                                    sortedData.map((registration) => (
                                        <tr key={registration._id}>
                                            <td>{registration.student.collegeRegistration}</td>
                                            <td>{registration.student.fname} {registration.student.lname}</td>
                                            <td>{registration.student.phone}</td>
                                            {form.questions.map((question, qIndex) => (
                                                <td key={qIndex} className="wrapped-cell">
                                                    {formatAnswers(registration.responses.find(response => response.question === question._id)?.answer || '-')}
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
                                    ))
                                    :
                                    (<tr><td colSpan={form.questions.length + 4}>No registrations found.</td></tr>)
                                }
                            </tbody>
                        </table>
                    </div>
                ))}
            </section>
        </div>
    );
}

export default EventManagement;
