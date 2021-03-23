from nsetools import Nse
import csv
import sys
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

with open('stockData.csv', 'w', newline='') as file:
    writer = csv.writer(file)
    """header = ['Ticker', 'Price']
    writer.writerow(header)"""
    for entry in stocks:
        print(entry)
        if entry == ['NIFTYBEES']:
            outPut = ['NIFTYBEES',158.31]
        elif entry == ['ICICIB22']:
            outPut = ['ICICIB22',36.05]
        else:
            ticker = nse.get_quote(listToString(entry))
            outPut = [ticker['symbol'],ticker['lastPrice']]
        writer.writerow(outPut)
    print("Writing Complete!!")