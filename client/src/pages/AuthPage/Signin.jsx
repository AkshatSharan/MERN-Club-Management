import React, { useState } from 'react';
import './auth.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader/Loader';

function Signin() {
    const [signupData, setSignupData] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const navigate = useNavigate()

    const handleChange = (e) => {
        setSignupData({ ...signupData, [e.target.id]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
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
                <form className='auth-form' onSubmit={handleSubmit}>
                    {errorMessage && <p className='error-message'>{`*${errorMessage}`}</p>} 
                    <input type='text'
                        placeholder='Enter email'
                        value={signupData.email || ''}
                        className='auth-form-input'
                        onChange={handleChange}
                        id='email'
                    />
                    <input type='password'
                        placeholder='Enter password'
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

export default Signin