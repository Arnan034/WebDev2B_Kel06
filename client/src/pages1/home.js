import React, { useState, useEffect } from "react";
import Navbar from "./content/navbar";
import LeftSidebar from "./content/leftSidebar";
import RightSidebar from "./content/rightSidebar"; 
// import MultiOptions from './content/multiopstion';
// import Genre from "./content/genre";
import ListMovie from "./content/listmovie";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faFilter } from '@fortawesome/free-solid-svg-icons';


const Home = ({isAuthenticated, handleLogout}) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State untuk sidebar
    const [filterCountry, setFilterCountry] = useState('');

    const toggleSidebar = () => {
        setIsSidebarOpen(prev => !prev);
    };

    const updateCountry = (newValue) => {
        console.log("Updating country to:", newValue); // Debugging line
        setFilterCountry(newValue);
    };

    useEffect(() => {
        console.log("Current filterCountry:", filterCountry); // Debugging line
    }, [filterCountry]); // Run effect when filterCountry changes

    return (
        <div>
            <Navbar
                isAuthenticated={isAuthenticated}
                handleLogout={handleLogout}
            />
            <LeftSidebar onCountryChange={updateCountry}/>
            <RightSidebar isSidebarOpen={isSidebarOpen} />
            <div className={`content ${isSidebarOpen ? 'shifted' : ''}`}>
                {/* <Genre /> */}
                <ListMovie filterCountry={filterCountry}/>
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
