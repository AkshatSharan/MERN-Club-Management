import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axiosInstance from '../../axiosinstance';
import CloseIcon from '../../assets/CloseIcon.svg';
import { updateSuccess } from '../../redux/userSlice';
import './clubmodal.css'
import EditPen from '../../assets/EditPen.svg'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../../firebase';

function UpdateClubPrimary({ handleClose }) {
    const { currentUser } = useSelector((state) => state.user)
    const [formData, setFormData] = useState(currentUser.user)
    const [image, setImage] = useState(undefined)
    const [imageError, setImageError] = useState(null)
    const fileRef = useRef(null)

    useEffect(() => {
        if (image) {
            handleImageUpload(image)
        }
    }, [image])

    const handleImageUpload = () => {
        const storage = getStorage(app)
        const fileName = new Date().getTime() + image.name
        const storageRef = ref(storage, fileName)
        const uploadTask = uploadBytesResumable(storageRef, image)
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                console.log("Upload is " + progress + "%")
            },
            (error) => {
                setImageError(true)
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then(
                    (downloadURL) => {
                        setFormData({ ...formData, clubLogo: downloadURL })
                    }
                )
            }
        );
    }

    const dispatch = useDispatch();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await axiosInstance.post('/club/update', formData)
            dispatch(updateSuccess(response.data.club))
            setImageError(null)

            console.log('Update successful:', response.data.club)
            handleClose()
        } catch (error) {
            console.error('Update failed:', error)
        }
    };

    return (
        <div className='modal-container'>
            <div className='modal'>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h3>Update Details</h3>
                    <img src={CloseIcon} className='close-modal' onClick={handleClose} />
                </div>
                {imageError && <p style={{ color: 'orangered', marginTop: 0 }}>*Image must be less than 3 MB</p>}
                <form className='club-updation-form' onSubmit={handleSubmit}>
                    <input type='file' id='clubLogo' ref={fileRef} hidden accept='image/*' onChange={(e) => setImage(e.target.files[0])} />
                    <div className='club-logo-edit' onClick={() => fileRef.current.click()}>
                        <div className='club-logo'><img src={formData.clubLogo} /></div>
                        <div className='edit-logo'><img src={EditPen} /></div>
                    </div>
                    <input type='text' onChange={handleChange} id='clubName' placeholder={formData.clubName} className='updation-input' />
                    <input type='submit' className='submit-update' value="Save" />
                </form>
            </div>
            <div className='modal-background' onClick={handleClose} ></div>
        </div>
    );
}

export default UpdateClubPrimary;
