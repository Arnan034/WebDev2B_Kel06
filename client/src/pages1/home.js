import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./content/navbar";
import LeftSidebar from "./content/leftSidebar";
import RightSidebar from "./content/rightSidebar"; 
import ListMovie from "./content/listmovie";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faFilter } from '@fortawesome/free-solid-svg-icons';


const Home = ({isAuthenticated, handleLogout}) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State untuk sidebar
    const [SortFilm, setSortFilm] = useState('');
    const [filterCountry, setFilterCountry] = useState('');
    const [filters, setFilters] = useState({
        year: null,
        availability: null,
        genre: null,
        award: null,
        status: null
    });

    
    const pictureUser = sessionStorage.getItem('picture');

    const location = useLocation(); // Get current location

    // Reset filters when navigating to "/"
    useEffect(() => {
        if (location.pathname === "/") {
            console.log("Navigated to home, resetting filters.");
            setFilterCountry(''); // Reset country filter
            setFilters({
                year: null,
                availability: null,
                genre: null,
                award: null,
                status: null
            });
        }
    }, [location]);

    const handleFiltersChange = (newFilters) => {
        setFilters(newFilters);
        console.log('Updated Filters in Parent:', newFilters);
    };

    const handleSortChange = (newFilters) => {
        setSortFilm(newFilters);
    };
    
    const toggleSidebar = () => {
        setIsSidebarOpen(prev => !prev);
    };

    const updateCountry = (newValue) => {
        console.log("Updating country to:", newValue);
        setFilterCountry(newValue);
    };

    useEffect(() => {
        console.log("Current filterCountry:", filterCountry);
    }, [filterCountry]);

    return (
        <div>
            <Navbar
                isAuthenticated={isAuthenticated}
                handleLogout={handleLogout}
            />
            <LeftSidebar onCountryChange={updateCountry}/>
            <RightSidebar isSidebarOpen={isSidebarOpen} onFiltersChange={handleFiltersChange} handleSortChange={handleSortChange}/>
            <div className={`content ${isSidebarOpen ? 'shifted' : ''}`}>
                {/* <Genre /> */}
                <ListMovie filterCountry={filterCountry} filterMovie={filters} SortFilm={SortFilm}/>
            </div>
            <div 
                className={`toggle-btn bg-selective-yellow-color ${isSidebarOpen ? 'active' : ''}`} 
                id="toggleSidebar" 
                onClick={toggleSidebar}
            >
                <FontAwesomeIcon icon={faFilter} />
            </div>
        </div>
    );
}

export default Home;
