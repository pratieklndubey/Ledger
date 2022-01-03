from nsetools import Nse
import csv
import sys
from os import system,path
nse = Nse()

def listToString(value):  
    name = "" 
    return (name.join(value))

validated = nse.is_valid_code(sys.argv[1])

if sys.argv[1] == 'NIFTYBEES' or sys.argv[1] == 'ICICIB22' or sys.argv[1] == 'SETFNIF50' or sys.argv[1] == 'INDINFO':
    validated = True

if(validated):
    print("True")
    exists = path.exists('stocks.csv')
    if exists:
        flag = True
        with open("stocks.csv", 'r') as checkFile:
            reader = csv.reader(checkFile)
            for row in reader:
                if (sys.argv[1] == listToString(row)):
                    flag = False

        if (flag == True):
            item = [sys.argv[1]]
            with open('stocks.csv', 'a', newline='') as file:
                appender = csv.writer(file)
                appender.writerow(item)
            with open('stockData.csv', 'a', newline='') as file:
                writer = csv.writer(file)
                if item == ['NIFTYBEES']:
                    outPut = ['NIFTYBEES',157.75]
                elif item == ['ICICIB22']:
                    outPut = ['ICICIB22',36.45]
                elif item == ['SETFNIF50']:
                    outPut = ['SETFNIF50',157.88]      
                elif item == ['INDINFO']:
                    outPut = ['INDINFO',1.46]              
                else:
                    ticker = nse.get_quote(sys.argv[1])
                    outPut = [ticker['symbol'],ticker['lastPrice']]
                writer.writerow(outPut)
    else:
        item = [sys.argv[1]]
        with open('stocks.csv', 'w', newline='') as file:
            appender = csv.writer(file)
            appender.writerow(item)
        with open('stockData.csv', 'w', newline='') as file:
            writer = csv.writer(file)
            if item == ['NIFTYBEES']:
                outPut = ['NIFTYBEES',157.75]
            elif item == ['ICICIB22']:
                outPut = ['ICICIB22',36.45]
            elif item == ['SETFNIF50']:
                outPut = ['SETFNIF50',157.88]
            elif item == ['INDINFO']:
                outPut = ['INDINFO',1.46]
            else:
                ticker = nse.get_quote(sys.argv[1])
                outPut = [ticker['symbol'],ticker['lastPrice']]
            writer.writerow(outPut)
        
else:
    print("False")
