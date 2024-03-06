import { useState, useEffect } from "react";
import axios from "axios";

function Profile(props) {

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
        
    return (
        <>
            <h1>PROFILE</h1>

            <button onClick={logMeOut}> 
                Logout
            </button>
        </>
    );
}
 
export default Profile;