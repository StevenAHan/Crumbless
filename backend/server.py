from flask import Flask, jsonify, request
import pandas as pd
from flask_mysqldb import MySQL
from datetime import datetime, timedelta, timezone
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token,get_jwt,get_jwt_identity, unset_jwt_cookies, jwt_required, JWTManager
import json
from bs4 import BeautifulSoup

 
app = Flask(__name__)


app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'crumbless'
mysql = MySQL(app)

bcrypt = Bcrypt(app) 

# To store later into environment variable
secretKey = "hello!"

app.config["JWT_SECRET_KEY"] = secretKey
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
jwt = JWTManager(app)


def runStatement(statement):
    cursor = mysql.connection.cursor()
    cursor.execute(statement)
    results = cursor.fetchall()
    mysql.connection.commit()
    df = ""
    if(cursor.description):
        column_names = [desc[0] for desc in cursor.description]
        df = pd.DataFrame(results, columns=column_names)
    cursor.close()
    return df

def getUserInfo():
    username = get_jwt_identity()
    user_info = runStatement(f"SELECT * FROM user WHERE username = '{username}'")
    if(user_info.shape[0] == 0):
        return jsonify({"msg": "User not found"}), 404
    return user_info.to_json(orient="records")

def get_password(username, df):
    password = df.loc[df['username'] == username, 'password'].values
    if len(password) > 0:
        return password[0]
    else:
        return None

@app.after_request
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            data = response.get_json()
            if type(data) is dict:
                data["access_token"] = access_token 
                response.data = json.dumps(data)
        return response
    except (RuntimeError, KeyError):
        # Case where there is not a valid JWT. Just return the original respone
        return response

@app.route('/login', methods=["POST"])
def create_token():
    users = runStatement("SELECT * FROM user")
    username = request.json.get("username", None)
    password = request.json.get("password", None)
    # Find the hashed password associated with the username
    if(users[users["username"] == username].shape[0] == 0):
        return {"msg": "Incorrect Username"}, 401
    foundPass = get_password(username, users)
    is_valid = bcrypt.check_password_hash(foundPass, password)
    # Username and password do not match
    if not is_valid:
        return {"msg": "Wrong email or password"}, 401
    access_token = create_access_token(identity=username)
    response = {"access_token": access_token}
    return response

@app.route("/register", methods=["POST"])
def create_user():
    print(request.json)
    # Parse Inputted Data
    username = request.json.get("username", None)
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    first_name = request.json.get("firstName", None)
    last_name = request.json.get("lastName", None)
    # Hash Password
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    # Check if username already exists
    if(runStatement(f"SELECT * FROM user WHERE username = '{username}'").shape[0] > 0):
        return {"msg": "Username already exists"}, 401
    # Create account
    statement = f"INSERT INTO user (username, email, password, first_name, last_name) VALUES ('{username}', '{email}', '{hashed_password}', '{first_name}', '{last_name}')"
    runStatement(statement)
    return {"msg": "User created"}


@app.route('/profile')
@jwt_required()
def my_profile():
    return getUserInfo()

@app.route("/logout", methods=["POST"])
def logout():
    response = jsonify({"msg": "logout successful"})
    unset_jwt_cookies(response)
    return response


@app.post('/create/ingredient')
def create_ingredient():
    print("hi")
    name = request.form.get("name", None)
    description = request.form.get("description", None)
    qType = request.form.get("qType", None)
    cBU = request.form.get("cBU", None)

    print(name, description, qType, cBU)

    # check if ingredient already exists
    if(runStatement(f"SELECT * FROM ingredient WHERE ingredient_name = '{name}'").shape[0] > 0):
        return {"msg": "Ingredient already exists"}, 401
    
    statement = f"INSERT INTO ingredient (ingredient_name, ingredient_desc, quantity_type, user_created) VALUES ('{name}', '{description}', '{qType}', '{cBU}')"
    runStatement(statement)
    return jsonify({
        'message': 'Ingredient created!'
    })

@app.route("/getuserinfo")
@jwt_required()
def get_user_info():
    print("hello")
    username = get_jwt_identity()
    user_info = runStatement(f"SELECT * FROM user WHERE username = '{username}'")
    if(user_info.shape[0] == 0):
        return jsonify({"msg": "User not found"}), 404
    return user_info.to_json(orient="records")


@app.route("/get/ingredients")
def get_ingredients():
    ingredients = runStatement("SELECT * FROM ingredient")
    return ingredients.to_json(orient="records")

@app.route("/get/useringredient")
@jwt_required()
def get_user_ingredients():
    username = get_jwt_identity()
    ingredients = runStatement(f'''SELECT ingredient.ingredient_id, user.user_id, ingredient.ingredient_name FROM ingredient 
                               INNER JOIN user_ingredient ON ingredient.ingredient_id = user_ingredient.ingredient_id
                               INNER JOIN user ON user_ingredient.user_id = user.user_id
                               WHERE user.username = "{username}"''')
    return ingredients.to_json(orient="records")

@app.route("/add/useringredient", methods=["POST"])
@jwt_required()
def add_user_ingredient():
    username = get_jwt_identity()
    ingredient_id = request.form.get("ingredient_id", None)
    quantity = request.form.get("quantity", None)
    # Check if ingredient is valid
    if(runStatement(f"SELECT * FROM ingredient WHERE ingredient_id = '{ingredient_id}'").shape[0] == 0):
        return jsonify({"msg": "Invalid ingredient"}), 401
    statement = f"INSERT INTO user_ingredient (user_id, ingredient_id, quantity) VALUES ((SELECT user_id FROM user WHERE username = '{username}'), '{ingredient_id}', '{quantity}')"
    runStatement(statement)
    return jsonify({"msg": "Ingredient added!"})

@app.route("/delete/useringredient", methods=["DELETE"])
@jwt_required()
def delete_user_ingredient():
    username = get_jwt_identity()
    ingredient_id = request.form.get("ingredient_id", None)
    statement = f"DELETE FROM user_ingredient WHERE user_id = (SELECT user_id FROM user WHERE username = '{username}') AND ingredient_id = '{ingredient_id}'"
    runStatement(statement)
    return jsonify({"msg": "Ingredient deleted!"})

if __name__ == '__main__':
    app.run(debug=True)