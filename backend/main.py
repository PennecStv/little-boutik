from fastapi import FastAPI, HTTPException
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os, httpx, requests

load_dotenv()
base_url = os.getenv("BASE_URL")
api_login = os.getenv("API_LOGIN")
api_key = os.getenv("API_KEY")

DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Customer(Base):
    __tablename__ = "customers"
    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, index=True)
    last_name = Column(String, index=True)

class CustomerCreate(BaseModel):
    first_name: str
    last_name: str

app = FastAPI()

# Allow all origins (for development purposes)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

'''
API ENDPOINTS
'''

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Drop all tables and recreate them
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    
    # Make a request to an external API to get initial data
    response = requests.get(base_url + "/customers", auth=(api_login, api_key))
    if response.status_code == 200:
        customers_data = response.json()
        db = SessionLocal()
        for customer_data in customers_data:
            db_customer = Customer(
                first_name=customer_data["first_name"],
                last_name=customer_data["last_name"]
            )
            db.add(db_customer)
        db.commit()
        db.close()
    else:
        raise HTTPException(status_code=500, detail="Failed to fetch initial data")
    
    yield

@app.post("/customers/", response_model=CustomerCreate)
def create_customer(customer: CustomerCreate):
    db = SessionLocal()
    db_customer = Customer(first_name=customer.first_name, last_name=customer.last_name)
    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)
    db.close()
    return db_customer

@app.get("/customers")
async def get_customers():
    # Make a request to the Hiboutik API with Basic Auth
    response = httpx.get(base_url + "/customers", auth=(api_login, api_key))
    if response.status_code == 200:
        customers = response.json()
        return customers
    else:
        return {"error": response.status_code, "message": response.json()}
   

 
@app.get("/customer/{customer_id}")
async def get_customer_by_id(customer_id: int):
    response = httpx.get(base_url + "/customer/" + customer_id, auth=(api_login, api_key))
    if response.status_code == 200:
        customer = response.json()
        return [{"last_name": customer["last_name"], "first_name": customer["first_name"], "email": customer["email"]}]
    else:
        return {"error": response.status_code, "message": response.json()}



@app.get("/customer")
async def get_customer(last_name: str = None, email: str = None):
    response = httpx.get(base_url + "/customers", auth=(api_login, api_key))
    
    if response.status_code == 200: 
        customers = response.json()
        if last_name and email:
            return [customer for customer in customers if last_name.lower() 
                    in customer["last_name"].lower() or last_name.lower() 
                    in customer["first_name"].lower() and email.lower() 
                    in customer["email"].lower()]
        elif last_name:
            return [customer for customer in customers if last_name.lower() 
                    in customer["last_name"].lower() or last_name.lower() 
                    in customer["first_name"].lower()]
        elif email:
            return [customer for customer in customers if email.lower() 
                    in customer["email"].lower()]
        else:
            return {"error": "Please provide a last name or email"}
    else:
        return {"error": response.status_code, "message": response.json()}
        
        
@app.get("/customer/{customer_id}/sales")
async def get_customer_sales(customer_id: int, skip: int = 0, limit: int = 5):
    response = httpx.get(base_url + "/customer/" + str(customer_id) + "/sales", auth=(api_login, api_key))
    pagination = 5 * skip	
    
    if response.status_code == 200:
        customer_sales = response.json()
        return customer_sales[pagination : pagination + limit]
    else:
        return {"error": response.status_code, "message": response.json()}
    
app = FastAPI(lifespan=lifespan)