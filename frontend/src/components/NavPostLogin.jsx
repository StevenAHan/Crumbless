import { useState, useEffect } from "react";
import "../css/navbar.css";
import cookie from "../assets/cookie.svg"


function NavPostLogin() {

    return (
        <nav>
            <div className="logo">
                <img src={cookie} alt="cookie" className="cookie-logo"/>
                <h1 className="logo-name">Crumbless</h1>
            </div>
            <ul className="left-links">
                <li>
                    <a href="/">Home</a>
                </li>
                <li>
                    <a href="/dishes">Personalized Dishes</a>
                </li>
                <li>
                    <a href="/foodstyles">List of Food Styles</a>
                </li>
                <li>
                    <a href="/ingredients">List of Ingredients</a>
                </li>
            </ul>
            
            <ul className="right-links">
                <li>
                    <a href="/profile">Profile</a>
                </li>
            </ul>
        </nav>
    );
}
 
export default NavPostLogin;