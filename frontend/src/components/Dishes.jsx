import { useState, useEffect } from "react";

function Dishes(props) {
    const [dishes, setDishes] = useState([]);
    const [userDishes, setUserDishes] = useState([]);
    const [dishHTML, setDishHTML] = useState([]);

    useEffect(() => {
        fetch("/api/get/dishes", {
            method: "GET",
            headers: {
            }
        }).then((res) => res.json()).then((data) => {
            setDishes(data);
        });
    }, []);
    
 
    return (
        <>
            
        </>
    );
}
 
export default Dishes;