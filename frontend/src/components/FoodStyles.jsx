import React, { useState, useEffect } from "react";
import "../css/foodstyle.css";

function FoodStyles() {
    const [foodStyles, setFoodStyles] = useState([]);

    useEffect(() => {
        fetch("/api/get/foodstyles", {
            method: "POST",
        })
        .then((res) => res.json())
        .then((data) => {
            data = data.sort((a, b) => a.style_name.localeCompare(b.style_name));
            setFoodStyles(data);
        });
    }, []);

    const organizeFoodStylesByType = () => {
        const organizedFoodStyles = {};
        foodStyles.forEach((foodStyle) => {
            const { style_category } = foodStyle;
            if (!organizedFoodStyles[style_category]) {
                organizedFoodStyles[style_category] = [];
            }
            organizedFoodStyles[style_category].push(foodStyle);
        });
        return organizedFoodStyles;
    };

    const formatText = (text) => {
        return text.charAt(0).toUpperCase() + text.slice(1).replace(/_/g, ' ');
    };

    const organizedFoodStyles = organizeFoodStylesByType();

    return (
        <>
            <h1>List of Food Styles</h1>
            <div className="fs-container">
                {Object.keys(organizedFoodStyles).map((type) => (
                    <div key={type} className="food-style-type">
                        <h2>{formatText(type)}</h2>
                        <div className="fs-items-container">
                            {organizedFoodStyles[type].map((foodStyle) => (
                                <div key={foodStyle.style_id} className={`fs-item ${type.toLowerCase()}`}>
                                    <h3>{foodStyle.style_name}</h3>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default FoodStyles;
