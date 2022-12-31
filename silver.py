import bs4 
import requests 
import pathlib
import datetime

fname = pathlib.Path('silverPrice.txt')
mtime = datetime.datetime.fromtimestamp(fname.stat().st_mtime).date()
today = datetime.date.today()
#print(mtime," | ",today)

if mtime != today:
	url = 'https://www.bankbazaar.com/silver-rate-madhya-pradesh.html'
	result = requests.get(url) 
	soup = bs4.BeautifulSoup(result.content,'html.parser') 
	price = soup.find(class_ = "bigfont")
	show = ""
	show = price.text.split('₹')[1]
	show = show.translate({ord(' '):None,ord('₹'):None,ord(','):None})
	print(show)
	price = open('silverPrice.txt','w')
	price.write(show)
	price.close()


