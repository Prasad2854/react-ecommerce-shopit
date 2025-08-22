// src/main.jsx
import { HashRouter as Router } from 'react-router-dom'; 
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { ThemeProvider } from './context/ThemeContext';
import AuthProvider from './context/AuthContext';
import ChatbotProvider from './context/ChatbotContext';
import { ProductProvider } from './context/ProductContext';
import { CartProvider } from './context/CartContext'; // 1. Import CartProvider

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
  <Router> 
    <ThemeProvider>
      <AuthProvider>
        <ChatbotProvider>
          <ProductProvider>
            <CartProvider>
              <App />
            </CartProvider>
          </ProductProvider>
        </ChatbotProvider>
      </AuthProvider>
    </ThemeProvider>
  </Router>
</React.StrictMode>,
);