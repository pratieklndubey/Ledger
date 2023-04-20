import os
import datetime

# The directory where the zip files are located
store = open(r"bustore.txt", 'r')
directory = store.readlines()[0]

# Get the current time
current_time = datetime.datetime.now()

# Find all zip files in the directory
zip_files = [f for f in os.listdir(directory) if f.endswith('.zip')]

# Sort the zip files by modification time
zip_files.sort(key=lambda x: os.path.getmtime(os.path.join(directory, x)))

# Delete all zip files except for the latest one
for zip_file in zip_files[:-1]:
    file_path = os.path.join(directory, zip_file)
    # Check the age of the file
    age = current_time - datetime.datetime.fromtimestamp(os.path.getmtime(file_path))
    if age.days >= 10:
        os.remove(file_path)
