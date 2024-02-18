import { useState, useEffect } from "react";

async function sendData(data) {
    const formData = new URLSearchParams();
    Object.keys(data).forEach(key => formData.append(key, data[key]));
    return await fetch('/api/test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData
    }).then(data => data.json());
}


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
        testSend({data: "test"})
    }, []);
 
    return (
        <div>
                <h1>React and flask test</h1>
                <p>{data["Cities"]} </p>
        </div>
    );
}
 
export default Test;