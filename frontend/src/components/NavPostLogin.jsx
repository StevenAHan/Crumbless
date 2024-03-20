import { useState, useEffect } from "react";
import "../css/navbar.css";

function NavPostLogin() {

    return (
        <nav>
            <div className="logo">
                <h1>Crumbless</h1>
            </div>
            <ul className="left-links">
                <li>
                    <a href="/">Home</a>
                </li>
                <li>
                    <a href="/create/dish">Create Dish</a>
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