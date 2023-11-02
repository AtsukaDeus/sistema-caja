from typing import Union
from fastapi import FastAPI, HTTPException
from services.product_service import save_product, delete_product, update_price_product, get_product, get_all_products, increment_quantity_product, decrement_quantity_product
from services.ticket_service import save_ticket, get_all_tickets, count_tickets
from models.Product import Product
from models.Ticket import Ticket
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

# configuration to receive requests from localhost:3000
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

    

######## APIs for Product ########

@app.post('/create_product')
def create_product_route(data: Product):
    result = save_product(data)
    if result is not None:
        return {"message": result}
    else:
        raise HTTPException(status_code=409)
        


@app.delete('/delete_product/{codeProduct}')
def delete_product_route(codeProduct: int):
    result = delete_product(codeProduct)
    if result is not None:
        return {"message": result}
    else:
        raise HTTPException(status_code=404)



@app.put('/update_price/{codeProduct}')
def update_price_route(codeProduct: int, newPrice: float):
    result = update_price_product(codeProduct, newPrice)
    if result is not None:
        return {"message": result}
    else:
        raise HTTPException(status_code=404)



@app.get('/get_product/{codeProduct}')
def get_product_route(codeProduct: int):
    product = get_product(codeProduct)
    if product is not None:
        return product
    else:
        raise HTTPException(status_code=404)



@app.get('/get_products')
def get_products_route():
    return get_all_products()



@app.put('/increment_product/{codeProduct}')
def increment_product_route(codeProduct: int, increment: int):
    result = increment_quantity_product(codeProduct, increment)
    if result is not None:
        return {"message": result}
    else:
        raise HTTPException(status_code=404)



@app.put('/decrement_product/{codeProduct}')
def decrement_product_route(codeProduct: int, decrement: int):
    result = decrement_quantity_product(codeProduct, decrement)
    if result is not None:
        return {"message": result}
    else:
        raise HTTPException(status_code=404)


########### APIS TICKET ###########


@app.post('/create_ticket')
def create_ticket_route(ticket: Ticket):
    result = save_ticket(ticket)
    if result is not None:
        return {"message": result}
    else:
        raise HTTPException(status_code=409)



@app.get('/get_tickets')
def get_tickets_route(limit: int, offset: int):
    return get_all_tickets(limit, offset)



@app.get('/total_tickets')
def count_tickets_route():
    return count_tickets()
