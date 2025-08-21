import React, { createContext, useState, useContext } from 'react';
import { useAuth } from './AuthContext';

const ChatbotContext = createContext();
export const useChatbot = () => useContext(ChatbotContext);

// Changed "export const ChatbotProvider" to just "const ChatbotProvider"
const ChatbotProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState('initial');
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [messages, setMessages] = useState([
        { from: 'bot', text: 'Welcome! Would you like to Login or Sign Up?' }
    ]);
    const [error, setError] = useState('');
    const { loginAction } = useAuth();

    const [confirmation, setConfirmation] = useState({
        isActive: false,
        message: '',
        onConfirm: null,
    });

    const resetChat = (message) => {
        setMessages([{ from: 'bot', text: message || 'Welcome! Would you like to Login or Sign Up?' }]);
        setStep('initial');
        setFormData({ name: '', email: '', password: '' });
        setError('');
        setConfirmation({ isActive: false, message: '', onConfirm: null });
    };

    const toggleChat = () => {
        const newIsOpen = !isOpen;
        setIsOpen(newIsOpen);
        if (newIsOpen) {
            resetChat();
        }
    };

    const requestConfirmation = ({ message, onConfirm }) => {
        setMessages([{ from: 'bot', text: message }]);
        setConfirmation({ isActive: true, message, onConfirm });
        setStep('confirm_action');
        setIsOpen(true);
    };

    const triggerProactiveChat = (initialMessage) => {
        resetChat(initialMessage);
        setStep('proactive_message');
        setIsOpen(true);
    };

    const handleUserResponse = (nextStep, userMessage) => {
        if (userMessage) {
            setMessages(prev => [...prev, { from: 'user', text: userMessage }]);
        }
        setError('');
        let botMessage = '';
        switch (nextStep) {
            case 'login-email': botMessage = 'Great! Please enter your email address.'; break;
            case 'login-password': botMessage = 'Thanks! Now, please enter your password.'; break;
            case 'register-name': botMessage = 'Awesome! What should we call you?'; break;
            case 'register-email': botMessage = `Nice to meet you, ${formData.name}! What's your email?`; break;
            case 'register-password': botMessage = 'Got it. Now, please create a secure password.'; break;
            case 'register-confirm': botMessage = 'Everything looks good! Ready to create your account?'; break;
            case 'initial': botMessage = 'How else can I help?'; break;
        }
        if (botMessage) {
            setTimeout(() => setMessages(prev => [...prev, { from: 'bot', text: botMessage }]), 500);
        }
        setStep(nextStep);
    };

    const handleAuthAction = async () => {
        setError('');
        const endpoint = step === 'login-password' ? 'login' : 'register';
        const payload = endpoint === 'login' ? { email: formData.email, password: formData.password } : formData;
        try {
            const response = await fetch(`http://localhost:5001/api/auth/${endpoint}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            const data = await response.json();
            if (!response.ok) throw new Error(data.msg || 'An error occurred.');
            if (endpoint === 'register') {
                setMessages(prev => [...prev, { from: 'bot', text: 'Registration successful! Logging you in...' }]);
                const loginResponse = await fetch(`http://localhost:5001/api/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: formData.email, password: formData.password }) });
                const loginData = await loginResponse.json();
                if (!loginResponse.ok) throw new Error(loginData.msg || 'Auto-login failed.');
                await loginAction(loginData.token);
            } else {
                await loginAction(data.token);
            }
            setMessages(prev => [...prev, { from: 'bot', text: 'Success! You are now logged in.' }]);
            setTimeout(() => setIsOpen(false), 2000);
        } catch (err) {
            setError(err.message);
            setTimeout(() => resetChat("Let's try that again. Would you like to Login or Sign Up?"), 1000);
        }
    };

    const value = { isOpen, messages, setMessages, step, setStep, formData, setFormData, error, setError, toggleChat, triggerProactiveChat, resetChat, handleUserResponse, handleAuthAction, requestConfirmation, confirmation };

    return (
        <ChatbotContext.Provider value={value}>
            {children}
        </ChatbotContext.Provider>
    );
};

export default ChatbotProvider;
