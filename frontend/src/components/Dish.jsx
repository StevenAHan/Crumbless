import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

function Dish(props) {
    const [dishInfo, setDishInfo] = useState({});
    const [searchParams] = useSearchParams();
    const [userIng, setUserIng] = useState([]);
    const [instrHTML, setInstrHTML] = useState([]);

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
            data.dish.creation_time = new Date(data.dish.creation_time).toLocaleDateString('en-US');
            setDishInfo(data);
        });
    }, [searchParams]);

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

        // Set instructions HTML
        if(dishInfo && dishInfo.dish && dishInfo.dish.dish_description) {
            setInstrHTML(() => {
                const instrHTML = [];
                let j = 0;
                for (let i = 0; i < dishInfo.dish.dish_description.length; i++) {
                    if(dishInfo.dish.dish_description[i].includes("Editor")) continue;
                    instrHTML.push(<p key={j + 1} className="dish-desc-num">{j + 1}.</p>);
                    j++;
                    instrHTML.push(<p key={i} className="dish-desc-item">{dishInfo.dish.dish_description[i]}</p>);
                    instrHTML.push(<br key={j + 1} />)
                }
                return instrHTML;
            });
        }
        console.log(dishInfo)
        
    }, [dishInfo]);

    return (
        <>
            {(dishInfo && dishInfo.dish) ?(<>
                <div className="dish-page-title-container">
                    <h1 className="dish-page-title">{dishInfo.dish.dish_name}</h1>
                </div>  
                <ul className="dish-page-styles-container">
                    {dishInfo.dish_styles && dishInfo.dish_styles.map((style) => (
                        <li key={style.style_id} className={`fs-item-li stylebutton ${style.style_category.toLowerCase()}`}>{style.style_name}</li>
                    ))}
                </ul>
                <div className="dish-page-container">
                    <div className="dish-page-popout">
                        <img src={dishInfo.dish.dish_img} alt={dishInfo.dish.dish_name} className="dish-page-image"/>
                        {/* <div className="ratings">
                            <h4>RATINGS</h4>
                            <p>{dishInfo.dish.rating}</p>
                        </div> */}
                        <div className="source-btn-container">
                            <a href={dishInfo.dish.source} className="source-btn btn" target="_blank" rel="noopener noreferrer">Check Source</a>
                        </div>
                        <div>
                            <h4>DATE CREATED</h4>
                            <p>{dishInfo.dish.creation_time}</p>
                        </div>
                        <div>
                            <h4>SERVES</h4>
                            <p>{dishInfo.dish.serves}</p>
                        </div>
                        <div>
                            <h4>PREP TIME</h4>
                            {/* convert minutes into hours and minutes, labeled */}
                            <p>{dishInfo.dish.time_required} minutes</p>
                        </div>
                    </div>
                    <div className="dish-page-info">
                        <div className="dish-page-ingredients-container">
                            <h2>Ingredients</h2>
                            <div className="ingr-key">
                                <div className="green-box"></div>
                                <p className="ingr-key-p">Already in your fridge</p>
                            </div>
                            <ul className="dish-ingredients">
                                {dishInfo.dish_ingredients && dishInfo.dish_ingredients.map((ingredient) => (
                                    <li key={ingredient.ingredient_id} className={`ingredients-item-li large ${userIng && userIng.names && userIng.names.includes(ingredient.ingredient_name) ? 'green': ""}`}>{ingredient.ingredient_name}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="dish-page-instructions-container">
                            <h2>Instructions</h2>
                            <p>{instrHTML}</p>
                        </div>
                        <a href={dishInfo.dish_source} className="src-btn btn">Check Source</a>
                    </div>
                </div>
            </>) : (<></>)}
        </>
    );
}
 
export default Dish;