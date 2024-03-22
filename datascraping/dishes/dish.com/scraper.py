from bs4 import BeautifulSoup
import requests

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


def foodcomScraper(url):
    html = get_html_body(url)
    soup = BeautifulSoup(html, 'html.parser')

    # Get the title of the recipe
    # title = soup.find('h1', class_='recipe-title').get_text(strip=True)

    # Get the ingredients
    ingredients = []
    ingredient_items = soup.find_all('span', class_='ingredient-text')
    for item in ingredient_items:
        if(item == None):
            continue
        ingredients.append(item.get_text(strip=True))

    # # Get the instructions
    # instructions = []
    # instruction_items = soup.find_all('li', class_='recipe-directions__step')
    # for item in instruction_items:
    #     instructions.append(item.get_text(strip=True))
    
    # # Get the total time
    # total_time = soup.find('div', class_='recipe-facts__time').get_text(strip=True)

    # # Get the number of servings
    # servings = soup.find('div', class_='recipe-facts__servings').get_text(strip=True)

    # Print the results
    # print("Title:", title)
    print("Ingredients:", ingredients)
    # print("Instructions:", instructions)
    # print("Total Time:", total_time)
    # print("Servings:", servings)



foodcomScraper('https://www.food.com/recipe/creamy-chicken-and-broccoli-casserole-521429')