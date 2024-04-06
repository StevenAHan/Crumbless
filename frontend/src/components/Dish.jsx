import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

function Dish(props) {
    const [dishInfo, setDishInfo] = useState({});
    const [searchParams] = useSearchParams();
    const [userIng, setUserIng] = useState([]);

    useEffect(() => {
        fetch(`/api/get/dish/${searchParams.get('id')}`, {
            method: "GET",
        })
        .then((res) => res.json())
        .then((data) => {
            data["dish"] = JSON.parse(data["dish"])[0];
            data["dish_ingredients"] = JSON.parse(data["dish_ingredients"]);
            data["dish_styles"] = JSON.parse(data["dish_styles"]);
            // Parse dish_description
            data.dish.dish_description = data.dish.dish_description.split("~");
            setDishInfo(data);
        });
    }, [searchParams]);

    useEffect(() => {
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
    }, [dishInfo]);

    return (
        <>
            {(dishInfo && dishInfo.dish) ?(<>
                <div className="dish-page-title-container">
                    <h1 className="dish-page-title">{dishInfo.dish.dish_name}</h1>
                </div>  
                <div className="dish-page-container">
                    <div className="dish-page-image">
                        <img src={dishInfo.dish.dish_img} alt={dishInfo.dish.dish_name} />
                    </div>
                    <div className="dish-page-info">
                        <div className="dish-page-ingredients-container">
                            <h2>Ingredients</h2>
                            <ul className="dish-ingredients">
                                {dishInfo.dish_ingredients && dishInfo.dish_ingredients.map((ingredient) => (
                                    <li key={ingredient.ingredient_id} className={`ingredients-item-li ${userIng && userIng.names && userIng.names.includes(ingredient.ingredient_name) ? 'green': ""}`}>{ingredient.ingredient_name}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="dish-page-instructions-container">
                            <h2>Instructions</h2>
                            <p>{dishInfo.dish.dish_desc}</p>
                        </div>
                        <h2>Food Styles</h2>
                        <ul>
                            {dishInfo.dish_styles && dishInfo.dish_styles.map((style) => (
                                <li key={style.style_id}>{style.style_name}</li>
                            ))}
                        </ul>
                        <a href={dishInfo.dish_source} className="src-btn btn">Check Source</a>
                    </div>
                </div>
            </>) : (<></>)}
        </>
    );
}
 
export default Dish;