import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const CmsSidebar = () => {
    const [role, setRole] = useState(''); // State untuk menyimpan role dari localStorage
    const navigate = useNavigate(); // Digunakan untuk navigasi
    const location = useLocation();

    useEffect(() => {
        const storedRole = 'admin'; //localStorage.getItem('role');
        if (storedRole) {
            setRole(storedRole);
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const isDramasActive = location.pathname === '/cms/validate' || location.pathname === '/cms';

    return (
        <div className="sidebar-left-cms bg-selective-yellow-color" id="sidebar-left">
            <div className="container-fluid">
                <ul className="side-list">
                    {/* Semua pengguna dapat mengakses halaman Movie */}
                    <li className={`side ${location.pathname === '/' ? 'active' : ''}`}>
                        <i className="fas fa-users fa-lg"></i>
                        <Link to="/">
                            <span>Movie</span>
                        </Link>
                    </li>

                    {/* Semua pengguna dapat mengakses halaman Input New Drama */}
                    <li className="side">
                        <div className={`side-link ${isDramasActive ? 'active' : ''}`}>
                            <i className="fas fa-film fa-lg"></i>
                            <span>Dramas</span>
                            <i className="fas fa-caret-down ms-2 fa-lg"></i>
                        </div>
                        <ul className="side flex-column ms-3" id="dramasSubmenu">
                            {role === 'admin' && (
                                <li className={`side ${location.pathname === '/cms/validate' ? 'active' : ''}`}>
                                    <i className="fas fa-circle-check"></i>
                                    <Link to="/cms/validate" className="side-link">
                                        <span className="fs-6">Validate</span>
                                    </Link>
                                </li>
                            )}
                            <li className={`side ${location.pathname === '/cms' ? 'active' : ''}`}>
                                <i className="fas fa-pen-to-square"></i>
                                <Link to="/cms" className="side-link">
                                    <span className="fs-6">Input New Drama</span>
                                </Link>
                            </li>
                        </ul>
                    </li>

                    {/* Hanya admin yang bisa mengakses menu berikut */}
                    {role === 'admin' ? (
                        <>
                            <li className={`side ${location.pathname === '/cms/countries' ? 'active' : ''}`}>
                                <i className="fas fa-globe fa-lg"></i>
                                <Link to="/cms/countries">
                                    <span>Countries</span>
                                </Link>
                            </li>
                            <li className={`side ${location.pathname === '/cms/awards' ? 'active' : ''}`}>
                                <i className="fas fa-award fa-lg"></i>
                                <Link to="/cms/awards">
                                    <span>Awards</span>
                                </Link>
                            </li>
                            <li className={`side ${location.pathname === '/cms/genres' ? 'active' : ''}`}>
                                <i className="fas fa-masks-theater fa-lg"></i>
                                <Link to="/cms/genres">
                                    <span>Genres</span>
                                </Link>
                            </li>
                            <li className={`side ${location.pathname === '/cms/actors' ? 'active' : ''}`}>
                                <i className="fas fa-user fa-lg"></i>
                                <Link to="/cms/actors" className="side-link">
                                    <span>Actors</span>
                                </Link>
                            </li>
                            <li className={`side ${location.pathname === '/cms/comments' ? 'active' : ''}`}>
                                <i className="fas fa-comments fa-lg"></i>
                                <Link to="/cms/comments">
                                    <span>Comments</span>
                                </Link>
                            </li>
                            <li className={`side ${location.pathname === '/cms/users' ? 'active' : ''}`}>
                                <i className="fas fa-users fa-lg"></i>
                                <Link to="/cms/users">
                                    <span>Users</span>
                                </Link>
                            </li>
                        </>
                    ) : (
                        <li className={`side ${location.pathname === '/cms/bookmark' ? 'active' : ''}`}>
                            <i className="fa-solid fa-bookmark"></i>
                            <Link to="/cms/bookmark">
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
