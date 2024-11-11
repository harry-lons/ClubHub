from fastapi import FastAPI
import psycopg2

# Replace with your actual PostgreSQL credentials
hostname = '71.142.247.245'  # e.g., 'localhost' or an IP address
username = 'postgres'  # e.g., 'postgres'
password = 'h39aF!wdLL0'  # e.g., 'your_password'
database = 'SoCalSocial'  # e.g., 'SoCalSocial'

app = FastAPI()

# Create a connection to the PostgreSQL database
try:
    connection = psycopg2.connect(
        host=hostname,
        user=username,
        password=password,
        dbname=database
    )
    print("Connected to the database.")

    # Create a cursor object to interact with the database
    cursor = connection.cursor()

    # Execute a command to list all tables
    cursor.execute("SELECT table_name FROM information_schema.tables WHERE table_schema='public';")
    
    # Fetch and display the results
    tables = cursor.fetchall()
    print("Tables in the database:")
    for table in tables:
        print(table[0])  # table[0] contains the table name

except Exception as e:
    print("Error connecting to the database:", e)

finally:
    # Close the cursor and connection
    if cursor:
        cursor.close()
    if connection:
        connection.close()
        print("Connection closed.")