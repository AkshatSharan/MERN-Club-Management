import './clubdashboard.css'
import { useDispatch, useSelector } from "react-redux"
import UpdateClubPrimary from '../../components/Modal/UpdateClubPrimary'
import { useState } from 'react';
import axiosInstance from '../../axiosinstance';
import { signOut } from '../../redux/userSlice';

function ClubDashboard() {
  const [open, setOpen] = useState(false);
  const { currentUser } = useSelector((state) => state.user)
  const club = currentUser.user
  const dispatch = useDispatch()

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/auth/club/logout');
      dispatch(signOut());
    } catch (error) {
      console.error('Error during logout: ', error);
    }
  };

  return (
    <div>
      {open && <UpdateClubPrimary handleClose={handleClose} />}
      <div className="club-primary">
        <button className='signout-club' onClick={handleLogout}>Signout</button>
        <div className="club-logo"><img src={club.clubLogo} /></div>
        <h1 className='club-name'>{club.clubName}</h1>
        <button className='edit-details' onClick={handleOpen}>Edit</button>
      </div>
      <div className='club-page-management'>
        <h2 className='dashboard-section-header'>Club page management</h2>
        <div className='club-page-management-actions-container'>
          <button className='club-page-management-action'>View club page</button>
          <button className='club-page-management-action'>Edit club page</button>
        </div>
      </div>
    </div>
  )
}

export default ClubDashboard