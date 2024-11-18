import React, { useState, useEffect, useCallback } from "react";
import { apiServicePublic } from '../../services/api';

const Comment = ({ id }) => {
    const [visibleComments, setVisibleComments] = useState(5); // Set initial visible comments to 5
    const [reviews, setReviews] = useState([]); // Store fetched reviews
    const [loading, setLoading] = useState(true); // Loading state
    const [filter, setFilter] = useState('all'); // State for filtering

    const handleShowMore = () => {
        setVisibleComments(prevVisibleComments => prevVisibleComments + 5);
    };

    const fetchComment = useCallback(async () => {
        setLoading(true);
        try {
            const response = await apiServicePublic.getCommentByIdFilm(id, {filter: filter});
            setReviews(response.data.data);
        } catch (error) {
            console.error('Error fetching comments:', error);   
        } finally {
            setLoading(false);
        }
    }, [id, filter]);

    useEffect(() => {
        fetchComment();
    }, [fetchComment]);

    if (loading) {
        return <div>Loading...</div>;
    }

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(i <= rating ? '★' : '☆');
        }
        return stars.join('');
    };

    // Function to format date as YYYY-MM-DD
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (`0${date.getMonth() + 1}`).slice(-2); // Add leading zero if needed
        const day = (`0${date.getDate()}`).slice(-2); // Add leading zero if needed
        return `${year}-${month}-${day}`;
    };

    return (
        <div className="container review-container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-3 review-header">
                <h4>({reviews.length}) People think about this drama</h4>
                <div className="filter">
                    Filtered by: 
                    <div className="custom-select">
                        <select onChange={(e) => setFilter(e.target.value)}>
                            <option value="">Show All</option>
                            <option value="5">⭐⭐⭐⭐⭐</option>
                            <option value="4">⭐⭐⭐⭐</option>
                            <option value="3">⭐⭐⭐</option>
                            <option value="2">⭐⭐</option>
                            <option value="1">⭐</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Display comments, initially show only 'visibleComments' */}
            {reviews.slice(0, visibleComments).map((review, index) => (
                <div className="review-item" key={index}>
                    <img
                        src={`data:image/jpeg;base64,${review.picture}`} 
                        alt={review.name}
                        className="review-image"
                    />
                    <div className="review-content">
                        <p>
                            <span className="review-name">{review.user}: </span> 
                            <span className="review-date">{formatDate(review.date)}</span> {/* Format date */}
                            said: {review.comment}
                        </p>
                    </div>
                    <div className="review-stars">{renderStars(review.rating)}</div>
                </div>
            ))}

            {/* Show More Button */}
            {visibleComments < reviews.length && (
                <button className="btn btn-primary mt-3 mb-3" onClick={handleShowMore}>
                    Show More
                </button>
            )}
        </div>
    );
};

export default Comment;