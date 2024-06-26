import React, { useEffect, useRef, useState } from 'react';
import './registrationform.css';
import axiosInstance from '../../axiosinstance';
import { useNavigate, useParams } from 'react-router-dom';
import Trashcan from '../../assets/Trashcan.svg';
import AddIcon from '../../assets/AddIcon.svg';

function RegistrationFormAdmin() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    type: 'text',
    question: '',
    options: []
  });
  const [editIndex, setEditIndex] = useState(-1);
  const [newOption, setNewOption] = useState('');
  const [formExists, setFormExists] = useState(false); // To track if form already exists

  const textareaRef = useRef(null);

  // Fetch form data if it exists
  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await axiosInstance.get(`/upcomingevent/getform/${eventId}`);
        if (response.data) {
          const { formTitle, formDescription, questions } = response.data;
          setFormTitle(formTitle);
          setFormDescription(formDescription);
          setQuestions(questions);
          setFormExists(true);
        }
      } catch (error) {
        console.error('Error fetching form data:', error);
      }
    };

    fetchFormData();
  }, [eventId]);

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
      const formData = { formTitle, questions, formDescription };

      if (formExists) {
        const response = await axiosInstance.put(`/upcomingevent/update-form/${eventId}`, formData);
        console.log('Form updated successfully:', response.data);
      } else {
        const response = await axiosInstance.post(`/upcomingevent/create-form/${eventId}`, formData);
        console.log('Form created successfully:', response.data);
        setFormExists(true);
      }

      resetForm();
      navigate(`/event-management/${eventId}`);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const resetForm = () => {
    setFormTitle('');
    setFormDescription('');
    setQuestions([]);
    resetNewQuestion();
    setEditIndex(-1);
  };

  const resetNewQuestion = () => {
    setNewQuestion({
      type: 'text',
      question: '',
      options: []
    });
    setNewOption('');
  };

  const handleAddOption = () => {
    if (newOption.trim() !== '') {
      setNewQuestion(prev => ({
        ...prev,
        options: [...prev.options, newOption.trim()]
      }));
      setNewOption('');
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
    const handleKeyDown = (event) => {
      if (event.key === 'Enter' && event.target.tagName !== 'TEXTAREA') {
        event.preventDefault();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    adjustTextareaHeight();
  }, []);

  useEffect(() => {
    adjustTextareaHeight();
  }, [formDescription]);

  return (
    <div>
      <form onSubmit={handleSubmitForm} className='registration-form'>
        <input
          type="text"
          id="formTitle"
          value={formTitle}
          placeholder='Form title'
          onChange={(e) => setFormTitle(e.target.value)}
          className='form-title'
          required
        />

        <label>
          <h2 className='form-description-header'>Form description</h2>
          <textarea
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
            placeholder='Enter description'
            className='form-description'
            required
            ref={textareaRef}
          />
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
                    className='option-input'
                  />
                ))}
              </div>
              <div className='option-input-container'>
                <input
                  type="text"
                  value={newOption}
                  placeholder="Enter Option"
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

        <button type="submit" className='submit-registration-form'>Save form</button>
      </form>
    </div>
  );
}

export default RegistrationFormAdmin;
