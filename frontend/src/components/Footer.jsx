import { useState, useEffect } from "react";
import cookie from "../assets/cookie.svg";
import "../css/footer.css";

function Footer() {
 
    return (
        <>
            <div className="footer-container">
                <div className="left-footer-container">
                    <div className="logo">
                        <img src={cookie} alt="cookie" className="cookie-logo"/>
                        <h1 className="logo-name">Crumbless</h1>
                    </div>
                    <div className="footer-text">
                        <p>Crumbless is a recipe searcher with the intention of reducing personal food waste. It minimize food waste by encouraging users to best utilize the resources available to them in creative recipes</p>
                    </div>
                </div>
            </div>
        </>
    );
}
 
export default Footer;