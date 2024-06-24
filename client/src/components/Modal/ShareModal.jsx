import React from 'react'
import './modal.css'
import CloseIcon from '../../assets/CloseIcon.svg'

import {
    EmailShareButton,
    FacebookShareButton,
    LinkedinShareButton,
    TwitterShareButton,
    WhatsappShareButton,

    EmailIcon,
    FacebookIcon,
    LinkedinIcon,
    XIcon,
    WhatsappIcon,
} from 'react-share'

function ShareModal({ handleClose, message, name }) {

    const pageUrl = window.location.href;
    const pageTitle = name + ' page'

    return (
        <div className='modal-container'>
            <div className='modal'>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h3>{message}</h3>
                    <img src={CloseIcon} className='close-modal' onClick={handleClose} />
                </div>
                <div className='share-social-icons'>
                    <WhatsappShareButton url={pageUrl} title={pageTitle}>
                        <WhatsappIcon className='share-icon' />
                    </WhatsappShareButton>
                    <EmailShareButton className='share-icon' url={pageUrl} title={pageTitle}>
                        <EmailIcon className='share-icon' />
                    </EmailShareButton>
                    <LinkedinShareButton className='share-icon' url={pageUrl} title={pageTitle}>
                        <LinkedinIcon className='share-icon' />
                    </LinkedinShareButton>
                    <TwitterShareButton className='share-icon' url={pageUrl} title={pageTitle}>
                        <XIcon className='share-icon' />
                    </TwitterShareButton>
                    <FacebookShareButton className='share-icon' url={pageUrl} title={pageTitle}>
                        <FacebookIcon className='share-icon' />
                    </FacebookShareButton>
                </div>
            </div>
            <div className='modal-background' onClick={handleClose} ></div>
        </div>
    )
}

export default ShareModal