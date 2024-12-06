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
database_url = os.getenv("DATABASE_URL")

engine = create_engine(database_url)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Customer(Base):
    __tablename__ = "customers"
    customers_id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, index=True)
    last_name = Column(String, index=True)
    
class Sale(Base):
    __tablename__ = "sales"
    sale_id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, index=True)
    created_at = Column(String, index=True)
    completed_at = Column(String, index=True)
    currency = Column(String, index=True)
    total = Column(Integer, index=True)

class CustomerCreate(BaseModel):
    first_name: str
    last_name: str

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Drop all tables and recreate them
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    
    # Make a request to an external API to get customers data
    response = requests.get(base_url + "/customers", auth=(api_login, api_key))
    if response.status_code == 200:
        customers_data = response.json()
        db = SessionLocal()
        for customer_data in customers_data:
            db_customer = Customer(
                customers_id=customer_data["customers_id"],
                first_name=customer_data["first_name"],
                last_name=customer_data["last_name"]
            )
            db.add(db_customer)
        db.commit()
        db.close()
    else:
        raise HTTPException(status_code=500, detail="Failed to fetch initial data")
    
    # Make a request to an external API to get sales data from each customer
    db = SessionLocal()
    customers = db.query(Customer).all()
    db.close()
    for customer in customers:
        response = requests.get(base_url + "/customer/" + str(customer.customers_id) + "/sales", auth=(api_login, api_key))
        if response.status_code == 200:
            sales_data = response.json()
            db = SessionLocal()
            for sale_data in sales_data:
                db_sale = Sale(
                    customer_id=sale_data["customer_id"],
                    created_at=sale_data["created_at"],
                    completed_at=sale_data["completed_at"],
                    currency=sale_data["currency"],
                    total=sale_data["total"]
                )
                db.add(db_sale)
            db.commit()
            db.close()
        else:
            raise HTTPException(status_code=500, detail="Failed to fetch initial data")
    
    yield
    
app = FastAPI(lifespan=lifespan)

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

@app.get("/customers", include_in_schema=False)
def get_customers():
    db = SessionLocal()
    customers = db.query(Customer).all()
    db.close()
    return customers

 
@app.get("/customer/{customer_id}")
async def get_customer_by_id(customer_id: int):
    db = SessionLocal()
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    db.close()
    return customer
        
        
@app.get("/customer/{customer_id}/sales")
async def get_customer_sales(customer_id: int, skip: int = 0, limit: int = 20): 
    # Default values ofr limit was 5 as requested in challenge 5 
    # But now the slicing is managed by the frontend with a Table component
    db = SessionLocal()
    sales = db.query(Sale).filter(Sale.customer_id == customer_id).offset(skip).limit(limit).all()
    db.close()
    return sales

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)