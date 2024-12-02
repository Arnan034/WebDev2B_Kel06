import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { apiServicePublic } from '../../services/api';
import { Tooltip } from 'bootstrap';

const ListMovie = ({ filterCountry, filterMovie, SortFilm }) => {
    const navigate = useNavigate();
    const [movies, setMovies] = useState([]);
    const [loadedMovies, setLoadedMovies] = useState(12);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingfilm, setLoadingfilm] = useState(false);

    const fetchMovies = useCallback(async () => {
        setLoadingfilm(true);
        try {
            const response = await apiServicePublic.getAllFilm({
                country: filterCountry,
                sort: SortFilm, 
                year: filterMovie.year,
                availability: filterMovie.availability,
                genre: filterMovie.genre,
                award: filterMovie.award,
                status: filterMovie.status
            });
    
            const formattedMovies = response.data.data.map(movie => ({
                id: movie.id,
                title: movie.title,
                imgSrc: `data:image/jpeg;base64,${movie.picture}`,
                year: movie.year,
                badge: movie.status === "On Going" ? "On Going" : "Completed",
                rating: movie.rate,
                views: movie.views,
                genres: movie.genres.join(', ')
            }));
    
            setMovies(formattedMovies);
            setLoadedMovies(12);
            setHasMore(formattedMovies.length > 12);
        } catch (error) {
            console.error('Error fetching movie data:', error);
        } finally {
            setLoadingfilm(false);
        }
    }, [filterCountry, filterMovie, SortFilm]);    

    useEffect(() => {
        fetchMovies();
    }, [fetchMovies]);

    const loadMoreMovies = useCallback(async () => {
        if (loadedMovies >= movies.length) {
            setHasMore(false);
            console.log("No more movies to load.");
            return;
        }

        setIsLoading(true);

        // Simulasi delay 3 detik
        await new Promise(resolve => setTimeout(resolve, 2000));

        setLoadedMovies((prevLoadedMovies) => prevLoadedMovies + 12);
        setIsLoading(false);
    }, [loadedMovies, movies.length]);

    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 50 && hasMore && !isLoading) {
                loadMoreMovies();
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, [loadMoreMovies, hasMore, isLoading]);

    const updateView = async (id) => {
        try {
            await apiServicePublic.updatePlusView(id);
        } catch (error) {
            console.error('Error incrementing view:', error);
        }
    }
    
    useEffect(() => {
        const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.forEach(tooltipTriggerEl => new Tooltip(tooltipTriggerEl));
    }, []);

    const handleMovieClick = (movieId) => {
        sessionStorage.setItem("scrollPosition", window.scrollY);
        updateView(movieId);
        navigate(`/detail/${movieId}`);
    };

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(i <= rating ? '★' : '☆');
        }
        return stars.join('');
    };

    return (
        <div className="row">
            {loadingfilm ? (
                <div class="d-flex justify-content-center">
                    <div class="spinner-border" role="status">
                        <span class="sr-only">Loading...</span>
                    </div>
                </div>
            ) : (
                movies.slice(0, loadedMovies).map((movie, index) => (
                    <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={index}>
                        <div onClick={() => handleMovieClick(movie.id)}>
                            <div className="card bg-transparent">
                                <img src={movie.imgSrc} className="card-img-top" alt="Movie Img" />
                                <span className={`badge ${movie.badge === "On Going" ? "on-going" : "completed"}`}>
                                    {movie.badge}
                                </span>
                                <div className="card-body">
                                    <h5 className="card-title">{movie.title}</h5>
                                    <p className="card-text">{movie.year}</p>
                                    <p className="card-text">{movie.genres}</p>
                                    <div className="rating-container">
                                        <p className="card-text mb-0 rating" 
                                            data-bs-toggle="tooltip" 
                                            data-bs-placement="top"
                                            data-bs-custom-class="custom-tooltip"
                                            data-bs-title={`Rating: ${movie.rating}`}>
                                                {renderStars(movie.rating)}
                                        </p>
                                        {movie.views && <p className="card-text mb-0">views {movie.views}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            )}
            {isLoading && (
                <div className="d-flex justify-content-center loading-spinner">
                    {/* Gambar Spinner */}
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}
            {!hasMore && !isLoading && <p>No more movies to load.</p>}
        </div>
    );
};

export default ListMovie;
