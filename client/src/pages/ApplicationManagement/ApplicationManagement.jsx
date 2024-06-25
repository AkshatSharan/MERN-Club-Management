import React, { useEffect, useState } from 'react';
import axiosInstance from '../../axiosinstance';
import Loader from '../../components/Loader/Loader';
import * as XLSX from 'xlsx';
import SortUpDown from '../../assets/SortUpDown.svg';
import './applicationmanagement.css'

function ApplicationManagement() {
    const [applications, setApplications] = useState([]);
    const [sortedApplications, setSortedApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [applicationForm, setApplicationForm] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
    const [searchQuery, setSearchQuery] = useState('');
    const [changes, setChanges] = useState({});  // To track local changes

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await axiosInstance.get('/club/application/getapplications');
                console.log('Application Form:', response.data.applicationForm);
                setApplications(response.data.applications);
                setSortedApplications(response.data.applications);
                setApplicationForm(response.data.applicationForm[0]);
            } catch (error) {
                console.error('Error fetching applications:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchApplications();
    }, []);

    const handleExportToExcel = () => {
        if (applications.length === 0 || !applicationForm || !applicationForm.questions || applicationForm.questions.length === 0) {
            console.error('No data to export');
            return;
        }
    
        const worksheetData = applications.map(application => {
            // Collect question responses first
            const rowData = {};
    
            application.responses.forEach(response => {
                const question = applicationForm.questions.find(q => q._id === response.question);
                if (question) {
                    rowData[question.question] = Array.isArray(response.answer) ? response.answer.join(', ') : response.answer;
                }
            });
    
            return {
                'College Registration': application.student.collegeRegistration,
                'Full Name': `${application.student.fname} ${application.student.lname}`,
                'Phone': application.student.phone,
                'Email': application.student.email,
                ...rowData,
                'Status': application.applicationStatus
            };
        });
    
        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Applications');
    
        const fileName = 'applications.xlsx';
        XLSX.writeFile(workbook, fileName);
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }

        const sortedArray = [...sortedApplications].sort((a, b) => {
            const getValue = (obj, key) => key.split('.').reduce((o, i) => o[i], obj);
            const valueA = getValue(a, key);
            const valueB = getValue(b, key);

            if (valueA < valueB) {
                return direction === 'asc' ? -1 : 1;
            }
            if (valueA > valueB) {
                return direction === 'asc' ? 1 : -1;
            }
            return 0;
        });

        setSortedApplications(sortedArray);
        setSortConfig({ key, direction });
    };

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        const filteredData = applications.filter(application =>
            application.student.collegeRegistration.toLowerCase().includes(query)
        );
        setSortedApplications(filteredData);
    };

    const handleStatusChange = (applicationId, newStatus) => {
        setChanges(prevChanges => ({
            ...prevChanges,
            [applicationId]: newStatus,
        }));
    };

    const handleSubmitChanges = async () => {
        try {
            const response = await axiosInstance.put('/club/application/update-statuses', changes);
            if (response.status === 200) {
                setApplications(prevApplications =>
                    prevApplications.map(application =>
                        changes[application._id]
                            ? { ...application, applicationStatus: changes[application._id] }
                            : application
                    )
                );
                setSortedApplications(prevSortedApplications =>
                    prevSortedApplications.map(application =>
                        changes[application._id]
                            ? { ...application, applicationStatus: changes[application._id] }
                            : application
                    )
                );
                setChanges({});
            }
        } catch (error) {
            console.error('Error updating application statuses:', error);
        }
    };

    const handleDeleteApplication = async (id) => {
        try {
            const response = await axiosInstance.delete(`/club/application/${id}`);
            if (response.status === 200) {
                setApplications(prevApplications => prevApplications.filter(application => application._id !== id));
                setSortedApplications(prevSortedApplications => prevSortedApplications.filter(application => application._id !== id));
            }
        } catch (error) {
            console.error('Error deleting application:', error);
        }
    };

    if (isLoading) {
        return <Loader message="Fetching applications" />;
    }

    return (
        <section className='event-registration-form'>
            <h1>Application Management</h1>
            <div className='application-table-actions'>
                <input
                    type="text"
                    placeholder="Search by Registration Number"
                    value={searchQuery}
                    onChange={handleSearch}
                    className="search-input"
                />
                <button className="export-button" onClick={handleExportToExcel}>Export to Excel</button>
                <button className="application-management-changes" onClick={handleSubmitChanges}>Save changes</button>
            </div>

            {sortedApplications.length > 0 ? (
                <div className='table-container'>
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
                                    </div>
                                </th>
                                <th onClick={() => handleSort('student.email')}>Email</th>
                                {applicationForm && applicationForm.questions && applicationForm.questions.length > 0 ? (
                                    applicationForm.questions.map((question) => (
                                        <th key={question._id} onClick={() => handleSort(`responses.${question._id}`)}>{question.question}</th>
                                    ))
                                ) : (
                                    <th>No Questions</th>
                                )}
                                <th onClick={() => handleSort('applicationStatus')}>Status</th>
                                <th >Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedApplications.map((application) => (
                                <tr key={application._id}>
                                    <td>{application.student.collegeRegistration}</td>
                                    <td>{`${application.student.fname} ${application.student.lname}`}</td>
                                    <td>{application.student.phone}</td>
                                    <td>{application.student.email}</td>
                                    {applicationForm.questions.map((question, index) => {
                                        const response = application.responses.find(r => r.question === question._id);
                                        const answer = response ? (Array.isArray(response.answer) ? response.answer.join(', ') : response.answer) : '-';
                                        return <td key={index}>{answer}</td>;
                                    })}
                                    <td>
                                        <select
                                            value={changes[application._id] || application.applicationStatus}
                                            onChange={(e) => handleStatusChange(application._id, e.target.value)}
                                            className='question-type-select'
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Accepted">Accepted</option>
                                            <option value="Rejected">Rejected</option>
                                        </select>
                                    </td>
                                    <td>
                                        <button onClick={() => handleDeleteApplication(application._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>No applications found.</p>
            )}
        </section>
    );
}

export default ApplicationManagement;
