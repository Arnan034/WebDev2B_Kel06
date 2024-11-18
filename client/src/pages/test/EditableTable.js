import React, { useState, useEffect } from "react";
import axios from "axios";

const FilmSearch = () => {
  const [films, setFilms] = useState([]);
  const [query, setQuery] = useState('');
  const [filteredFilms, setFilteredFilms] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  useEffect(() => {
    // Fetch films from the API when the component mounts
    const fetchFilms = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/film/');
        setFilms(response.data);
      } catch (error) {
        console.error("Error fetching films:", error);
      }
    };

    fetchFilms();
  }, []);

  // Function to handle search input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 2) {
      const searchResults = films.filter(film => 
        film.title.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredFilms(searchResults);
      setIsDropdownVisible(true);
    } else {
      setIsDropdownVisible(false);
    }
  };

  // Function to handle selecting a film from the dropdown
  const handleSelectFilm = (film) => {
    setQuery(film.title);
    setIsDropdownVisible(false);
    // Redirect or do something with the selected film, e.g., navigate to film details page
    console.log(`Selected film: ${film.title}`);
  };

  return (
    <div className="film-search-container" style={{ position: 'relative' }}>
      <input
        type="text"
        className="film-search-input"
        placeholder="Search film here..."
        value={query}
        onChange={handleInputChange}
        onFocus={() => setIsDropdownVisible(query.length > 0)}
      />
      {isDropdownVisible && (
        <div className="film-search-dropdown" style={{ border: '1px solid #ccc', position: 'absolute', backgroundColor: '#fff', width: '20%', zIndex: 1000 }}>
          {filteredFilms.length > 0 ? (
            filteredFilms.slice(0, 5).map((film) => (
              <div
                key={film.id}
                className="film-search-item"
                style={{ padding: '8px', cursor: 'pointer' }}
                onClick={() => handleSelectFilm(film)}
              >
                <img
                  src={`data:image/jpeg;base64,${film.picture}`}
                  alt='no img'
                  style={{ width: '30px', height: '45px', marginRight: '8px' }}
                />
                <span>{film.title}</span>
              </div>
            ))
          ) : (
            <div style={{ padding: '8px' }}>No results found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default FilmSearch;
