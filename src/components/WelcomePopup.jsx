import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './WelcomePopup.css';

const WelcomePopup = () => {
    const { user } = useAuth();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // 1. Check if the user has seen the generic pop-up before
        const hasSeenPopup = localStorage.getItem('hasSeenWelcomePopup');

        // 2. We decide whether to show the pop-up
        // Show it IF the user is logged in (to greet them)
        // OR IF they are a guest who has NEVER seen it before.
        if (user || !hasSeenPopup) {
            
            // Timer to slide the pop-up in
            const showTimer = setTimeout(() => {
                setIsVisible(true);
            }, 500);

            // Timer to slide the pop-up out
            const hideTimer = setTimeout(() => {
                setIsVisible(false);
            }, 5500); // Stays on screen for 5 seconds

            // 3. If it's a first-time guest, set the flag in localStorage
            // so they won't see the generic pop-up again.
            if (!user) {
                localStorage.setItem('hasSeenWelcomePopup', 'true');
            }

            // Clean up timers when the component unmounts or re-renders
            return () => {
                clearTimeout(showTimer);
                clearTimeout(hideTimer);
            };
        }
    }, [user]); // 4. The effect depends on the user's login status

    const welcomeMessage = user 
        ? `Welcome back, ${user.name}!` 
        : "Welcome to ShopIt";
        
    const subMessage = user 
        ? "Let's continue your shopping journey." 
        : "Your one-stop shop for everything you need.";

    // If we decided not to show the pop-up at all, render nothing.
    if (!isVisible) {
        return null;
    }

    return (
        <div className={`welcome-popup ${isVisible ? 'visible' : ''}`}>
            <h3>{welcomeMessage}</h3>
            <p>{subMessage}</p>
        </div>
    );
};

export default WelcomePopup;