import React, { useEffect, useState } from 'react';
import './auth.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader/Loader';
import WhiteArrow from '../../assets/WhiteArrow.svg'

function Signin() {
    const [signinData, setSigninData] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [signinType, setSigninType] = useState('student')
    const navigate = useNavigate()

    const handleChange = (e) => {
        setSigninData({ ...signinData, [e.target.id]: e.target.value })
    }

    const handleAccountTypeSwitch = (type) => {
        setSigninType(type)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!signinData.email || !signinData.password) {
            setErrorMessage('Please fill up all fields');
            return;
        }
        try {
            setIsLoading(true);
            let response;
            if (signinType === 'student') {
                response = await axios.post('http://localhost:3000/api/auth/user/signin', signinData);
            } else if (signinType === 'club') {
                response = await axios.post('http://localhost:3000/api/auth/club/signin', signinData);
            }
            setErrorMessage('')
            setIsLoading(false);
            navigate('/signin');
        } catch (error) {
            setIsLoading(false);
            console.error('Error during signin:', error);
            if (error.response && error.response.data && error.response.data.error) {
                setErrorMessage(error.response.data.error);
            } else {
                setErrorMessage('An error occurred during signin');
            }
        }
    }

    if (isLoading) {
        return <Loader message={"Signing you up"} />
    }

    return (
        <div className='authpage'>
            <section className='left-auth'>
                <div className='left-content'>
                    <h1 className='welcome-text'>Welcome to ClubConnect!</h1>
                    <h3 className='welcome-subtext'>Don't have an account?</h3>
                    <button className='switch-page' onClick={() => navigate('/signup')}>Sign up</button>
                </div>
            </section>
            <section className='right-auth'>
                <h1 className='auth-form-heading'>Sign In</h1>

                <div className='account-type-container'>
                    <p className={`account-type ${signinType === 'student' ? 'selected-account-type' : null}`}
                        onClick={() => handleAccountTypeSwitch('student')}
                    >Student</p>
                    <p className={`account-type ${signinType === 'club' ? 'selected-account-type' : null}`}
                        onClick={() => handleAccountTypeSwitch('club')}
                    >Club</p>
                    <div className={`selected-type-highlighter ${signinType === 'student' ? 'type-student' : 'type-club'}`}></div>
                </div>

                <form className='auth-form' onSubmit={handleSubmit}>
                    {errorMessage && <p className='error-message'>{`*${errorMessage}`}</p>}
                    <input type='text'
                        placeholder='Enter email'
                        value={signinData.email || ''}
                        className='auth-form-input'
                        onChange={handleChange}
                        id='email'
                    />
                    <input type='password'
                        placeholder='Enter password'
                        value={signinData.password || ''}
                        className='auth-form-input'
                        onChange={handleChange}
                        id='password'
                    />
                    <input type='submit' className='submit-auth' value='Sign in' />
                </form>
            </section>
        </div>
    )
}

export default Signin