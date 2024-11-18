import React, { useState } from "react";
import { apiServiceAuth } from '../../services/api';
import { Modal } from "semantic-ui-react";

const CommentInput = ({ filmId, userId }) => {
    const [rating, setRating] = useState(null);
    const [review, setReview] = useState("");
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);

    const handleRatingChange = (event) => {
        setRating(event.target.value);
    };

    const handleReviewChange = (event) => {
        setReview(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {   
            await apiServiceAuth.createComment(userId, filmId, {
                rating: parseInt(rating, 10),
                review: review
            });
            setShowModal(true);

            setTimeout(() => {
                setShowModal(false);
            }, 2000);
        } catch (error) {
            setError(error.response.data.message);
        } finally {
            handleReset()
        }
    };

    const handleReset = () => {
        setRating(null);
        setReview("");
    };

    return (
        <div className="comment-form-container">
            <h2>Add Yours!</h2>
            {error && <p className="error-message">{error}</p>}
            <form id="review-form" onSubmit={handleSubmit}>
                <div className="comment-stars-container">
                    <label htmlFor="rate">Rating:</label>
                    <div className="comment-stars">
                        <input type="radio" id="star5" name="rate" value="5" checked={rating === "5"} onChange={handleRatingChange} />
                        <label htmlFor="star5" title="5 stars"></label>
                        <input type="radio" id="star4" name="rate" value="4" checked={rating === "4"} onChange={handleRatingChange} />
                        <label htmlFor="star4" title="4 stars"></label>
                        <input type="radio" id="star3" name="rate" value="3" checked={rating === "3"} onChange={handleRatingChange} />
                        <label htmlFor="star3" title="3 stars"></label>
                        <input type="radio" id="star2" name="rate" value="2" checked={rating === "2"} onChange={handleRatingChange} />
                        <label htmlFor="star2" title="2 stars"></label>
                        <input type="radio" id="star1" name="rate" value="1" checked={rating === "1"} onChange={handleRatingChange} />
                        <label htmlFor="star1" title="1 star"></label>
                    </div>
                </div>
                <div className="comment-form-group">
                    <label htmlFor="review">Ulasan:</label>
                    <textarea
                        id="review"
                        name="review"
                        rows="4"
                        value={review}
                        onChange={handleReviewChange}
                        required
                    ></textarea>
                </div>
                <div className="comment-form-buttons">
                    <button type="button" className="btn btn-danger" onClick={handleReset}>
                        Reset
                    </button>
                    <button type="submit" className="btn btn-primary">
                        Submit
                    </button>
                </div>
            </form>

            {/* Success Modal */}
            <Modal
                size="mini"
                open={showModal}
                onClose={() => setShowModal(false)}
                className="confirm-comment-modal"
            >
                <Modal.Header>Success</Modal.Header>
                <Modal.Content>
                    <p>Your comment was submitted successfully!</p>
                </Modal.Content>
            </Modal>
        </div>
    );
};

export default CommentInput;
