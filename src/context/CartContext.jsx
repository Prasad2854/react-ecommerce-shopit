import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    
    const [shippingAddress, setShippingAddress] = useState(() => {
        try {
            const savedAddress = localStorage.getItem('shippingAddress');
            return savedAddress ? JSON.parse(savedAddress) : {};
        } catch (error) {
            return {};
        }
    });
    const [paymentMethod, setPaymentMethod] = useState('PayPal');


    useEffect(() => {
        if (user) {
            const localData = localStorage.getItem(`cartItems_${user._id}`);
            setCartItems(localData ? JSON.parse(localData) : []);
        } else {
            setCartItems([]);
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            localStorage.setItem(`cartItems_${user._id}`, JSON.stringify(cartItems));
        }
        localStorage.setItem('shippingAddress', JSON.stringify(shippingAddress));
    }, [cartItems, user, shippingAddress]);

    const addToCart = (product) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.id);
            if (existingItem) {
                return prevItems.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                return [...prevItems, { ...product, quantity: 1 }];
            }
        });
    };
    
    const removeFromCart = (productId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            setCartItems(prevItems =>
                prevItems.map(item =>
                    item.id === productId ? { ...item, quantity: newQuantity } : item
                )
            );
        }
    };
    
    const clearCart = () => { setCartItems([]); };

    const buyNow = (product) => {
        // Clear the cart and add the single new item with quantity 1
        setCartItems([{ ...product, quantity: 1 }]);
    };

    const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    const value = {
        cartItems, addToCart, removeFromCart, updateQuantity, clearCart, buyNow,
        cartItemCount, cartTotal,
        shippingAddress, setShippingAddress,
        paymentMethod, setPaymentMethod,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
