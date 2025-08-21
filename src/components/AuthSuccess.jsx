import React, { useEffect } from 'react';
  import { useSearchParams, useNavigate } from 'react-router-dom';
  import { useAuth } from '../context/AuthContext';

  const AuthSuccess = () => {
      const [searchParams] = useSearchParams();
      const navigate = useNavigate();
      const { loginAction } = useAuth();

      useEffect(() => {
        // This inner function is already async
        const handleAuth = async () => {
            const token = searchParams.get('token');
            if (token) {
                // Add 'await' here
                await loginAction(token);
                navigate('/');
            } else {
                navigate('/login');
            }
        };
        handleAuth();
    }, [searchParams, navigate, loginAction]);
      return <div>Loading...</div>;
  };

  export default AuthSuccess;