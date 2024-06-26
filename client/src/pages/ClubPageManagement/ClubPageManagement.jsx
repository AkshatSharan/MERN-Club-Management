import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../../axiosinstance';
import './clubpagemanagement.css'

import StarterKit from '@tiptap/starter-kit';
import Text from '@tiptap/extension-text';
import TextStyle from '@tiptap/extension-text-style';
import { Underline } from '@tiptap/extension-underline';
import { useEditor, EditorContent } from '@tiptap/react';
import { Color } from '@tiptap/extension-color';

import UnderlineIcon from '../../assets/Underline.svg'
import BoldIcon from '../../assets/Bold.svg'
import Italics from '../../assets/Italics.svg'
import OL from '../../assets/OL.svg'
import UL from '../../assets/UL.svg'
import Quote from '../../assets/Quote.svg'
import HorizontalRule from '../../assets/HorizontalRule.svg'
import LineBreak from '../../assets/LineBreak.svg'
import Undo from '../../assets/Undo.svg'
import Redo from '../../assets/Redo.svg'
import { useNavigate } from 'react-router-dom';

import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../../firebase';

import { IconButton, ImageList, ImageListItem, ImageListItemBar } from '@mui/material';
import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';

const extensions = [
    StarterKit,
    Underline,
    Text,
    TextStyle,
    Color
];

