import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

function StudentPrivateRoute() {
    const { currentUser, userType } = useSelector((state) => state.user);
    return (currentUser && userType === 'student') ? <Outlet /> : <Navigate to='/signup' />;
}

export default StudentPrivateRoute;
