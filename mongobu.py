"""from pydrive.auth import GoogleAuth
from pydrive.drive import GoogleDrive"""
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

"""
read_date = open('lastbudate.txt','r')
performed = read_date.read()
read_date.close()

performed_list = list(performed.split("-"))
performed_list = list(map(int,performed_list))

performed_date = date(performed_list[0],performed_list[1],performed_list[2])

current_date = date.today()

date_difference = current_date - performed_date

if int(date_difference.days) > 5:
    lastbudate = year+"-"+month+"-"+day

    write_date = open('lastbudate.txt','w')
    write_date.write(lastbudate)
    write_date.close()

    
    gauth = GoogleAuth()           
    drive = GoogleDrive(gauth)  

    upload_file_list = [output_filename+".zip"]
    for upload_file in upload_file_list:
        gfile = drive.CreateFile({'parents': [{'id': '18SfHg1rz9tXxKbwhd5_VNI8N0Y-iKKvi'}]})
        # Read file and set it as the content of this instance.
        gfile.SetContentFile(upload_file)
        gfile.Upload() # Upload the file.
 """   

