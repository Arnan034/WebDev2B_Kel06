import React, { useState, useEffect } from "react";
import Select from 'react-select';
import axios from 'axios';

const RightSidebar = ({ isSidebarOpen, onFiltersChange, handleSortChange }) => {
    const [sortOrder, setSortOrder] = useState(null);
    const [activeFilters, setActiveFilters] = useState(new Set());
    const [yearFilter, setYearFilter] = useState([]);
    const [availabilityFilter, setAvailabilityFilter] = useState([]);
    const [genreFilter, setGenreFilter] = useState([]);
    const [awardFilter, setAwardFilter] = useState([]);

    const [filters, setFilters] = useState({
        year: null,
        availability: null,
        genre: null,
        award: null,
        status: null
    });

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

    useEffect(() => {
        const fetchAward = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/awards/name');
                const options = response.data.map(award => ({ value: award.name, label: award.name }));
                setAwardFilter(options);
            } catch (error) {
                console.error(error);
            }
        };

        fetchAward();
    }, []);

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
                updateFilter('status', null);
            } else {
                newFilters.add(filter);
                updateFilter('status', filter);
            }
            return newFilters;
        });
    };

    const updateFilter = (field, value) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [field]: value,
        }));
    };

    const handleSubmit = () => {
        console.log('Selected Filters before reset:', filters);

        // Kirim filters ke parent component
        onFiltersChange(filters);
        handleSortChange(sortOrder);
        // Reset all filters to default
        setFilters({
            year: null,
            availability: null,
            genre: null,
            award: null,
            status: null
        });

        // Optionally reset active filters
        setActiveFilters(new Set());

        console.log('Filters have been reset to default.');
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
                                [A-Z]
                            </button>
                        </div>
                        <div className="col">
                            <button 
                                id="sortDesc" 
                                className={`btn btn-primary w-100 ${sortOrder === 'desc' ? 'active' : ''}`} 
                                onClick={handleSortDesc}
                            >
                                [Z-A]
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
                            isClearable
                            onChange={(selected) => {
                                const yearValue = selected ? parseInt(selected.value, 10) : null;
                                updateFilter('year', yearValue);
                            }}
                            value={filters.year ? yearFilter.find(option => option.value === filters.year) : null} 
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
                                isClearable
                                onChange={(selected) => updateFilter('genre', selected ? selected.value : null)} 
                                value={filters.genre ? genreFilter.find(option => option.value === filters.genre) : null} 
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
                                isClearable
                                onChange={(selected) => updateFilter('availability', selected ? selected.value : null)} 
                                value={filters.availability ? availabilityFilter.find(option => option.value === filters.availability) : null} 
                            />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label jet-color">Award</label>
                        <div className="row mb-2">
                            <Select 
                                options={awardFilter}
                                placeholder="Award"
                                isSearchable
                                isClearable
                                onChange={(selected) => updateFilter('award', selected ? selected.value : null)} 
                                value={filters.award ? awardFilter.find(option => option.value === filters.award) : null} 
                            />
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
                                <button type="submit" className="btn btn-secondary w-100" onClick={handleSubmit}>
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
