import mysql.connector
from datetime import datetime

class User:
    def __init__(self, host, user, password, database):
        self.conn = mysql.connector.connect(
            host=host,
            user=user,
            password=password,
            database=database
        )
        self.cursor = self.conn.cursor()

    def create_user(self, username, email, password):
        query = "INSERT INTO user (username, email, password, datetime) VALUES (%s, %s, %s, %s)"
        values = (username, email, password, datetime.today())
        self.cursor.execute(query, values)
        self.conn.commit()
        return self.cursor.lastrowid

    def get_user(self, username, password):
        query = "SELECT * FROM user WHERE username = %s and password = %s"
        self.cursor.execute(query, (username,password))
        user =  self.cursor.fetchone()
        print(user)
        return user

    def update_user(self, user_id, new_username):
        query = "UPDATE user SET username = %s WHERE id = %s"
        values = (new_username, user_id)
        self.cursor.execute(query, values)
        self.conn.commit()
        return self.cursor.rowcount

    def delete_user(self, user_id):
        query = "DELETE FROM user WHERE id = %s"
        self.cursor.execute(query, (user_id,))
        self.conn.commit()
        return self.cursor.rowcount
