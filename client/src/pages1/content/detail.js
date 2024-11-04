import React, { useEffect } from "react";
import { Tooltip } from 'bootstrap';

const Detail = ({ movie }) => {

    // Initialize tooltips on component mount
    useEffect(() => {
        const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.forEach(tooltipTriggerEl => new Tooltip(tooltipTriggerEl));
    }, []);

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (i < rating ? '★' : '☆')).join('');
    };

    return (
        <div className="film-detail-container">
            <div>
                <img src={`data:image/jpeg;base64,${movie.picture}`} alt="Film img" className="film-image" />
            </div>
            <div className="film-info">
                <h1>{movie.title}</h1>
                <div className="genre-list">
                    {movie.genres.map((genre, index) => (
                        <span key={index} className="genre-item">{genre}</span>
                    ))}
                </div>
                <h2>Other Title: {movie.alternative_title}</h2>
                <p><strong>Year:</strong> {movie.year}</p>
                <p className="my-2 film-sysnopsis">{movie.sysnopsis}</p>
                <p>
                    <strong>Rate: </strong>
                    <span 
                        className="rating" 
                        data-bs-toggle="tooltip" 
                        data-bs-placement="top"
                        data-bs-custom-class="custom-tooltip"
                        data-bs-title={`Rating: ${movie.rating}`}
                    >
                        {renderStars(movie.rating)}
                    </span>
                </p>
                <p><strong>Availability:</strong> {movie.availability}</p>
            </div>
        </div>
    );
};

export default Detail;