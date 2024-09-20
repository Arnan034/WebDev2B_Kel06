import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../pages1/content/navbar";
import LeftSidebar from "../pages1/content/leftSidebar";
import RightSidebar from "../pages1/content/rightSidebar";
import Genre from "../pages1/content/genre";
import ListSearch from "../pages1/content/listSearch";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faFilter } from '@fortawesome/free-solid-svg-icons'; 

const SearchPage = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get('query'); // Mendapatkan nilai query
    
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false); // State untuk sidebar

    const toggleSidebar = () => {
        setIsSidebarOpen(prev => !prev);
    };

    return (
        <div>
            <Navbar />
            <LeftSidebar />
            <RightSidebar isSidebarOpen={isSidebarOpen}/>
            <div className="content">
                <div class="d-flex justify-content-center h-100 mt-2">
                    <h5>Search / Tagging With <strong>{searchQuery}</strong></h5>
                </div>
                <Genre />
                <ListSearch searchQuery={searchQuery} />
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
