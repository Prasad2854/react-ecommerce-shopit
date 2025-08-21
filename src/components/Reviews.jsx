import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Reviews.css';

const StarRating = ({ rating, setRating }) => {
    return (
        <div className="star-rating">
            {[...Array(5)].map((star, index) => {
                index += 1;
                return (
                    <button
                        type="button"
                        key={index}
                        className={index <= rating ? "on" : "off"}
                        onClick={() => setRating(index)}
                    >
                        <span className="star">&#9733;</span>
                    </button>
                );
            })}
        </div>
    );
};

const Reviews = ({ product, onReviewSubmitted }) => {
    const { user, token } = useAuth();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const submitHandler = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await fetch(`/api/products/${product._id}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token,
                },
                body: JSON.stringify({ rating, comment }),
            });
            
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Could not submit review.');
            }

            setSuccess('Review submitted successfully!');
            setRating(0);
            setComment('');
            onReviewSubmitted(); // This function will refetch the product data
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="reviews-section">
            <h2>Customer Reviews</h2>
            {product.reviews.length === 0 && <p>No reviews yet.</p>}
            <div className="review-list">
                {product.reviews.map((review) => (
                    <div key={review._id} className="review-item">
                        <strong>{review.name}</strong>
                        <StarRating rating={review.rating} />
                        <p>{review.comment}</p>
                        <small>{new Date(review.createdAt).toLocaleDateString()}</small>
                    </div>
                ))}
            </div>

            <div className="review-form-container">
                <h3>Write a Customer Review</h3>
                {success && <p className="success-message">{success}</p>}
                {error && <p className="error-message">{error}</p>}
                {user ? (
                    <form onSubmit={submitHandler}>
                        <div className="form-group">
                            <label>Rating</label>
                            <StarRating rating={rating} setRating={setRating} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="comment">Comment</label>
                            <textarea
                                id="comment"
                                rows="3"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            ></textarea>
                        </div>
                        <button type="submit" className="submit-review-btn">Submit</button>
                    </form>
                ) : (
                    <p>Please <a href="/login">log in</a> to write a review.</p>
                )}
            </div>
        </div>
    );
};

export default Reviews;
