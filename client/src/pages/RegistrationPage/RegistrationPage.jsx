import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axiosinstance';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loader from '../../components/Loader/Loader';

function RegistrationPage() {
    const { eventId } = useParams();
    const [form, setForm] = useState(null);
    const [responses, setResponses] = useState([]);
    const { currentUser } = useSelector((state) => state.user);
    const [isLoading, setIsLoading] = useState(true);
    const [isRegistered, setIsRegistered] = useState(false); // Added state for debugging

    const navigate = useNavigate();

    useEffect(() => {
        const getUser = async () => {
            try {
                const info = await axiosInstance.get('/user/getspecificuser');
                const registrations = info.data.user.registrations;
                const isRegistered = registrations.some((reg) => reg.event._id === eventId);

                if (isRegistered) {
                    navigate('/profile');
                    alert('Already registered for event');
                } else {
                    const fetchForm = async () => {
                        try {
                            const eventResponse = await axiosInstance.get(`/upcomingevent/event/${eventId}`);
                            if (!eventResponse.data.registrationsOpen) {
                                navigate('/profile');
                            }
                            const response = await axiosInstance.get(`/upcomingevent/getform/${eventId}`);
                            if (response.data) {
                                setForm(response.data);
                                initializeResponses(response.data.questions);
                            }
                        } catch (error) {
                            console.error('Error fetching form data:', error);
                        } finally {
                            setIsLoading(false);
                        }
                    };

                    fetchForm();
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                setIsLoading(false); // Ensure isLoading is set to false on error
            }
        };

        getUser();
    }, [eventId, navigate]);

    const initializeResponses = (questions) => {
        const initialResponses = questions.map((question) => {
            let answer = '';
            if (question.type === 'radio' || question.type === 'checkbox' || question.type === 'select') {
                answer = [];
            }
            return {
                question: question._id,
                answer: answer,
            };
        });
        setResponses(initialResponses);
    };

    const handleInputChange = (index, answer) => {
        const updatedResponses = [...responses];
        updatedResponses[index].answer = answer;
        setResponses(updatedResponses);
    };

    const handleSubmitForm = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post(`/upcomingevent/register/${eventId}/${form._id}`, { responses });
            console.log('Registration submitted successfully:', response.data);
            navigate('/');
        } catch (error) {
            console.error('Error submitting registration:', error);
        }
    };

    if (isLoading) {
        return <Loader message="Fetching form" />;
    }

    return (
        <div>
            <h1>{form.formTitle}</h1>
            <p>{form.formDescription}</p>
            <form onSubmit={handleSubmitForm}>
                {form.questions.map((question, index) => (
                    <div key={question._id}>
                        <h3>{question.question}</h3>
                        {question.type === 'text' && (
                            <input
                                type="text"
                                value={responses[index].answer}
                                onChange={(e) => handleInputChange(index, e.target.value)}
                            />
                        )}
                        {question.type === 'textarea' && (
                            <textarea
                                value={responses[index].answer}
                                onChange={(e) => handleInputChange(index, e.target.value)}
                            />
                        )}
                        {question.type === 'radio' && (
                            question.options.map((option, optionIndex) => (
                                <div key={optionIndex}>
                                    <input
                                        type="radio"
                                        id={`${question._id}_${optionIndex}`}
                                        name={`${question._id}`}
                                        value={option}
                                        checked={responses[index].answer === option}
                                        onChange={(e) => handleInputChange(index, e.target.value)}
                                    />
                                    <label htmlFor={`${question._id}_${optionIndex}`}>{option}</label>
                                </div>
                            ))
                        )}
                        {question.type === 'checkbox' && (
                            question.options.map((option, optionIndex) => (
                                <div key={optionIndex}>
                                    <input
                                        type="checkbox"
                                        id={`${question._id}_${optionIndex}`}
                                        name={`${question._id}`}
                                        checked={responses[index].answer.includes(option)}
                                        onChange={(e) => {
                                            const isChecked = e.target.checked;
                                            let updatedAnswers = [...responses[index].answer];
                                            if (isChecked) {
                                                updatedAnswers.push(option);
                                            } else {
                                                updatedAnswers = updatedAnswers.filter((ans) => ans !== option);
                                            }
                                            handleInputChange(index, updatedAnswers);
                                        }}
                                    />
                                    <label htmlFor={`${question._id}_${optionIndex}`}>{option}</label>
                                </div>
                            ))
                        )}
                        {question.type === 'select' && (
                            <select
                                multiple={question.isMultiple} // Assume you have a field in the question object indicating if it's a multi-select
                                value={responses[index].answer}
                                onChange={(e) => {
                                    const options = e.target.options;
                                    const selectedValues = [];
                                    for (let i = 0; i < options.length; i++) {
                                        if (options[i].selected) {
                                            selectedValues.push(options[i].value);
                                        }
                                    }
                                    handleInputChange(index, selectedValues);
                                }}
                            >
                                {question.options.map((option, optionIndex) => (
                                    <option key={optionIndex} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                ))}
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default RegistrationPage;
