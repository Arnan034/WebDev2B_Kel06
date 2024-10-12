import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const ListMovie = ({ filterCountry }) => {
    const [movies, setMovies] = useState([]);
    const [loadedMovies, setLoadedMovies] = useState(12); // Awal dengan 12 film
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false); // State loading

    const fetchMovies = useCallback(async () => {
        console.log("Fetching movies for country:", filterCountry);
        try {
            const response = await axios.get('http://localhost:5000/api/film/', { params: { country: filterCountry } });

            const formattedMovies = response.data.map(movie => ({
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
            setLoadedMovies(12); // Reset to initial loaded amount
            setHasMore(formattedMovies.length > 12); // Update hasMore state
        } catch (error) {
            console.error('Error fetching movie data:', error);
        }
    }, [filterCountry]);

    useEffect(() => {
        fetchMovies();
    }, [fetchMovies]);

    const loadMoreMovies = useCallback(async () => {
        if (loadedMovies >= movies.length) {
            setHasMore(false); // Tidak ada lagi film yang dapat dimuat
            console.log("No more movies to load.");
            return;
        }

        setIsLoading(true); // Set loading state to true

        // Simulasi delay 3 detik
        await new Promise(resolve => setTimeout(resolve, 2000));

        setLoadedMovies((prevLoadedMovies) => prevLoadedMovies + 12); // Tambahkan 12 film lagi
        setIsLoading(false); // Set loading state to false
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
            await axios.post(`http://localhost:5000/api/film/increment-view/${id}`);
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
            {movies.slice(0, loadedMovies).map((movie, index) => (
                <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={index}>
                    <Link to={`/detail/${movie.id}`} onClick={() => updateView(movie.id)}>
                        <div className="card bg-transparent">
                            <img src={movie.imgSrc} className="card-img-top" alt="Movie Img" />
                            <span className={`badge ${movie.badge === "On Going" ? "On Going" : "completed"}`}>
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
            {isLoading && (
                <div className="d-flex justify-content-center loading-spinner">
                    {/* Gambar Spinner */}
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}
            {!hasMore && !isLoading && <p>No more movies to load.</p>} {/* Optional message when there are no more movies */}
        </div>
    );
};

export default ListMovie;
