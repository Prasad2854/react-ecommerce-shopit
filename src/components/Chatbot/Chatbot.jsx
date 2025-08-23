import React from 'react';
import { useChatbot } from '../../context/ChatbotContext';
import './Chatbot.css';
import Logo from '../../assets/logo.svg?react';


// --- SVG Icon Components ---
const ChatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 0 24 24" width="28" fill="white">
        <path d="M0 0h24v24H0V0z" fill="none" />
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
    </svg>
);
const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 0 24 24" width="28" fill="white">
        <path d="M0 0h24v24H0V0z" fill="none"/>
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
    </svg>
);

const Chatbot = () => {
    const { 
        isOpen, messages, step, 
        formData, setFormData, error, toggleChat, 
        handleUserResponse, handleAuthAction, 
        confirmation, resetChat
    } = useChatbot();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const renderStep = () => {
        let fieldName, nextStep;
        switch (step) {
            case 'initial':
                return (
                    <div className="chat-options">
                        <button onClick={() => handleUserResponse('login-email', 'I want to log in.')}>Login</button>
                        <button onClick={() => handleUserResponse('register-name', 'I want to sign up.')}>Sign Up</button>
                    </div>
                );
            case 'confirm_action':
                return (
                    <div className="chat-options">
                        <button onClick={() => {
                            if (confirmation && confirmation.onConfirm) {
                                confirmation.onConfirm();
                            }
                        }} className="confirm-yes-btn">
                            Yes, Proceed
                        </button>
                        <button onClick={() => {
                            resetChat('Okay, action cancelled. How else can I help?');
                        }}>
                            No, Go Back
                        </button>
                    </div>
                );
            case 'proactive_message':
                return (
                    <form onSubmit={(e) => { e.preventDefault(); handleUserResponse('initial', e.target.userInput.value); e.target.userInput.value = ''; }} className="chat-form">
                        <input name="userInput" type="text" placeholder="Reply or choose an option..." autoFocus/>
                        <button type="submit">→</button>
                    </form>
                );
            case 'register-name':
                fieldName = 'name'; nextStep = 'register-email';
                return (
                    <form onSubmit={(e) => { e.preventDefault(); handleUserResponse(nextStep, formData[fieldName]); }} className="chat-form">
                        <input type="text" name={fieldName} value={formData[fieldName]} onChange={handleChange} placeholder={`Enter your ${fieldName}...`} required autoFocus/>
                        <button type="submit">→</button>
                    </form>
                );
            case 'login-email':
            case 'register-email':
                fieldName = 'email'; nextStep = step === 'login-email' ? 'login-password' : 'register-password';
                return (
                    <form onSubmit={(e) => { e.preventDefault(); handleUserResponse(nextStep, formData[fieldName]); }} className="chat-form">
                        <input type="email" name={fieldName} value={formData[fieldName]} onChange={handleChange} placeholder={`Enter your ${fieldName}...`} required autoFocus/>
                        <button type="submit">→</button>
                    </form>
                );
            case 'login-password':
            case 'register-password':
                fieldName = 'password';
                nextStep = step === 'login-password' ? null : 'register-confirm';
                const handleSubmit = (e) => {
                    e.preventDefault();
                    nextStep ? handleUserResponse(nextStep, 'Password set.') : handleAuthAction();
                };
                return (
                     <form onSubmit={handleSubmit} className="chat-form">
                        <input type="password" name={fieldName} value={formData[fieldName]} onChange={handleChange} placeholder="Enter your password..." required autoFocus/>
                        <button type="submit">{step === 'login-password' ? 'Login' : '→'}</button>
                    </form>
                );
            case 'register-confirm':
                return <button onClick={handleAuthAction} className="chat-action-btn">Create Account</button>;
            default:
                return null;
        }
    };

    return (
        <div className="chatbot-container">
            <div className={`chat-window ${isOpen ? 'open' : ''}`}>
                <div className="chat-header">
                    <Logo className="chatbot-header-logo" />
                    <h3>ShopIt Assistant</h3>
                </div>
                <div className="chat-body">
                    {messages.map((msg, index) => (
                        <div key={index} className={`chat-message-wrapper ${msg.from}`}>
                            {msg.from === 'bot' && (
                                <Logo className="chatbot-message-logo" />
                            )}
                            <p className={`chat-message ${msg.from}`}>{msg.text}</p>
                        </div>
                    ))}
                    {error && (
                        <div className="chat-message-wrapper error">
                            <p className="chat-message error">{error}</p>
                        </div>
                    )}
                </div>
                <div className="chat-footer">{renderStep()}</div>
            </div>
            <button onClick={toggleChat} className="chatbot-fab">
                {isOpen ? <CloseIcon /> : <ChatIcon />}
            </button>
        </div>
    );
};

export default Chatbot;
