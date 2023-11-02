import psycopg2

def get_connection():
    
    return psycopg2.connect(
        dbname="db_caja",
        user="postgres",
        password="2543424356786754354256",
        host="localhost",
        port="5432"
    )