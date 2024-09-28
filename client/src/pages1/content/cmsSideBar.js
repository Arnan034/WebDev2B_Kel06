import React from "react";
import { Link } from 'react-router-dom';

class CmsSidebar extends React.Component {
    render() {
        return (
            <div className="sidebar-left-cms bg-selective-yellow-color" id="sidebar-left">
                <div className="container-fluid">
                    <ul className="side-list">
                        <li className="side">
                            <i className="fas fa-users fa-lg"></i>
                            <Link to="/">
                                <span>Movie</span>
                            </Link>
                        </li>
                        <li className="side">
                        <div className="side-link">
                            <i className="fas fa-film fa-lg"></i>
                            <span>Dramas</span>
                            <i className="fas fa-caret-down ms-2 fa-lg"></i>
                        </div>
                            <ul className="side flex-column ms-3" id="dramasSubmenu">
                                <li className="side">
                                    <i className="fas fa-circle-check side-link"></i>
                                    <Link to="/cms/validate" className="side-link">
                                        <span className="fs-6">Validate</span>
                                    </Link>
                                </li>
                                <li className="side">
                                    <i className="fas fa-pen-to-square side-link"></i>
                                    <Link to="/cms" className="side-link">
                                        <span className="fs-6">Input New Drama</span>
                                    </Link>
                                </li>
                            </ul>
                        </li>  
                        <li className="side">
                            <i className="fas fa-globe fa-lg"></i>
                            <Link to="/cms/countries">
                                <span>Countries</span>
                            </Link>
                        </li>
                        <li className="side">
                            <i className="fas fa-award fa-lg"></i>
                            <Link to="/cms/awards">
                                <span>Awards</span>
                            </Link>
                        </li>
                        <li className="side">
                            <i className="fas fa-masks-theater fa-lg"></i>
                            <Link to="/cms/genres">
                                <span>Genres</span>
                            </Link>
                        </li>
                        <li className="side">
                            <i className="fas fa-user fa-lg side-link"></i>
                            <Link to="/cms/actors" className="side-link">
                                <span>Actors</span>
                            </Link>
                        </li>
                        <li className="side">
                            <i className="fas fa-comments fa-lg"></i>
                            <Link to="/cms/comments">
                                <span>Comments</span>
                            </Link>
                        </li>
                        <li className="side">
                            <i className="fas fa-users fa-lg"></i>
                            <Link to="/cms/users">
                                <span>Users</span>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <div className="dropdown">
                                <button
                                    className="btn border-none dropdown-toggle text-black"
                                    type="button"
                                    id="dropdownMenuButton1"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    <i className="fas fa-user fa-lg"></i>
                                    <span className="fs-5 ms-2 d-none d-sm-inline">Naia</span>
                                </button>
                                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                    <li>
                                        <Link className="dropdown-item" to="/">
                                            <i className="fas fa-sign-out-alt me-2"></i>
                                            Logout
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}

export default CmsSidebar;
