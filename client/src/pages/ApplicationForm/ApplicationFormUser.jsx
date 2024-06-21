import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../axiosinstance';
import parser from 'html-react-parser'
import './application.css'

const ApplicationFormUser = () => {
    const { clubId } = useParams();
    const [formSchema, setFormSchema] = useState(null);
    const [responses, setResponses] = useState({});
    const navigate = useNavigate()

    useEffect(() => {
        const fetchApplicationForm = async () => {
            try {
                const alreadyApplied = await axiosInstance.get(`/club/application/already-applied/${clubId}`)
                if (alreadyApplied.data.alreadyApplied) {
                    navigate('/')
                    alert("Already applied")
                }
                const response = await axiosInstance.get(`/club/application/get-application/${clubId}`);
                setFormSchema(response.data);
                initializeResponses(response.data.questions);

            } catch (error) {
                console.error('Error fetching application form:', error);
            }
        };

        fetchApplicationForm();
    }, [clubId]);

    const initializeResponses = (questions) => {
        const initialResponses = {};
        questions.forEach(question => {
            initialResponses[question._id] = '';
        });
        setResponses(initialResponses);
    };

    const handleInputChange = (questionId, value) => {
        setResponses(prevResponses => ({
            ...prevResponses,
            [questionId]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            // Map responses to match backend schema
            const formattedResponses = formSchema.questions.map(question => ({
                question: question._id, // Assuming question._id is the ID of the question
                answer: responses[question._id], // Use the user's answer for this question
            }));

            await axiosInstance.post('/club/application/submit-application', {
                clubId: clubId,
                responses: formattedResponses, // Send formatted responses to backend
            });
            alert('Application submitted successfully!');
        } catch (error) {
            console.error('Error submitting application:', error);
        }
    };

    if (!formSchema) {
        return <div>Loading...</div>;
    }

    return (
        <form onSubmit={handleSubmit} className='registration-form'>
            <h1 className='application-form-title'>{formSchema.formTitle}</h1>
            <p className='application-detail'>{parser(formSchema.formDescription)}</p>
            {formSchema.questions.map(question => (
                <div key={question._id} className='reg-question-container'>
                    <h3 className='reg-question'>{'Q) ' + question.question}</h3>
                    {question.type === 'text' && (
                        <input
                            type="text"
                            id={question._id}
                            value={responses[question._id]}
                            onChange={(e) => handleInputChange(question._id, e.target.value)}
                            className='reg-form-input'
                        />
                    )}
                    {question.type === 'textarea' && (
                        <textarea
                            id={question._id}
                            value={responses[question._id]}
                            onChange={(e) => handleInputChange(question._id, e.target.value)}
                            className='reg-textarea'
                        />
                    )}
                    {question.type === 'checkbox' && (
                        question.options.map(option => (
                            <div key={option} className='reg-checkbox'>
                                <input
                                    type="checkbox"
                                    id={`${question._id}-${option}`}
                                    value={option}
                                    checked={responses[question._id] && responses[question._id].includes(option)}
                                    onChange={(e) => {
                                        const isChecked = e.target.checked;
                                        setResponses(prevResponses => ({
                                            ...prevResponses,
                                            [question._id]: isChecked
                                                ? [...(prevResponses[question._id] || []), option]
                                                : prevResponses[question._id].filter(item => item !== option)
                                        }));
                                    }}
                                />
                                <label htmlFor={`${question._id}-${option}`}>{option}</label>
                            </div>
                        ))
                    )}
                    {question.type === 'radio' && (
                        question.options.map(option => (
                            <div key={option} className='reg-radio'>
                                <input
                                    type="radio"
                                    id={`${question._id}-${option}`}
                                    name={question._id}
                                    value={option}
                                    checked={responses[question._id] === option}
                                    onChange={(e) => handleInputChange(question._id, e.target.value)}
                                />
                                <label htmlFor={`${question._id}-${option}`}>{option}</label>
                            </div>
                        ))
                    )}
                    {question.type === 'select' && (
                        <select
                            id={question._id}
                            value={responses[question._id]}
                            onChange={(e) => handleInputChange(question._id, e.target.value)}
                            className='reg-dropdown'
                        >
                            <option value="">Select an option</option>
                            {question.options.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    )}
                </div>
            ))}
            <button type="submit" className='edit-details' style={{width: 'fit-content'}}>Submit Application</button>
        </form>
    );
};

export default ApplicationFormUser;
