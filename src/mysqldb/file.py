import mysql.connector
from fastapi import UploadFile
from datetime import datetime

class File:
    def __init__(self, host, user, password, database):
        self.conn = mysql.connector.connect(
            host=host,
            user=user,
            password=password,
            database=database
        )
        self.cursor = self.conn.cursor()

    def create_file(self, filename : str , filepath : str, userId : int ):
        print("i m in create")
        query = "INSERT INTO file_table (filename, filepath, datetime, userId) VALUES (%s, %s, %s, %s)"
        values = (filename,filepath,datetime.today(),userId )
        self.cursor.execute(query, values)
        self.conn.commit()
        return self.cursor.lastrowid

    def get_files_by_name_user(self, userId : int, filenames : list):
        # Create a list to store the filepaths
        filepaths = []
        print("I m in method ")
        print(userId)

        # Loop through the list of filenames and retrieve matching filepaths
        for filename in filenames:
            query = "SELECT filepath FROM file_table WHERE userId = %s AND filename = %s"
            self.cursor.execute(query, (userId, filename))
            file = self.cursor.fetchone()

            # Check if a file was found
            if file:
                filepaths.append(file[0])  # Assuming the filepath is in the first column

        return filepaths
    
    def get_files_by_user(self, userid):
        query = "SELECT filename FROM file_table WHERE userid = %s"
        self.cursor.execute(query, (userid,))
        file_rows = self.cursor.fetchall()
        
        # Extract filenames from the result
        filenames = [row[0] for row in file_rows]
        
        return filenames

    def update_file(self, file_id, new_filename, new_file_data, new_user_id):
        query = "UPDATE file_table SET filename = %s, file = %s, userid = %s WHERE id = %s"
        values = (new_filename, new_file_data, new_user_id, file_id)
        self.cursor.execute(query, values)
        self.conn.commit()
        return self.cursor.rowcount

    def delete_file(self, filename, userid):
        query = "DELETE FROM file_table WHERE userid = %s and filename = %s"
        self.cursor.execute(query, (userid, filename))
        self.conn.commit()
        return True

