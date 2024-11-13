import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const CmsSidebar = () => {
    const [role, setRole] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path;
    };

    const activeStyle = {
        padding: '8px',
        color: 'white'
    };

    const activeLinkStyle = {
        color: 'white'
    };

    useEffect(() => {
        const storedRole = sessionStorage.getItem('role');
        if (storedRole) {
            setRole(storedRole);
        } else {
            navigate('/login');
        }
    }, [navigate]);

    return (
        <div className="sidebar-left-cms bg-selective-yellow-color" id="sidebar-left">
            <div className="container-fluid">
                <ul className="side-list">
                    <li className="side" style={isActive('/') ? activeStyle : {}}>
                        <i className="fas fa-users fa-lg"></i>
                        <Link to="/" style={isActive('/') ? activeLinkStyle : {}}>
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
                            {role === 'admin' && (
                                <li className="side" style={isActive('/cms/validate') ? activeStyle : {}}>
                                    <i className="fas fa-circle-check side-link"></i>
                                    <Link to="/cms/validate" style={isActive('/cms/validate') ? activeLinkStyle : {}}>
                                        <span className="fs-6">Validate</span>
                                    </Link>
                                </li>
                            )}
                            <li className="side" style={isActive('/cms') ? activeStyle : {}}>
                                <i className="fas fa-pen-to-square side-link"></i>
                                <Link to="/cms" style={isActive('/cms') ? activeLinkStyle : {}}>
                                    <span className="fs-6">Input New Drama</span>
                                </Link>
                            </li>
                        </ul>
                    </li>

                    {role === 'admin' ? (
                        <>
                            <li className="side" style={isActive('/cms/countries') ? activeStyle : {}}>
                                <i className="fas fa-globe fa-lg"></i>
                                <Link to="/cms/countries" style={isActive('/cms/countries') ? activeLinkStyle : {}}>
                                    <span>Countries</span>
                                </Link>
                            </li>
                            <li className="side" style={isActive('/cms/awards') ? activeStyle : {}}>
                                <i className="fas fa-award fa-lg"></i>
                                <Link to="/cms/awards" style={isActive('/cms/awards') ? activeLinkStyle : {}}>
                                    <span>Awards</span>
                                </Link>
                            </li>
                            <li className="side" style={isActive('/cms/genres') ? activeStyle : {}}>
                                <i className="fas fa-masks-theater fa-lg"></i>
                                <Link to="/cms/genres" style={isActive('/cms/genres') ? activeLinkStyle : {}}>
                                    <span>Genres</span>
                                </Link>
                            </li>
                            <li className="side" style={isActive('/cms/actors') ? activeStyle : {}}>
                                <i className="fas fa-user fa-lg side-link"></i>
                                <Link to="/cms/actors" style={isActive('/cms/actors') ? activeLinkStyle : {}}>
                                    <span>Actors</span>
                                </Link>
                            </li>
                            <li className="side" style={isActive('/cms/comments') ? activeStyle : {}}>
                                <i className="fas fa-comments fa-lg"></i>
                                <Link to="/cms/comments" style={isActive('/cms/comments') ? activeLinkStyle : {}}>
                                    <span>Comments</span>
                                </Link>
                            </li>
                            <li className="side" style={isActive('/cms/users') ? activeStyle : {}}>
                                <i className="fas fa-users fa-lg"></i>
                                <Link to="/cms/users" style={isActive('/cms/users') ? activeLinkStyle : {}}>
                                    <span>Users</span>
                                </Link>
                            </li>
                        </>
                    ) : (
                        <li className="side" style={isActive('/cms/bookmark') ? activeStyle : {}}>
                            <i className="fa-solid fa-bookmark"></i>
                            <Link to="/cms/bookmark" style={isActive('/cms/bookmark') ? activeLinkStyle : {}}>
                                <span>Bookmark</span>
                            </Link>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
}

export default CmsSidebar;
