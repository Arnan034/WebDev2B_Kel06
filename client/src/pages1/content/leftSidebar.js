import React, { useState, useEffect } from "react";
import axios from 'axios';

const LeftSidebar = ({ onCountryChange }) => {
    const [countries, setCountries] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeCountry, setActiveCountry] = useState(''); // State untuk melacak negara aktif

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/countries/');
                setCountries(response.data || []);
            } catch (error) {
                console.error(error);
                setError("Failed to fetch countries");
            } finally {
                setLoading(false);
            }
        };

        fetchCountries();
    }, []);

    const handleChangeCountry = (country) => {
        // Toggle active country
        setActiveCountry((prev) => (prev === country ? '' : country)); // Set to '' if already active
        onCountryChange(activeCountry === country ? '' : country); // Pass empty string to parent if deactivated
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
                            <li className="region" key={country.id}>
                                <i className="far fa-flag fa-lg black-color"></i>
                                <a 
                                    href={`#${encodeURIComponent(country.country_name)}`}
                                    onClick={(e) => {
                                        e.preventDefault(); 
                                        handleChangeCountry(country.id_country);
                                    }}
                                    className={activeCountry === country.id_country ? 'active' : ''} // Add active class
                                >
                                    <span>{country.country_name}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default LeftSidebar;