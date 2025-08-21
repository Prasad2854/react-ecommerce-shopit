import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useAuth } from '../context/AuthContext';
import Logo from '../assets/logo.svg?react';
import './AuthPage.css';

const EyeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 6c3.79 0 7.17 2.13 8.82 5.5C19.17 14.87 15.79 17 12 17s-7.17-2.13-8.82-5.5C4.83 8.13 8.21 6 12 6m0-2C7 4 2.73 7.11 1 11.5 2.73 15.89 7 19 12 19s9.27-3.11 11-7.5C21.27 7.11 17 4 12 4zm0 5c1.38 0 2.5 1.12 2.5 2.5S13.38 14 12 14s-2.5-1.12-2.5-2.5S10.62 9 12 9m0-2c-2.48 0-4.5 2.02-4.5 4.5S9.52 16 12 16s4.5-2.02 4.5-4.5S14.48 7 12 7z" fill="currentColor"/></svg>;
const EyeSlashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 6.5c2.76 0 5 2.24 5 5 0 .69-.14 1.35-.38 1.96l2.14 2.14C19.56 14.46 21.27 12.5 22 11.5 20.27 7.11 16 4 12 4c-1.4 0-2.73.4-3.92 1.1l1.58 1.58c.94-.32 1.96-.5 3.02-.5zm-3.42 7.07l2.6 2.6C10.54 16.59 9.3 17 8 17c-3.79 0-7.17-2.13-8.82-5.5.9-1.92 2.36-3.49 4.1-4.58l1.45 1.45c-.34.61-.53 1.28-.53 2.01 0 2.21 1.79 4 4 4zM2 4.27l3.11 3.11c-1.28.91-2.35 2.2-3.05 3.62C3.73 15.89 8 19 12 19c1.93 0 3.73-.61 5.25-1.66l2.48 2.48L21.19 18.4l-18-18L2 4.27z" fill="currentColor"/></svg>;

const AuthPage = () => {

    const navigate = useNavigate();
    const { user, loginAction } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

   
    
    
    const validate = () => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email address is invalid";
        }

        if (!isLogin) {
            if (!formData.password) {
                newErrors.password = "Password is required";
            } else if (formData.password.length < 8) {
                newErrors.password = "Password must be at least 8 characters";
            } else if (!/(?=.*[a-z])/.test(formData.password)) {
                newErrors.password = "Password must contain a lowercase letter";
            } else if (!/(?=.*[A-Z])/.test(formData.password)) {
                newErrors.password = "Password must contain an uppercase letter";
            } else if (!/(?=.*\d)/.test(formData.password)) {
                newErrors.password = "Password must contain a number";
            } else if (!/(?=.*[\W_])/.test(formData.password)) {
                newErrors.password = "Password must contain a special character";
            }

            if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = "Passwords do not match";
            }
        } else {
             if (!formData.password) {
                newErrors.password = "Password is required";
            }
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const toggleForm = () => { setIsLogin(!isLogin); setErrors({}); setApiError(''); };

    const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };
    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        
        setIsLoading(true);
        setApiError('');
        try {
            const endpoint = isLogin ? 'login' : 'register';
            const payload = isLogin 
                ? { email: formData.email, password: formData.password } 
                : { name: formData.name, email: formData.email, password: formData.password };

            const response = await fetch(`http://localhost:5001/api/auth/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.msg || 'An error occurred.');
            
            if (isLogin) {
                await loginAction(data.token);
                navigate('/');
            } else {
                alert('Registration successful! Please log in.');
                toggleForm();
            }
        } catch (error) {
            setApiError(error.message);
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="auth-container">
            <div className={`auth-form-wrapper ${!isLogin ? 'signup' : ''}`}>
            <Logo className="auth-logo-svg" />
                <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
                
                {/* Display API Error Message */}
                {apiError && <p className="error-text api-error">{apiError}</p>}    
                <form onSubmit={handleSubmit} noValidate>
                    {!isLogin && (
                        <div className="form-group">
                            <label htmlFor="name">Full Name</label>
                            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required />
                        </div>
                    )}
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required 
                               className={errors.email ? 'error' : ''} />
                        {errors.email && <span className="error-text">{errors.email}</span>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="password-wrapper">
                            <input
                                type={isPasswordVisible ? 'text' : 'password'}
                                name="password"
                                id="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className={errors.password ? 'error' : ''}
                            />
                            <button type="button" onClick={togglePasswordVisibility} className="password-toggle-btn">
                                {isPasswordVisible ? <EyeSlashIcon /> : <EyeIcon />}
                            </button>
                        </div>
                        {errors.password && <span className="error-text">{errors.password}</span>}
                    </div>
                    {!isLogin && (
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <div className="password-wrapper">
                                <input
                                    type={isPasswordVisible ? 'text' : 'password'}
                                    name="confirmPassword"
                                    id="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    className={errors.confirmPassword ? 'error' : ''}
                                />
                                <button type="button" onClick={togglePasswordVisibility} className="password-toggle-btn">
                                    {isPasswordVisible ? <EyeSlashIcon /> : <EyeIcon />}
                                </button>
                            </div>
                            {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
                        </div>
                    )}
                    <button type="submit" className="submit-btn" disabled={isLoading}>
    {isLoading ? <div className="loader"></div> : 'Login'}
    </button>
    <div className="social-login-divider">
                <span>OR</span>
            </div>

            <a href="http://localhost:5001/api/auth/google" className="social-login-btn google-btn">
                <svg width="20" height="20" viewBox="0 0 48 48">
                    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
                    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
                    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
                    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.99,35.508,44,30.026,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                </svg>
                <span>Sign in with Google</span>
            </a>
                </form>
                <p className="toggle-text">
                    {isLogin ? "Don't have an account?" : 'Already have an account?'}
                    <span onClick={toggleForm} className="toggle-link">{isLogin ? ' Sign Up' : ' Login'}</span>
                </p>
            </div>
        </div>
    );
};

export default AuthPage;