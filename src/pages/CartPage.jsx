import React from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import './CartPage.css';

const CartPage = () => {
    const { cartItems, removeFromCart, updateQuantity, cartTotal, cartItemCount } = useCart();
    const navigate = useNavigate(); // 2. Initialize the navigate function

    // 3. Create the handler function
    const checkoutHandler = () => {
        navigate('/shipping'); // Navigate to the shipping page
    };

    return (
        <div className="cart-page-container">
            <h1 className="cart-title">Your Shopping Cart</h1>
            {cartItemCount === 0 ? (
                <div className="empty-cart-message">
                    <p>Your cart is empty.</p>
                    <Link to="/" className="shop-now-link">Continue Shopping</Link>
                </div>
            ) : (
                <div className="cart-content">
                    <div className="cart-items-list">
                        {cartItems.map(item => (
                            <div key={item.id} className="cart-item-card">
                                <img src={item.image} alt={item.title} className="cart-item-image" />
                                <div className="cart-item-details">
                                    <h3 className="cart-item-title">{item.title}</h3>
                                    <p className="cart-item-price">₹{item.price.toFixed(2)}</p>
                                    <div className="cart-item-quantity">
                                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                                    </div>
                                </div>
                                <button onClick={() => removeFromCart(item.id)} className="cart-item-remove-btn">Remove</button>
                            </div>
                        ))}
                    </div>
                    <div className="cart-summary">
                        <h2>Order Summary</h2>
                        <div className="summary-line">
                            <span>Subtotal ({cartItemCount} items)</span>
                            <span>₹{cartTotal.toFixed(2)}</span>
                        </div>
                        {/* 4. Connect the button to the handler */}
                        <button onClick={checkoutHandler} className="checkout-btn">
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;
