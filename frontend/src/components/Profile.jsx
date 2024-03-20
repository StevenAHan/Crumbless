import { useState, useEffect } from "react";
import axios from "axios";
import defaultPic from "../assets/profile_pictures/default.png";
import "../css/profile.css";

function Profile(props) {
    const [userInfo, setUserInfo] = useState({
        username: "",
        email: "",
        first_name: "",
        last_name: "",
        user_img: ""
    });

    const [fridge, setFridge] = useState([]);
    const [fridgeItems, setFridgeItems] = useState([]);

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

        fetch('/api/get/useringredient', {
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
            setFridge(data);
        });
    },[]);

    useEffect(() => {
        let items = [];
        fridge.forEach((item) => {
            items.push(<li>{item.ingredient_name}</li>);
        });
        setFridgeItems(items);
    }, [fridge]);
    
    return (
        <div className="profile-container">
            <h1>Hello, {userInfo.first_name} ({userInfo.username})</h1>
            <img src={defaultPic} alt="whoops" className="profile-picture"/>
            <div className="profile-info"> 

            </div>

            <div className="fridge">
                <h3>Your Fridge</h3>
                <ul>
                    {fridgeItems}
                </ul>
            </div>

            <button onClick={logMeOut} className="logout-btn"> 
                Logout
            </button>
        </div>
    );
}
 
export default Profile;