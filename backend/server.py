from flask import Flask, jsonify, request
import pandas as pd
from flask_mysqldb import MySQL
 
app = Flask(__name__)


app.config["MYSQL_HOST"] = "localhost"
app.config["MYSQL_USER"] = "root"
app.config["MYSQL_PASSWORD"] = ""
app.config["MYSQL_DB"] = "crumbless"

mysql = MySQL(app)

def runstatement(statement):
    cursor = mysql.connection.cursor()
    cursor.execute(statement)
    results = cursor.fetchall()
    mysql.connection.commit()
    #convert into a pandas dataframe
    df = ""
    if(cursor.description):
        column_names = [desc[0] for desc in cursor.description]
        df = pd.DataFrame(results, columns=column_names)

    cursor.close()
    return df



@app.get('/data')
def get_data() -> str:
    """
    Endpoint to return clique data.
    """
    
    return jsonify({
        'Cities': []
    })


@app.post("/test")
def test():
    print(request.form)
    return jsonify({
        'message': 'Hello, World!'
    })


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