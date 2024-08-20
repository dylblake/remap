import csv

# Define the path to the CSV file and output SQL file
csv_file = '../resources/services.csv'
sql_file = '../backup/insert_services.sql'

def generate_insert_statements(csv_file, sql_file):
    with open(csv_file, mode='r', newline='', encoding='utf-8') as file:
        reader = csv.reader(file)
        
        # Skip header if present
        next(reader, None)
        
        # Open the SQL file to write the statements
        with open(sql_file, mode='w', encoding='utf-8') as sql:
            sql.write("INSERT INTO services (name, type, upper_service_id, middle_service_id, created_at, updated_at)\nVALUES\n")
            
            # Generate the SQL insert statements
            values = []
            for row in reader:
                name = row[0].strip()
                type = row[1].strip()
                values.append(f"  ('{name}', '{type}', NULL, NULL, NOW(), NOW())")
            
            # Join all values with commas and write to file
            sql.write(",\n".join(values) + ";\n")

if __name__ == "__main__":
    generate_insert_statements(csv_file, sql_file)
    print(f"SQL insert statements have been written to {sql_file}")
