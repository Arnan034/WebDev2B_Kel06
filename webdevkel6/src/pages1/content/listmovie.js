import React from "react";
import { Link } from "react-router-dom";

class ListMovie extends React.Component {
    handleClick(movieTitle) {
        console.log(`${movieTitle} clicked`);
        // Anda bisa menambahkan logika lain di sini, seperti mengatur state atau mengarahkan ke halaman detail
    }

    render() {
        const movies = [
            { title: "Movie Title 1", year: 2024, genre: "Action", imgSrc: "./assets/img/350x233.png", badge: "On Going", rating: "★★★★☆", views: "2K" },
            { title: "Movie Title 2", year: 2024, genre: "Comedy", imgSrc: "./assets/img/350x233.png", badge: "Completed", rating: "★★★☆☆", views: "1M" },
            { title: "Movie Title 3", year: 2024, genre: "Drama", imgSrc: "./assets/img/350x233.png", badge: "On Going", rating: "★★★☆☆", views: "3.4K" },
            { title: "Movie Title 4", year: 2024, genre: "Thriller", imgSrc: "./assets/img/350x233.png", badge: "Completed", rating: "★★★★☆", views: "20K" },
            { title: "Movie Title 5", year: 2024, genre: "Sci-Fi", imgSrc: "./assets/img/350x233.png", badge: "On Going", rating: "★★★★☆", views: "54K" },
            // Tambahkan lebih banyak film sesuai kebutuhan
        ];

        return (
            <div className="row">
                {movies.map((movie, index) => (
                    <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={index}>
                        <Link to="/detail" onClick={() => this.handleClick(movie.title)}>
                            <div className="card bg-transparent">
                                <img src={movie.imgSrc} className="card-img-top" alt="Movie Img" />
                                <span className={`badge ${movie.badge === "On Going" ? "ongoing" : "completed"}`}>{movie.badge}</span>
                                <div className="card-body">
                                    <h5 className="card-title">{movie.title}</h5>
                                    <p className="card-text">{movie.year}</p>
                                    <p className="card-text">{movie.genre}</p>
                                    <div className="rating-container">
                                        <p className="card-text mb-0 rating">{movie.rating}</p>
                                        {movie.views && <p className="card-text mb-0">views {movie.views}</p>}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        );
    }
}

export default ListMovie;
