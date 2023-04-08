
import shutil
from datetime import date,datetime

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

shutil.rmtree(dir_name)


