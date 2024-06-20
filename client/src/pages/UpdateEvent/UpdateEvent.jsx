import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { DatePicker, TimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import axiosInstance from '../../axiosinstance';
import StarterKit from '@tiptap/starter-kit';
import Text from '@tiptap/extension-text';
import TextStyle from '@tiptap/extension-text-style';
import { Underline } from '@tiptap/extension-underline';
import { useEditor, EditorContent } from '@tiptap/react';
import { Color } from '@tiptap/extension-color';
import UnderlineIcon from '../../assets/Underline.svg';
import BoldIcon from '../../assets/Bold.svg';
import Italics from '../../assets/Italics.svg';
import OL from '../../assets/OL.svg';
import UL from '../../assets/UL.svg';
import Quote from '../../assets/Quote.svg';
import HorizontalRule from '../../assets/HorizontalRule.svg';
import LineBreak from '../../assets/LineBreak.svg';
import Undo from '../../assets/Undo.svg';
import Redo from '../../assets/Redo.svg';

const extensions = [
    StarterKit,
    Underline,
    Text,
    TextStyle,
    Color
];

const UpdateEvent = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();

    const [eventDetails, setEventDetails] = useState({
        eventTitle: '',
        participation: 'Individual',
        coverDescription: '',
        eventDescription: '',
        rounds: [],
        prizes: [],
        registrationFees: '',
    });

    const [newPrize, setNewPrize] = useState({
        positionName: '',
        trophy: false,
        certificate: false,
        cashPrize: false,
        cashPrizeAmt: '',
    });

    const [registrationDate, setRegistrationDate] = useState(dayjs());
    const [registrationTime, setRegistrationTime] = useState(dayjs());
    const [loading, setLoading] = useState(false);
    const [isDataLoaded, setDataLoaded] = useState(false);

    const editor = useEditor({
        extensions,
        content: eventDetails?.eventDescription || '',
        onUpdate: ({ editor }) => {
            if (eventDetails) {
                setEventDetails(prevDetails => ({
                    ...prevDetails,
                    eventDescription: editor.getHTML(),
                }));
            }
        },
        editorProps: {
            onFocus: (event) => {
                event.preventDefault();
            },
        },
    }, [isDataLoaded]);

    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                if (eventId) {
                    const response = await axiosInstance.get(`/upcomingevent/event/${eventId}`);
                    const eventData = response.data;
                    setEventDetails({
                        eventTitle: eventData.eventTitle,
                        teamSize: eventData.participation,
                        participation: eventData.participation,
                        coverDescription: eventData.coverDescription,
                        eventDescription: eventData.eventDescription,
                        rounds: eventData.rounds,
                        prizes: eventData.prizes,
                        registrationFees: eventData.registrationFees,
                    });
                    setRegistrationDate(dayjs(eventData.registrationDeadline));
                    setRegistrationTime(dayjs(eventData.registrationDeadline));
                    setDataLoaded(true)
                }
            } catch (error) {
                console.error('Error fetching event details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEventDetails();
    }, [eventId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEventDetails(prevState => ({
            ...prevState,
            [name]: name === 'participation' ? value : value.trim(),
        }));
    };

    const handleParticipationChange = (e) => {
        const { value } = e.target;
        if (value === 'Individual') {
            setEventDetails({ ...eventDetails, participation: 'Individual' });
        } else {
            setEventDetails({ ...eventDetails, participation: value });
        }
    };

    const handleDateChange = (date) => {
        setRegistrationDate(date);
    };

    const handleTimeChange = (time) => {
        setRegistrationTime(time);
    };

    const handleRoundChange = (index, key, value) => {
        const updatedRounds = [...eventDetails.rounds];
        updatedRounds[index][key] = value;
        setEventDetails({ ...eventDetails, rounds: updatedRounds });
    };

    const handlePrizeChange = (index, key, value) => {
        const updatedPrizes = [...eventDetails.prizes];
        updatedPrizes[index][key] = value;
        setEventDetails({ ...eventDetails, prizes: updatedPrizes });
    };

    const handleCashPrizeChange = (e) => {
        const { checked } = e.target;
        setNewPrize({ ...newPrize, cashPrize: checked, cashPrizeAmt: checked ? newPrize.cashPrizeAmt : '' });
    };

    const addRound = () => {
        setEventDetails({ ...eventDetails, rounds: [...eventDetails.rounds, { roundName: '', roundDate: '', startTime: '', endTime: '', roundLocation: '' }] });
    };

    const removeRound = (index) => {
        const updatedRounds = eventDetails.rounds.filter((_, i) => i !== index);
        setEventDetails({ ...eventDetails, rounds: updatedRounds });
    };

    const addPrize = () => {
        setEventDetails({ ...eventDetails, prizes: [...eventDetails.prizes, newPrize] });
        setNewPrize({ positionName: '', trophy: false, certificate: false, cashPrize: false, cashPrizeAmt: '' });
    };

    const removePrize = (index) => {
        const updatedPrizes = eventDetails.prizes.filter((_, i) => i !== index);
        setEventDetails({ ...eventDetails, prizes: updatedPrizes });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const registrationDeadline = dayjs(registrationDate).hour(dayjs(registrationTime).hour()).minute(dayjs(registrationTime).minute());

        const submissionData = {
            ...eventDetails,
            participation: eventDetails.participation === 'Team' && eventDetails.teamSize
                ? eventDetails.teamSize
                : 'Individual',
            registrationDeadline,
        };

        try {
            let response;
            if (eventId) {
                response = await axiosInstance.put(`/upcomingevent/update-event/${eventId}`, submissionData);
            } else {
                response = await axiosInstance.post('/upcomingevent/create', submissionData);
            }

            navigate('/');
        } catch (error) {
            console.error('Error submitting event:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="create-event-form">
            <form onSubmit={handleSubmit} className='create-event-form'>
                <input
                    type="text"
                    name="eventTitle"
                    value={eventDetails.eventTitle}
                    onChange={handleInputChange}
                    required
                    className="event-title-input"
                />

                <div className='participation-type'>
                    <label className="form-section-label">Participation</label>
                    <div className="participation-type">
                        <label className='form-field-label'>
                            <input
                                type="radio"
                                id="Individual"
                                name="participation"
                                value="Individual"
                                checked={eventDetails.participation === 'Individual'}
                                onChange={handleParticipationChange}
                            />
                            Individual</label>
                        <label className='form-field-label'>
                            <input
                                type="radio"
                                id="Team"
                                name="participation"
                                value="Team"
                                checked={eventDetails.participation !== 'Individual'}
                                onChange={handleParticipationChange}
                            />
                            Team
                            {eventDetails.participation !== 'Individual' && (
                                <div className="team-size-container ">
                                    <label>
                                        Team Size:
                                        <input
                                            type="text"
                                            name="teamSize"
                                            value={eventDetails.teamSize}
                                            onChange={handleInputChange}
                                            required
                                            className="team-size-input"
                                        />
                                    </label>
                                </div>
                            )}
                        </label>
                    </div>
                </div>

                <label className='form-section-label'>Registration deadline
                    <div className='registration-date-time-container'>
                        <label className='date-time-input'>Date:
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label=""
                                    value={registrationDate}
                                    onChange={handleDateChange}
                                    slotProps={{
                                        textField: {
                                            variant: 'outlined',
                                            className: 'custom-date-time-picker',
                                        },
                                    }}
                                />
                            </LocalizationProvider>
                        </label>
                        <label className='date-time-input'>Time:
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <TimePicker
                                    label=""
                                    value={registrationTime}
                                    onChange={handleTimeChange}
                                    slotProps={{
                                        textField: {
                                            variant: 'outlined',
                                            className: 'custom-date-time-picker',
                                        },
                                    }}
                                />
                            </LocalizationProvider>
                        </label>
                    </div>
                </label>

                <label className="form-section-label">Cover Description
                    <div>
                        <textarea
                            name="coverDescription"
                            value={eventDetails.coverDescription}
                            onChange={handleInputChange}
                            required
                            className="cover-description-textarea"
                        />
                        <div className="word-count">Word count: {eventDetails.coverDescription.trim().split(/\s+/).length}</div>
                    </div>
                </label>

                <label className="form-section-label">Event Description
                    <div className='controls-container'>
                        {editor && (
                            <>
                                <button type='button'
                                    onClick={() => editor.chain().focus().toggleBold().run()}
                                    disabled={
                                        !editor.can()
                                            .chain()
                                            .focus()
                                            .toggleBold()
                                            .run()
                                    }
                                    className={editor.isActive('bold') ? 'is-active' : ''}
                                >
                                    <img src={BoldIcon} className='text-editor-icon' alt="Bold" />
                                </button>
                                <button type='button'
                                    onClick={() => editor.chain().focus().toggleItalic().run()}
                                    disabled={
                                        !editor.can()
                                            .chain()
                                            .focus()
                                            .toggleItalic()
                                            .run()
                                    }
                                    className={editor.isActive('italic') ? 'is-active' : ''}
                                >
                                    <img src={Italics} className='text-editor-icon' alt="Italic" />
                                </button>
                                <button type='button'
                                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                                    disabled={
                                        !editor.can()
                                            .chain()
                                            .focus()
                                            .toggleUnderline()
                                            .run()
                                    }
                                    className={editor.isActive('underline') ? 'is-active' : ''}
                                >
                                    <img src={UnderlineIcon} className='text-editor-icon' alt="Underline" />
                                </button>
                                <button type='button'
                                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                                    className={editor.isActive('bulletList') ? 'is-active' : ''}
                                >
                                    <img src={UL} className='text-editor-icon' alt="Bullet List" />
                                </button>
                                <button type='button'
                                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                                    className={editor.isActive('orderedList') ? 'is-active' : ''}
                                >
                                    <img src={OL} className='text-editor-icon' alt="Ordered List" />
                                </button>
                                <button type='button'
                                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                                    className={editor.isActive('blockquote') ? 'is-active' : ''}
                                >
                                    <img src={Quote} className='text-editor-icon' alt="Blockquote" />
                                </button>
                                <button type='button' onClick={() => editor.chain().focus().setHorizontalRule().run()}>
                                    <img src={HorizontalRule} className='text-editor-icon' alt="Horizontal Rule" />
                                </button>
                                <button onClick={() => editor.chain().focus().setHardBreak().run()}>
                                    <img src={LineBreak} className='text-editor-icon' alt="Line Break" />
                                </button>
                                <button type='button'
                                    onClick={() => editor.chain().focus().undo().run()}
                                    disabled={
                                        !editor.can()
                                            .chain()
                                            .focus()
                                            .undo()
                                            .run()
                                    }
                                >
                                    <img src={Undo} className='text-editor-icon' alt="Undo" />
                                </button>
                                <button type='button'
                                    onClick={() => editor.chain().focus().redo().run()}
                                    disabled={
                                        !editor.can()
                                            .chain()
                                            .focus()
                                            .redo()
                                            .run()
                                    }
                                >
                                    <img src={Redo} className='text-editor-icon' alt="Redo" />
                                </button>
                            </>
                        )}
                    </div>
                    <div className='event-description'>
                        {editor && <EditorContent editor={editor} />}
                    </div>
                </label>

                <div className="createeventinput">
                    <label className="form-field-label">Registration Fees</label>
                    <input
                        type="text"
                        name="registrationFees"
                        value={eventDetails.registrationFees}
                        onChange={handleInputChange}
                        className="registration-fees-input"
                    />
                </div>

                <h3 className="form-section-label">Rounds</h3>
                {eventDetails.rounds.map((round, index) => (
                    <div key={index} className="event-round-box">
                        <span className="new-round-name">Round {index + 1}</span>
                        <input
                            type="text"
                            value={round.roundName}
                            onChange={(e) => handleRoundChange(index, 'roundName', e.target.value)}
                            required
                            className="new-round-location"
                        />
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                value={dayjs(round.roundDate)}
                                onChange={(date) => handleRoundChange(index, 'roundDate', date)}
                                className="custom-date-time-picker"
                            />
                            <TimePicker
                                value={dayjs(round.startTime)}
                                onChange={(time) => handleRoundChange(index, 'startTime', time)}
                                className="custom-date-time-picker"
                            />
                            <TimePicker
                                value={dayjs(round.endTime)}
                                onChange={(time) => handleRoundChange(index, 'endTime', time)}
                                className="custom-date-time-picker"
                            />
                        </LocalizationProvider>
                        <input
                            type="text"
                            value={round.roundLocation}
                            onChange={(e) => handleRoundChange(index, 'roundLocation', e.target.value)}
                            required
                            className="new-round-location"
                        />
                        <button type="button" onClick={() => removeRound(index)} className="controls-container">
                            Remove Round
                        </button>
                    </div>
                ))}
                <button type="button" onClick={addRound} className="controls-container">
                    Add Round
                </button>

                <h3 className="form-section-label">Prizes</h3>
                {eventDetails.prizes.map((prize, index) => (
                    <div key={index} className="event-prize-box">
                        <span className="new-round-name">Prize {index + 1}</span>
                        <input
                            type="text"
                            value={prize.positionName}
                            onChange={(e) => handlePrizeChange(index, 'positionName', e.target.value)}
                            required
                            className="new-round-location"
                        />
                        <label>
                            <input
                                type="checkbox"
                                checked={prize.trophy}
                                onChange={(e) => handlePrizeChange(index, 'trophy', e.target.checked)}
                            />
                            Trophy
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={prize.certificate}
                                onChange={(e) => handlePrizeChange(index, 'certificate', e.target.checked)}
                            />
                            Certificate
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={prize.cashPrize}
                                onChange={(e) => handlePrizeChange(index, 'cashPrize', e.target.checked)}
                            />
                            Cash Prize
                        </label>
                        {prize.cashPrize && (
                            <input
                                type="text"
                                value={prize.cashPrizeAmt}
                                onChange={(e) => handlePrizeChange(index, 'cashPrizeAmt', e.target.value)}
                                required
                                className="cash-prize-amt-input"
                            />
                        )}
                        <button type="button" onClick={() => removePrize(index)} className="controls-container">
                            Remove Prize
                        </button>
                    </div>
                ))}
                <div className="createeventinput">
                    <span className="form-field-label">Position Name</span>
                    <input
                        type="text"
                        value={newPrize.positionName}
                        onChange={(e) => setNewPrize({ ...newPrize, positionName: e.target.value })}
                        className="new-round-location"
                    />
                    <label>
                        <input
                            type="checkbox"
                            checked={newPrize.trophy}
                            onChange={(e) => setNewPrize({ ...newPrize, trophy: e.target.checked })}
                        />
                        Trophy
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={newPrize.certificate}
                            onChange={(e) => setNewPrize({ ...newPrize, certificate: e.target.checked })}
                        />
                        Certificate
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={newPrize.cashPrize}
                            onChange={handleCashPrizeChange}
                        />
                        Cash Prize
                    </label>
                    {newPrize.cashPrize && (
                        <input
                            type="text"
                            value={newPrize.cashPrizeAmt}
                            onChange={(e) => setNewPrize({ ...newPrize, cashPrizeAmt: e.target.value })}
                            required
                            className="cash-prize-amt-input"
                        />
                    )}
                    <button type="button" onClick={addPrize} className="controls-container">
                        Add Prize
                    </button>
                </div>
                <button type="submit" className="save-button">{eventId ? 'Save' : 'Create Event'}</button>
            </form>
        </div >
    );
};

export default UpdateEvent;
