import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../axiosinstance";
import Loader from "../../components/Loader/Loader";
import { Switch } from '@mui/material';
import { useTable, useSortBy, useGlobalFilter, usePagination } from 'react-table';
import './eventmanagement.css';
import SortUpDown from '../../assets/SortUpDown.svg';
import SortUp from '../../assets/SortUp.svg';
import SortDown from '../../assets/SortDown.svg';
import * as XLSX from 'xlsx'; // Import all functions from xlsx library

function EventManagement() {
    const { eventId } = useParams();
    const [event, setEvent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [registrationsOpen, setRegistrationsOpen] = useState(null);
    const [registrationsData, setRegistrationsData] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [pageSize, setPageSize] = useState(30);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const eventResponse = await axiosInstance.get(`/upcomingevent/event-management/${eventId}`);
                setEvent(eventResponse.data);
                setRegistrationsOpen(eventResponse.data.registrationsOpen);
                setRegistrationsData(eventResponse.data.registrations);
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
    };

    const handleExportToExcel = () => {
        try {
            const workbook = XLSX.utils.book_new();
            const sheetData = [];

            // Adding header row
            const headers = [];
            headerGroups.forEach(headerGroup => {
                headerGroup.headers.forEach(column => {
                    headers.push(column.Header);
                });
            });
            sheetData.push(headers);

            // Adding data rows
            page.forEach(row => {
                const rowData = [];
                row.cells.forEach(cell => {
                    if (cell.column.id === 'attended') {

                        const selectElement = document.createElement('select');
                        selectElement.innerHTML = cell.render('Cell');
                        console.log(selectElement.value)
                        rowData.push(selectElement.value);
                    } else if (typeof cell.value === 'object') {
                        // If cell.value is an object, stringify it or format as needed
                        rowData.push(JSON.stringify(cell.value)); // Example: JSON.stringify(cell.value)
                    } else {
                        rowData.push(cell.value); // Assuming cell.value is a string or number
                    }
                });
                sheetData.push(rowData);
            });

            const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Registrations');
            XLSX.writeFile(workbook, 'registrations.xlsx');
        } catch (error) {
            console.error('Error exporting to Excel:', error);
        }
    };

    const handelEditFormClick = () => {
        navigate(`/registration-form/${eventId}`);
    };

    const data = useMemo(() => registrationsData.map(registration => ({
        ...registration,
        collegeRegistration: registration.student.collegeRegistration,
        attended: registration.attended,
        phone: registration.student.phone,
    })), [registrationsData]);

    const columns = useMemo(() => [
        {
            Header: 'Registration',
            accessor: 'collegeRegistration',
            canSort: true,
        },
        {
            Header: 'Name',
            accessor: row => `${row.student.fname} ${row.student.lname}`,
            canSort: true,
        },
        {
            Header: 'Phone',
            accessor: 'phone',
            canSort: true,
        },
        ...(event?.registrationForm?.flatMap(form =>
            form.questions.map(question => ({
                Header: question.question,
                accessor: row => {
                    const response = row.responses.find(response => response.question === question._id);
                    return response ? response.answer : '-';
                },
                canSort: true,
            }))
        ) || []),
        {
            Header: 'Attended',
            accessor: 'attended',
            Cell: ({ value }) => (
                <select defaultValue={value || '-'} className="question-type-select">
                    <option value="" disabled>Select</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                </select>
            ),
            canSort: true,
        },
    ], [event]);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
        state: { pageIndex, pageCount, canPreviousPage, canNextPage },
        setGlobalFilter: setTableGlobalFilter,
        nextPage,
        previousPage,
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0, pageSize },
        },
        useGlobalFilter,
        useSortBy,
        usePagination
    );

    useEffect(() => {
        setTableGlobalFilter(globalFilter);
    }, [globalFilter, setTableGlobalFilter]);

    if (isLoading) {
        return <Loader message='Fetching event' />;
    }

    if (!event || !event.registrationForm || !event.registrationForm.length) {
        return <p>No registration form questions found.</p>;
    }

    return (
        <div>
            <h1><u>{event.eventTitle}</u></h1>
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
                <div className="table-container">
                    <input
                        type="text"
                        placeholder="Search registrations..."
                        value={globalFilter}
                        onChange={e => setGlobalFilter(e.target.value)}
                    />
                    <table className="registration-table" {...getTableProps()}>
                        <thead>
                            {headerGroups.map(headerGroup => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map(column => (
                                        <th key={column.id} {...column.getHeaderProps(column.getSortByToggleProps())}>
                                            <div className="header-items">
                                                {column.render('Header')}
                                                {column.isSorted
                                                    ? column.isSortedDesc
                                                        ? <img src={SortDown} alt="Sort Descending" className="sorting-icon" />
                                                        : <img src={SortUp} alt="Sort Ascending" className="sorting-icon" />
                                                    : <img src={SortUpDown} alt="Sort Descending" className="sorting-icon" />}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody {...getTableBodyProps()}>
                            {page.map(row => {
                                prepareRow(row);
                                return (
                                    <tr key={row.id} {...row.getRowProps()}>
                                        {row.cells.map(cell => {
                                            return (
                                                <td key={cell.id} {...cell.getCellProps()}>
                                                    {cell.render('Cell')}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    <div className="pagination">
                        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                            Previous
                        </button>
                        <span>
                            Page{' '}
                            <strong>
                                {pageIndex + 1} of {Math.ceil(data.length / pageSize)}
                            </strong>{' '}
                        </span>
                        <button onClick={() => nextPage()} disabled={!canNextPage}>
                            Next
                        </button>
                    </div>

                    <button onClick={handleExportToExcel}>Export as Excel</button>
                </div>
            </section>
        </div>
    );

}

export default EventManagement;
