import { useState, useEffect } from "react";

function Ingredients() {
    const [ingredients, setIngredients] = useState([]);
    const [ingredientsHTML, setIngredientsHTML] = useState([]);
    
    useEffect(() => {
        fetch("/api/ingredients")
        .then((res) => res.json())
        .then((data) => {
            setIngredients(data);
            
        });
    }, []);

    useEffect(() => {
        setIngredientsHTML(ingredients.map((ingredient) => {
            return (
                <div className="ingredients-Container" key={ingredient.id}>
                    <h2>{ingredient.name}</h2>
                    <p>{ingredient.description}</p>
                </div>
            );
        }));
    }, [ingredients]);

    return (
        <>
            <h1>Ingredients</h1>
            {ingredientsHTML}
        </>
    );
}
 
export default Ingredients;