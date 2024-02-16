import { useState, useEffect } from "react";

function Test() {
    // usestate for setting a javascript
    // object for storing and using data
    const [data, setdata] = useState({'Cities': [], 'Sorted Cliques': [{}]});
 
    
    // Using useEffect for single rendering
    useEffect(() => {
        fetch("/api/data").then((res) =>{
            res.json().then((newData) => {
                setdata({
                    "Cities": newData["Cities"],
                });
            })
        })
    }, []);
 
    return (
        <div>
                <h1>React and flask test</h1>
                <p>{data["Cities"]} </p>
        </div>
    );
}
 
export default Test;