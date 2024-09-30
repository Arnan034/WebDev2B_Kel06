import React from "react";

class LeftSidebarCMS extends React.Component {
    render() {
        return (
            <div class="sidebar-left-cms" id="sidebar-left">
                <div class="container-fluid">
                    <h2 class="name-web">
                        <a href="Home.html" class="title">DramaKu</a>    
                    </h2>
                    <ul class="side-cms-list">
                        <li class="side-cms">
                        <a class="side-cms-link">
                            <i class="fas fa-film fa-lg"></i>
                            <span>Dramas</span>
                            <i class="fas fa-caret-down ms-2 fa-lg"></i>
                        </a>              
                        <ul class="side-cms flex-column ms-3" id="dramasSubmenu">
                            <li class="side-cms">
                                    <i class="fas fa-circle-check side-cms-link"></i>
                                    <a href="CMSValidate.html" class="side-cms-link">
                                        <span class="fs-6">Validate</span>
                                    </a>
                            </li>
                            <li class="side-cms">
                                    <i class="fas fa-pen-to-square side-cms-link"></i>
                                    <a href="CMSInputNewDrama.html" class="side-cms-link">
                                        <span class="fs-6">Input New Drama</span>
                                    </a>
                            </li>
                        </ul>
                        </li>  
                        <li class="side-cms">
                            <i class="fas fa-globe fa-lg side-cms-link active"></i>
                            <a href="CMSCountries.html" class="side-cms-link active">
                            <span>Countries</span>
                            </a>
                        </li>
                        <li class="side-cms">
                            <i class="fas fa-award fa-lg"></i>
                            <a href="CMSAwards.html">
                            <span>Awards</span>
                            </a>
                        </li>
                        <li class="side-cms">
                            <i class="fas fa-masks-theater fa-lg"></i>
                            <a href="CMSGenres.html">
                            <span>Genres</span>
                            </a>
                        </li>
                        <li class="side-cms">
                            <i class="fas fa-user fa-lg"></i>
                            <a href="CMSActors.html">
                            <span>Actors</span>
                            </a>
                        </li>
                        <li class="side-cms">
                            <i class="fas fa-comments fa-lg"></i>
                            <a href="CMSComments.html">
                            <span>Comments</span>
                            </a>
                        </li>
                        <li class="side-cms">
                            <i class="fas fa-users fa-lg"></i>
                            <a href="CMSUsers.html">
                            <span>Users</span>
                            </a>
                        </li>
                        <li class="nav-item">
                        <div class="dropdown">
                            <button
                            class="btn border-none dropdown-toggle text-black"
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
                                <a class="dropdown-item" href="#">
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

export default LeftSidebarCMS;