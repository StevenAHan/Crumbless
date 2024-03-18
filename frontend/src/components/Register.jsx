import { useState, useEffect } from "react";
import "../css/register.css";

function Register() {

    const [loginForm, setLoginForm] = useState({});

    function register(e) {
        if(loginForm.password !== loginForm.confirmPassword) {
            alert("Passwords do not match.");
            return;
        }
        fetch("/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(loginForm)
        }).then((response) => {
            if(response.status === 401) {
                alert("Username taken. Please try again with a different username.")
            }
            else {
                alert("Account Successfully Created! Please log in.");
                window.location.replace("/login");
            }
        }).catch((error) => {
        alert("Unable to Register. Please try again.");
        if (error.response) {
            console.log(error.response)
            console.log(error.response.status)
            console.log(error.response.headers)
        }
        });
    }

    function handleChange(event) { 
        const {value, name} = event.target
        setLoginForm(prevNote => ({
            ...prevNote, [name]: value})
        )}
        
 
    return (
        <div className="register-container">
            <h1>Register</h1>
            <form className="register-form">
                <input onChange={handleChange} 
                    type="username"
                    text={loginForm.username} 
                    name="username" 
                    placeholder="Username" 
                    value={loginForm.username} />
                <input onChange={handleChange} 
                    type="email"
                    text={loginForm.email} 
                    name="email" 
                    placeholder="Email" 
                    value={loginForm.email} />
                <input onChange={handleChange} 
                    type="password"
                    text={loginForm.password} 
                    name="password" 
                    placeholder="Password" 
                    value={loginForm.password} />
                <input onChange={handleChange}
                    type="password"
                    text={loginForm.confirmPassword}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={loginForm.confirmPassword} />
                <input onChange={handleChange}
                    type="text"
                    text={loginForm.firstName}
                    name="firstName"
                    placeholder="First Name"
                    value={loginForm.firstName} />
                <input onChange={handleChange}
                    type="text"
                    text={loginForm.lastName}
                    name="lastName"
                    placeholder="Last Name"
                    value={loginForm.lastName} />
            <button onClick={register}>Submit</button>
            </form>
        </div>
    );
}
 
export default Register;