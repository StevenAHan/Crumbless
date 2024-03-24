import { useState, useEffect } from "react";

function Dishes(props) {
    const [dishes, setDishes] = useState([]);
    const [userDishes, setUserDishes] = useState([]);

    function setupDish(data) {
        // setup dish info
        const dishesHTML = [];
        data["dishes"] = JSON.parse(data["dishes"]);
        for (let i = 0; i < data["dish_ingredients"].length; i++) {
            data["dish_ingredients"][i] = JSON.parse(data["dish_ingredients"][i]);
            data["dish_styles"][i] = JSON.parse(data["dish_styles"][i]);
        }

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
            // console.log(dishInfo)
            // setup dish HTML
            const ingHTML = [];
            for (let j = 0; j < dishInfo.dish_ingredients.length; j++) {
                const ing = dishInfo.dish_ingredients[j];
                const ingHTMLItem = (
                    <li key={ing.ingredient_id}>{ing.ingredient_name}</li>
                );
                ingHTML.push(ingHTMLItem);
            }

            const styleHTML = [];
            for (let j = 0; j < dishInfo.dish_food_styles.length; j++) {
                const style = dishInfo.dish_food_styles[j];
                const styleHTMLItem = (
                    <li key={style.food_style_id}>{style.food_style_name}</li>
                );
                styleHTML.push(styleHTMLItem);
            }

            const dishHTML = (
                <div key={dishInfo.dish_id} className="dish">
                    <h2>{dishInfo.dish_name}</h2>
                    <h3>Instructions</h3>
                    <p>{dishInfo.dish_description}</p>
                    <h3>Ingredients</h3>
                    <ul>
                        {ingHTML}
                    </ul>

                    {/* only activate food styles if styleHTML has more than 0 objects */}
                    {styleHTML.length > 0 ? <>
                        <h3>Food Styles</h3>
                    <ul>
                        {styleHTML}
                    </ul>
                    </> : ""
                    }
                    
                    <a href={dishInfo.dish_source} className="btn">Check Source</a>
                </div>
            );
            dishesHTML.push(dishHTML);
        }
        console.log(dishesHTML[0])
        return dishesHTML;
    }

    useEffect(() => {
        fetch("/api/get/dishes", {
            method: "POST",
            headers: {
            }
        }).then((res) => res.json()).then((data) => {
            setDishes(setupDish(data));
        });
    }, []);
 
    return (
        <>
            <h1>Dishes</h1>

            <div className="search">
                <input type="text" placeholder="Search..." />
            </div>
            
            <div className="dishes">
                {dishes}
            </div>

        </>
    );
}
 
export default Dishes;