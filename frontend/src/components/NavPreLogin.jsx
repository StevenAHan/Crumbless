import { useState, useEffect } from "react";
import "../css/navbar.css";
import cookie from "../assets/cookie.svg"

function NavPreLogin() {

    return (
        <nav>
            <div className="logo">
                <a href="/">
                    <img src={cookie} alt="cookie" className="cookie-logo"/>
                    <h1 className="logo-name">Crumbless</h1>
                </a>
            </div>
            <div className="links">
                <ul className="left-links">
                </ul>
                <ul className="right-links">
                    <li>
                        <a href="/login">Login</a>
                    </li>
                    <li>
                        <a href="/register">Register</a>
                    </li>
                </ul>
            </div>
        </nav>
    );
}
 
export default NavPreLogin;