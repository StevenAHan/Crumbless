import { useState, useEffect } from "react";
import "../css/dish.css";

function Dishes(props) {
    const [dishes, setDishes] = useState([]);
    const [userIng, setUserIng] = useState([]);
    const [numOfResults, setNumOfResults] = useState(0);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [ingredients, setIngredients] = useState([]);
    const [showMoreCount, setShowMoreCount] = useState(30);
    const [switchie, setSwitchie] = useState(false);
    const [ingSearch, setIngSearch] = useState("");
    const [showIngredients, setShowIngredients] = useState(false);
    const [initial, setInitial] = useState(false);

    const handleIngredientClick = (ingredientId) => {
        const formData = new URLSearchParams();
        if (userIng.ids.includes(ingredientId)) {
          const data = {
            ingredient_id: ingredientId
          };
          Object.keys(data).forEach((key) => formData.append(key, data[key]));
          fetch(`/api/delete/useringredient`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: "Bearer " + props.token
            },
            body: formData
          })
            .then((res) => res.json())
            .then((data) => {
              setSwitchie(!switchie);
            });
        } else {
          const data = {
            ingredient_id: ingredientId,
            quantity: 1
          };
          Object.keys(data).forEach((key) => formData.append(key, data[key]));
          fetch(`/api/add/useringredient`, {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: "Bearer " + props.token
            },
            body: formData
          })
            .then((res) => res.json())
            .then((data) => {
              setSwitchie(!switchie);
            });
        }
    };

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
                // if(userIng && userIng.names && userIng.names.includes(ing.ingredient_name)) {
                //     numOfUserIng++;
                // }
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
                    {/* <div className="instructions-div">
                        <h3>Instructions</h3>
                        <div>
                            {descHTML}
                        </div>
                    </div> */}
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
                    
                    <a href={dishInfo.dish_source} className="src-btn btn" target="_blank" rel="noopener noreferrer">Check Source</a>
                </div>
            );
            dishesHTML.push(dishHTML);
        }
        return dishesHTML;
    }

    // Fetch dishes data
    useEffect(() => {
        setLoading(true); // Set loading to true while fetching data
        const formData = new URLSearchParams();
        const data = {
            search: search
        }
        Object.keys(data).forEach(key => formData.append(key, data[key]));
        fetch("/api/get/dishes/personal", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: "Bearer " + props.token,
            },
            body: formData
        })
        .then((res) => res.json())
        .then((data) => {
            setDishes(setupDish(data));
            setLoading(false);
        })
        .catch((error) => {
            setLoading(false);
        });
    }, [search, userIng]);

    // Fetch user ingredients
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
    }, [switchie]);

    useEffect(() => {
        const formData = new URLSearchParams();
        const data = {
          search: ingSearch
        };
        Object.keys(data).forEach((key) => formData.append(key, data[key]));
        fetch("/api/get/ingredients", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: formData
        })
          .then((res) => res.json())
          .then((data) => {
            setIngredients(data);
          });
      }, [ingSearch]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "`" || event.key === "~") {
                setShowIngredients(!showIngredients);
                setInitial(true);
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [showIngredients]); 

      return (
        <div className="dishes-page-container">
            {/* Button to toggle visibility of ingredient container */}
            {/* <button onClick={() => setShowIngredients(!showIngredients)} className="ing-button">
                {showIngredients ? "Hide Ingredients" : "Show Ingredients"}
            </button> */}

            {/* Ingredients container */}
            {initial && (
                <div className={`dish-ingredients-container ${!showIngredients ? "disable" : ""}`}>
                    <h1>Ingredients</h1>
                    <p className="ingredients-desc">
                        Select the ingredients you have. The ingredients you currently have are
                        highlighted in green. (We assume you have water, salt, and pepper)
                    </p>
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Search for ingredients"
                            onChange={(e) => setIngSearch(e.target.value)}
                        />
                    </div>
                    <div className="dish-ing-ing-container">
                        {ingredients.slice(0, showMoreCount).map((ingredient) => (
                            <div
                                className={`ingredients-item ${
                                    userIng.names.includes(ingredient.ingredient_name) ? "green" : ""
                                } dishes-ing-item`}
                                key={ingredient.ingredient_id}
                                onClick={() => handleIngredientClick(ingredient.ingredient_id)}
                            >
                                <h2>{ingredient.ingredient_name}</h2>
                                <h4>{ingredient.dish_count}</h4>
                            </div>
                        ))}
                    </div>
                    <a href="/ingredients" className="showmore-btn ing-btn">See All Ingredients</a>
                </div>
            )}

            <div className="dishes-container">
                <h1>Personalized Dishes</h1>

                <div className="search">
                    <input type="text" placeholder="Search..." onChange={(e) => setSearch(e.target.value)} />
                </div>
                {loading ? ( // Show loading screen if loading is true
                    <div className="loading">Loading...</div>
                ) : (
                    <>
                        <div className="num-results-container">
                            <h3 className="num-of-results">{numOfResults} Results</h3>
                            <div className="search-legend">
                                <p className="legend-item">Green ingredients are the ones you have. Click on a dish to see more details. To see your ingredients and possibly add more, press `.</p>
                            </div>
                        </div>
                        <div className="dishes">
                            {dishes}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default Dishes;