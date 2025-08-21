import React from 'react';
import { Link } from 'react-router-dom';
import Slider from "react-slick";
import { useProducts } from '../context/ProductContext';
import { useNavigate } from 'react-router-dom'; 
import { useCart } from '../context/CartContext';
import SearchBar from '../components/SearchBar';
import localVideo2 from '../assets/video2.mp4'; 
import localVideo3 from '../assets/video3.mp4'; 
import useWindowSize from '../hooks/useWindowSize'; 
import { useAuth } from '../context/AuthContext'; 

// CSS Imports
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import './HomePage.css';

// Component Imports
import WelcomePopup from '../components/WelcomePopup';

const BannerSlider = () => {
    // --- NEW BANNER DATA ---
    const banners = [
        {
            type: 'video',
            url: localVideo3,
            title: 'Immerse Yourself.',
            subtitle: 'The New Noise-Cancelling Headphones',
            link: '/category/electronics'
        },
        {
            type: 'video',
            url: localVideo2,
            title: 'Timeless Elegance.',
            subtitle: 'Explore Our Jewelery Collection',
            link: '/category/jewelery'
        },
    ];

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,      // Must be 1 for fade effect
        slidesToScroll: 1,    // Must be 1 for fade effect
        autoplay: true,
        autoplaySpeed: 5000,
        fade: true,
        cssEase: 'linear',
        arrows: false
    };

    return (
        <div className="banner-slider">
            <Slider {...settings}>
                {banners.map((banner, index) => (
                    <div key={index} className="slick-slide-item">
                        {banner.type === 'video' ? (
                            <video 
                                src={banner.url} 
                                className="slick-video" 
                                autoPlay loop muted playsInline
                            />
                        ) : (
                            <img src={banner.url} alt={banner.title} className="slick-img" />
                        )}
                        {/* --- NEW TEXT OVERLAY --- */}
                        <div className="slick-content">
                            <h1>{banner.title}</h1>
                            <p>{banner.subtitle}</p>
                            <Link to={banner.link} className="banner-btn">Shop Now</Link>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

const CategoryGrid = () => {
    const { categories, isLoading } = useProducts();
    const categoryImages = {
        "electronics": 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        "jewelery": 'https://images.pexels.com/photos/265906/pexels-photo-265906.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        "men's clothing": 'https://images.pexels.com/photos/837140/pexels-photo-837140.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        "women's clothing": 'https://images.pexels.com/photos/375880/pexels-photo-375880.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    };

    if (isLoading) return <div className="loading-container">Loading Categories...</div>;

    return (
        <div className="category-section">
            <h2>Shop by Category</h2>
            <div className="category-grid">
                {categories.map(categoryName => (
                    <Link to={`/category/${encodeURIComponent(categoryName)}`} key={categoryName} className="category-card-link">
                        <div 
                            className="category-card" 
                            style={{ backgroundImage: `url(${categoryImages[categoryName] || 'https://placehold.co/600x400'})` }}
                        >
                            <div className="category-card-overlay">
                                <span style={{textTransform: 'capitalize'}}>{categoryName}</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

const ProductGrid = () => {
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
        return (
            <div className="product-section">
                <h2>Featured Products</h2>
                <div className="loading-container">Loading products...</div>
            </div>
        );
    }

    return (
        <div className="product-section">
            <h2>Featured Products</h2>
            <div className="product-grid">
                {products.slice(0, 4).map(product => (
                     <div key={product.id} className="product-card">
                        <Link to={`/product/${product.id}`}>
                            <img src={product.image} alt={product.title} className="hp-product-image" />
                        </Link>
                        <div className="hp-product-info">
                            <h3 className="hp-product-name">
                                <Link to={`/product/${product.id}`} className="product-title-link">
                                    {product.title}
                                </Link>
                            </h3>
                            <p className="hp-product-price">₹{product.price}</p>
                        </div>
                        <div className="hp-product-footer">
                            {/* 6. Add both buttons here */}
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


const HomePage = () => {
    // 2. Get the current window width from our custom hook
    const { width } = useWindowSize();

    return (
        <div className="homepage-container">
            <WelcomePopup />
            
            {/* 3. Conditionally render the SearchBar on the homepage */}
            {/* It will only appear if the screen width is 900px or less. */}
            {width <= 900 && <SearchBar />}
            
            <BannerSlider />
            <CategoryGrid />
            <ProductGrid />
        </div>
    );
};

export default HomePage;
