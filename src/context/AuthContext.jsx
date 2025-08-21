import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserDataOnLoad = async () => {
            if (token) {
                try {
                    const response = await fetch('http://localhost:5001/api/user/me', {
                        headers: { 'x-auth-token': token },
                    });
                    const userData = await response.json();
                    
                    if (response.ok) {
                        setUser(userData);
                    } else {
                        logoutAction();
                    }
                } catch (error) {
                    logoutAction();
                }   
            }
            setIsLoading(false);
        };
        fetchUserDataOnLoad();
    }, [token]);

    const loginAction = async (newToken) => {
        try {
            localStorage.setItem('token', newToken);
            setToken(newToken);
        } catch (err) {
            console.error(err);
            logoutAction();
        }
    };

    const logoutAction = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    const value = { user, token, isLoading, loginAction, logoutAction };

    return (
        <AuthContext.Provider value={value}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
