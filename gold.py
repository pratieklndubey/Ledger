import requests
from bs4 import BeautifulSoup

url = "https://www.amazon.com/Apple-iPhone-13-Pro-Max/dp/B097P9B819"

page = requests.get(url)
soup = BeautifulSoup(page.content, "html.parser")

price = soup.find(class_='bigfont')
if price is None:
    price = "N/A"

print(price)