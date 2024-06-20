import React from 'react'
import './modal.css'
import CloseIcon from '../../assets/CloseIcon.svg'

function CompleteConfirmation({ handleClose, action, message }) {
    return (
        <div className='modal-container'>
            <div className='modal'>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h3>{message}</h3>
                    <img src={CloseIcon} className='close-modal' onClick={handleClose} />
                </div>
                <div className='confirmation-buttons'>
                    <button className='edit-details' style={{ width: '50%' }} onClick={action}>Yes</button>
                    <button className='edit-details' style={{ width: '50%', backgroundColor: 'orangered' }} onClick={handleClose}>Cancel</button>
                </div>
            </div>
            <div className='modal-background' onClick={handleClose} ></div>
        </div>
    )
}

export default CompleteConfirmation