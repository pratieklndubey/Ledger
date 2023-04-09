
import shutil
from os import path,mkdir
from datetime import date

year = str(date.today().year)

if date.today().month < 10:
    month = "0"+str(date.today().month)
else:
    month = str(date.today().month)

if date.today().day < 10:
    day = "0"+str(date.today().day)
else:
    day = str(date.today().day)

output_filename = year+month+day
dir_name = year+month+day

shutil.make_archive(output_filename, 'zip', dir_name)

store = open(r"bustore.txt", 'r')

fpath = store.readlines()[0]

if not path.exists(fpath):
    mkdir(fpath)

shutil.rmtree(dir_name)

shutil.move(output_filename+'.zip',fpath+output_filename+'.zip')


