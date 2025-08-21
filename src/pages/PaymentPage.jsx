import React, { useState, useEffect } from 'react'; // 1. Import useEffect
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './PaymentPage.css'; // 2. Corrected the CSS import

const PaymentPage = () => {
    const { shippingAddress, setPaymentMethod } = useCart();
    const navigate = useNavigate();

    // 3. Use useEffect for side-effects like navigation
    useEffect(() => {
        // If the user lands on this page without a shipping address, redirect them back
        if (shippingAddress && !shippingAddress.address) {
            navigate('/shipping');
        }
    }, [shippingAddress, navigate]);

    const [paymentMethod, setPaymentMethodState] = useState('Razorpay');

    const submitHandler = (e) => {
        e.preventDefault();
        setPaymentMethod(paymentMethod);
        // In a real app, you would navigate to a place order summary page
        navigate('/placeorder'); 
        // navigate('/placeorder');
    };

    // To prevent rendering before the redirect check happens
    if (!shippingAddress || !shippingAddress.address) {
        return null; // or a loading spinner
    }

    return (
        <div className="payment-container">
            <div className="form-wrapper">
                <h1>Payment Method</h1>
                <form onSubmit={submitHandler}>
                    <div className="form-group">
                        <label>Select Your Payment Method</label>
                        <div className="payment-options-list">
                            <label className={`payment-option ${paymentMethod === 'CashOnDelivery' ? 'selected' : ''}`}>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="CashOnDelivery"
                                    checked={paymentMethod === 'CashOnDelivery'}
                                    onChange={(e) => setPaymentMethodState(e.target.value)}
                                />
                                <div className="payment-option-content">
                                    <strong>Cash On Delivery</strong>
                                </div>
                            </label>
                            {/* You can add other payment options here */}
                        </div>
                    </div>
                    <button type="submit" className="continue-btn">Continue</button>
                </form>
            </div>
        </div>
    );
};

export default PaymentPage;
