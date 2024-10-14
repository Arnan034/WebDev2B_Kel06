import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { Dropdown, Button } from 'semantic-ui-react'; 
import 'semantic-ui-css/semantic.min.css';

const Navbar = ({ isAuthenticated, handleLogout }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false); // State untuk loading
    const user = sessionStorage.getItem('user');
    const pictureUser = sessionStorage.getItem('picture');

    const navigate = useNavigate();

    const handleSearch = (event) => {
        event.preventDefault();
        navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    };

    const logout = () => {
        setLoading(true); // Set loading ke true
        handleLogout();

        // Tunggu 1 detik sebelum navigasi
        setTimeout(() => {
            setLoading(false); // Reset loading
            navigate('/'); // Navigasi ke halaman utama
        }, 1000);
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-selective-yellow-color">
            <div className="container-fluid navbar-container d-flex justify-content-between align-items-center">
                <h2 className="name-web">
                    <Link to="/" className="title black-color">DramaKu</Link>
                </h2>
                <div className="d-flex">
                    <form onSubmit={handleSearch}>
                        <div className="search">
                            <input
                                className="search_input"
                                type="text"
                                placeholder="Search here..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button type="submit" className="search_icon">
                                <i className="fa fa-search"></i>
                            </button>
                        </div>
                    </form>
                </div>
                <div className="collapse navbar-collapse justify-content-start collapse-width" id="navbarNav">
                    <div className="navbar-nav">
                        {isAuthenticated ? (
                            <>  
                                <div className="nav-item">
                                    <Link to="/cms">
                                        <Button color='blue'>C M S</Button>
                                    </Link>
                                </div>
                                <div className="nav-item">
                                    <div className="custom-dropdown-menu">
                                    <Dropdown
                                        text={
                                            <span style={{ color: 'black'}}>
                                                {user }
                                                {pictureUser && (
                                                    <img 
                                                        src={`data:image/jpeg;base64,${pictureUser}`} 
                                                        alt="" 
                                                        style={{ 
                                                            width: '30px', 
                                                            height: '30px', 
                                                            marginLeft: '8px', 
                                                            borderRadius: '50%' 
                                                        }} 
                                                    />
                                                )}
                                            </span>
                                        }
                                        floating
                                        labeled
                                        button
                                        className="icon"
                                        style={{ backgroundColor: 'red', color: 'white', fontSize: '14px' }}
                                    >
                                        <Dropdown.Menu>
                                            <Dropdown.Item  
                                                text='Logout'
                                                icon='logout'
                                                onClick={logout} 
                                            />
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                {loading ? (
                                    <>
                                        <div className="loading-indicator">Logging out...</div>
                                    </>) : (
                                    <>
                                        <div className="nav-item d-none d-lg-block m-1">
                                            <Link to="/signin">
                                                <Button color='red'>Sign In</Button>
                                            </Link>
                                        </div>
                                        <div className="nav-item d-none d-lg-block m-1">
                                            <Link to="/signup">
                                                <Button color='blue'>Sign Up</Button>
                                            </Link>
                                        </div>
                                    </>
                                )} 
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
