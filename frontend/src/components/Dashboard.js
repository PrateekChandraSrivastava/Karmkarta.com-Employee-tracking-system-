// src/components/Dashboard.js
import React from 'react';
import LogoutButton from './LogoutButton';

const Dashboard = () => {
    return (
        <div>
            <h2>Dashboard</h2>
            {/* Add the logout button */}
            <LogoutButton />
            <p>Welcome to the Employee Tracking System Dashboard!</p>
        </div>
    );
};

export default Dashboard;
