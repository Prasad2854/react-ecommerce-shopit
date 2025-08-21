import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

// This is our new, smart component for displaying a product
const ProductCard = ({ product }) => {
    const [imageUrl, setImageUrl] = useState(null);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const response = await fetch(`http://localhost:5001/api/products/image?q=${encodeURIComponent(product.imageQuery)}`);
                if (!response.ok) throw new Error('Image fetch failed');
                const data = await response.json();
                setImageUrl(data.imageUrl);
            } catch (error) {
                console.error("Failed to fetch image:", error);
                setImageUrl('https://placehold.co/400x400/cccccc/ffffff?text=Image+Error');
            }
        };

        if (product.imageQuery) {
            fetchImage();
        }
    }, [product.imageQuery]);

    return (
        <div className="product-card-container">
            <Link to={`/product/${product._id}`} className="product-card-link">
                <div className="product-card-image-wrapper">
                    {imageUrl ? (
                        <img src={imageUrl} alt={product.name} className="product-card-image" />
                    ) : (
                        <div className="product-image-loader"></div>
                    )}
                </div>
                <div className="product-card-info">
                    <h3 className="product-card-name">{product.name}</h3>
                    <p className="product-card-price">₹{product.price}</p>
                </div>
            </Link>
            <button onClick={() => addToCart(product)} className="product-card-add-btn">Add to Cart</button>
        </div>
    );
};

export default ProductCard;
