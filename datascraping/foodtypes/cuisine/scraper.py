from bs4 import BeautifulSoup

def scrape_cuisines():
    with open('cuisine.txt', 'r', encoding='utf-8') as file:
        html = file.read()

    soup = BeautifulSoup(html, 'html.parser')
    items = soup.find_all('a', class_='mntl-link-list__link')
    cuisines = [item.get_text(strip=True) for item in items]
    
    # Generate INSERT statements
    insert_statements = []
    for cuisine in cuisines:
        insert_statement = "INSERT INTO Food_Style (style_name, style_category, style_description) VALUES ('{}', 'Cuisine', '');".format(cuisine)
        insert_statements.append(insert_statement)
    
    return insert_statements

# Example usage:
insert_statements = scrape_cuisines()
for statement in insert_statements:
    print(statement)
