from nsetools import Nse
import csv
import sys
import os
import pathlib
import datetime
import requests
from bs4 import BeautifulSoup

fname = pathlib.Path('stockData.csv')
mtime = datetime.datetime.fromtimestamp(fname.stat().st_mtime).date()
today = datetime.date.today()

if True:#today != mtime
    nse = Nse()

    def listToString(value):  
        name = "" 
        return (name.join(value))

    print("Fetching Data...")

    stocks = []
    with open('stocks.csv', 'r') as file:
        reader = csv.reader(file)
        for row in reader:
            stocks.append(row)

    listSize = len(stocks)
    counter = 0

    with open('stockDataStore.csv', 'w', newline='') as file:
        writer = csv.writer(file)
        """header = ['Ticker', 'Price']
        writer.writerow(header)"""
        for entry in stocks:
            counter += 1
            print(entry,counter,"/",listSize)
            if entry == ['NIFTYBEES']:
                URL = 'https://www.tickertape.in/etfs/nippon-india-nifty-50-bees-etf-NBES'
                page = requests.get(URL)
                soup = BeautifulSoup(page.content, 'html.parser')
                price_div = soup.find(class_='current-price')
                price = price_div.get_text()
                outPut = ['NIFTYBEES',float(price)]
            elif entry == ['ICICIB22']:
                ticker = nse.get_index_quote('NIFTY 50')
                outPut = ['ICICIB22',float(ticker['lastPrice']/377.87)]
            elif entry == ['SETFNIF50']:
                URL = 'https://www.tickertape.in/etfs/sbi-nifty-50-etf-SBFP'
                page = requests.get(URL)
                soup = BeautifulSoup(page.content, 'html.parser')
                price_div = soup.find(class_='current-price')
                price = price_div.get_text()
                outPut = ['SETFNIF50',float(price)]
            elif entry == ['INDINFO']:
                outPut = ['INDINFO',1.46]
            else:
                ticker = nse.get_quote(listToString(entry))
                outPut = [ticker['symbol'],ticker['lastPrice']]
            writer.writerow(outPut)

    with open('stockDataStore.csv', 'r', newline='') as file, open('stockData.csv', 'w', newline='') as data:
        for ticker in file:
            data.write(ticker)
        print("Writing Complete!!")

    os.remove("stockDataStore.csv")


