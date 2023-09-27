from fastapi import FastAPI, Depends, HTTPException, UploadFile, Request
from src.mylib.upload import Upload
import uvicorn
from src.mysqldb.user import User
from src.mysqldb.file import File
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
import json


app = FastAPI()
uploadDoc = Upload()
db_entity = User(host='localhost',
                 user='root',
                 password='',
                 database='chatbox')
file_entity = File(host='localhost',
                   user='root',
                   password='',
                   database='chatbox')


@app.get("/me")
def get_items():
    return 1


app.add_middleware(
    CORSMiddleware,
    allow_origins='*',
    allow_credentials=True,
    allow_methods=["POST", "GET", "DELETE"],
    allow_headers=["Content-Type"],
)


@app.post("/upload-file/")
async def upload_file(file: UploadFile, userId, username):
    print(file.filename, userId,username)
    filepath = uploadDoc.uploadDocument(file, username)
    if type(filepath) == str:
        response = file_entity.create_file(
            filename=file.filename, filepath=filepath, userId=userId)
        print(response)
        return response
    else:
        return filepath
    

@app.get("/get-file-list/")
async def get_files(userId):
    files = file_entity.get_files_by_user(userId)
    return files

@app.post("/answer/")
async def get_answer(request_obj : dict):
    # Process the uploaded file here
    # 'file' contains the uploaded file data

    # For demonstration, we'll just return the file name
    file_path_list = file_entity.get_files_by_name_user(userId=request_obj['userId'], filenames=request_obj['file_list'])
    response = uploadDoc.processDocument(request_obj['question'], file_path_list)
    print(response)
    return response

"""@app.get("/get-file/")
async def get_file(file_data : dict ):
    response = file_entity.get_file_by_name_user(file_data['userid'],file_data['filename'])
    print(response)
    return response

@app.post("/process-file/")
async def upload_file(file: UploadFile):
    # Process the uploaded file here
    # 'file' contains the uploaded file data
    
    # For demonstration, we'll just return the file name
    response = Upload.uploadDocument(file)
    print(response)
    return response"""


@app.post("/register/")
async def create_user(user_request: dict):
    print(user_request)
    user = db_entity.create_user(
        user_request['username'], user_request['email'], user_request['password'])
    return user


@app.post("/login/")
async def login(credentials: dict):
    print(credentials)
    username = credentials['username']
    # hashlib.sha256(credentials.password.encode()).hexdigest()  # Hash the password
    password = credentials['password']

    # Check if the username and hashed password combination exists in the database
    user = db_entity.get_user(username, password)

    if user:   
        formatted_datetime = user[4].isoformat()
        user_dict = {
            "id": user[0],
            "name": user[1],
            "email": user[2],
            "datetime": formatted_datetime,
        }
        #json_output = json.dumps(user_dict)
        return user_dict
    else:
        raise HTTPException(status_code=404, detail="User not found")

    # python -m uvicorn main:app --reload"""

@app.post("/delete-file")
async def delete(file: str, userId):
    deleted = file_entity.delete_file(file, userId)
    return deleted

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
