import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './CategoryPage.css';

const CategoryPage = () => {
    const { categoryName } = useParams();
    const { products, isLoading } = useProducts();
    const { addToCart, buyNow } = useCart(); // 1. Get buyNow function
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleAddToCart = (product) => {
        if (user) {
            addToCart(product);
        } else {
            navigate('/login');
        }
    };

    // 2. Create a handler for the Buy Now action
    const handleBuyNow = (product) => {
        if (user) {
            buyNow(product);
            navigate('/shipping');
        } else {
            navigate('/login');
        }
    };

    if (isLoading) {
        return <div className="loading-container">Loading products...</div>;
    }

    const categoryProducts = products.filter(prod => prod.category === decodeURIComponent(categoryName));

    return (
        <div className="category-page-container">
            <h1 className="category-title" style={{textTransform: 'capitalize'}}>{decodeURIComponent(categoryName)}</h1>
            <div className="category-product-grid">
                {categoryProducts.map(product => (
                    <div key={product.id} className="category-product-card">
                        <Link to={`/product/${product.id}`} className="product-image-link">
                            <img src={product.image} alt={product.title} className="product-image" />
                        </Link>
                        <div className="category-product-info">
                            <h3 className="product-name">{product.title}</h3>
                            <p className="product-price">₹{product.price.toFixed(2)}</p>
                            <div className="product-card-buttons">
                                <button onClick={() => handleAddToCart(product)} className="btn-add-to-cart">Add to Cart</button>
                                {/* 3. Connect the new handler to the button */}
                                <button onClick={() => handleBuyNow(product)} className="btn-buy-now">Buy Now</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoryPage;
