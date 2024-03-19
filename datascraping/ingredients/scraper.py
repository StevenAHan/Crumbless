from bs4 import BeautifulSoup

# Read HTML content from the file
def getIngredients():
    with open('ingr.txt', 'r') as file:
        html = file.read()

    soup = BeautifulSoup(html, 'html.parser')

    # Find all tags-mini-item elements
    items = soup.find_all(class_='tags-mini-item')

    # Extract text from each element
    ingredients = [item.get_text(strip=True) for item in items]
    
    # check to see if ingredients table is empty
    if(runStatement("SELECT * FROM ingredient").shape[0] > 0):
        return jsonify({"msg": "Ingredients already exist"}), 401
    for ingredient in ingredients:
        print(f"INSERT INTO ingredient (name) VALUES ({ingredient})")
        runStatement(f'INSERT INTO ingredient (ingredient_name) VALUES ("{ingredient}")')
    return jsonify({"msg": "Ingredients added"})


def inputIntoDatabase(ingredients):
    # Connect to MySQL database
    try:
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password="",
            database="crumbless"
        )
        
        if conn.is_connected():
            print('Connected to MySQL database')

            cursor = conn.cursor()

            # Insert each ingredient into the database
            for ingredient in ingredients:
                query = "INSERT INTO ingredient (name) VALUES (%s)"
                data = (ingredient)
                cursor.execute(query, data)
                conn.commit()

            print("Data inserted successfully")

    except mysql.connector.Error as error:
        print("Failed to connect to MySQL database: {}".format(error))

    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()
            print("MySQL connection is closed")


# Get ingredients from HTML
ingredients = getIngredients()

# Input ingredients into the database
inputIntoDatabase(ingredients)