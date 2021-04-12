import bs4 
import requests 
import pathlib
import datetime

fname = pathlib.Path('goldPrice.txt')
mtime = datetime.datetime.fromtimestamp(fname.stat().st_mtime).date()
today = datetime.date.today()
if today != mtime:
	url = 'https://www.goodreturns.in/gold-rates/delhi.html'
	result = requests.get(url) 
	soup = bs4.BeautifulSoup(result.content,'html.parser') 
	price = soup.find_all('strong', {"id":"el"})
	show = ""
	for pr in price:
		show = pr.text
	show = show.translate({ord(' '):None,ord('₹'):None,ord(','):None})
	price = open('goldPrice.txt','w')
	price.write(show)
	price.close()


