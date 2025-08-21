import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useChatbot } from '../context/ChatbotContext'; 
import './OrderHistoryPage.css';

const OrderHistoryPage = () => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const { token } = useAuth();
    const { requestConfirmation, triggerProactiveChat } = useChatbot(); 

    // Moved fetchOrders outside useEffect so we can call it after cancellation
    const fetchOrders = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/orders/myorders', {
                headers: { 'x-auth-token': token },
            });
            if (!response.ok) throw new Error('Failed to fetch orders.');
            const data = await response.json();
            setOrders(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchOrders();
        }
    }, [token]);

    // --- NEW: Function to handle order cancellation ---
    const handleCancelOrder = (orderId) => {
        // 3. Define the action to be taken on confirmation
        const confirmAction = async () => {
            try {
                const response = await fetch(`http://localhost:5001/api/orders/${orderId}`, {
                    method: 'DELETE',
                    headers: { 'x-auth-token': token },
                });
                if (!response.ok) throw new Error('Failed to cancel order.');
                
                setOrders(currentOrders => currentOrders.filter(order => order._id !== orderId));
                // Show success message in chatbot
                triggerProactiveChat('Your order has been cancelled successfully.');
            } catch (err) {
                setError(err.message);
                triggerProactiveChat(`Error: ${err.message}`);
            }
        };

        // 4. Request confirmation from the user via the chatbot
        requestConfirmation({
            message: 'Are you sure you want to cancel this order? This action cannot be undone.',
            onConfirm: confirmAction,
        });
    };

    if (isLoading) return <div className="loading-container">Loading your orders...</div>;
    if (error) return <div className="loading-container">{error}</div>;

    return (
        <div className="order-history-container">
            <h1>Your Orders</h1>
            {orders.length === 0 ? (
                <p>You have no past orders.</p>
            ) : (
                <div className="orders-list">
                    {orders.map((order) => (
                        <div key={order._id} className="order-card">
                            <div className="order-card-header">
                                <div><span>Order ID:</span> {order._id}</div>
                                <div><span>Date:</span> {new Date(order.createdAt).toLocaleDateString()}</div>
                                <div><span>Total:</span> ₹{order.totalPrice.toFixed(2)}</div>
                            </div>
                            <div className="order-card-body">
                                {order.orderItems.map((item) => (
                                    <div key={item.product} className="order-item-summary">
                                        <img src={item.image} alt={item.name} />
                                        <span>{item.name} (x{item.qty})</span>
                                    </div>
                                ))}
                            </div>
                            {/* --- NEW: Cancel Order Button in Footer --- */}
                            <div className="order-card-footer">
                                <button onClick={() => handleCancelOrder(order._id)} className="cancel-order-btn">
                                    Cancel Order
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderHistoryPage;
