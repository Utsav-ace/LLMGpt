from langchain.document_loaders import PyPDFLoader
from langchain.document_loaders.csv_loader import CSVLoader
from langchain.text_splitter import MarkdownHeaderTextSplitter,RecursiveCharacterTextSplitter
from langchain.vectorstores import Chroma
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.llms import OpenAI
from langchain.retrievers.self_query.base import SelfQueryRetriever
from langchain.chains.query_constructor.base import AttributeInfo    
from langchain.chains import RetrievalQA, ConversationalRetrievalChain
from langchain.text_splitter import CharacterTextSplitter
from langchain.chat_models import ChatOpenAI
from fastapi import UploadFile
from langchain.chains.question_answering import load_qa_chain
import os
import json
import requests
from langchain.document_loaders import PyPDFLoader, TextLoader
import PyPDF2

os.environ['OPENAI_API_KEY'] = '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'

class Upload:
    def __init__(self) -> None:
        self.temp_path = ''
    def uploadDocument(self,uploadedFile : UploadFile, username : str):
        try:
            file_extension = uploadedFile.filename.split('.')[-1].lower()
            if file_extension == 'pdf' or file_extension == 'csv' or file_extension =='txt':
                # Read the contents of the uploaded file
                #file_content = os.path.basename(uploadedFile.filename)
                #print(file_content)
                
                # Get the current working directory
                current_directory = os.getcwd()
                new_folder_path = os.path.join(current_directory, username)
                os.makedirs(new_folder_path, exist_ok=True)
                

                # Construct the path for saving the file in the current folder
                file_path = os.path.join(new_folder_path, uploadedFile.filename)

                # Save the file to the current folder
                with open(file_path, "wb") as f:
                    f.write(uploadedFile.file.read())
                return file_path
            else:
                return {"errormsg" : "Please upload file with .pdf, .txt or .csv extension"}
        
        except Exception as e:
            return {"error": str(e)}
    
        
    def processDocument(self, question : str, filepaths : list):
        response_list = {}
        for file_path in filepaths:
            print(file_path)
            file_extension = file_path.split('.')[-1].lower()
            file_name = file_path.split('\\')[-1]
            print(file_extension)

            if file_extension == 'pdf':
                loader = PyPDFLoader(file_path)
                
            elif file_extension == 'txt':
                loader = TextLoader(file_path)
            
            elif file_extension == 'csv':
                loader = CSVLoader(file_path)

            documents = loader.load()
            text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
            documents = text_splitter.split_documents(documents)
            vectordb = Chroma.from_documents(
            documents,
            embedding=OpenAIEmbeddings(),
            persist_directory='./data'
            )
            vectordb.persist()


            # we are specifying that OpenAI is the LLM that we want to use in our chain
            chain = load_qa_chain(llm=OpenAI())
            response = chain.run(input_documents=documents, question=question)
            print(response)
            if (response != " I don't know."):
                response_list[file_name] = response


        #json_output = json.dumps(response_list)
        return response_list
        # {'source': 'docs/cs229_lectures/MachineLearning-Lecture01.pdf', 'page': 0}

