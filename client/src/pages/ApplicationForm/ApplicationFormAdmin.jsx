import React, { useEffect, useRef, useState } from 'react';
import axiosInstance from '../../axiosinstance';
import { useNavigate, useParams } from 'react-router-dom';
import Trashcan from '../../assets/Trashcan.svg';
import { DatePicker, TimePicker, DateTimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

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

function ApplicationFormAdmin() {
    const { clubId } = useParams();
    const navigate = useNavigate();
    const [newOption, setNewOption] = useState('');

    const [formTitle, setFormTitle] = useState('');
    const [formId, setFormId] = useState(null)
    const [formDescription, setFormDescription] = useState('');
    const [questions, setQuestions] = useState([]);
    const [applicationDeadline, setApplicationDeadline] = useState(null);
    const [newQuestion, setNewQuestion] = useState({
        type: 'text',
        question: '',
        options: []
    });
    const [editIndex, setEditIndex] = useState(-1);
    const [formExists, setFormExists] = useState(false);

    const textareaRef = useRef(null);

    useEffect(() => {
        const fetchFormData = async () => {
            try {
                const response = await axiosInstance.get(`/club/application/get-application-admin/${clubId}`);
                if (response.data.length > 0) {
                    const { formTitle, formDescription, questions, _id } = response.data[0];
                    setFormTitle(formTitle);
                    setFormDescription(formDescription);
                    setQuestions(questions);
                    setFormId(_id)
                    setFormExists(true);
                } else {
                    setFormTitle('');
                    setFormDescription('');
                    setQuestions([]);
                    setFormExists(false);
                }
            } catch (error) {
                console.error('Error fetching form data:', error);
            }
        };

        if (clubId) {
            fetchFormData();
        }
    }, [clubId]);

    const addQuestion = () => {
        if (newQuestion.question.trim() !== '') {
            if (['radio', 'checkbox', 'select'].includes(newQuestion.type) && newQuestion.options.length === 0) {
                alert('Please enter at least one option for the question.');
                return;
            }
            setQuestions(prevQuestions => [
                ...prevQuestions,
                { ...newQuestion }
            ]);
            resetNewQuestion();
        } else {
            alert('Please enter a question.');
        }
    };

    const updateQuestion = () => {
        if (newQuestion.question.trim() !== '') {
            if (['radio', 'checkbox', 'select', 'textarea'].includes(newQuestion.type) && newQuestion.options.length === 0) {
                alert('Please enter at least one option for the question.');
                return;
            }
            const updatedQuestions = [...questions];
            updatedQuestions[editIndex] = { ...newQuestion };
            setQuestions(updatedQuestions);
            resetNewQuestion();
            setEditIndex(-1);
        } else {
            alert('Please enter a question.');
        }
    };

    const deleteQuestion = (index) => {
        const updatedQuestions = [...questions];
        updatedQuestions.splice(index, 1);
        setQuestions(updatedQuestions);
        if (editIndex === index) {
            setEditIndex(-1);
        }
    };

    const editQuestion = (index) => {
        setEditIndex(index);
        setNewQuestion({ ...questions[index] });
    };

    const handleSubmitForm = async (e) => {
        e.preventDefault();
        try {
            if (!formTitle.trim()) {
                alert('Please enter a form title');
                return;
            }

            const formatISODate = (date) => {
                const isoString = date.toISOString();
                const formattedString = isoString.replace('Z', '+00:00');
                return formattedString;
            };

            const formattedDeadline = applicationDeadline ? formatISODate(applicationDeadline) : null;

            const formData = { formTitle, questions, formDescription, applicationDeadline: formattedDeadline };

            let response;
            if (!formId) {
                response = await axiosInstance.post(`/club/application/create-application/${clubId}`, formData);
                console.log('Form created successfully:', response.data);
                setFormExists(true);
            } else {
                response = await axiosInstance.put(`/club/application/update-application/${formId}`, formData);
                console.log('Form updated successfully:', response.data);
            }

            resetForm();
            navigate('/');
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Error submitting form. Please try again.');
        }
    };

    // console.log(formId)

    const resetForm = () => {
        setFormTitle('');
        setFormDescription('');
        setQuestions([]);
        resetNewQuestion();
        setEditIndex(-1);
    };

    const editor = useEditor({
        extensions,
        content: formDescription || '',
        onUpdate: ({ editor }) => {
            setFormDescription(editor.getHTML());
        }
    }, [formExists]);

    const resetNewQuestion = () => {
        setNewQuestion({
            type: 'text',
            question: '',
            options: []
        });
    };

    const handleAddOption = () => {
        if (newQuestion.options.length < 4) {
            if (newOption.trim() !== '') {
                setNewQuestion(prev => ({
                    ...prev,
                    options: [...prev.options, newOption.trim()]
                }));
                setNewOption('');
            } else {
                alert('Please enter an option.');
            }
        } else {
            alert('You can only add up to 4 options.');
        }
    };

    const handleOptionInputChange = (e, index) => {
        const updatedOptions = [...newQuestion.options];
        updatedOptions[index] = e.target.value;
        setNewQuestion(prev => ({
            ...prev,
            options: updatedOptions
        }));
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
    }, [formDescription]);

    const handleInputKeyDown = (e) => {
        if (e.key === 'Enter' && e.target.tagName === 'INPUT' && e.target.type === 'text') {
            e.preventDefault();
        }
    };

    console.log(applicationDeadline)

    return (
        <div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                    label="Application Deadline"
                    value={applicationDeadline}
                    onChange={(newValue) => setApplicationDeadline(newValue)}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                />
            </LocalizationProvider>
            <form onSubmit={handleSubmitForm} className='create-event-form'>
                <input
                    type="text"
                    id="formTitle"
                    value={formTitle}
                    placeholder='Form title'
                    onChange={(e) => setFormTitle(e.target.value)}
                    className='form-title'
                    onKeyDown={handleInputKeyDown}
                    required
                />

                <label className='form-section-label'>Form description
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

                {questions.map((question, index) => {
                    let type;
                    switch (question.type) {
                        case 'text':
                            type = 'Short answer';
                            break;
                        case 'textarea':
                            type = 'Long answer';
                            break;
                        case 'checkbox':
                            type = 'Checkbox';
                            break;
                        case 'radio':
                            type = 'Multiple choice';
                            break;
                        case 'select':
                            type = 'Dropdown';
                            break;
                        default:
                            type = '';
                    }

                    return (
                        <div key={index} className="add-question-section">
                            <div className='question-type'>{type}</div>
                            <div className='set-question'>{`Q)`} {question.question}</div>
                            {['radio', 'checkbox', 'select'].includes(question.type) && (
                                <div>
                                    Options:
                                    {question.options.map((option, optionIndex) => (
                                        <input
                                            key={optionIndex}
                                            type="text"
                                            value={option}
                                            onChange={(e) => handleOptionInputChange(e, optionIndex)}
                                            onKeyDown={handleInputKeyDown}
                                            className='option-input'
                                        />
                                    ))}
                                </div>
                            )}
                            <div className='question-actions'>
                                <button type="button" className='edit-question' onClick={() => editQuestion(index)}>Edit Question</button>
                                <button type="button" onClick={() => deleteQuestion(index)}><img className='delete-question' src={Trashcan} alt="Delete" /> </button>
                            </div>
                        </div>
                    );
                })}

                <div className='add-question-section'>
                    <select
                        value={newQuestion.type}
                        onChange={(e) => setNewQuestion({ ...newQuestion, type: e.target.value })}
                        className='question-type-select'
                    >
                        <option value="text">Short answer</option>
                        <option value="textarea">Long answer</option>
                        <option value="radio">Multiple choice</option>
                        <option value="checkbox">Checkbox</option>
                        <option value="select">Dropdown</option>
                    </select>
                    <input
                        type="text"
                        value={newQuestion.question}
                        placeholder="Enter Question"
                        onKeyDown={handleInputKeyDown}
                        onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                        className='question-input'
                    />
                    {(newQuestion.type === 'radio' || newQuestion.type === 'checkbox' || newQuestion.type === 'select') && (
                        <>
                            <div>
                                {newQuestion.options.map((option, idx) => (
                                    <input
                                        key={idx}
                                        type="text"
                                        value={option}
                                        onChange={(e) => handleOptionInputChange(e, idx)}
                                        onKeyDown={handleInputKeyDown}
                                        className='option-input'
                                    />
                                ))}
                            </div>
                            <div className='option-input-container'>
                                <input
                                    type="text"
                                    value={newOption}
                                    placeholder="Enter Option"
                                    onKeyDown={handleInputKeyDown}
                                    onChange={(e) => setNewOption(e.target.value)}

                                    className='options-input'
                                />
                                <button type="button" className='edit-details' onClick={handleAddOption}>Save option</button>
                            </div>
                        </>
                    )}
                    {editIndex === -1 ? (
                        <button type="button" onClick={addQuestion} className='save-question edit-details'>Save question</button>
                    ) : (
                        <button type="button" className='update-question edit-details' onClick={updateQuestion}>Update Question</button>
                    )}
                </div>

                <button type="submit" className='edit-details' style={{ width: 'fit-content', backgroundColor: 'var(--siteGreen)' }}>Save form</button>
            </form>
        </div>
    );
}

export default ApplicationFormAdmin;
