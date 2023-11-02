import psycopg2
from connection.connection_psycopg2 import get_connection
from services.helpers import to_json, get_iva, to_json_all
from datetime import datetime


def save_ticket(ticket):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        
        ticket.date = datetime.now()
        ticket.iva = int(get_iva(ticket.subTotal))
        ticket.total = int(ticket.subTotal + ticket.iva)
        cursor.execute("INSERT INTO tickets (subtotal, iva, total, paymethod, date) VALUES (%s, %s, %s, %s, %s)", 
                        (ticket.subTotal, ticket.iva, ticket.total, ticket.payMethod, ticket.date))
        conn.commit()
        
        return "Se ha creado el ticket correctamente!"


    except psycopg2.Error as e:

        print(f"Error en la base de datos: {e}")
        conn.rollback()
    
    finally:
        cursor.close()
        conn.close()
        
        

def get_all_tickets(limit, offset):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        
        cursor.execute("SELECT * FROM tickets ORDER BY date DESC LIMIT (%s) OFFSET (%s)", (limit, offset,))
        return to_json_all(cursor)
        
        
    except psycopg2.Error as e:
        
        print(f"Error en la base de datos: {e}")
        conn.rollback()
    
    finally:
        cursor.close()
        conn.close()   
        
        

def count_tickets():
    try:
        conn = get_connection()
        cursor = conn.cursor()
        
        cursor.execute("SELECT COUNT(*) FROM tickets")
        return cursor.fetchone()
        
        
    except psycopg2.Error as e:
        
        print(f"Error en la base de datos: {e}")
        conn.rollback()
    
    finally:
        cursor.close()
        conn.close()  