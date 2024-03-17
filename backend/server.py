from flask import Flask, jsonify, request
import pandas as pd
from flask_mysqldb import MySQL
from datetime import datetime, timedelta, timezone
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token,get_jwt,get_jwt_identity, unset_jwt_cookies, jwt_required, JWTManager
import json
 
app = Flask(__name__)


app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'crumbless'
mysql = MySQL(app)

bcrypt = Bcrypt(app) 

app.config["JWT_SECRET_KEY"] = "please-remember-to-change-me"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
jwt = JWTManager(app)
secretKey = "asdsad"


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

# def create_access_token_personal(email):
#     a_token = str(hash(email+secretKey))
#     print(a_token)

@app.route('/login', methods=["POST"])
def create_token():
    users = runStatement("SELECT * FROM user")
    print(request.json)
    username = request.json.get("username", None)
    password = request.json.get("password", None)
    # Find the hashed password associated with the username
    if(users[users["username"] == username].shape[0] == 0):
        return {"msg": "Incorrect Username"}, 401
    foundPass = get_password(username, users)
    print("--------------------------------------")
    print(foundPass, password)
    is_valid = bcrypt.check_password_hash(foundPass, password)
    print(is_valid)
    # Username and password do not match
    if not is_valid:
        return {"msg": "Wrong email or password"}, 401
    access_token = create_access_token(identity=username)
    response = {"access_token": access_token}
    print(response)
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
# @jwt_required()
def my_profile():
    response_body = {
        "name": "Steven",
        "about" :"If this works i am a genius"
    }

    return response_body

@app.route("/logout", methods=["POST"])
def logout():
    response = jsonify({"msg": "logout successful"})
    unset_jwt_cookies(response)
    return response


@app.post('/create/ingredient')
def create_ingredient():
    print(request.form)
    # name = request.form['name']
    # statement = f"INSERT INTO ingredients (name) VALUES ('{name}')"
    # runstatement(statement)
    return jsonify({
        'message': 'Ingredient created!'
    })


if __name__ == '__main__':
    app.run(debug=True)