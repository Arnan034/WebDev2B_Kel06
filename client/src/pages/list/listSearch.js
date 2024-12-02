import React, { useEffect, useState, useCallback } from "react";
import { Link} from "react-router-dom";
import { apiServicePublic } from '../../services/api';

const ListSearch = ({ filterCountry, searchQuery, filterMovie, SortFilm }) => {
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchMovies = useCallback(async () => {
        setIsLoading(true)
        try {
            const response = await apiServicePublic.getFilmSearch({ 
                search: searchQuery,
                country: filterCountry ? parseInt(filterCountry) : undefined,
                sort: SortFilm,
                year: filterMovie.year,
                availability: filterMovie.availability,
                genre: filterMovie.genre,
                award: filterMovie.award,
                status: filterMovie.status
            });
            
            const formattedMovies = response.data.data.map(movie => ({
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
        } finally {
            setIsLoading(false)
        }
    }, [filterCountry, searchQuery, filterMovie, SortFilm]); // Dependency on filterCountry only

    useEffect(() => {
        fetchMovies();
    }, [fetchMovies]);

    const updateView = async (id) => {
        try {
            await apiServicePublic.updatePlusView(id);
        } catch (error) {
            console.error('Error incrementing view:', error);
        }
    }

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(i <= rating ? '★' : '☆');
        }
        return stars.join('');
    };

    return (
        <div className="row">
            {isLoading ? (
                <div class="d-flex justify-content-center">
                    <div class="spinner-border" role="status">
                        <span class="sr-only">Loading...</span>
                    </div>
                </div>
            ) : (
                movies.length > 0 ? (
                    movies.map((movie, index) => (
                        <div className="col-md-6" key={index}>
                            <div className="card-wrapper">
                                <Link to={`/detail/${movie.id}`} onClick={() => updateView(movie.id)}> 
                                    <div className="card-link">
                                        <div className="card card-search-horizontal bg-transparent">
                                            <img src={movie.imgSrc} className="card-search-img-left" alt="Movie" />
                                            <span className={`badge-search ${movie.badge === "On Going" ? "on-going" : "completed"}`}>
                                                {movie.badge}
                                            </span>
                                            <div className="card-search-body">
                                                <h5 className="card-search-title">{movie.title}</h5>
                                                <p className="card-search-text">{movie.year}</p>
                                                <p className="card-search-text">{movie.genres}</p>
                                                <p className="card-search-text">Availability: {movie.availability}</p>
                                                <div className="rating-container">
                                                    <p className="card-search-text mb-0 rating">{renderStars(movie.rating)}</p>
                                                    <p className="card-search-text mb-0">Views {movie.views}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="d-flex justify-content-center h-100 mt-2">
                        <h5>Tidak ada hasil yang ditemukan.</h5>
                    </div>
                )
            )}
        </div>
    );
}

export default ListSearch;
