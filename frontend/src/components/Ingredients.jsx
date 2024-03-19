import { useState, useEffect } from "react";
import "../css/ingredient.css";

function Ingredients() {
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    fetch("/api/get/ingredients")
      .then((res) => res.json())
      .then((data) => {
        setIngredients(data);
      });
  }, []);

  return (
    <>
      <h1>Ingredients</h1>
      <div className="ingredients-container">
        {ingredients.map((ingredient) => (
          <div className="ingredients-item" key={ingredient.ingredient_id}>
            <h2>{ingredient.ingredient_name}</h2>
          </div>
        ))}
      </div>
    </>
  );
}

export default Ingredients;
