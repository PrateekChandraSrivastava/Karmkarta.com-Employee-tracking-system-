// src/components/RoleBasedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const RoleBasedRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem('token');

    if (!token) {
        // If no token, redirect to login
        return <Navigate to="/login" replace />;
    }

    try {
        const decoded = jwtDecode(token);
        const userRole = decoded.role;

        // Check if the user's role is in the allowedRoles array
        if (allowedRoles.includes(userRole)) {
            return children;
        } else {
            return <div>You do not have permission to view this page.</div>;
        }
    } catch (error) {
        return <Navigate to="/login" replace />;
    }
};

export default RoleBasedRoute;
