import psycopg2
from connection.connection_psycopg2 import get_connection
from services.helpers import to_json, to_json_all, product_founded


def save_product(data):
    try:
        product_saved = False
        conn = get_connection()
        cursor = conn.cursor()
        
        if not product_founded(conn, data.code):
            cursor.execute("INSERT INTO products (code, name, price, quantity) VALUES (%s, %s, %s, %s)", 
                            (data.code, data.name, data.price, data.quantity))
            conn.commit()
            return 'Se ha guardado el producto correctamente'


    except psycopg2.Error as e:

        print(f"Error en la base de datos: {e}")
        conn.rollback()
    
    finally:
        cursor.close()
        conn.close()
        


def delete_product(codeProduct):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        
        if  product_founded(conn, codeProduct):
            cursor.execute("DELETE FROM products WHERE code = (%s)", (codeProduct,))
            conn.commit()
            return 'Se ha eliminado el producto!'
        
        

    except psycopg2.Error as e:

        print(f"Error en la base de datos: {e}")
        conn.rollback()
    
    finally:
        cursor.close()
        conn.close()



def update_price_product(codeProduct, newprice):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        
        if product_founded(conn, codeProduct):
            cursor.execute("UPDATE products SET price = (%s) WHERE code = (%s)", (newprice, codeProduct,))
            conn.commit()
            return 'Se ha cambiado el precio del producto!'
            
    
    except psycopg2.Error as e:
        
        print(f"Error en la base de datos: {e}")
        conn.rollback()
    
    finally:
        cursor.close()
        conn.close()



def get_product(codeProduct):
    try:
        conn = get_connection()
        cursor = conn.cursor()
    
        if product_founded(conn, codeProduct):
            cursor.execute("SELECT * FROM products WHERE code = (%s)", (codeProduct,))
            return to_json(cursor)
            
    
    except psycopg2.Error as e:
        
        print(f"Error en la base de datos: {e}")
        conn.rollback()
    
    finally:
        cursor.close()
        conn.close()
        
        

def get_all_products():
    try:
        conn = get_connection()
        cursor = conn.cursor()
        
        cursor.execute("SELECT * FROM products ORDER BY code ASC")
        return to_json_all(cursor)
        

    except psycopg2.Error as e:
        print(f"Error en la base de datos: {e}")
        conn.rollback()
        
    finally:
        cursor.close()
        conn.close()
        


def increment_quantity_product(codeProduct, increment):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        
        if product_founded(conn, codeProduct):            
            cursor.execute("UPDATE products SET quantity = quantity + (%s) WHERE code = (%s)", (increment, codeProduct))
            conn.commit()
            
            return f'Se ha incrementado en {increment} la cantidad del producto!'

        
    except psycopg2.Error as e:
        print(f"Error en la base de datos: {e}")
        conn.rollback()
        
    finally:
        cursor.close()
        conn.close()
        
        

def decrement_quantity_product(codeProduct, decrement):
    try:
        conn = get_connection()
        cursor = conn.cursor()        
        
        if product_founded(conn, codeProduct):
            conn = get_connection()
            cursor = conn.cursor()
            
            cursor.execute("UPDATE products SET quantity = quantity - (%s) WHERE code = (%s)", (decrement, codeProduct))
            conn.commit()
            
            return f'Se ha disminuido en {decrement} la cantidad del producto!'

        
    except psycopg2.Error as e:
        print(f"Error en la base de datos: {e}")
        conn.rollback()
        
    finally:
        cursor.close()
        conn.close()