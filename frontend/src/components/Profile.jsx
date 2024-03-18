import { useState, useEffect } from "react";
import axios from "axios";
import defaultPic from "../assets/profile_pictures/default.png";

function Profile(props) {
    const [userInfo, setUserInfo] = useState({
        username: "",
        email: "",
        first_name: "",
        last_name: "",
        user_img: ""
    });

    function logMeOut() {
        axios({
          method: "POST",
          url:"/api/logout",
        })
        .then((response) => {
            props.removeToken();
            alert("You have been logged out");
            window.location.replace("/");
        }).catch((error) => {
            alert("Error, could not log out");
          if (error.response) {
            console.log(error.response)
            console.log(error.response.status)
            console.log(error.response.headers)
            }
        });
    }

    useEffect(() => {
        fetch('/api/profile', {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + props.token
            }
        }).then((response) => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
        }).then((data) => {
            setUserInfo(data[0]);
        });
    },[]);
    
    return (
        <>
            <h1>PROFILE</h1>
            <img src={defaultPic} alt="whoops" className="profile_picture"/>
            <p>Username: {userInfo.username}</p>
            <p>Email: {userInfo.email}</p>
            <p>First Name: {userInfo.first_name}</p>
            <p>Last Name: {userInfo.last_name}</p>

            <button onClick={logMeOut}> 
                Logout
            </button>
        </>
    );
}
 
export default Profile;