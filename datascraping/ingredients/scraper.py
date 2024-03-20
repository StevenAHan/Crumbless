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
        # check to see that ingredient is not already in ingredients
        if(runStatement(f'SELECT * FROM ingredient WHERE ingredient_name = "{ingredient}"').shape[0] > 0):
            continue
        runStatement(f'INSERT INTO ingredient (ingredient_name) VALUES ("{ingredient}")')
    return jsonify({"msg": "Ingredients added"})


# delete all duplicates
def delete_dups():
    runStatement("DELETE t1 FROM ingredient t1 INNER JOIN ingredient t2 WHERE t1.ingredient_id < t2.ingredient_id AND t1.ingredient_name = t2.ingredient_name")
    return jsonify({"msg": "Duplicates deleted"})