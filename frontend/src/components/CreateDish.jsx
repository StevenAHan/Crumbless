import { useState, useEffect } from "react";

function CreateDish() {
 
    return (
        <div className='create-ingredient-container'>
            <h1>Create/Submit a New Dish</h1>

            <form  className='create-ingredient-form'>
                <div>
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" name="name" required />
                </div>
                <div>
                    <label htmlFor="description">Description</label>
                    <input type="text" id="description" name="description" required />
                </div>
                <div>
                    <label htmlFor="instruction">Instructions</label>
                    <input type="text" id="instruction" name="instruction" required />
                </div>
                <div>
                    <label htmlFor="ingredients">Ingredients</label>
                    {/* todo */}
                </div>
                <div>
                    <label htmlFor="image">Image</label>
                    <input type="file" id="image" name="image" required />
                </div>
                <div>
                    <button type="submit">Submit</button>
                </div>
            </form>
        </div>
    );
}
 
export default CreateDish;