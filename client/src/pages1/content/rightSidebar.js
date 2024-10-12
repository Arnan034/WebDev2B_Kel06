import React, { useState, useEffect } from "react";
import Select from 'react-select';
import axios from 'axios';

const RightSidebar = ({ isSidebarOpen }) => {
    const [sortOrder, setSortOrder] = useState(null);
    const [activeFilters, setActiveFilters] = useState(new Set());
    const [yearFilter, setYearFilter] = useState([]);
    const [selectedYear, setSelectedYear] = useState(null);
    const [availabilityFilter, setAvailabilityFilter] = useState([]);
    const [selectedAvaiability, setSelectedAvailability] = useState(null);
    const [genreFilter, setGenreFilter] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState({ id: null, year: null });;

    useEffect(() => {
        const fetchYear = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/filters/years');
                const options = response.data.map(year => ({ value: year.year_film, label: year.year_film }));
                setYearFilter(options);
            } catch (error) {
                console.error(error);
            }
        };

        fetchYear();
    }, []);

    useEffect(() => {
        const fetchAvailability = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/filters/availability');
                const options = response.data.map(availability => ({ value: availability.availability, label: availability.availability }));
                setAvailabilityFilter(options);
            } catch (error) {
                console.error(error);
            }
        };

        fetchAvailability();
    }, []);

    useEffect(() => {
        const fetchGenre = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/genres');
                const options = response.data.map(genre => ({ value: genre.id_genre, label: genre.genre }));
                setGenreFilter(options);
            } catch (error) {
                console.error(error);
            }
        };

        fetchGenre();
    }, []);

    const handleYearChange = (selectedOption) => {
        setSelectedYear(selectedOption);
        console.log('Selected Year:', selectedOption);
    };

    const handleAvailabilityChange = (selectedOption) => {
        setSelectedAvailability(selectedOption);
        console.log('Selected Availability', selectedOption);
    };


    const handleGenreChange = (selectedOption) => {
        setSelectedGenre(prevState => ({
            ...prevState,
            id: selectedOption,
        }));;
        console.log('Selected Genre', selectedOption);
    };

    const handleSortAsc = () => {
        setSortOrder(prevOrder => prevOrder === 'asc' ? '' : 'asc');
    };

    const handleSortDesc = () => {
        setSortOrder(prevOrder => prevOrder === 'desc' ? '' : 'desc');
    };

    const handleFilterClick = (filter) => {
        setActiveFilters(prevFilters => {
            const newFilters = new Set(prevFilters);
            if (newFilters.has(filter)) {
                newFilters.delete(filter);
            } else {
                newFilters.add(filter);
            }
            return newFilters;
        });
    };

    const buttonClass = (filter) => `btn btn-primary w-100 ${activeFilters.has(filter) ? 'active' : ''}`;

    return (
        <div>
            <div className={`sidebar-right bg-selective-yellow-color ${isSidebarOpen ? 'open' : ''}`} id="sidebar-right">
                <div className="container-fluid">
                    <h2 className="black-color">Sort</h2>
                    <div className="row mb-3">
                        <div className="col">
                            <button 
                                id="sortAsc" 
                                className={`btn btn-primary w-100 ${sortOrder === 'asc' ? 'active' : ''}`} 
                                onClick={handleSortAsc}
                            >
                                ASC
                            </button>
                        </div>
                        <div className="col">
                            <button 
                                id="sortDesc" 
                                className={`btn btn-primary w-100 ${sortOrder === 'desc' ? 'active' : ''}`} 
                                onClick={handleSortDesc}
                            >
                                DESC
                            </button>
                        </div>
                    </div>

                    <h2 className="black-color">Filter</h2>
                    <div className="mb-3">
                        <label className="form-label jet-color">Tahun</label>
                        <div className="row mb-2">
                        <Select 
                            options={yearFilter}
                            placeholder="Tahun"
                            isSearchable
                            styles={{
                                menu: (provided) => ({
                                    ...provided,
                                }),
                            }}
                            onChange={handleYearChange}
                            value={selectedYear}
                        />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label jet-color">Genre</label>
                        <div className="row mb-2">
                            <Select 
                                options={genreFilter}
                                placeholder="Genre"
                                isSearchable
                                styles={{
                                    menu: (provided) => ({
                                        ...provided,
                                    }),
                                }}
                                onChange={handleGenreChange}
                                value={selectedGenre.id}
                            />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label jet-color">Availability</label>
                        <div className="row mb-2">
                            <Select 
                                options={availabilityFilter}
                                placeholder="Availability"
                                isSearchable
                                styles={{
                                    menu: (provided) => ({
                                        ...provided,
                                    }),
                                }}
                                onChange={handleAvailabilityChange} // Menambahkan handler untuk perubahan
                                value={selectedAvaiability} // Mengatur nilai terpilih
                            />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label jet-color">Award</label>
                        <div className="row mb-2">
                            <select className="form-select px-2" id="awardDropdown">
                                <option selected>Award</option>
                                <option>Netflix</option>
                            </select>
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label jet-color">Status</label>
                        <div className="row mb-2">
                            <div className="col-6">
                                <button 
                                    className={buttonClass('On Going')} 
                                    onClick={() => handleFilterClick('On Going')}
                                >
                                    On Going
                                </button>
                            </div>
                            <div className="col-6">
                                <button 
                                    className={buttonClass('Completed')} 
                                    onClick={() => handleFilterClick('Completed')}
                                >
                                    Completed
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4">
                        <div className="row mt-2">
                            <div className="col">
                                <button type="submit" className="btn btn-secondary w-100">
                                    Terapkan
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RightSidebar;