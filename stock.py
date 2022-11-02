from nsetools import Nse
import csv
import sys
import os
import pathlib
import datetime

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
                ticker = nse.get_index_quote('NIFTY 50')
                outPut = ['NIFTYBEES',float(ticker['lastPrice']/92.45)]
            elif entry == ['ICICIB22']:
                ticker = nse.get_index_quote('NIFTY 50')
                outPut = ['ICICIB22',float(ticker['lastPrice']/377.87)]
            elif entry == ['SETFNIF50']:
                ticker = nse.get_index_quote('NIFTY 50')
                outPut = ['SETFNIF50',float(ticker['lastPrice']/97.76)]
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


