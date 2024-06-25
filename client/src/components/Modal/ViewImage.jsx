import React, { useEffect } from 'react'
import './imagemodal.css'
import CloseIcon from '../../assets/CloseIcon.svg'
function ViewImage({ handleClose, img }) {

    useEffect(() => {
        const handleResize = () => {
            const imageContainer = document.querySelectorAll('.fullscreen-image');
            const image = document.querySelectorAll('.full-image');
            imageContainer.forEach((image) => {
                if (window.innerWidth > window.innerHeight) {
                    image.style.height = '70vh';
                } else {
                    image.style.width = '90vw';
                }
            })
            image.forEach((img) => {
                if (window.innerWidth > window.innerHeight) {
                    img.style.height = '100%';
                } else {
                    img.style.width = '100%';
                }
            });
        };

        window.addEventListener('resize', handleResize);

        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className='modal-container'>
            <div className='fullscreen-image image-modal'>
                <img src={CloseIcon} className='close-image' onClick={handleClose} />
                <img src={img} className='view-image full-image' />
            </div>
            <div className='modal-background' onClick={handleClose} ></div>
        </div>
    )
}

export default ViewImage