import { useState, useEffect } from "react";
import "../css/dish.css";

function Dishes(props) {
    const [dishes, setDishes] = useState([]);
    const [userIng, setUserIng] = useState([]);
    const [numOfResults, setNumOfResults] = useState(0);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    function setupDish(data) {
        // setup dish info
        const dishesHTML = [];
        data["dishes"] = JSON.parse(data["dishes"]);
        for (let i = 0; i < data["dish_ingredients"].length; i++) {
            data["dish_ingredients"][i] = JSON.parse(data["dish_ingredients"][i]);
            data["dish_styles"][i] = JSON.parse(data["dish_styles"][i]);
        }
        setNumOfResults(data["dishes"].length);
        for (let i = 0; i < data["dishes"].length; i++) {
            const dishInfo = {
                dish_id: data["dishes"][i].dish_id,
                dish_name: data["dishes"][i].dish_name,
                dish_description: data["dishes"][i].dish_description,
                dish_ingredients: data["dish_ingredients"][i],
                dish_steps: data["dishes"][i].dish_steps,
                dish_food_styles: data["dish_styles"][i],
                dish_source: data["dishes"][i].source
            };

            // Parse dish_description
            dishInfo.dish_description = dishInfo.dish_description.split("~");
            let numOfUserIng = 0;
            const numOfIng = dishInfo.dish_ingredients.length;
            // setup dish HTML
            const ingHTML = [];
            for (let j = 0; j < dishInfo.dish_ingredients.length; j++) {
                const ing = dishInfo.dish_ingredients[j];
                // if(userIng && userIng.names && userIng.names.includes(ing.ingredient_name)) {
                //     numOfUserIng++;
                // }
                const ingHTMLItem = (
                    <li key={ing.ingredient_id} className={`ingredients-item-li ${userIng && userIng.names && userIng.names.includes(ing.ingredient_name) ? 'green': ""}`}>{ing.ingredient_name}</li>
                );
                ingHTML.push(ingHTMLItem);
            }
            const percentageOfIng = Math.round((numOfUserIng / numOfIng) * 100);

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
                <div key={dishInfo.dish_id} className="dish">
                    <h2>{dishInfo.dish_name}</h2>
                    <h3>Instructions</h3>
                    <div>
                        {descHTML}
                    </div>
                    <h3>Ingredients</h3>
                    <ul className="dish-ingredients">
                        {ingHTML}
                    </ul>

                    {/* only activate food styles if styleHTML has more than 0 objects */}
                    {styleHTML.length > 0 ? <>
                        <h3>Food Styles</h3>
                    <ul className="dish-styles">
                        {styleHTML}
                    </ul>
                    </> : ""
                    }
                    
                    <a href={dishInfo.dish_source} className="btn">Check Source</a>
                </div>
            );
            dishesHTML.push(dishHTML);
        }
        return dishesHTML;
    }

    // only if logged in
    useEffect(() => {
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
    }, []);

    useEffect(() => {
        const formData = new URLSearchParams();
        const data = {
            search: search
        }
        Object.keys(data).forEach(key => formData.append(key, data[key]));
        fetch("/api/get/dishes", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: "Bearer " + props.token,
            },
            body: formData
        }).then((res) => res.json()).then((data) => {
            setDishes(setupDish(data));
        });
    }, [search, userIng]);
 
    return (
        <>
            <h1>Dishes</h1>

            <div className="search">
                <input type="text" placeholder="Search..." onChange={(e) => setSearch(e.target.value)} />
            </div>
            <h2>Tailored to you:</h2>
            <h3>{numOfResults} results:</h3>
            <div className="dishes">
                {dishes}
            </div>

        </>
    );
}
 
export default Dishes;