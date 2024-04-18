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

    function openFridge() {

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
        let i = 0;
        for (let item of fridge) {
            items.push(<li key={i}>{item.ingredient_name}</li>);
            i++;
            if(i > 22) {
                items.push(<li key={i}>...</li>);
                break;
            }
        }
        setFridgeItems(items);
    }, [fridge]);
    
    return (
        <>
        {(userInfo.first_name === "") ? 
        <>

        </> :
        <>
            <h1>Hello, {userInfo.first_name} ({userInfo.username})</h1>
            <div className="profile-container">
                {/* <img src={defaultPic} alt="whoops" className="profile-picture"/> */}
                <div className="profile-info"> 

                </div>

                <button onClick={logMeOut} className="profile-btn logout-btn"> 
                    Logout
                </button>
            </div>

            <div className="fridge">
                <h3>Your Fridge</h3>
                <ul className="dish-ingredients">
                    {fridgeItems}
                </ul>
                {fridge.length >= 27 ?                 
                    <button onClick={openFridge}>Check Full Fridge</button> 
                    : ""}
            </div>
        </>
        }
        </>
    );
}
 
export default Profile;