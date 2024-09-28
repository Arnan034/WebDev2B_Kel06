import React, {useState} from "react";
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ isAuthenticated, handleLogout }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const handleSearch = (event) => {
        event.preventDefault(); // Mencegah refresh halaman
        navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    };

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
                    <form onSubmit={handleSearch} > {/* Wrap input in a form */}
                        <div className="search">
                            <input
                                className="search_input"
                                type="text"
                                placeholder="Search here..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button type="submit" className="search_icon">
                                <i className="fa fa-search"></i>
                            </button>
                        </div>
                    </form>
                </div>
                <div className="collapse navbar-collapse justify-content-end collapse-width" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        {isAuthenticated ? (
                            <>
                            <li className="nav-item d-none d-lg-block mx-1">
                                <button className="btn btn-outline-primary" onClick={handleLogout}>Log Out</button>
                            </li>
                            <li className="nav-item d-none d-lg-block mx-1">
                                 <Link className="btn btn-outline-primary" to="/cms">CMS</Link>
                            </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item d-none d-lg-block mx-1">
                                    <Link className="btn btn-outline-primary" to="/signin">Sign In</Link>
                                </li>
                                <li className="nav-item d-none d-lg-block mx-1">
                                    <Link className="btn btn-primary" to="/signup">Sign Up</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
