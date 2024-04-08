import { useState, useEffect } from "react";
import "../css/ingredient.css";

function Ingredients(props) {
  const [ingredients, setIngredients] = useState([]);
  const [userIngredients, setUserIngredients] = useState([]);
  const [switchie, setSwitchie] = useState(false);
  const [search, setSearch] = useState("");

    useEffect(() => {
        const formData = new URLSearchParams();
        const data = {
            search: search
        }
        Object.keys(data).forEach(key => formData.append(key, data[key]));
        fetch("/api/get/ingredients", {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: formData
        })
        .then((res) => res.json())
        .then((data) => {
            setIngredients(data);
        });
        
    }, [search]);

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
                setUserIngredients({ids: ingId, names: ingNames});
            });
    }, [switchie]);

    const handleIngredientClick = (ingredientId) => {
        console.log(`Clicked on ingredient with ID ${ingredientId}`);
        const formData = new URLSearchParams();
        if(userIngredients.ids.includes(ingredientId)) {
            const data = {
                ingredient_id: ingredientId
            }
            Object.keys(data).forEach(key => formData.append(key, data[key]));
            fetch(`/api/delete/useringredient`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: 'Bearer ' + props.token
                },
                body: formData
            }).then((res) => res.json()).then((data) => {
                console.log(data);
                setSwitchie(!switchie);
            });
        } else {
            const data = {
                ingredient_id: ingredientId,
                quantity: 1
            }
            Object.keys(data).forEach(key => formData.append(key, data[key]));
            fetch(`/api/add/useringredient`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: 'Bearer ' + props.token
                },
                body: formData
            }).then((res) => res.json()).then((data) => {
                console.log(data);
                setSwitchie(!switchie);
            });
        }
        
    };

    return (
        <>
        <h1>Ingredients</h1>
        <p>Select the ingredients you have. The ingredients you currently have are highlighted in green. (Water, salt, and pepper are the only ingredients we assume you have.)</p>
        <div className="search-container">
            <input type="text" placeholder="Search for ingredients" onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="ingredients-container">
            {ingredients.map((ingredient) => (
            <div
            className={`ingredients-item ${userIngredients.names.includes(
              ingredient.ingredient_name
            ) ? 'green' : ''}`}
            key={ingredient.ingredient_id}
            onClick={() => handleIngredientClick(ingredient.ingredient_id)}
            >
            <h2>{ingredient.ingredient_name} ({ingredient.dish_count})</h2>
          </div>
            ))}
        </div>
        </>
    );
}

export default Ingredients;
