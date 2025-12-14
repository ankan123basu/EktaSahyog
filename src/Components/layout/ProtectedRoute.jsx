import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token) {
        return <Navigate to="/auth" replace />;
    }

    if (adminOnly && user?.email !== 'admin@ektasahyog.com') {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
