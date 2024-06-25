import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../axiosinstance';
import './clubpage.css'
import Loader from '../../components/Loader/Loader';
import parser from 'html-react-parser'
import FacebookLogo from '../../assets/FacebookLogo.svg'
import X from '../../assets/X.svg'
import InstagramLogo from '../../assets/InstagramLogo.svg'
import LinkedInLogo from '../../assets/LinkedInLogo.svg'
import { useSelector } from 'react-redux';

const ClubPage = () => {
    const { clubId } = useParams();
    const { userType } = useSelector((state) => state.user)
    const [club, setClub] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [followed, setFollowed] = useState()

    useEffect(() => {
        const fetchClubDetails = async () => {
            try {
                const response = await axiosInstance.get(`/club/get-club-display/${clubId}`)

                let userInfo
                if (userType === 'student') {
                    userInfo = await axiosInstance.get('/user/getspecificuser')
                    const followedClubs = userInfo.data.user.followedClubs
                    setFollowed(followedClubs.some(club => club === clubId))
                }

                setClub(response.data);
            } catch (error) {
                setError('Error fetching club details');
                console.error('Error fetching club details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchClubDetails();
    }, [clubId]);

    const handleFollow = async () => {
        try {
            await axiosInstance.post(`/user/follow/${clubId}`);
            setFollowed(true);
        } catch (error) {
            console.error('Error following club:', error);
        }
    };

    const handleUnfollow = async () => {
        try {
            await axiosInstance.delete(`/user/unfollow/${clubId}`);
            setFollowed(false);
        } catch (error) {
            console.error('Error unfollowing club:', error);
        }
    };

    const handleToggleFollow = () => {
        if (followed) {
            handleUnfollow();
        } else {
            handleFollow();
        }
    };

    if (loading) return <Loader message="Fetching club details" />;
    if (error) return <div>{error}</div>;

    return (
        <div className="club-page">
            <div className='club-branding'>
                <div className='club-name-logo'>
                    <div className='club-page-logo'>{club.clubLogo && <img src={club.clubLogo} alt={`${club.clubName} logo`} />}</div>
                    <h1 className='club-page-title'>{club.clubName}</h1>
                    {userType === 'student' &&
                        <button
                            className={`follow-button ${followed ? 'followed' : 'not-followed'}`}
                            onClick={handleToggleFollow}
                        >{followed ? "Following" : "Follow"}</button>
                    }
                </div>

                <div className='socials-container'>
                    {club.socials.map((social, index) => {
                        let socialLogo
                        if (social.name === 'X') socialLogo = X
                        if (social.name === 'instagram') socialLogo = InstagramLogo
                        if (social.name === 'facebook') socialLogo = FacebookLogo
                        if (social.name === 'linkedin') socialLogo = LinkedInLogo
                        return (
                            <button key={index} className='socials-button'>
                                <a href={social.url} target="_blank" rel="noopener noreferrer" style={{ height: '100%' }} >
                                    <img src={socialLogo} style={{ height: '100%' }} />
                                </a>
                            </button>
                        )
                    })}
                </div>  
            </div>
            <div className='club-description-container'>
                <h2 className='club-page-section-title'>About the club</h2>
                <div className='club-description'>{parser(club.clubDescription)}</div>
            </div>
        </div>
    );
};

export default ClubPage;
