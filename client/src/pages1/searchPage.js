import React, {useState} from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../pages1/content/navbar";
import LeftSidebar from "../pages1/content/leftSidebar";
import RightSidebar from "../pages1/content/rightSidebar";
import ListSearch from "../pages1/content/listSearch";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faFilter } from '@fortawesome/free-solid-svg-icons'; 

const SearchPage = ({isAuthenticated, handleLogout}) => {
    const [filterCountry, setFilterCountry] = useState('');
    const [SortFilm, setSortFilm] = useState('');
    const location = useLocation();
    const query = new URLSearchParams(location.search).get("query");
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false); // State untuk sidebar
    const [filters, setFilters] = useState({
        year: null,
        availability: null,
        genre: null,
        award: null,
        status: null
    });

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
        console.log("Updating country to:", newValue); // Debugging line
        setFilterCountry(newValue);
    };

    return (
        <div>
            <Navbar
                isAuthenticated={isAuthenticated}
                handleLogout={handleLogout}
            />
            <LeftSidebar onCountryChange={updateCountry}/>
            <RightSidebar isSidebarOpen={isSidebarOpen} onFiltersChange={handleFiltersChange} handleSortChange={handleSortChange}/>
            <div className={`content ${isSidebarOpen ? 'shifted' : ''}`}>
                <div class="d-flex justify-content-center h-100 mt-2">
                    <h5>Search / Tagging With <strong>{query}</strong></h5>
                </div>
                {/* <Genre /> */}
                <ListSearch filterCountry={filterCountry} searchQuery={query} filterMovie={filters} SortFilm={SortFilm}/>
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

export default SearchPage;
