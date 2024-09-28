import React, { useState, useEffect } from "react";
import axios from "axios";

const Comment = ({ id }) => {
    const [visibleComments, setVisibleComments] = useState(5); // Set initial visible comments to 5
    const [reviews, setReviews] = useState([]); // Store fetched reviews
    const [loading, setLoading] = useState(true); // Loading state
    const [rating, setRating] = useState('all'); // State for filtering

    const handleShowMore = () => {
        setVisibleComments(prevVisibleComments => prevVisibleComments + 5); // Show 5 more comments
    };

    useEffect(() => {
        const fetchComment = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/comment/${id}`);
                setReviews(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching movie data:', error);
                setLoading(false);
            }
        };

        fetchComment();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>; // Show loading indicator while data is being fetched
    }

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(i <= rating ? '★' : '☆'); // Menampilkan bintang solid atau kosong berdasarkan rating
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

    // Filter reviews based on selected rating
    const filteredReviews = rating === 'all'
        ? reviews
        : reviews.filter(review => review.rate === parseInt(rating));

    return (
        <div className="container review-container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-3 review-header">
                <h4>({filteredReviews.length}) People think about this drama</h4>
                <div className="filter">
                    Filtered by: 
                    <div className="custom-select">
                        <select value={rating} onChange={(e) => setRating(e.target.value)}>
                            <option value="all">Show All</option>
                            <option value="5">★★★★★</option>
                            <option value="4">★★★★☆</option>
                            <option value="3">★★★☆☆</option>
                            <option value="2">★★☆☆☆</option>
                            <option value="1">★☆☆☆☆</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Display comments, initially show only 'visibleComments' */}
            {filteredReviews.slice(0, visibleComments).map((review, index) => (
                <div className="review-item" key={index}>
                    <div className="review-image"></div>
                    <div className="review-content">
                        <p>
                            <span className="review-name">{review.user}: </span> 
                            <span className="review-date">{formatDate(review.date)}</span> {/* Format date */}
                            said: {review.comment}
                        </p>
                    </div>
                    <div className="review-stars">{renderStars(review.rate)}</div>
                </div>
            ))}

            {/* Show More Button */}
            {visibleComments < filteredReviews.length && (
                <button className="btn btn-primary mt-3 mb-3" onClick={handleShowMore}>
                    Show More
                </button>
            )}
        </div>
    );
};

export default Comment;
