import { useState, useEffect } from "react";
import "../css/home.css";

function PreLogHome(props) {
    const [dishes, setDishes] = useState([]);
    const [search, setSearch] = useState("");
    const [numOfResults, setNumOfResults] = useState(0);
    const [userIng, setUserIng] = useState([]);


    function setupDish(data) {
        // setup dish info
        const dishesHTML = [];
        data["dishes"] = JSON.parse(data["dishes"]);
        for (let i = 0; i < data["dish_ingredients"].length; i++) {
            data["dish_ingredients"][i] = JSON.parse(data["dish_ingredients"][i]);
            data["dish_styles"][i] = JSON.parse(data["dish_styles"][i]);
        }
        setNumOfResults(() => {
            if (data["dishes"].length >= 100) {
                setNumOfResults("100+");
            } else {
                setNumOfResults(data["dishes"].length);
            }
        });
        for (let i = 0; i < data["dishes"].length; i++) {
            const dishInfo = {
                dish_id: data["dishes"][i].dish_id,
                dish_name: data["dishes"][i].dish_name,
                dish_description: data["dishes"][i].dish_description,
                dish_ingredients: data["dish_ingredients"][i],
                dish_steps: data["dishes"][i].dish_steps,
                dish_food_styles: data["dish_styles"][i],
                dish_source: data["dishes"][i].source,
                dish_image: data["dishes"][i].dish_img,
            };

            // Parse dish_description
            dishInfo.dish_description = dishInfo.dish_description.split("~");
            // setup dish HTML
            const ingHTML = [];
            for (let j = 0; j < Math.min(dishInfo.dish_ingredients.length, 10); j++) {
                const ing = dishInfo.dish_ingredients[j];
                const ingHTMLItem = (
                    <li key={ing.ingredient_id} className={`ingredients-item-li ${userIng && userIng.names && userIng.names.includes(ing.ingredient_name) ? 'green': ""}`}>{ing.ingredient_name}</li>
                );
                if(j == 9 && dishInfo.dish_ingredients.length > 10) {
                    const ingHTMLItem = (
                        <li key={ing.ingredient_id} className={`ingredients-item-li`}>...</li>
                    );
                    ingHTML.push(ingHTMLItem);
                    break;
                } else {
                    ingHTML.push(ingHTMLItem);
                }
            }
            
            const styleHTML = [];
            for (let j = 0; j < dishInfo.dish_food_styles.length; j++) {
                const style = dishInfo.dish_food_styles[j];
                const styleHTMLItem = (
                    <li key={style.style_id} className={`fs-item-li ${style.style_category.toLowerCase()}`}>{style.style_name}</li>
                );
                styleHTML.push(styleHTMLItem);
            }

            const descHTML = [];
            for (let j = 0; j < dishInfo.dish_description.length; j++) {
                const desc = dishInfo.dish_description[j];
                const descHTMLItem = (
                    <p key={j}>{desc}</p>
                );
                descHTML.push(descHTMLItem);
            }

            const dishHTML = (
                <div key={dishInfo.dish_id} className="dish" onClick={() => window.location.replace(`/dish?id=${dishInfo.dish_id}`)}>
                    <h2 className="dish-title">{dishInfo.dish_name}</h2>
                    <img src={dishInfo.dish_image} alt={dishInfo.dish_name} className="dish-img" />
                    <div className="instructions-div">
                        <h3>Instructions</h3>
                        <div>
                            {descHTML}
                        </div>
                    </div>
                    <div className="ingredients-div">
                        <h3 className="dish-subtitle">Ingredients</h3>
                        <ul className="dish-ingredients">
                            {ingHTML}
                        </ul>
                    </div>

                    {/* only activate food styles if styleHTML has more than 0 objects */}
                    {styleHTML.length > 0 ? <>
                    <div className="food-style-div">
                        <h3 className="dish-subtitle">Food Styles</h3>
                        <ul className="dish-styles">
                            {styleHTML}
                        </ul>
                    </div>   
                    </> : ""
                    }
                    
                    <a href={dishInfo.dish_source} className="src-btn btn">Check Source</a>
                </div>
            );
            dishesHTML.push(dishHTML);
        }
        return dishesHTML;
    }

    useEffect(() => {
        const formData = new URLSearchParams();
        const data = {
            search: search
        }
        Object.keys(data).forEach(key => formData.append(key, data[key]));
        fetch("/api/get/dishes/general", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: formData
        })
        .then((res) => res.json())
        .then((data) => {
            setDishes(setupDish(data));
        })
        .catch((error) => {
            console.error("Error fetching dishes:", error);
        });
    }, [search, userIng]);

    useEffect(() => {
        // Check to see if user is logged in
        if(props.token && props.token !== "") {
            fetch("/api/get/useringredient", {
                method: "GET",
                headers: {
                    Authorization: "Bearer " + props.token,
                },
            })
            .then((res) => res.json())
            .then((data) => {
                // organize data by alphabetical order
                const ingNames = data.map((data) => data.ingredient_name);
                const ingId = data.map((data) => data.ingredient_id);
                setUserIng({ids: ingId, names: ingNames});
            });
        }
    }, [props.token]);
 
    return (
        <>
            <div className="home-main-container">
                <div className="home-main-image"></div>
                <h1 className="home-main-subtitle">Keeping your stomach full and your fridge empty.</h1>
                <h2 className="home-secondary-subtitle">Find dishes you can cook depending on the ingredients you have available. To get personalized recipes, please log in or create an account!</h2>
            </div>
            <h2>Popular Dishes</h2>
            <div className="search">
                <input type="text" placeholder="Search for dishes" onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="num-results-container">
                <h3 className="num-of-results">{numOfResults} Results</h3>
                <div className="search-legend">
                    <p className="legend-item">Green ingredients are the ones you have. Click on a dish to see more details</p>
                </div>
            </div>
            <div className="dishes">
                {dishes}
            </div>
        </>
    );
}
 
export default PreLogHome;