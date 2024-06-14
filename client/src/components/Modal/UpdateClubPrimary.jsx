import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axiosInstance from '../../axiosinstance';
import CloseIcon from '../../assets/CloseIcon.svg';
import { updateSuccess } from '../../redux/userSlice';

function UpdateClubPrimary({ handleClose }) {
    const { currentUser } = useSelector((state) => state.user);
    const [formData, setFormData] = useState(currentUser.user);

    const dispatch = useDispatch();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('/club/update', formData);
            dispatch(updateSuccess(response.data.club));

            console.log('Update successful:', response.data.club);
            handleClose();
        } catch (error) {
            console.error('Update failed:', error);
        }
    };

    return (
        <div className='modal-container'>
            <div className='modal'>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h3>Update Details</h3>
                    <img src={CloseIcon} className='close-modal' onClick={handleClose} />
                </div>
                <form className='updation-form' onSubmit={handleSubmit}>
                    <input type='text' onChange={handleChange} id='clubName' placeholder={formData.clubName} className='updation-input' />
                    <input type='submit' className='submit-update' value="Save" />
                </form>
            </div>
            <div className='modal-background' onClick={handleClose} ></div>
        </div>
    );
}

export default UpdateClubPrimary;
