import { useSelector } from 'react-redux'
import './modal.css'
import CloseIcon from '../../assets/CloseIcon.svg'

function UpdateUserModal({ handleClose }) {
    const { currentUser } = useSelector((state) => state.user)

    return (
        <div className='modal-container'>
            <div className='modal'>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <h3>Update Details</h3>
                    <img src={CloseIcon} className='close-modal' onClick={handleClose} />
                </div>
                <form className='updation-form'>
                    <input type='text' id='fname' placeholder={currentUser.fname} className='updation-input' />
                    <input type='text' id='lname' placeholder={currentUser.lname} className='updation-input' />
                    <input type='text' id='phone' placeholder={currentUser.phone} className='updation-input' />
                    <input type='text' id='email' placeholder={currentUser.email} className='updation-input' />
                    <input type='submit' className='submit-update' value="Save" />
                </form>
            </div>
            <div className='modal-background' onClick={handleClose} ></div>
        </div>
    )
}

export default UpdateUserModal