import shutil
from os import path, mkdir
from datetime import date

# Get the current date
current_date = date.today()
year = str(current_date.year)

# Add leading zero to month and day if needed
month = str(current_date.month).zfill(2)
day = str(current_date.day).zfill(2)

# Set the output filename and directory name
output_filename = year + month + day
dir_name = year + month + day

# Create a zip archive of the directory
shutil.make_archive(output_filename, 'zip', dir_name)

# Read the path to the backup storage directory from file
with open(r"bustore.txt", 'r') as store:
    fpath = store.readline().strip()

# Create the backup storage directory if it doesn't exist
if not path.exists(fpath):
    mkdir(fpath)

# Delete the directory that was zipped
shutil.rmtree(dir_name)

# Move the zip archive to the backup storage directory
shutil.move(output_filename+'.zip', path.join(fpath, output_filename+'.zip'))
