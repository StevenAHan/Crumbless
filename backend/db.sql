CREATE TABLE User (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    creation_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    acc_type INT DEFAULT 0,
    user_img VARCHAR(255) DEFAULT 'default.png'
);

CREATE TABLE Dish (
    dish_id INT PRIMARY KEY AUTO_INCREMENT,
    dish_name VARCHAR(255) NOT NULL,
    dish_description TEXT NOT NULL,
    dish_img VARCHAR(255) DEFAULT 'default.png',
    source VARCHAR(255) NOT NULL,
    verified BOOLEAN DEFAULT 0,
    creation_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_created BOOLEAN DEFAULT 0
);

CREATE TABLE Ingredient (
    ingredient_id INT PRIMARY KEY AUTO_INCREMENT,
    ingredient_name VARCHAR(255) NOT NULL,
    ingredient_desc TEXT NOT NULL,
    ingredient_img VARCHAR(255) DEFAULT 'default.png',
    creation_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_created BOOLEAN DEFAULT 0,
    quantity_type VARCHAR(255) NOT NULL
);

CREATE TABLE Dish_Ingredient (
    dish_ingredient_id INT PRIMARY KEY AUTO_INCREMENT,
    dish_id INT REFERENCES Dish(dish_id),,
    ingredient_id INT REFERENCES Ingredient(ingredient_id),
    essential BOOLEAN DEFAULT 0,
    quantity FLOAT NOT NULL,
);

CREATE TABLE Dish_Ingredient_Alternative (
    dish_ingredient_id INT REFERENCES Dish_Ingredient(dish_ingredient_id),
    ingredient_id INT REFERENCES Ingredient(ingredient_id),
    PRIMARY KEY (dish_ingredient_id, ingredient_id)
);

CREATE TABLE User_Ingredient (
    user_id INT REFERENCES User(user_id),
    ingredient_id INT REFERENCES Ingredient(ingredient_id),
    quantity FLOAT NOT NULL,
    PRIMARY KEY (user_id, ingredient_id)
);

CREATE TABLE User_Dish (
    user_id INT REFERENCES User(user_id),
    dish_id INT REFERENCES Dish(dish_id),
    rating FLOAT NOT NULL,
    review VARCHAR(255),
    rev_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, dish_id)
);

CREATE TABLE User_Favorited_Dish (
    user_id INT REFERENCES User(user_id),
    dish_id INT REFERENCES Dish(dish_id),
    fav_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, dish_id)
);

CREATE TABLE Dish_Style (
    dish_id INT REFERENCES Dish(dish_id),
    style_id INT REFERENCES Style(style_id),
    PRIMARY KEY (dish_id, style_id)
);

CREATE TABLE Food_Style (
    style_id INT PRIMARY KEY AUTO_INCREMENT,
    style_name VARCHAR(255) NOT NULL,
    style_description VARCHAR(255) NOT NULL,
    style_img VARCHAR(255) DEFAULT 'default.png'
);
