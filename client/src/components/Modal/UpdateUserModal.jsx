import { useDispatch, useSelector } from 'react-redux'
import './modal.css'
import CloseIcon from '../../assets/CloseIcon.svg'
import { useState } from 'react'
import axiosInstance from '../../axiosinstance'
import { updateFailure, updateStart, updateSuccess } from '../../redux/userSlice'

function UpdateUserModal({ handleClose }) {
    const { currentUser } = useSelector((state) => state.user)
    const [formData, setFormData] = useState(currentUser.user)
    const dispatch = useDispatch()

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            dispatch(updateStart())
            const response = await axiosInstance.post('/user/update', formData)

            if (response.success == false) {
                dispatch(updateFailure(response.data.user))
            }

            dispatch(updateSuccess(response.data.user))
            console.log('Update successful:', response.data)
            handleClose();
        } catch (error) {
            console.error('Update failed:', error)
        }
    }

    return (
        <div className='modal-container'>
            <div className='modal'>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h3>Update Details</h3>
                    <img src={CloseIcon} className='close-modal' onClick={handleClose} />
                </div>
                <form className='updation-form' onSubmit={handleSubmit}>
                    <input type='text' onChange={handleChange} id='fname' placeholder={formData.fname} className='updation-input' />
                    <input type='text' onChange={handleChange} id='lname' placeholder={formData.lname} className='updation-input' />
                    <input type='text' onChange={handleChange} id='phone' placeholder={formData.phone} className='updation-input' />
                    <input type='text' onChange={handleChange} id='email' placeholder={formData.email} className='updation-input' />
                    <input type='submit' className='submit-update' value="Save" />
                </form>
            </div>
            <div className='modal-background' onClick={handleClose} ></div>
        </div>
    )
}

export default UpdateUserModal