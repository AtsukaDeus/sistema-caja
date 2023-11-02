from pydantic import BaseModel


class Product(BaseModel):
    code: int
    name: str
    price: float
    quantity: int
    
    
