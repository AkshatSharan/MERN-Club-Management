import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axiosinstance';
import { useParams } from 'react-router-dom';

function RegistrationPage() {
    const { eventId } = useParams();
    const [form, setForm] = useState(null);
    const [responses, setResponses] = useState([]);

    useEffect(() => {
        const fetchForm = async () => {
            try {
                const response = await axiosInstance.get(`/upcomingevent/getform/${eventId}`);
                if (response.data) {
                    setForm(response.data);
                    initializeResponses(response.data.questions);
                }
            } catch (error) {
                console.error('Error fetching form data:', error);
            }
        };

        fetchForm();
    }, [eventId]);

    const initializeResponses = (questions) => {
        const initialResponses = questions.map(question => {
            let answer = '';
            if (question.type === 'radio' || question.type === 'checkbox' || question.type === 'select') {
                answer = []; // Initialize answer as an array for multiple choice questions
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
            // Optionally navigate or show success message
        } catch (error) {
            console.error('Error submitting registration:', error);
        }
    };

    if (!form) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{form.formTitle}</h1>
            <form onSubmit={handleSubmitForm}>
                {form.questions.map((question, index) => (
                    <div key={question._id}>
                        <h3>{question.question}</h3>
                        {question.type === 'text' || question.type === 'textarea' ? (
                            <input
                                type="text"
                                value={responses[index].answer}
                                onChange={(e) => handleInputChange(index, e.target.value)}
                            />
                        ) : (
                            question.options.map((option, optionIndex) => (
                                <div key={optionIndex}>
                                    <input
                                        type={question.type === 'radio' ? 'radio' : 'checkbox'}
                                        id={`${question._id}_${optionIndex}`}
                                        name={`${question._id}`}
                                        checked={responses[index].answer.includes(option)}
                                        onChange={(e) => {
                                            const isChecked = e.target.checked;
                                            let updatedAnswers = [...responses[index].answer];
                                            if (isChecked) {
                                                updatedAnswers.push(option);
                                            } else {
                                                updatedAnswers = updatedAnswers.filter(ans => ans !== option);
                                            }
                                            handleInputChange(index, updatedAnswers);
                                        }}
                                    />
                                    <label htmlFor={`${question._id}_${optionIndex}`}>{option}</label>
                                </div>
                            ))
                        )}
                    </div>
                ))}
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default RegistrationPage;
