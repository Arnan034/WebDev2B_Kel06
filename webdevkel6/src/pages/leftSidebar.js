import React from "react";

class LeftSidebar extends React.Component {
    render() {
        return (
            <div class="sidebar-left bg-selective-yellow-color" id="sidebar-left">
                <div class="container-fluid">
                    <h2 class="name-web">
                        <a href="/" class="title black-color">DramaKu</a>    
                    </h2>
                    <ul class="region-list">
                        <li class="region">
                        <i class="far fa-flag fa-lg black-color"></i>
                        <a href="#Indonesian">
                            <span>Indonesian</span>
                        </a>
                        </li>   
                        <li class="region">
                        <i class="far fa-flag fa-lg black-color"></i>
                        <a href="#Korean">
                            <span>Korean</span>
                        </a>
                        </li>
                        <li class="region">
                        <i class="far fa-flag fa-lg black-color"></i>
                        <a href="#England">
                            <span>England</span>
                        </a>
                        </li>
                        <li class="region">
                        <i class="far fa-flag fa-lg black-color"></i>
                        <a href="#Chine">
                            <span>Chine</span>
                        </a>
                        </li>
                        <li class="region">
                        <i class="far fa-flag fa-lg black-color"></i>
                        <a href="#Japan">
                            <span>Japan</span>
                        </a>
                        </li>
                        <li class="nav-item">
                        <div class="dropdown">
                            <button
                            class="btn border-none dropdown-toggle black-color"
                            type="button"
                            id="dropdownMenuButton1"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                            >
                            <i class="fas fa-user fa-lg"></i>
                            <span class="fs-5 ms-2 d-none d-sm-inline">Naia</span>
                            </button>
                            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                            <li>
                                <a class="dropdown-item" href="/">
                                <i class="fas fa-sign-out-alt me-2"></i>
                                Logout
                                </a>
                            </li>
                            </ul>
                        </div>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}

export default LeftSidebar;