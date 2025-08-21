import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { categories, products } from '../data/mockData';
import './ProductListPage.css';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';

// This is a reusable card component for our products
// const ProductCard = ({ product }) => {
//     const [imageUrl, setImageUrl] = useState(null);

//     useEffect(() => {
//         const fetchImage = async () => {
//             try {
//                 // Fetch image from our backend API
//                 const response = await fetch(`http://localhost:5001/api/products/image?q=${encodeURIComponent(product.query)}`);
//                 if (!response.ok) {
//                     throw new Error('Network response was not ok');
//                 }
//                 const data = await response.json();
//                 setImageUrl(data.imageUrl);
//             } catch (error) {
//                 console.error("Failed to fetch image:", error);
//                 setImageUrl('https://placehold.co/400x400/cccccc/ffffff?text=Image+Error');
//             }
//         };

//         fetchImage();
//     }, [product.query]);

//     return (
//         <div className="product-list-card">
//             <div className="product-list-image-container">
//                 {imageUrl ? (
//                     <img src={imageUrl} alt={product.name} className="product-list-image" />
//                 ) : (
//                     <div className="product-image-loader"></div>
//                 )}
//             </div>
//             <div className="product-list-info">
//                 <h3 className="product-list-name">{product.name}</h3>
//                 <p className="product-list-rating">Rating: {product.rating} ★</p>
//                 <p className="product-list-price">{product.price}</p>
//                 <div className="product-list-buttons">
//                     <button className="btn-add-to-cart">Add to Cart</button>
//                     <button className="btn-buy-now">Buy Now</button>
//                 </div>
//             </div>
//         </div>
//     );
// };

const ProductListPage = () => {
    const { categoryName } = useParams();
    const { products, isLoading } = useProducts();
    const { addToCart } = useCart(); // 2. Get the addToCart function

    if (isLoading) {
        return <div className="loading-container">Loading products...</div>;
    }

    const categoryProducts = products.filter(prod => prod.category === decodeURIComponent(categoryName));

    return (
        <div className="product-list-page-container">
            <h1 className="product-list-title" style={{textTransform: 'capitalize'}}>{decodeURIComponent(categoryName)}</h1>
            <div className="product-list-grid">
                {categoryProducts.map(product => (
                    <div key={product.id} className="category-product-card">
                        <img src={product.image} alt={product.title} className="product-image" />
                        <h3 className="product-name">{product.title}</h3>
                        <p className="product-price">₹{product.price}</p>
                        {/* 3. Call addToCart when the button is clicked */}
                        <button onClick={() => addToCart(product)} className="add-to-cart-btn">Add to Cart</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductListPage;