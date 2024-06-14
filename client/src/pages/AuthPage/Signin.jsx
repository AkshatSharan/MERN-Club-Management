// Signin.jsx
import React, { useEffect, useState } from 'react';
import './auth.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader/Loader';
import { signinStart, signinSuccess, signinFailure } from '../../redux/userSlice'
import { useDispatch, useSelector } from 'react-redux';
import axiosInstance from '../../axiosinstance';

function Signin() {
    const [studentSigninData, setStudentSigninData] = useState({ collegeRegistration: '', password: '' });
    const [clubSigninData, setClubSigninData] = useState({ email: '', password: '' });
    const { loading, errorMessage } = useSelector((state) => state.user);
    const [signinType, setSigninType] = useState('student');
    const { currentUser, userType } = useSelector((state) => state.user);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser && userType === 'student') {
            navigate('/');
        }
    }, [currentUser, userType, navigate]);

    const handleStudentDataChange = (e) => {
        setStudentSigninData({ ...studentSigninData, [e.target.id]: e.target.value });
    }

    const handleClubDataChange = (e) => {
        setClubSigninData({ ...clubSigninData, [e.target.id]: e.target.value });
    }

    const handleAccountTypeSwitch = (type) => {
        setSigninType(type);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        let data = {};
        if (signinType === 'student') {
            data = studentSigninData;
        } else if (signinType === 'club') {
            data = clubSigninData;
        }
        try {
            dispatch(signinStart());
            let response;
            if (signinType === 'student') {
                response = await axiosInstance.post('/auth/user/signin', studentSigninData);
            } else if (signinType === 'club') {
                response = await axiosInstance.post('/auth/club/signin', clubSigninData);
            }
            dispatch(signinSuccess({ user: response.data, userType: signinType }));
            navigate('/');
        } catch (error) {
            const errorMessage = error.response && error.response.data && error.response.data.error
                ? error.response.data.error
                : 'An error occurred during sign in';
            dispatch(signinFailure(errorMessage));
        }
    };

    if (loading) {
        return <Loader message={"Signing you in"} />;
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
                    {signinType === 'student' ? (
                        <>
                            <input type='text'
                                placeholder='College registration'
                                value={studentSigninData.collegeRegistration}
                                className='auth-form-input'
                                onChange={handleStudentDataChange}
                                id='collegeRegistration'
                            />
                            <input type='password'
                                placeholder='Enter password'
                                value={studentSigninData.password}
                                className='auth-form-input'
                                onChange={handleStudentDataChange}
                                id='password'
                            />
                        </>
                    ) : (
                        <>
                            <input type='text'
                                placeholder='Club email'
                                value={clubSigninData.email}
                                className='auth-form-input'
                                onChange={handleClubDataChange}
                                id='email'
                            />
                            <input type='password'
                                placeholder='Enter password'
                                value={clubSigninData.password}
                                className='auth-form-input'
                                onChange={handleClubDataChange}
                                id='password'
                            />
                        </>
                    )}
                    <input type='submit' className='submit-auth' value='Sign in' />
                </form>
            </section>
        </div>
    )
}

export default Signin;
