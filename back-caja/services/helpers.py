

def product_founded(conn, code):
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT COUNT(*) FROM products WHERE code = %s", (code,))
        count = cursor.fetchone()[0]
        return count > 0
    
    finally:
        cursor.close()



# convert a query to a dictionary and return a json object
# only when we have a get method for one object
def to_json(cursor):
    try:        
        obj = cursor.fetchone()
        column_names = []
        
        # gets the column name for each tuple in the list of tuples
        for desc in cursor.description:
            column_names.append(desc[0])
            
        obj = dict(zip(column_names, obj))
        obj.pop('id')
        return obj 
    
    finally:
        cursor.close()
        
        

def to_json_all(cursor):
    try:
        objs = cursor.fetchall()
        column_names = [desc[0] for desc in cursor.description]

        result = []

        # Iterate through each row and create a dictionary for each row
        for row in objs:
            row_dict = {}
            for i in range(1, len(column_names)):
                row_dict[column_names[i]] = row[i]
            result.append(row_dict)

        return result

    finally:
        cursor.close()

        

def get_iva(neto):
    return neto * 0.19

