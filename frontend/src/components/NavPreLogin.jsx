import { useState, useEffect } from "react";
import "../css/navbar.css";

function NavPreLogin() {

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
                    <a href="/login">Login</a>
                </li>
                <li>
                    <a href="/register">Register</a>
                </li>
            </ul>
        </nav>
    );
}
 
export default NavPreLogin;