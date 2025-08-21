import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const { user, logoutAction } = useAuth(); // Get user and logoutAction from context

    const handleLogout = () => {
        logoutAction();
        navigate('/');
    };

    // The useEffect to fetch data is no longer needed here! The context handles it.

    return (
        <div className="dashboard-container">
            <div className="dashboard-content">
                <h1>{user ? `Welcome, ${user.name}!` : 'Loading...'}</h1>
                <p>You have successfully logged in to the ShopIt Dashboard.</p>
                <button onClick={handleLogout} className="logout-btn">
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Dashboard;