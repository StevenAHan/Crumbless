from bs4 import BeautifulSoup

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
        runStatement(f'INSERT INTO ingredient (ingredient_name) VALUES ("{ingredient}")')
    return jsonify({"msg": "Ingredients added"})