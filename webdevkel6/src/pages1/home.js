import React from "react";
import Navbar from "./content/navbar";
import LeftSidebar from "./content/leftSidebar";
import RightSidebar from "./content/rightSidebar";
import Genre from "./content/genre";
import ListMovie from "./content/listmovie";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faFilter } from '@fortawesome/free-solid-svg-icons'; 
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Home = () => {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false); // State untuk sidebar
    const [searchQuery, setSearchQuery] = React.useState(''); // State untuk query pencarian
    const navigate = useNavigate(); // Inisialisasi useNavigate

    const toggleSidebar = () => {
        setIsSidebarOpen(prev => !prev);
    };

    const handleSearch = (event) => {
        event.preventDefault();
        if (searchQuery) {
            navigate(`/search?query=${encodeURIComponent(searchQuery)}`); // Navigasi ke halaman pencarian
        }
    };

    return (
        <div>
            <Navbar 
                searchQuery={searchQuery} 
                setSearchQuery={setSearchQuery} 
                handleSearch={handleSearch} 
            />
            <LeftSidebar />
            <RightSidebar isSidebarOpen={isSidebarOpen} />
            <div className={`content ${isSidebarOpen ? 'shifted' : ''}`}>
                <Genre />
                <ListMovie />
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
