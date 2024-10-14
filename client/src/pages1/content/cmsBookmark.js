import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const ListMovie = () => {
    const [movies, setMovies] = useState([]);
    const [loadedMovies, setLoadedMovies] = useState(12);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const user_id = sessionStorage.getItem('id_user')

    const fetchMovies = useCallback(async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/bookmark/film/${user_id}`);
    
            const formattedMovies = response.data.map(movie => ({
                id: movie.id,
                title: movie.title,
                imgSrc: `data:image/jpeg;base64,${movie.picture}`,
                year: movie.year,
                badge: movie.status === "On Going" ? "On Going" : "Completed",
                rating: movie.rate,
                genres: movie.genres.join(', ')
            }));
    
            setMovies(formattedMovies);
            setLoadedMovies(12);
            setHasMore(formattedMovies.length > 12);
        } catch (error) {
            console.error('Error fetching movie data:', error);
        }
    }, [user_id]);    

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
    
    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(i <= rating ? '★' : '☆');
        }
        return stars.join('');
    };

    return (
        <div className="row">
            {movies.length === 0 ? (
                <div className="no-film-bookmark">
                    <h3>Tidak ada film yang kamu simpan</h3>
                </div>
            
            ) : (
                movies.slice(0, loadedMovies).map((movie, index) => (
                    <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={index}>
                        <Link to={`/detail/${movie.id}`}>
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
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))
            )}
            
            {isLoading && (
                <div className="d-flex justify-content-center loading-spinner">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}
            
            {!hasMore && !isLoading && movies.length > 0 && (
                <p>No more movies to load.</p>
            )}
        </div>
    );
};

export default ListMovie;