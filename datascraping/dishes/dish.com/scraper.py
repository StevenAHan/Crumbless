from bs4 import BeautifulSoup
import requests
import re

def get_html_body(url):
    try:
        response = requests.get(url)
        # Check if the request was successful (status code 200)
        if response.status_code == 200:
            return response.text  # Return HTML body
        else:
            print("Failed to retrieve HTML. Status code:", response.status_code)
            return None
    except requests.exceptions.RequestException as e:
        print("Error:", e)
        return None

# Converts a html of many search results into a list of strings. Outputs to links.txt
def getUrls():
    from bs4 import BeautifulSoup

    html = ""

    with open('search1-250.txt', 'r', encoding='utf-8') as file:
        html = file.read()
    
    soup = BeautifulSoup(html, 'html.parser')

    tiles = soup.find_all(class_="fd-tile")

    links = []

    for i in range(len(tiles)):
        if(tiles[i].find('a') is None):
            continue
        links.append(tiles[i].find('a')['href'])

    with open('links.txt', 'w', encoding='utf-8') as outfile:
        for link in links:
            outfile.write(link + '\n')

    return links

def find_specific_ingredient(ingredient, ingredients):
    for specific_ingredient in ingredients:
        if specific_ingredient in ingredient:
            return specific_ingredient
    return None

def replace_with_berry(word):
    return word.replace("berries", "berry")

def time_to_minutes(time_str):
    # Split the string into hours and minutes parts
    if("min" in time_str):
        return 1
    if("mins" not in time_str):
        return int(re.search(r'\d+', time_str).group()) * 60
    parts = time_str.split('hr ')
    if(len(parts) == 1):
        parts = time_str.split('hrs ')
    # Extract hours and minutes
    hours = int(parts[0]) if len(parts) > 1 else 0
    minutes = int(parts[1].replace('mins', '')) if len(parts) > 1 else int(time_str.replace('mins', ''))
    
    # Calculate total minutes
    total_minutes = hours * 60 + minutes
    return total_minutes

def foodcomScraper(url):
    html = get_html_body(url)
    soup = BeautifulSoup(html, 'html.parser')


    # Get the description of the recipe
    desc = soup.find('div', class_='svelte-1aswkii').get_text(strip=True)
    styles = []
    with open('styles.txt', 'r') as file:
        styles = file.readlines()
    styles = [style.strip() for style in styles]
    styles_in_food = []

    for style in styles:
        if style.lower() in desc.lower():
            styles_in_food.append(style)

    # Get the title of the recipe
    title = soup.find('h1', class_='svelte-1muv3s8').get_text(strip=True)

    # Get the ingredients
    ingredients = []
    cleaned_ingredients = []
    leftovers = []
    ingredient_items = soup.find_all('span', class_='ingredient-text')
    for item in ingredient_items:
        if(item == None):
            continue
        ingredients.append(item.get_text(strip=True).lower())

    # clean the ingredients
    db_ingredients = []
    with open('ingredients.txt', 'r') as file:
        db_ingredients = file.readlines()
    db_ingredients = [ingredient.strip() for ingredient in db_ingredients]
    # check to see if ingredient is in the database, if not add it
    for ingredient in ingredients:
        ingredient = replace_with_berry(ingredient)
        cleaned_ingredient = find_specific_ingredient(ingredient, db_ingredients)
        if(cleaned_ingredient != None):
            cleaned_ingredients.append(cleaned_ingredient)
        else:
            if("water" in ingredient or "salt" in ingredient or "pepper" in ingredient):
                continue
            leftovers.append(ingredient)


    # Get the instructions
    instructions = []
    instruction_items = soup.find_all('li', class_='direction')
    for item in instruction_items:
        instructions.append(item.get_text(strip=True))
    
    # Get the total time
    total_time = soup.find('dd', class_='facts__value').get_text(strip=True)
    total_time = time_to_minutes(total_time)

    # Get the number of servings
    if(soup.find('span', class_='value svelte-1o10zxc')):
        servings = soup.find('span', class_='value svelte-1o10zxc').get_text(strip=True)
        # Get rid of fractions
        try:
            int(servings)
        except ValueError:
            servings = 1
    else:
        servings = 1

    return {"title": title, "ingredients": cleaned_ingredients, "instructions": instructions, "total_time": total_time, "servings": servings, "leftovers": leftovers, "styles": styles_in_food}

def getLeftovers(links):
    leftovers = []
    i = 1
    for link in links:
        print(link, i)
        i += 1
        leftovers.extend(foodcomScraper(link).leftovers)
    with open('leftovers.txt', 'w', encoding='utf-8') as outfile:
        for row in leftovers:
            outfile.write(f"{row}\n")

    
def add_ingr_to_db():
    ing = []
    html = ""
    with open('toadd.txt', 'r', encoding='utf-8') as file:
        html = file.read()
    ing = html.splitlines()
    for ingr in ing:
        print('''INSERT INTO ingredient (ingredient_name) VALUES ("''' + ingr + '''");''')

def main():
    links = []
    html = ""
    with open('links.txt', 'r', encoding='utf-8') as file:
        html = file.read()
    links = html.splitlines()
    # links = links[:100]
    statements = []
    i = 1
    statements.append("DELETE FROM dish;")
    statements.append("DELETE FROM dish_ingredient;")
    statements.append("DELETE FROM dish_style;")

    for link in links:
        print(link, i)
        i += 1
        food = foodcomScraper(link)
        food["instructions"] = '~'.join(food["instructions"])
        food['title'] = food['title'].replace('"', "'")
        food["instructions"] = food["instructions"].replace('"', "'")
        statements.append(f'''INSERT INTO dish (dish_name, dish_description, serves, time_required, source) VALUES ("{food["title"]}", "{food["instructions"]}", {food["servings"]}, {food["total_time"]}, "{link}");''')
        for ing in food["ingredients"]:
            statements.append(f'''INSERT INTO dish_ingredient (dish_id, ingredient_id) VALUES ((SELECT dish_id FROM dish WHERE dish_name LIKE "{food["title"]}" LIMIT 1), (SELECT ingredient_id FROM ingredient WHERE ingredient_name LIKE "{ing}" LIMIT 1));''')
        for style in food["styles"]:
            statements.append(f'''INSERT INTO dish_style (dish_id, style_id) VALUES ((SELECT dish_id FROM dish WHERE dish_name LIKE "{food["title"]}" LIMIT 1), (SELECT style_id FROM food_style WHERE style_name LIKE "{style}" LIMIT 1));''')
    with open('clean-statements.txt', 'w', encoding='utf-8') as outfile:
        for statement in statements:
            outfile.write(statement + '\n')

if __name__ == "__main__":
    main()