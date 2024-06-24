import { useState, useRef, useEffect } from 'react';
import './createevent.css';
import axiosInstance from '../../axiosinstance';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import UnderlineIcon from '../../assets/Underline.svg'
import BoldIcon from '../../assets/Bold.svg'
import Italics from '../../assets/Italics.svg'
import OL from '../../assets/OL.svg'
import UL from '../../assets/UL.svg'
import Quote from '../../assets/Quote.svg'
import HorizontalRule from '../../assets/HorizontalRule.svg'
import LineBreak from '../../assets/LineBreak.svg'
import Undo from '../../assets/Undo.svg'
import Redo from '../../assets/Redo.svg'
import { useNavigate } from 'react-router-dom';

import StarterKit from '@tiptap/starter-kit';
import Text from '@tiptap/extension-text'
import TextStyle from '@tiptap/extension-text-style'
import { Underline } from '@tiptap/extension-underline';
import { useEditor, EditorContent } from '@tiptap/react';
import { Color } from '@tiptap/extension-color'

const extensions = [
    StarterKit,
    Underline,
    Text,
    TextStyle,
    Color
];

function CreateEvent() {
    const [eventDetails, setEventDetails] = useState({
        eventTitle: '',
        participation: 'individual',
        registrationDeadline: dayjs().toISOString(),
        coverDescription: '',
        teamSize: '',
        eventDescription: '',
        rounds: [],
        prizes: [],
        registrationFees: 'Free',
        organizers: [{ name: '', phoneNumber: '' }]
    });

    const navigate = useNavigate()

    const [isPaid, setIsPaid] = useState(false)

    const [newPrize, setNewPrize] = useState({
        positionName: '',
        trophy: false,
        certificate: false,
        cashPrize: false,
        cashPrizeAmt: '',
    });

    const [registrationDate, setRegistrationDate] = useState(dayjs());
    const [registrationTime, setRegistrationTime] = useState(dayjs().set('hour', 12).set('minute', 0));
    const [coverWordCount, setCoverWordCount] = useState(0);
    const maxWords = 130;

    const editor = useEditor({
        extensions,
        content: eventDetails.eventDescription,
        onUpdate: ({ editor }) => {
            setEventDetails(prevDetails => ({
                ...prevDetails,
                eventDescription: editor.getHTML(),
            }));
        },
        editorProps: {
            onFocus: (event) => {
                event.preventDefault();
            },
        },
    });

    const textareaRef = useRef(null);

    const countWords = (str) => {
        return str.trim().split(/\s+/).filter(word => word.length > 0).length;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'coverDescription') {
            const words = countWords(value);
            if (words <= maxWords) {
                setEventDetails(prevDetails => ({
                    ...prevDetails,
                    [name]: value,
                }));
                setCoverWordCount(words);
                adjustTextareaHeight();
            }
        } else if (name === 'eventDescription') {
            setEventDetails(prevDetails => ({
                ...prevDetails,
                eventDescription: value,
            }));
        } else {
            setEventDetails(prevDetails => ({
                ...prevDetails,
                [name]: value,
            }));
        }
    };

    const handleParticipationChange = (e) => {
        const { value } = e.target;
        setEventDetails(prevDetails => ({
            ...prevDetails,
            participation: value,
            teamSize: value === 'team' ? prevDetails.teamSize : '',
        }));
    };

    const handleDateChange = (date) => {
        setRegistrationDate(date);
        const updatedDateTime = date.hour(registrationTime.hour()).minute(registrationTime.minute());
        setEventDetails(prevDetails => ({
            ...prevDetails,
            registrationDeadline: updatedDateTime.toISOString(),
        }));
    };

    const handleTimeChange = (time) => {
        setRegistrationTime(time);
        const updatedDateTime = registrationDate.hour(time.hour()).minute(time.minute());
        setEventDetails(prevDetails => ({
            ...prevDetails,
            registrationDeadline: updatedDateTime.toISOString(),
        }));
    };

    const handleRoundChange = (index, field, value) => {
        const updatedRounds = [...eventDetails.rounds];

        if (field === 'startTime' || field === 'endTime') {
            if (value) {
                updatedRounds[index][field] = value.toISOString();
            } else {
                updatedRounds[index][field] = '';
            }
        } else {
            updatedRounds[index][field] = value;
        }

        setEventDetails(prevState => ({
            ...prevState,
            rounds: updatedRounds,
        }));
    };

    const adjustTextareaHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    };

    const addRound = () => {
        const isAnyRoundIncomplete = eventDetails.rounds.some(round => (
            !round.roundName || !round.roundDate || !round.startTime || !round.endTime || !round.roundLocation
        ));

        if (isAnyRoundIncomplete) {
            alert('Please fill out all round details before adding a new round.');
            return;
        }

        setEventDetails(prevState => ({
            ...prevState,
            rounds: [...prevState.rounds, {
                roundName: '',
                roundDate: '',
                startTime: '',
                endTime: '',
                roundLocation: '',
            }],
        }));
    };

    const deleteRound = (index) => {
        const updatedRounds = [...eventDetails.rounds];
        updatedRounds.splice(index, 1);
        setEventDetails(prevState => ({
            ...prevState,
            rounds: updatedRounds,
        }));
    };

    const handlePrizeInputChange = (index, field, value) => {
        const updatedPrizes = [...eventDetails.prizes];
        updatedPrizes[index][field] = value;
        setEventDetails(prevDetails => ({
            ...prevDetails,
            prizes: updatedPrizes,
        }));
    };

    const addPrize = () => {
        const isAnyPrizeIncomplete = eventDetails.prizes.some(prize => (
            (prize.cashPrize && !prize.cashPrizeAmt)
        ));

        if (isAnyPrizeIncomplete) {
            alert('Please fill out all round details before adding a new round.');
            return;
        }

        setEventDetails(prevDetails => ({
            ...prevDetails,
            prizes: [...prevDetails.prizes, { ...newPrize }],
        }));

        setNewPrize({
            positionName: '',
            trophy: false,
            certificate: false,
            cashPrize: false,
            cashPrizeAmt: '',
        });
    };

    const deletePrize = (index) => {
        const updatedPrizes = [...eventDetails.prizes]
        updatedPrizes.splice(index, 1)
        setEventDetails(prevDetails => ({
            ...prevDetails,
            prizes: updatedPrizes,
        }))
    }

    const handleOrganizerInputChange = (index, field, value) => {
        const updatedOrganizers = [...eventDetails.organizers];
        updatedOrganizers[index][field] = value;
        setEventDetails(prevDetails => ({
            ...prevDetails,
            organizers: updatedOrganizers,
        }));
    };

    const addOrganizer = () => {
        setEventDetails(prevDetails => ({
            ...prevDetails,
            organizers: [...prevDetails.organizers, { name: '', phoneNumber: '' }],
        }))
    }

    const deleteOrganizer = (index) => {
        const updatedOrganizers = [...eventDetails.organizers];
        updatedOrganizers.splice(index, 1);
        setEventDetails(prevDetails => ({
            ...prevDetails,
            organizers: updatedOrganizers,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const earliestRoundDate = eventDetails.rounds.reduce((earliestDate, round) => {
            const roundDate = dayjs(round.roundDate);
            if (!earliestDate || roundDate.isBefore(dayjs(earliestDate))) {
                return roundDate.toDate();
            }
            return earliestDate;
        }, null);

        const eventStartDate = earliestRoundDate;

        const submissionData = {
            ...eventDetails,
            participation: eventDetails.participation === 'team' && eventDetails.teamSize
                ? eventDetails.teamSize
                : 'Individual',
            eventStartDate: eventStartDate,
        };

        try {
            const response = await axiosInstance.post('/upcomingevent/createupcomingevent', submissionData);
            console.log('Form Submitted:', response);
            navigate('/')
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleFeeInputChange = (e) => {
        setEventDetails((prevDetails) => ({
            ...prevDetails,
            registrationFees: e.target.value,
        }));
    };

    useEffect(() => {
        adjustTextareaHeight();
    }, []);

    useEffect(() => {
        adjustTextareaHeight();
    }, [eventDetails.coverDescription]);

    if (!editor) return null;

    return (
        <form className='create-event-form' onSubmit={handleSubmit}>
            <input type='submit' value="Save and Publish" className='save-button' />
            <input
                type='text'
                id='eventTitle'
                className='event-title-input'
                placeholder='Enter an event title'
                value={eventDetails.eventTitle}
                name='eventTitle'
                required
                onChange={handleInputChange}
            />
            <div className='participation-type'>
                <label className='form-section-label'>Participation type</label>
                <label className='form-field-label'>
                    <input
                        type="radio"
                        name="participation"
                        value="individual"
                        checked={eventDetails.participation === 'individual'}
                        onChange={handleParticipationChange}
                    />
                    Individual
                </label>
                <label className='form-field-label'>
                    <input
                        type="radio"
                        name="participation"
                        value="team"
                        checked={eventDetails.participation === 'team'}
                        onChange={handleParticipationChange}
                    />
                    Team
                    {eventDetails.participation === 'team' && (
                        <div className='team-size-container'>
                            <label>
                                Team Size:
                                <input
                                    type="text"
                                    name="teamSize"
                                    value={eventDetails.teamSize}
                                    onChange={handleInputChange}
                                    placeholder="e.g. 3-4 members or teams of 2"
                                    className='team-size-input'
                                    required
                                />
                            </label>
                        </div>
                    )}
                </label>
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

            <label className='form-section-label'>
                Cover description
                <div style={{ position: 'relative' }}>
                    <textarea
                        ref={textareaRef}
                        name='coverDescription'
                        value={eventDetails.coverDescription}
                        placeholder='Enter an eyecatching description'
                        onChange={handleInputChange}
                        className='cover-description-textarea'
                    />
                    <div className='word-count'>
                        {coverWordCount} / {maxWords} words
                    </div>
                </div>
            </label>

            <label className='form-section-label'>
                Event description

                <div className='controls-container'>
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
                        <img src={BoldIcon} className='text-editor-icon' />
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
                        <img src={Italics} className='text-editor-icon' />
                    </button>
                    <button type='button'
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        disabled={
                            !editor.can()
                                .chain()
                                .focus()
                                .toggleItalic()
                                .run()
                        }
                        className={editor.isActive('underline') ? 'is-active' : ''}
                    >
                        <img src={UnderlineIcon} className='text-editor-icon' />
                    </button>
                    <button type='button'
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className={editor.isActive('bulletList') ? 'is-active' : ''}
                    >
                        <img src={UL} className='text-editor-icon' />
                    </button>
                    <button type='button'
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        className={editor.isActive('orderedList') ? 'is-active' : ''}
                    >
                        <img src={OL} className='text-editor-icon' />
                    </button>
                    <button type='button'
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        className={editor.isActive('blockquote') ? 'is-active' : ''}
                    >
                        <img src={Quote} className='text-editor-icon' />
                    </button>
                    <button type='button' onClick={() => editor.chain().focus().setHorizontalRule().run()}>
                        <img src={HorizontalRule} className='text-editor-icon' />
                    </button>
                    <button onClick={() => editor.chain().focus().setHardBreak().run()}>
                        <img src={LineBreak} className='text-editor-icon' />
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
                        <img src={Undo} className='text-editor-icon' />
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
                        <img src={Redo} className='text-editor-icon' />
                    </button>
                </div>
                <div className='event-description'>
                    <EditorContent editor={editor} />
                </div>
            </label>

            <label className='form-section-label'>
                Round details
                <div className='new-rounds-container'>
                    {eventDetails.rounds.map((round, index) => (
                        <div key={index} className='event-round-box'>
                            <input
                                type="text"
                                name="roundName"
                                placeholder="Round Name"
                                value={round.roundName}
                                onChange={(e) => handleRoundChange(index, 'roundName', e.target.value)}
                                required
                                className='new-round-name'
                            />
                            <label className='date-time-input'> Round date
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        value={round.roundDate ? dayjs(round.roundDate) : null}
                                        onChange={(date) => handleRoundChange(index, 'roundDate', date ? date.toISOString() : '')}
                                        renderInput={(params) => <TextField {...params} variant="standard" />}
                                        label=""
                                        slotProps={{
                                            textField: {
                                                variant: 'outlined',
                                                className: 'custom-date-time-picker',
                                            },
                                        }}
                                    />
                                </LocalizationProvider>
                            </label>
                            <label className='date-time-input'> Start time
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <TimePicker
                                        value={round.startTime ? dayjs(round.startTime) : null}
                                        onChange={(time) => handleRoundChange(index, 'startTime', time)}
                                        renderInput={(params) => <TextField {...params} variant="standard" />}
                                        label=""
                                        slotProps={{
                                            textField: {
                                                variant: 'outlined',
                                                className: 'custom-date-time-picker',
                                            },
                                        }}
                                    />
                                </LocalizationProvider>
                            </label>
                            <label className='date-time-input'> End time
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <TimePicker
                                        value={round.endTime ? dayjs(round.endTime) : null}
                                        onChange={(time) => handleRoundChange(index, 'endTime', time)}
                                        renderInput={(params) => <TextField {...params} variant="standard" />}
                                        label=""
                                        slotProps={{
                                            textField: {
                                                variant: 'outlined',
                                                className: 'custom-date-time-picker',
                                            },
                                        }}
                                    />
                                </LocalizationProvider>
                            </label>
                            <input
                                type="text"
                                name="roundLocation"
                                placeholder="Round Location"
                                value={round.roundLocation}
                                onChange={(e) => handleRoundChange(index, 'roundLocation', e.target.value)}
                                required
                                className='new-round-location'
                            />
                            <div style={{ marginTop: 20 }}>
                                <button type="button" onClick={(e) => { deleteRound(index), e.preventDefault() }} style={{ backgroundColor: 'orangered' }} className='edit-details'>Delete round</button>
                            </div>
                        </div>
                    ))}
                </div>
                <div style={{ marginTop: 20 }}><button type="button" onClick={addRound} className='edit-details'>Add Round +</button></div>
            </label>

            <label className='form-section-label'>Event prizes
                <div className='new-rounds-container'>
                    {eventDetails.prizes.map((prize, index) => (
                        <div key={index} className='event-round-box'>
                            <input
                                type='text'
                                className='new-round-name'
                                placeholder='Position Name'
                                value={prize.positionName}
                                onChange={(e) => handlePrizeInputChange(index, 'positionName', e.target.value)}
                                required
                            />
                            <label>
                                <input
                                    type='checkbox'
                                    className='prize-option-input'
                                    checked={prize.trophy}
                                    onChange={(e) => handlePrizeInputChange(index, 'trophy', e.target.checked)}
                                />
                                Trophy
                            </label>
                            <label>
                                <input
                                    type='checkbox'
                                    className='prize-option-input'
                                    checked={prize.certificate}
                                    onChange={(e) => handlePrizeInputChange(index, 'certificate', e.target.checked)}
                                />
                                Certificate
                            </label>
                            <label>
                                <input
                                    type='checkbox'
                                    className='prize-option-input'
                                    checked={prize.cashPrize}
                                    onChange={(e) => handlePrizeInputChange(index, 'cashPrize', e.target.checked)}
                                />
                                Cash Prize
                                {prize.cashPrize && (
                                    <input
                                        type='text'
                                        className='cash-prize-amt-input'
                                        placeholder='Amount'
                                        value={prize.cashPrizeAmt}
                                        onChange={(e) => handlePrizeInputChange(index, 'cashPrizeAmt', e.target.value)}
                                        required
                                    />
                                )}
                            </label>
                            <div style={{ marginTop: 20 }}><button type='button' className='edit-details' style={{ backgroundColor: 'orangered' }} onClick={(e) => { deletePrize(index), e.preventDefault() }}>Delete</button></div>
                        </div>
                    ))}
                </div>
                <div style={{ marginTop: 20 }}><button type='button' onClick={addPrize} className='edit-details '>Add Prize +</button></div>
            </label>

            <label className='form-section-label'>Organizer contact information
                <div className='new-rounds-container'>
                    {eventDetails.organizers.map((organizer, index) => (
                        <div key={index} className='event-round-box'>
                            <input
                                type='text'
                                placeholder='Organizer name'
                                id={`name`}
                                name={`name`}
                                value={organizer.name}
                                onChange={(e) => handleOrganizerInputChange(index, 'name', e.target.value)}
                                className='new-round-name'
                            />
                            <input
                                type='text'
                                id={`phoneNumber`}
                                placeholder='Organizer contact'
                                name={`phoneNumber`}
                                value={organizer.phoneNumber}
                                onChange={(e) => handleOrganizerInputChange(index, 'phoneNumber', e.target.value)}
                                className='cash-prize-amt-input'
                                style={{margin: 0}}
                            />
                            <button type='button' onClick={() => deleteOrganizer(index)} className='edit-details' style={{ backgroundColor: 'orangered' }}>
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
                <button type='button' onClick={addOrganizer} className='edit-details'>
                    Add Organizer
                </button>
            </label>

            <div className='participation-type'>
                <label className='form-section-label'>Registration Fees</label>
                <label className='form-field-label'>
                    <input
                        type='radio'
                        name='registrationFees'
                        value='Free'
                        checked={!isPaid}
                        onChange={() => {
                            setIsPaid(false), setEventDetails((prevDetails) => ({
                                ...prevDetails,
                                registrationFees: 'Free',
                            }));
                        }}
                    />
                    Free
                </label>
                <label className='form-field-label'>
                    <input
                        type='radio'
                        name='registrationFees'
                        value='Paid'
                        checked={isPaid}
                        onChange={() => {
                            setIsPaid(true),
                                setEventDetails((prevDetails) => ({
                                    ...prevDetails,
                                    registrationFees: '',
                                }));
                        }}
                    />
                    Paid
                    {isPaid && (
                        <input
                            type='text'
                            className='cash-prize-amt-input'
                            name='registrationFeesAmount'
                            placeholder='Enter fee amount'
                            value={eventDetails.registrationFees}
                            onChange={handleFeeInputChange}
                            required
                        />
                    )}
                </label>
            </div>
        </form >
    );
}

export default CreateEvent;