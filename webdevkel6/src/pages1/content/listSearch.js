import React from "react";

class ListSearch extends React.Component {
    movies = [
        {
            title: "Harry Potter Contohnyaa Movie Title Harry Potter",
            year: 2024,
            genre: "Action",
            availability: "Yes",
            views: "5M",
            status: "ongoing",
            img: "./assets/img/350x233.png"
        },
        {
            title: "Fast And Go Home",
            year: 2024,
            genre: "Action",
            availability: "No",
            views: "700k",
            status: "completed",
            img: "./assets/img/350x233.png"
        },
        {
            title: "Main Ke Rumah Mantan",
            year: 2024,
            genre: "Thriller",
            availability: "No",
            views: "-1K",
            status: "ongoing",
            img: "./assets/img/350x233.png"
        },
        {
            title: "Mampir ke rumah janda",
            year: 2024,
            genre: "Romance",
            availability: "Yes",
            views: "273T",
            status: "completed",
            img: "./assets/img/350x233.png"
        }
    ];

    render() {
        const { searchQuery } = this.props;

        const filteredMovies = this.movies.filter(movie =>
            movie.title.toLowerCase().includes(searchQuery.toLowerCase())
        );

        return (
            <div>
                <div className="row">
                    {filteredMovies.length > 0 ? (
                        filteredMovies.map((movie, index) => (
                            <div className="col-md-12" key={index}>
                                <div className="card-wrapper">
                                    <a href="/#" target="_blank" className="card-link">
                                        <div className="card card-search-horizontal bg-transparent">
                                            <img src={movie.img} className="card-search-img-left" alt="Movie" />
                                            <span className={`badge-search ${movie.status}`}>{movie.status.charAt(0).toUpperCase() + movie.status.slice(1)}</span>
                                            <div className="card-search-body">
                                                <h5 className="card-search-title">{movie.title}</h5>
                                                <p className="card-search-text">{movie.year}</p>
                                                <p className="card-search-text">{movie.genre}</p>
                                                <p className="card-search-text">Availability: {movie.availability}</p>
                                                <div className="rating-container">
                                                    <p className="card-search-text mb-0 rating">★★★★☆</p>
                                                    <p className="card-search-text mb-0">Views {movie.views}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        ))
                    ) : (
                      <div class="d-flex justify-content-center h-100 mt-2">
                          <h5>Tidak ada hasil yang ditemukan.</h5>
                      </div>
                    )}
                </div>
            </div>
        );
    }
}

export default ListSearch;
