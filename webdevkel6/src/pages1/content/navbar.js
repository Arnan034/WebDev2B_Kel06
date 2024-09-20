import React from "react";
import { Link } from 'react-router-dom';

class Navbar extends React.Component {
    state = {
        searchQuery: ''
    };

    handleSearchChange = (event) => {
        this.setState({ searchQuery: event.target.value });
    };

    render() {
        const { searchQuery } = this.state;

        return (
            <nav className="navbar navbar-expand-lg navbar-light bg-selective-yellow-color">
                <div className="container-fluid navbar-container d-flex justify-content-between align-items-center">
                    <h2 className="name-web">
                        <Link to="/" className="title black-color">DramaKu</Link>    
                    </h2>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="d-flex">
                        <div className="search">
                            <input
                                className="search_input"
                                type="text"
                                placeholder="Search here..."
                                value={searchQuery}
                                onChange={this.handleSearchChange}
                            />
                            <Link to={`/search?query=${encodeURIComponent(searchQuery)}`} className="search_icon">
                                <i className="fa fa-search"></i>
                            </Link>
                        </div>
                    </div>
                    <div className="collapse navbar-collapse justify-content-end collapse-width" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item dropdown d-lg-none mt-2">
                                <Link className="dropdown-item" to="/signin">Sign In</Link>
                                <Link className="dropdown-item" to="/signup">Sign Up</Link>
                            </li>
                            <li className="nav-item d-none d-lg-block mx-1">
                                <Link className="btn btn-outline-primary" to="/signin">Sign In</Link>
                            </li>
                            <li className="nav-item d-none d-lg-block mx-1">
                                <Link className="btn btn-primary" to="/signup">Sign Up</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}

export default Navbar;