function ClubPageManagement() {
    const [displayDescription, setDisplayDescription] = useState('')
    const [clubDescription, setClubDescription] = useState('')
    const [clubId, setClubId] = useState(null);
    const [socials, setSocials] = useState([]);
    const [isDataLoaded, setIsDataLoaded] = useState(false)
    const [galleryImages, setGalleryImages] = useState([])
    const textareaRef = useRef(null)
    const fileInputRef = useRef(null)
    const [uploadProgess, setUploadProgress] = useState(0)

    const navigate = useNavigate()

    useEffect(() => {
        const fetchClubDetails = async () => {
            try {
                const response = await axiosInstance.get('/club/get-club');
                const { displayDescription, clubDescription, socials, _id, gallery } = response.data;
                setDisplayDescription(displayDescription || '');
                setClubDescription(clubDescription || '');
                setSocials(socials || []);
                setClubId(_id);
                setGalleryImages(gallery || []);
            } catch (error) {
                console.error('Error fetching club details:', error);
            } finally {
                setIsDataLoaded(true)
            }
        };

        fetchClubDetails();
    }, []);

    const handleSave = async () => {
        try {
            await axiosInstance.put(`/club/update-page`, {
                displayDescription,
                clubDescription,
                socials,
                gallery: galleryImages
            });
            alert('Club details saved successfully');
            navigate('/')
        } catch (error) {
            console.error('Error saving club details:', error);
            alert('Failed to save club details');
        }
    };

    const toggleSocial = (socialName) => {
        if (socials.some(social => social.name === socialName)) {
            const updatedSocials = socials.filter(social => social.name !== socialName);
            setSocials(updatedSocials);
        } else {
            setSocials([...socials, { name: socialName, url: '' }]);
        }
    };

    const adjustTextareaHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    };

    const editor = useEditor({
        extensions,
        content: clubDescription,
        onUpdate: ({ editor }) => {
            setClubDescription(editor.getHTML())
        },
        editorProps: {
            onFocus: (event) => {
                event.preventDefault()
            },
        },
    }, [isDataLoaded]);

    const uploadFile = async (file) => {
        const storageRef = ref(getStorage(app), 'gallery/' + file.name);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                setUploadProgress(progress)
            },
            (error) => {
                console.error('Error uploading file:', error)
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setGalleryImages(prevImages => [...prevImages, downloadURL])
                    setUploadProgress(0)
                })
            }
        )
    }

    const removeImage = (imageUrl) => {
        const updatedGallery = galleryImages.filter(url => url !== imageUrl);
        setGalleryImages(updatedGallery);
    };

    useEffect(() => {
        adjustTextareaHeight();
    }, [displayDescription]);

    return (
        <div className='create-event-form'>
            <div className='event-management-header'>
                <h2 className='page-title'>Club Page Management</h2>
            </div>

            <label className='form-section-label'>Social Media:
                {socialOptions.map((socialOption, index) => (
                    <div key={index}>
                        <label className='socials-checkbox'>
                            <div className='check-social'>
                                <input
                                    type="checkbox"
                                    id={socialOption.value}
                                    checked={socials.some(social => social.name === socialOption.value)}
                                    onChange={() => toggleSocial(socialOption.value)}
                                />
                                {socialOption.label}
                            </div>
                            {socials.some(social => social.name === socialOption.value) && (
                                <input
                                    type="text"
                                    value={socials.find(social => social.name === socialOption.value)?.url || ''}
                                    onChange={(e) => {
                                        const updatedSocials = [...socials];
                                        const index = updatedSocials.findIndex(social => social.name === socialOption.value);
                                        updatedSocials[index].url = e.target.value;
                                        setSocials(updatedSocials);
                                    }}
                                    className='social-link'
                                    placeholder={`Enter ${socialOption.label} URL`}
                                />
                            )}
                        </label>
                    </div>
                ))}
            </label>

            <label className='form-section-label'>Cover description:
                <textarea
                    value={displayDescription}
                    onChange={(e) => setDisplayDescription(e.target.value)}
                    ref={textareaRef}
                    className='cover-description-textarea'
                />
            </label>

            <label className='form-section-label'>Club Description:
                <div className='controls-container'>
                    <button type='button'
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        disabled={!editor}
                        className={editor?.isActive('bold') ? 'is-active' : ''}
                    >
                        <img src={BoldIcon} className='text-editor-icon' />
                    </button>
                    <button type='button'
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        disabled={!editor}
                        className={editor?.isActive('italic') ? 'is-active' : ''}
                    >
                        <img src={Italics} className='text-editor-icon' />
                    </button>
                    <button type='button'
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        disabled={!editor}
                        className={editor?.isActive('underline') ? 'is-active' : ''}
                    >
                        <img src={UnderlineIcon} className='text-editor-icon' />
                    </button>
                    <button type='button'
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        disabled={!editor}
                        className={editor?.isActive('bulletList') ? 'is-active' : ''}
                    >
                        <img src={UL} className='text-editor-icon' />
                    </button>
                    <button type='button'
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        disabled={!editor}
                        className={editor?.isActive('orderedList') ? 'is-active' : ''}
                    >
                        <img src={OL} className='text-editor-icon' />
                    </button>
                    <button type='button'
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        disabled={!editor}
                        className={editor?.isActive('blockquote') ? 'is-active' : ''}
                    >
                        <img src={Quote} className='text-editor-icon' />
                    </button>
                    <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
                        <img src={HorizontalRule} className='text-editor-icon' />
                    </button>
                    <button onClick={() => editor.chain().focus().setHardBreak().run()}>
                        <img src={LineBreak} className='text-editor-icon' />
                    </button>
                    <button type='button'
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor}
                    >
                        <img src={Undo} className='text-editor-icon' />
                    </button>
                    <button type='button'
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor}
                    >
                        <img src={Redo} className='text-editor-icon' />
                    </button>
                </div>
                <div className='event-description'>
                    <EditorContent editor={editor} />
                </div>
            </label>

            <div className='gallery-section'>
                <h3>Gallery</h3>
                <input
                    type='file'
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                            uploadFile(file);
                        }
                    }}
                />

                {uploadProgess == 0 && <button onClick={() => fileInputRef.current.click()} className='add-image-button'>+</button>}
                {uploadProgess > 0 &&
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ width: '100%', mr: 1 }}>
                            <LinearProgress variant="determinate" value={uploadProgess} />
                        </Box>
                        <Box sx={{ minWidth: 35 }}>
                            <Typography variant="body2" color="text.secondary">{`${Math.round(
                                uploadProgess,
                            )}%`}</Typography>
                        </Box>
                    </Box>
                }

                <ImageList variant="masonry" cols={3} gap={8}>
                    {galleryImages.map((image, index) => (
                        <ImageListItem key={index}>
                            <img src={image} alt={`Gallery ${index + 1}`} />
                            <ImageListItemBar
                                actionIcon={
                                    <IconButton
                                        onClick={() => removeImage(image)}
                                        aria-label={`delete image ${index + 1}`}
                                    >
                                        <p className='delete-image-button'>Delete</p>
                                    </IconButton>
                                }
                                sx={{
                                    background: 'rgba(255, 68, 0, 0.6)',
                                    textAlign: 'center',
                                    width: 'fit-content',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    padding: 0
                                }}
                            />
                        </ImageListItem>
                    ))}
                </ImageList>
            </div>


            <button onClick={handleSave} className='edit-details'>Save</button>
        </div>
    );
}

const socialOptions = [
    { value: 'X', label: 'X' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'linkedin', label: 'LinkedIn' },
];

export default ClubPageManagement;
