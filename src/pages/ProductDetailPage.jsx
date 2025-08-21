import React from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // 1. Add useNavigate
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext'; // 2. Add useAuth
import Reviews from '../components/Reviews';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
    const { productId } = useParams();
    const { addToCart, buyNow } = useCart(); // 3. Get buyNow
    const { user } = useAuth(); // 4. Get user
    const { products, isLoading } = useProducts();
    const navigate = useNavigate(); // 5. Initialize navigate

    const handleAddToCart = (product) => {
        if (user) {
            addToCart(product);
        } else {
            navigate('/login');
        }
    };

    const handleBuyNow = (product) => {
        if (user) {
            buyNow(product);
            navigate('/shipping');
        } else {
            navigate('/login');
        }
    };

    if (isLoading) { /* ... (no changes) ... */ }
    const product = products.find(p => p.id === parseInt(productId));
    if (!product) { /* ... (no changes) ... */ }

    return (
        <div className="product-detail-container">
            <div className="product-detail-card">
                <div className="product-detail-image-container">
                    <img src={product.image} alt={product.title} className="product-detail-image" />
                </div>
                <div className="product-detail-info">
                    <h1 className="product-detail-title">{product.title}</h1>
                    <p className="product-detail-category">{product.category}</p>
                    <div className="product-detail-rating">
                        <span>{product.rating.rate} ★</span> ({product.rating.count} reviews)
                    </div>
                    <p className="product-detail-price">₹{product.price.toFixed(2)}</p>
                    <p className="product-detail-description">{product.description}</p>
                    <div className="product-detail-buttons">
                        <button onClick={() => handleAddToCart(product)} className="btn-add-to-cart">Add to Cart</button>
                        {/* 6. Connect the new handler */}
                        <button onClick={() => handleBuyNow(product)} className="btn-buy-now">Buy Now</button>
                    </div>
                </div>
            </div>
            {/* The Reviews component can be re-enabled when using a custom backend */}
        </div>
    );
};

export default ProductDetailPage;
