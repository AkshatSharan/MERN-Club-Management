import React, { useState } from 'react';
import './auth.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader/Loader';

function Signup() {
    const [signupData, setSignupData] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const handleChange = (e) => {
        setSignupData({ ...signupData, [e.target.id]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!signupData.fname || !signupData.lname || !signupData.phone || !signupData.email || !signupData.collegeRegistration || !signupData.password) {
            setErrorMessage('Please fill up all fields');
            return
        }
        try {
            setIsLoading(true);
            const response = await axios.post('http://localhost:3000/api/auth/user/signup', signupData)
            setIsLoading(false);
            navigate('/signin')
        } catch (error) {
            setIsLoading(false)
            console.error('Error during signup: ', error)
            if (error.response && error.response.data && error.response.data.error) {
                setErrorMessage(error.response.data.error)
            } else {
                setErrorMessage('An error occurred during signup')
            }
        }
    };

    const navigate = useNavigate()

    if (isLoading) {
        return <Loader message={"Signing you up"} />
    }

    return (
        <div className='authpage'>
            <section className='left-auth'>
                <div className='left-content'>
                    <h1 className='welcome-text'>Welcome to ClubConnect!</h1>
                    <h3 className='welcome-subtext'>Already have an account?</h3>
                    <button className='switch-page' onClick={() => navigate('/signin')}>Sign in</button>
                </div>
            </section>
            <section className='right-auth'>
                <h1 className='auth-form-heading'>Sign Up</h1>
                <form className='auth-form' onSubmit={handleSubmit}>
                    {errorMessage && <p className='error-message'>{`*${errorMessage}`}</p>}
                    <input type='text'
                        placeholder='First name'
                        value={signupData.fname || ''}
                        className='auth-form-input'
                        onChange={handleChange}
                        id='fname'
                    />
                    <input type='text'
                        placeholder='Last name'
                        value={signupData.lname || ''}
                        className='auth-form-input'
                        onChange={handleChange}
                        id='lname'
                    />
                    <input type='text'
                        placeholder='Phone'
                        value={signupData.phone || ''}
                        className='auth-form-input'
                        onChange={handleChange}
                        id='phone'
                    />
                    <input type='text'
                        placeholder='Email'
                        value={signupData.email || ''}
                        className='auth-form-input'
                        onChange={handleChange}
                        id='email'
                    />
                    <input type='text'
                        placeholder='College registration'
                        value={signupData.collegeRegistration || ''}
                        className='auth-form-input'
                        onChange={handleChange}
                        id='collegeRegistration'
                    />
                    <input type='password'
                        placeholder='Set password'
                        value={signupData.password || ''}
                        className='auth-form-input'
                        onChange={handleChange}
                        id='password'
                    />
                    <input type='submit' className='submit-auth' value='Sign up' />
                </form>
            </section>
        </div>
    )
}

export default Signup