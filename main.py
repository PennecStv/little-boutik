from fastapi import FastAPI
from dotenv import load_dotenv
import os, httpx

load_dotenv()
base_url = os.getenv("BASE_URL")
api_login = os.getenv("API_LOGIN")
api_key = os.getenv("API_KEY")

app = FastAPI()


@app.get("/")   
async def root():
    return {"message": f"Welcome to my API!"}

@app.get("/customer")
async def get_customer():
    
    # Make a request to the Hiboutik API with Basic Auth
    response = httpx.get(base_url + "/customers", auth=(api_login, api_key))
    if response.status_code == 200:
        data = response.json()
        return {"data": data}
    else:
        return {"error": response.status_code, "message": response.json()}