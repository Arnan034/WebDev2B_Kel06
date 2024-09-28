import React, { useState, useEffect } from "react";
import axios from 'axios';

const LeftSidebar = ({ onCountryChange }) => {
    const [countries, setCountries] = useState([]);
    const [error, setError] = useState(null); // State to handle errors
    const [loading, setLoading] = useState(true); // State to handle loading

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await axios.get('http://localhost:5000/country');
                setCountries(response.data || []); // Set to empty array if no data
            } catch (error) {
                console.error(error);
                setError("Failed to fetch countries"); // Set error message
            } finally {
                setLoading(false); // Stop loading
            }
        };

        fetchCountries();
    }, []);

    const handleChangeCountry = (value) => {
        onCountryChange(value);
    };

    return (
        <div className="sidebar-left bg-selective-yellow-color" id="sidebar-left">
            <div className="container-fluid">
                {loading ? (
                    <p>Loading countries...</p>
                ) : error ? (
                    <p className="text-danger">{error}</p>
                ) : (
                    <ul className="region-list">
                        {countries.map((country) => (
                            <li className="region" key={country.id}> {/* Use unique country.id */}
                                <i className="far fa-flag fa-lg black-color"></i>
                                <a 
                                    href={`#${encodeURIComponent(country.country_name)}`}
                                    onClick={(e) => {
                                        e.preventDefault(); // Prevent default anchor behavior
                                        handleChangeCountry(country.id_country);
                                    }}
                                >
                                    <span>{country.country_name}</span>
                                </a>
                            </li>
                        ))}
                        <li className="nav-item">
                            <div className="dropdown">
                                <button
                                    className="btn border-none dropdown-toggle black-color"
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
                                        <a className="dropdown-item" href="/">
                                            <i className="fas fa-sign-out-alt me-2"></i>
                                            Logout
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </li>
                    </ul>
                )}
            </div>
        </div>
    );
}

export default LeftSidebar;
