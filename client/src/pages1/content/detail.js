import React from "react";

const Detail = ( {movie} ) => {

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(i <= rating ? '★' : '☆'); // Menampilkan bintang solid atau kosong berdasarkan rating
        }
        return stars.join(''); // Menggabungkan array bintang menjadi satu string
    };

    return (
        <div className="film-detail-container">
            <img src={`data:image/jpeg;base64,${movie.picture}`} alt="Film img" className="film-image" />
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
                <p><strong>Rate:</strong> <span className="rating">{renderStars(movie.rating)}</span></p>
                <p><strong>Availability:</strong> {movie.availability}</p>
            </div>
        </div>
    );
};

export default Detail;
