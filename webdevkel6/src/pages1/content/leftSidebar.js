import React from "react";

class LeftSidebar extends React.Component {
    render() {
        const regions = [
            { name: "Indonesian", href: "#Indonesian" },
            { name: "Korean", href: "#Korean" },
            { name: "England", href: "#England" },
            { name: "China", href: "#China" },
            { name: "Japan", href: "#Japan" },
        ];

        return (
            <div className="sidebar-left bg-selective-yellow-color" id="sidebar-left">
                <div className="container-fluid">
                    <ul className="region-list">
                        {regions.map((region, index) => (
                            <li className="region" key={index}>
                                <i className="far fa-flag fa-lg black-color"></i>
                                <a href={region.href}>
                                    <span>{region.name}</span>
                                </a>
                            </li>
                        ))}
                        <li className="nav-item">
                            <div className="dropdown">
                                <button
                                    className="btn border-none dropdown-toggle black-color"
                                    type="button"
                                    id="dropdownMenuButton1"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    <i className="fas fa-user fa-lg"></i>
                                    <span className="fs-5 ms-2 d-none d-sm-inline">Naia</span>
                                </button>
                                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                    <li>
                                        <a className="dropdown-item" href="/">
                                            <i className="fas fa-sign-out-alt me-2"></i>
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
