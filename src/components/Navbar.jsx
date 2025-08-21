import React, { useState, useEffect } from 'react';
import './Navbar.css';
import Logo from '../assets/logo.svg?react';
import ThemeToggle from './ThemeToggle/ThemeToggle';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import { Link } from 'react-router-dom'; // Import Link for navigation
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext'; 


const CartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentColor">
        <path d="M0 0h24v24H0V0z" fill="none"/><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zm-1.45-5c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.37-.66-.11-1.48-.87-1.48H5.21l-.94-2H1v2h2l3.6 7.59-1.35 2.44C4.52 15.37 5.24 17 6.5 17h12v-2H6.5c-.25 0-.45-.22-.4-.44L7.1 13h7.45z"/>
    </svg>
);

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20" fill="currentColor">
        <path d="M0 0h24v24H0V0z" fill="none"/><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
    </svg>
);
const Navbar = () => {
    const { user, logoutAction } = useAuth(); // Get user from context

    const { cartItemCount } = useCart(); 
    const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown


    const [query, setQuery] = useState('');
    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/search?q=${encodeURIComponent(query.trim())}`);
            setQuery(''); // Clear input after search
        }
    };
    useEffect(() => {
        const handleScroll = () => {
            // Set isScrolled to true if user has scrolled more than 10px
            if (window.scrollY > 10) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        // Cleanup function to remove the event listener
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []); 


    const handleLogout = () => {
        logoutAction();
        setIsDropdownOpen(false); // Close dropdown on logout
        navigate('/');
    };
    return (
        <nav  className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
          <div className="navbar-container">
                {/* 5. Simplified logo section - always links to homepage */}
                <Link to="/" className="navbar-logo">
                    <Logo className="logo-svg" />
                    <h1>ShopIt</h1>
                </Link>
                <div className="navbar-search">
                    <form onSubmit={handleSearch} className="search-form">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search for products..."
                            className="search-input"
                        />
                        <button type="submit" className="search-button">
                            <SearchIcon />
                        </button>
                    </form>
                </div>
                <div className="navbar-links">
                    <Link to="/">Home</Link>

                    
                    {/* --- DYNAMIC SECTION --- */}
                    {user ? (
                        // --- NEW DROPDOWN ---
                        <div className="user-dropdown">
                            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="navbar-user-btn">
                                Hi, {user.name.split(' ')[0]}
                            </button>
                            {isDropdownOpen && (
                                <div className="dropdown-menu">
                                    <Link to="/dashboard" onClick={() => setIsDropdownOpen(false)}>Dashboard</Link>
                                    <Link to="/myorders" onClick={() => setIsDropdownOpen(false)}>Your Orders</Link>
                                    <button onClick={handleLogout}>Logout</button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            {/* 3. Added a dedicated Login button for guests */}
                            <Link to="/login" className="navbar-login-btn">Login</Link>
                        </>
                    )}
                    {/* --- END OF DYNAMIC SECTION --- */}

                    <ThemeToggle />

                    <Link to="/cart" className="navbar-cart-link">
                        <CartIcon />
                        {cartItemCount > 0 && (
                            <span className="cart-badge">{cartItemCount}</span>
                        )}
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;