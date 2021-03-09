import bs4 
import requests 

url = 'https://www.goodreturns.in/silver-rates/delhi.html'
result = requests.get(url) 
soup = bs4.BeautifulSoup(result.content,'html.parser') 
price = soup.find_all('strong', {"id":"el"})
show = ""
for pr in price:
	show = pr.text
show = show.translate({ord(' '):None,ord('₹'):None,ord(','):None})
price = open('silverPrice.txt','w')
price.write(show)
price.close()


