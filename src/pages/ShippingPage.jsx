import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './ShippingPage.css';

const ShippingPage = () => {
    const { setShippingAddress, shippingAddress } = useCart();
    const navigate = useNavigate();

    const [address, setAddress] = useState(shippingAddress.address || '');
    const [city, setCity] = useState(shippingAddress.city || '');
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
    const [country, setCountry] = useState(shippingAddress.country || '');

    const submitHandler = (e) => {
        e.preventDefault();
        setShippingAddress({ address, city, postalCode, country });
        navigate('/payment');
    };

    return (
        <div className="shipping-container">
            <div className="form-wrapper">
                <h1>Shipping Address</h1>
                <form onSubmit={submitHandler}>
                    <div className="form-group">
                        <label htmlFor="address">Address</label>
                        <input type="text" id="address" value={address} onChange={(e) => setAddress(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="city">City</label>
                        <input type="text" id="city" value={city} onChange={(e) => setCity(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="postalCode">Postal Code</label>
                        <input type="text" id="postalCode" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="country">Country</label>
                        <input type="text" id="country" value={country} onChange={(e) => setCountry(e.target.value)} required />
                    </div>
                    <button type="submit" className="continue-btn">Continue to Payment</button>
                </form>
            </div>
        </div>
    );
};

export default ShippingPage;
