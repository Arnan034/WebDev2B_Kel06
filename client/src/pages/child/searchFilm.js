// Search.js
import React, { useState, useEffect } from "react";
import { apiServicePublic } from '../../services/api';
import { useNavigate } from "react-router-dom";

const Search = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [films, setFilms] = useState([]);
    const [filteredFilms, setFilteredFilms] = useState([]);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch films from the API when the component mounts
        const fetchFilms = async () => {
        try {
            const response = await apiServicePublic.getAllFilm();
            setFilms(response.data.data);
        } catch (error) {
            console.error("Error fetching films:", error);
        }
        };

        fetchFilms();
    }, []);

    // Function to handle search input change
    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);

        if (value.length > 2) {
        const searchResults = films.filter((film) =>
            film.title.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredFilms(searchResults);
        setIsDropdownVisible(true);
        } else {
        setIsDropdownVisible(false);
        }
    };

    const updateView = async (id) => {
        try {
            await apiServicePublic.updatePlusView(id);
        } catch (error) {
            console.error('Error incrementing view:', error);
        }
    }

    const handleSelectFilm = (film) => {
        setSearchQuery(film.title);
        setIsDropdownVisible(false);
        updateView(film.id);
        navigate(`/detail/${encodeURIComponent(film.id)}`);
    };

    const handleSearch = (event) => {
        event.preventDefault();
        navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    };

  return (
    <div className="search-container" style={{ position: "relative" }}>
        <form onSubmit={handleSearch}>
            <div className="search">
            <input
                className="search_input"
                type="text"
                placeholder="Search Movie Or Actor Film here..."
                value={searchQuery}
                onChange={handleInputChange}
                onFocus={() => setIsDropdownVisible(searchQuery.length > 0)}
            />
            <button type="submit" className="search_icon">
                <i className="fa fa-search"></i>
            </button>
            </div>
        </form>
        {isDropdownVisible && (
            <div className="search-dropdown">
            {filteredFilms.length > 0 ? (
                filteredFilms.map((film) => (
                <div
                    key={film.id}
                    className="search-item"
                    style={{ padding: "8px", cursor: "pointer", display: "flex", alignItems: "center" }}
                    onClick={() => handleSelectFilm(film)}
                >
                    <img
                    src={`data:image/jpeg;base64,${film.picture}`}
                    alt="Film Poster"
                    style={{ width: "30px", height: "45px", marginRight: "8px" }}
                    />
                    <span>{film.title}</span>
                </div>
                ))
            ) : (
                <div style={{ padding: "8px" }}>No results found</div>
            )}
            </div>
        )}
    </div>
  );
};

export default Search;
