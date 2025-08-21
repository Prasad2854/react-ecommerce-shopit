import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../assets/logo.svg?react';
import './Footer.css';

const Footer = () => {
    // Get the current year automatically
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-logo-section">
                    <Link to="/" className="footer-logo-link">
                        <Logo className="footer-logo-svg" />    
                    </Link>
                </div>
                <div className="footer-copyright">
                    &copy; {currentYear} ShopIt. All Rights Reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;