from pydantic import BaseModel
from datetime import datetime
from typing import Union


class Ticket(BaseModel):
    subTotal: float
    iva: None
    total: None
    payMethod: str
    date: None