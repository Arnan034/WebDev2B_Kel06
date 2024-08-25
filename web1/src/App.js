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
import {
  BrowserRouter as Router,
  Route,
  Routes,
  NavLink,
} from "react-router-dom";
import Countries from "./Countries";
import Awards from "./Awards";
import Genres from "./Genres";
import Actors from "./Actors";

function Sidebar() {
  return (
    <div className="bg-dark col-auto col-md-4 col-lg-3 min-vh-100 d-flex flex-column justify-content-between">
      <div className="bg-dark p-2">
        <a className="d-flex text-decoration-none mt-2 align-items-center text-white">
          <span className="fs-3">DramaKu</span>
        </a>
        <hr className="text-white my-2" />
        <ul className="nav nav-pills flex-column mt-2">
          <li className="nav-item">
            <NavLink
              to="/"
              className="nav-link text-white"
              activeClassName="active"
            >
              <FontAwesomeIcon icon={faFilm} className="me-2" />
              <span className="fs-5 d-none d-sm-inline">Dramas</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/countries"
              className="nav-link text-white"
              activeClassName="active"
            >
              <FontAwesomeIcon icon={faGlobe} className="me-2" />
              <span className="fs-5 d-none d-sm-inline">Countries</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/awards"
              className="nav-link text-white"
              activeClassName="active"
            >
              <FontAwesomeIcon icon={faAward} className="me-2" />
              <span className="fs-5 d-none d-sm-inline">Awards</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/genres"
              className="nav-link text-white"
              activeClassName="active"
            >
              <FontAwesomeIcon icon={faTheaterMasks} className="me-2" />
              <span className="fs-5 d-none d-sm-inline">Genres</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/actors"
              className="nav-link text-white"
              activeClassName="active"
            >
              <FontAwesomeIcon icon={faUser} className="me-2" />
              <span className="fs-5 d-none d-sm-inline">Actors</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/comments"
              className="nav-link text-white"
              activeClassName="active"
            >
              <FontAwesomeIcon icon={faComments} className="me-2" />
              <span className="fs-5 d-none d-sm-inline">Comments</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/users"
              className="nav-link text-white"
              activeClassName="active"
            >
              <FontAwesomeIcon icon={faUsers} className="me-2" />
              <span className="fs-5 d-none d-sm-inline">Users</span>
            </NavLink>
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
  );
}

function App() {
  return (
    <Router>
      <div className="container-fluid">
        <div className="row flex-wrap">
          <Sidebar />
          <div className="col p-3">
            <Routes>
              <Route path="/" element={<h3>Welcome to DramaKu</h3>} />
              <Route path="/countries" element={<Countries />} />
              <Route path="/awards" element={<Awards />} />
              <Route path="/genres" element={<Genres />} />
              <Route path="/actors" element={<Actors />} />
              {/* Tambahkan route lainnya di sini */}
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
