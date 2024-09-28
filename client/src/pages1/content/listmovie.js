import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const ListMovie = ({filterCountry}) => {
    const [movies, setMovies] = useState([]);

    const fetchMovies = useCallback(async () => {
        console.log("Fetching movies for country:", filterCountry); // Debugging line
        try {
            const response = await axios.get('http://localhost:5000/showmovies', { params: { country: filterCountry } });

            const formattedMovies = response.data.map(movie => ({
                id: movie.id, // Ensure 'id' exists in API response
                title: movie.title,
                imgSrc: `data:image/jpeg;base64,${movie.picture}`, 
                year: movie.year,
                badge: movie.status === "On Going" ? "On Going" : "Completed", 
                rating: movie.rate,
                views: movie.views,
                genres: movie.genres.join(', ') 
            }));
            setMovies(formattedMovies);
        } catch (error) {
            console.error('Error fetching movie data:', error);
        }
    }, [filterCountry]); // `useCallback` will ensure `fetchMovies` changes only when `filterCountry` changes.

    useEffect(() => {
        fetchMovies();
    }, [fetchMovies]);

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(i <= rating ? '★' : '☆'); // Menampilkan bintang solid atau kosong berdasarkan rating
        }
        return stars.join(''); // Menggabungkan array bintang menjadi satu string
    };

    return (
        <div className="row">
            {movies.map((movie, index) => (
                <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={index}>
                    <Link to={`/detail/${movie.id}`}>
                        <div className="card bg-transparent">
                            <img src={movie.imgSrc} className="card-img-top" alt="Movie Img" />
                            <span className={`badge ${movie.badge === "On Going" ? "ongoing" : "completed"}`}>
                                {movie.badge}
                            </span>
                            <div className="card-body">
                                <h5 className="card-title">{movie.title}</h5>
                                <p className="card-text">{movie.year}</p>
                                <p className="card-text">{movie.genres}</p>
                                <div className="rating-container">
                                    <p className="card-text mb-0 rating">{renderStars(movie.rating)}</p>
                                    {movie.views && <p className="card-text mb-0">views {movie.views}</p>}
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            ))}
        </div>
    );
};

export default ListMovie;
