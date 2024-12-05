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

'''
API ENDPOINTS
'''

@app.get("/customers")
async def get_customers():
    # Make a request to the Hiboutik API with Basic Auth
    response = httpx.get(base_url + "/customers", auth=(api_login, api_key))
    if response.status_code == 200:
        data = response.json()
        return {"data": data}
    else:
        return {"error": response.status_code, "message": response.json()}
   

 
@app.get("/customer/{customer_id}")
async def get_customer_by_id(customer_id: int):
    response = httpx.get(base_url + "/customer/" + customer_id, auth=(api_login, api_key))
    if response.status_code == 200:
        data = response.json()
        return {"last_name": data["last_name"], "first_name": data["first_name"], "email": data["email"]}
    else:
        return {"error": response.status_code, "message": response.json()}



@app.get("/customer")
async def get_customer(last_name: str = None, email: str = None):
    response = httpx.get(base_url + "/customers", auth=(api_login, api_key))
    
    if response.status_code == 200: 
        data = response.json()
        if last_name and email:
            return [customer for customer in data if last_name.lower() 
                    in customer["last_name"].lower() or last_name.lower() 
                    in customer["first_name"].lower() and email.lower() 
                    in customer["email"].lower()]
        elif last_name:
            return [customer for customer in data if last_name.lower() 
                    in customer["last_name"].lower() or last_name.lower() 
                    in customer["first_name"].lower()]
        elif email:
            return [customer for customer in data if email.lower() 
                    in customer["email"].lower()]
        else:
            return {"error": "Please provide a last name or email"}
    else:
        return {"error": response.status_code, "message": response.json()}
        