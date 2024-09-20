import React, { Component } from "react";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
// import { faFilter } from '@fortawesome/free-solid-svg-icons'; 

class RightSidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isMoreAwardsVisible: false,
            sortOrder: null,
            activeFilters: new Set() // Use a Set to keep track of active buttons
        };
    }

    handleToggleClick = () => {
        // Memanggil fungsi dari parent (Home.js)
        this.props.onSidebarToggle(); // Mengirim sinyal ke parent ketika tombol di-click
    };

    toggleMoreAwards = () => {
        this.setState(prevState => ({
            isMoreAwardsVisible: !prevState.isMoreAwardsVisible
        }));
    };

    handleSortAsc = () => {
        this.setState({
            sortOrder: 'asc'
        });
    };

    handleSortDesc = () => {
        this.setState({
            sortOrder: 'desc'
        });
    };

    resetFilters = () => {
        this.setState({
            sortOrder: null,
            isMoreAwardsVisible: false,
            activeFilters: new Set() // Reset active filters
        });
    };

    handleFilterClick = (filter) => {
        this.setState(prevState => {
            const activeFilters = new Set(prevState.activeFilters);
            if (activeFilters.has(filter)) {
                activeFilters.delete(filter);
            } else {
                activeFilters.add(filter);
            }
            return { activeFilters };
        });
    };

    render() {
        const { isMoreAwardsVisible, sortOrder, activeFilters } = this.state;
        const { isSidebarOpen } = this.props;
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
                                    onClick={this.handleSortAsc}
                                >
                                    ASC
                                </button>
                            </div>
                            <div className="col">
                                <button 
                                    id="sortDesc" 
                                    className={`btn btn-primary w-100 ${sortOrder === 'desc' ? 'active' : ''}`} 
                                    onClick={this.handleSortDesc}
                                >
                                    DESC
                                </button>
                            </div>
                        </div>
                        
                        <h2 className="black-color">Filter</h2>
                        <div className="mb-3">
                            <label className="form-label jet-color">Tahun</label>
                            <div className="row mb-2">
                                <div className="col ">
                                    <button 
                                        className={buttonClass('2024')} 
                                        onClick={() => this.handleFilterClick('2024')}
                                    >
                                        2024
                                    </button>
                                </div>
                                <div className="col">
                                    <button 
                                        className={buttonClass('2023')} 
                                        onClick={() => this.handleFilterClick('2023')}
                                    >
                                        2023
                                    </button>
                                </div>
                            </div>
                            <div className="row mb-2">
                                <div className="col-6">
                                    <button 
                                        className={buttonClass('2022')} 
                                        onClick={() => this.handleFilterClick('2022')}
                                    >
                                        2022
                                    </button>
                                </div>
                                <div className="col-6">
                                    <select className="form-select" id="yearDropdown">
                                        <option selected>Lainnya</option>
                                        <option>2021</option>
                                        <option>2020</option>
                                        <option>2019</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label jet-color">Status</label>
                            <div className="row mb-2">
                                <div className="col-6">
                                    <button 
                                        className={buttonClass('On Going')} 
                                        onClick={() => this.handleFilterClick('On Going')}
                                    >
                                        On Going
                                    </button>
                                </div>
                                <div className="col-6">
                                    <button 
                                        className={buttonClass('Completed')} 
                                        onClick={() => this.handleFilterClick('Completed')}
                                    >
                                        Completed
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label jet-color">Availability</label>
                            <div className="row mb-2">
                                <div className="col-6">
                                    <button 
                                        className={buttonClass('Yes')} 
                                        onClick={() => this.handleFilterClick('Yes')}
                                    >
                                        Yes
                                    </button>
                                </div>
                                <div className="col-6">
                                    <button 
                                        className={buttonClass('No')} 
                                        onClick={() => this.handleFilterClick('No')}
                                    >
                                        No
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label jet-color">Award</label>
                            <div className="row mb-2">
                                <div className="col-6">
                                    <button 
                                        className={buttonClass('Award 1')} 
                                        onClick={() => this.handleFilterClick('Award 1')}
                                    >
                                        Award 1
                                    </button>
                                </div>
                                <div className="col-6">
                                    <button 
                                        className={buttonClass('Award 2')} 
                                        onClick={() => this.handleFilterClick('Award 2')}
                                    >
                                        Award 2
                                    </button>
                                </div>
                            </div>
                            <div className="row mb-2">
                                <div className="col-6">
                                    <button 
                                        className={buttonClass('Award 3')} 
                                        onClick={() => this.handleFilterClick('Award 3')}
                                    >
                                        Award 3
                                    </button>
                                </div>
                                <div className="col-6">
                                    <button 
                                        className={buttonClass('Award 4')} 
                                        onClick={() => this.handleFilterClick('Award 4')}
                                    >
                                        Award 4
                                    </button>
                                </div>
                            </div>
                            {isMoreAwardsVisible && (
                                <div id="moreAwards">
                                    <div className="row mb-2">
                                        <div className="col-6">
                                            <button 
                                                className={buttonClass('Award 5')} 
                                                onClick={() => this.handleFilterClick('Award 5')}
                                            >
                                                Award 5
                                            </button>
                                        </div>
                                        <div className="col-6">
                                            <button 
                                                className={buttonClass('Award 6')} 
                                                onClick={() => this.handleFilterClick('Award 6')}
                                            >
                                                Award 6
                                            </button>
                                        </div>
                                    </div>
                                    {/* Repeat for more awards if needed */}
                                    <div className="row mb-2">
                                        <div className="col">
                                            <input className="form-control w-200" placeholder="Input Award here" />
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="text-center" id="moreAwardsWrapper">
                                <button className="btn btn-outline-secondary w-100" onClick={this.toggleMoreAwards}>
                                    {isMoreAwardsVisible ? 'Less Awards' : 'More Awards'}
                                </button>
                            </div>
                        </div>
                        
                        <div className="mt-4">
                            <div className="row mt-2">
                                <div className="col-6">
                                    <button type="reset" className="btn btn-danger w-100" onClick={this.resetFilters}>
                                        Reset
                                    </button>
                                </div>
                                <div className="col-6">
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
    }
}

export default RightSidebar;
