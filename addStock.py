from nsetools import Nse
import csv
import sys
nse = Nse()

def listToString(value):  
    name = "" 
    return (name.join(value))

validated = nse.is_valid_code(sys.argv[1])

if(validated):
    print("True")
    item = [sys.argv[1]]
    with open('stocks.csv', 'a', newline='') as file:
        appender = csv.writer(file)
        appender.writerow(item)
    with open('stockData.csv', 'a', newline='') as file:
        writer = csv.writer(file)
        ticker = nse.get_quote(sys.argv[1])
        outPut = [ticker['symbol'],ticker['lastPrice']]
        writer.writerow(outPut)
else:
    print("False")
