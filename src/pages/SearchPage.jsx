import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './SearchPage.css';

const SearchPage = () => {
    const { search } = useLocation();
    const query = new URLSearchParams(search).get('q');
    
    const { products, isLoading } = useProducts();
    const { addToCart, buyNow } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

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

    if (isLoading) {
        return <div className="loading-container">Searching for products...</div>;
    }

    const filteredProducts = products.filter(product =>
        product.title.toLowerCase().includes(query ? query.toLowerCase() : '')
    );

    return (
        <div className="search-page-container">
            <h1 className="search-title">
                {filteredProducts.length > 0
                    ? `Showing results for "${query}"`
                    : `No results found for "${query}"`}
            </h1>
            <div className="search-results-grid">
                {filteredProducts.map(product => (
                    // Using the same detailed card structure as the Category Page
                    <div key={product.id} className="category-product-card">
                        <Link to={`/product/${product.id}`} className="product-image-link">
                            <img src={product.image} alt={product.title} className="product-image" />
                        </Link>
                        <div className="category-product-info">
                            <h3 className="product-name">{product.title}</h3>
                            <p className="product-price">₹{product.price.toFixed(2)}</p>
                            <div className="product-card-buttons">
                                <button onClick={() => handleAddToCart(product)} className="btn-add-to-cart">Add to Cart</button>
                                <button onClick={() => handleBuyNow(product)} className="btn-buy-now">Buy Now</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SearchPage;
