import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const CmsSidebar = () => {
    const [role, setRole] = useState(''); // State untuk menyimpan role dari localStorage
    const navigate = useNavigate(); // Digunakan untuk navigasi

    // Inisialisasi nilai dari localStorage
    useEffect(() => {
        const storedRole = localStorage.getItem('role'); // Ambil nilai role dari localStorage
        if (storedRole) {
            setRole(storedRole);
        } else {
            // Jika tidak ada role di localStorage, bisa redirect ke halaman login
            navigate('/login');
        }
    }, [navigate]);

    return (
        <div className="sidebar-left-cms bg-selective-yellow-color" id="sidebar-left">
            <div className="container-fluid">
                <ul className="side-list">
                    {/* Semua pengguna dapat mengakses halaman Movie */}
                    <li className="side">
                        <i className="fas fa-users fa-lg"></i>
                        <Link to="/">
                            <span>Movie</span>
                        </Link>
                    </li>

                    {/* Semua pengguna dapat mengakses halaman Input New Drama */}
                    <li className="side">
                        <div className="side-link">
                            <i className="fas fa-film fa-lg"></i>
                            <span>Dramas</span>
                            <i className="fas fa-caret-down ms-2 fa-lg"></i>
                        </div>
                        <ul className="side flex-column ms-3" id="dramasSubmenu">
                            {role === 'admin' && (
                                <li className="side">
                                    <i className="fas fa-circle-check side-link"></i>
                                    <Link to="/cms/validate" className="side-link">
                                        <span className="fs-6">Validate</span>
                                    </Link>
                                </li>
                            )}
                            <li className="side">
                                <i className="fas fa-pen-to-square side-link"></i>
                                <Link to="/cms" className="side-link">
                                    <span className="fs-6">Input New Drama</span>
                                </Link>
                            </li>
                        </ul>
                    </li>

                    {/* Hanya admin yang bisa mengakses menu berikut */}
                    {role === 'admin' && (
                        <>
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
                        </>
                    )}
                </ul>
            </div>
        </div>
    );
}

export default CmsSidebar;