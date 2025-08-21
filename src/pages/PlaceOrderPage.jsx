import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useChatbot } from '../context/ChatbotContext'; // 1. Import the chatbot hook
import './PlaceOrderPage.css';

const PlaceOrderPage = () => {
    const navigate = useNavigate();
    const { cartItems, shippingAddress, paymentMethod, cartTotal, clearCart } = useCart();
    const { token } = useAuth();
    const { triggerProactiveChat } = useChatbot(); // 2. Get the trigger function

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const itemsPrice = cartTotal;
    const shippingPrice = itemsPrice > 500 ? 0 : 50;
    const taxPrice = (0.18 * itemsPrice);
    const totalPrice = itemsPrice + shippingPrice + taxPrice;

    const placeOrderHandler = async () => {
        setIsLoading(true);
        setError('');
        try {
            const res = await fetch('http://localhost:5001/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token,
                },
                body: JSON.stringify({
                    orderItems: cartItems.map(item => ({
                        name: item.title,
                        qty: item.quantity,
                        image: item.image,
                        price: item.price,
                        product: item.id, 
                    })),
                    shippingAddress,
                    paymentMethod,
                    itemsPrice,
                    taxPrice,
                    shippingPrice,
                    totalPrice,
                }),
            });

            const createdOrder = await res.json();
            if (!res.ok) throw new Error(createdOrder.message || 'Could not place order.');

            clearCart();
            
            // 3. Trigger the success pop-up and redirect to the homepage
             triggerProactiveChat('Your order has been placed successfully!');
            navigate('/');

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="place-order-container">
            <div className="place-order-grid">
                <div className="order-details">
                    <div className="detail-section">
                        <h2>Shipping Address</h2>
                        <p>
                            <strong>Address: </strong>
                            {shippingAddress.address}, {shippingAddress.city},{' '}
                            {shippingAddress.postalCode}, {shippingAddress.country}
                        </p>
                    </div>
                    <div className="detail-section">
                        <h2>Payment Method</h2>
                        <p><strong>Method: </strong>{paymentMethod}</p>
                    </div>
                    <div className="detail-section">
                        <h2>Order Items</h2>
                        {cartItems.length === 0 ? (
                            <p>Your cart is empty.</p>
                        ) : (
                            <div className="order-items-list">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="order-item">
                                        <img src={item.image} alt={item.title} className="order-item-image" />
                                        <Link to={`/product/${item.id}`} className="order-item-name">{item.title}</Link>
                                        <div className="order-item-price">
                                            {item.quantity} x ₹{item.price.toFixed(2)} = ₹{(item.quantity * item.price).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div className="order-summary-card">
                    <h2>Order Summary</h2>
                    <div className="summary-line">
                        <span>Items</span>
                        <span>₹{itemsPrice.toFixed(2)}</span>
                    </div>
                    <div className="summary-line">
                        <span>Shipping</span>
                        <span>₹{shippingPrice.toFixed(2)}</span>
                    </div>
                    <div className="summary-line">
                        <span>Tax (18%)</span>
                        <span>₹{taxPrice.toFixed(2)}</span>
                    </div>
                    <div className="summary-line total">
                        <span>Total</span>
                        <span>₹{totalPrice.toFixed(2)}</span>
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button
                        type="button"
                        className="place-order-btn"
                        disabled={cartItems.length === 0 || isLoading}
                        onClick={placeOrderHandler}
                    >
                        {isLoading ? 'Placing Order...' : 'Place Order'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PlaceOrderPage;
