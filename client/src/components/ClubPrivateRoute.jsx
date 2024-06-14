import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

function ClubPrivateRoute() {
    const { currentUser, userType } = useSelector((state) => state.user);
    return (currentUser && userType === 'club') ? <Outlet /> : <Navigate to='/signin' />;
}

export default ClubPrivateRoute