
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import engine
from sqlalchemy import text

def check_companies():
    try:
        with engine.connect() as conn:
            result = conn.execute(text('SELECT COUNT(*) FROM companies'))
            count = result.scalar()
            print(f"Companies count: {count}")
            
            if count > 0:
                result = conn.execute(text('SELECT inn, name FROM companies LIMIT 5'))
                companies = result.fetchall()
                print("First 5 companies:")
                for company in companies:
                    print(f"  INN: {company[0]}, Name: {company[1]}")
            else:
                print("No companies found in database")
                
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_companies()
