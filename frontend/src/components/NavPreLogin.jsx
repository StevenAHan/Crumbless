import { useState, useEffect } from "react";

function NavPreLogin() {
    const [isMenuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="navbar navbar-expand-lg bg-primary navbar-dark">
        <div className="container-fluid">
            <a className="navbar-brand fw-bold" href="/">
            Home
            </a>
            <button
                className="navbar-toggler"
                type="button"
                onClick={toggleMenu}
                aria-expanded={isMenuOpen}
                aria-label="Toggle navigation"
            >
            <span className="navbar-toggler-icon"></span>
            </button>
            <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarNav">
            <ul className="navbar-nav">
                <li className="nav-item">
                <a className="nav-link text-white fw-bold" href="/help">
                    How to Play
                </a>
                </li>
                <li className="nav-item d-lg-none">
                <a className="nav-link text-white fw-bold" href="/login">
                    Register / Login
                </a>
                </li>
            </ul>
            <form
                action="/profilesearch"
                method="GET"
                className="navbar-form form-inline d-lg-none"
            >
                <input
                type="text"
                name="profile"
                className="form-control mr-sm-2"
                placeholder="Search for Profile"
                />
                <input type="submit" className="btn btn-light my-2 my-sm-0 text-white fw-bold" value="Search" />
            </form>
            <div className="navbar-collapse justify-content-end d-none d-lg-block">
            <form
                action="/profilesearch"
                method="GET"
                className="profilesearchform"
            >
                <input
                type="text"
                name="profile"
                className="form-control mr-sm-2"
                placeholder="Search for Profile"
                />
                <input type="submit" className="btn btn-light my-2 my-sm-0" value="Search" />
            </form>
                <a className="nav-link text-white fw-bold" href="/login">
                Register / Login
                </a>
            </div>
            </div>
        </div>
        </nav>
    );
}
 
export default NavPreLogin;