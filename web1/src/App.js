import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilm,
  faGlobe,
  faAward,
  faTheaterMasks,
  faUser,
  faComments,
  faUsers,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";

function App() {
  return (
    <div className="container-fluid">
      <div className="row flex-wrap">
        <div className="bg-dark col-auto col-md-4 col-lg-3 min-vh-100 d-flex flex-column justify-content-between">
          <div className="bg-dark p-2">
            <a className="d-flex text-decoration-none mt-2 align-items-center text-white">
              <span className="fs-3">DramaKu</span>
            </a>
            <hr className="text-white my-2" />
            <ul className="nav nav-pills flex-column mt-2">
              <li className="nav-item">
                <a href="#" className="nav-link text-white">
                  <FontAwesomeIcon icon={faFilm} className="me-2" />
                  <span className="fs-5 d-none d-sm-inline">Dramas</span>
                </a>
              </li>
              <li className="nav-item">
                <a href="#" className="nav-link text-white">
                  <FontAwesomeIcon icon={faGlobe} className="me-2" />
                  <span className="fs-5 d-none d-sm-inline">Countries</span>
                </a>
              </li>
              <li className="nav-item">
                <a href="#" className="nav-link text-white">
                  <FontAwesomeIcon icon={faAward} className="me-2" />
                  <span className="fs-5 d-none d-sm-inline">Awards</span>
                </a>
              </li>
              <li className="nav-item">
                <a href="#" className="nav-link text-white">
                  <FontAwesomeIcon icon={faTheaterMasks} className="me-2" />
                  <span className="fs-5 d-none d-sm-inline">Genres</span>
                </a>
              </li>
              <li className="nav-item">
                <a href="#" className="nav-link text-white">
                  <FontAwesomeIcon icon={faUser} className="me-2" />
                  <span className="fs-5 d-none d-sm-inline">Actors</span>
                </a>
              </li>
              <li className="nav-item">
                <a href="#" className="nav-link text-white">
                  <FontAwesomeIcon icon={faComments} className="me-2" />
                  <span className="fs-5 d-none d-sm-inline">Comments</span>
                </a>
              </li>
              <li className="nav-item">
                <a href="#" className="nav-link text-white">
                  <FontAwesomeIcon icon={faUsers} className="me-2" />
                  <span className="fs-5 d-none d-sm-inline">Users</span>
                </a>
              </li>
            </ul>
          </div>
          <div className="dropdown open p-3">
            <button
              className="btn border-none dropdown-toggle text-white"
              type="button"
              id="dropdownMenuButton1"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <FontAwesomeIcon icon={faUser} className="me-2" />
              <span className="ms-2 fs-5 d-none d-sm-inline">Naia</span>
            </button>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
              <li>
                <a className="dropdown-item" href="#">
                  <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Content */}
        <div className="col p-3">
          <h3>Content Area</h3>
        </div>
      </div>
    </div>
  );
}

export default App;
