
import sys
import os
from typing import Optional
from datetime import datetime

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import engine
from app.models.base import Base
from app.models import Company, Founder, Financial, CourtCase, Contract, User
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy import text
import pandas as pd

def create_tables() -> None:
    print("Создание таблиц...")
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        
        Base.metadata.drop_all(bind=engine)
        print("Старые таблицы удалены")
        
        Base.metadata.create_all(bind=engine)
        print("Таблицы созданы успешно!")
        from sqlalchemy import inspect
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        print(f"Созданные таблицы: {tables}")
        
    except Exception as e:
        print(f"Ошибка при создании таблиц: {e}")
        raise

def load_test_data() -> None:
    print("Загрузка тестовых данных отключена - используем только API-ФНС")
    print("Система будет работать с реальными данными из API-ФНС")
    return

def main() -> None:
    print("Инициализация базы данных...")
    create_tables()
    load_test_data()
    print("Инициализация завершена!")

if __name__ == "__main__":
    main()