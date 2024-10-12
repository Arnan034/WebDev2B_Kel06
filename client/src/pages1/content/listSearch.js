import React, { useEffect, useState, useCallback } from "react";
import { Link} from "react-router-dom";
import axios from "axios";

const ListSearch = ({ filterCountry, searchQuery }) => {
    const [movies, setMovies] = useState([]);

    const fetchMovies = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/film/search', { 
                params: { 
                  country: filterCountry ? parseInt(filterCountry) : undefined, // Pastikan ini adalah integer
                  search: searchQuery 
                } 
            });

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
    }, [filterCountry, searchQuery]); // Dependency on filterCountry only

    useEffect(() => {
        fetchMovies();
    }, [fetchMovies]);

    const updateView = async (id) => {
        try {
            await axios.post(`http://localhost:5000/api/film/increment-view/${id}`);
        } catch (error) {
            console.error('Error incrementing view:', error);
        }
    }

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(i <= rating ? '★' : '☆'); // Menampilkan bintang solid atau kosong berdasarkan rating
        }
        return stars.join(''); // Menggabungkan array bintang menjadi satu string
    };

    return (
        <div className="row">
            {movies.length > 0 ? (
                movies.map((movie, index) => (
                    <div className="col-md-6" key={index}>
                        <div className="card-wrapper">
                            <Link to={`/detail/${movie.id}`} onClick={() => updateView(movie.id)}> 
                                <div className="card-link">
                                    <div className="card card-search-horizontal bg-transparent">
                                        <img src={movie.imgSrc} className="card-search-img-left" alt="Movie" />
                                        <span className={`badge-search ${movie.badge}`}>{movie.badge}</span>
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
            )}
        </div>
    );
}

export default ListSearch;
