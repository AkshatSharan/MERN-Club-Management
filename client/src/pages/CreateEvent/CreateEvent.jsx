import { useState, useRef, useEffect } from 'react';
import './createevent.css';
import axiosInstance from '../../axiosinstance';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Text from '@tiptap/extension-text'
import TextStyle from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import { Underline } from '@tiptap/extension-underline';
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
        eventDescription: '', // Added eventDescription to state
    });

    const [participationType, setParticipationType] = useState('individual');
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
            // Handle eventDescription change
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const submissionData = {
            ...eventDetails,
            participation: eventDetails.participation === 'team' && eventDetails.teamSize
                ? eventDetails.teamSize
                : 'Individual',
        };
        try {
            await axiosInstance.post('/events', submissionData);
            console.log('Form Submitted:', submissionData);
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const adjustTextareaHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    };

    useEffect(() => {
        adjustTextareaHeight();
    }, []);

    useEffect(() => {
        adjustTextareaHeight();
    }, [eventDetails.coverDescription]);

    if (!editor) return null;

    // console.log(eventDetails.eventDescription)

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
                    <button
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
                    <button
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
                    <button
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
                    <button
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className={editor.isActive('bulletList') ? 'is-active' : ''}
                    >
                        <img src={UL} className='text-editor-icon' />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        className={editor.isActive('orderedList') ? 'is-active' : ''}
                    >
                        <img src={OL} className='text-editor-icon' />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        className={editor.isActive('blockquote') ? 'is-active' : ''}
                    >
                        <img src={Quote} className='text-editor-icon' />
                    </button>
                    <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
                        <img src={HorizontalRule} className='text-editor-icon' />
                    </button>
                    <button onClick={() => editor.chain().focus().setHardBreak().run()}>
                        <img src={LineBreak} className='text-editor-icon' />
                    </button>
                    <button
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
                    <button
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
                Event details
            </label>
        </form>
    );
}

export default CreateEvent;
