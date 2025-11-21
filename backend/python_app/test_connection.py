
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import create_engine, text
import time

def test_connection():
    print("🔍 Тестирование подключения к PostgreSQL...")
    
    SQLALCHEMY_DATABASE_URL = "postgresql://devuser:devpass@localhost:5432/myapp_dev"
    
    print(f"📡 URL подключения: {SQLALCHEMY_DATABASE_URL}")
    
    try:
        engine = create_engine(SQLALCHEMY_DATABASE_URL)
        
        print("⏳ Попытка подключения...")
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1 as test"))
            row = result.fetchone()
            print(f"✅ Подключение успешно! Результат: {row[0]}")
            
            result = conn.execute(text("SELECT current_database()"))
            db_name = result.fetchone()[0]
            print(f"📊 Текущая база данных: {db_name}")
            
            result = conn.execute(text("SELECT version()"))
            version = result.fetchone()[0]
            print(f"🐘 Версия PostgreSQL: {version}")
            
            return True
            
    except Exception as e:
        print(f"❌ Ошибка подключения: {e}")
        print("\n💡 Возможные решения:")
        print("1. Убедитесь, что PostgreSQL контейнер запущен:")
        print("   docker ps | grep postgres")
        print("2. Перезапустите контейнер:")
        print("   restart_postgres.bat")
        print("3. Проверьте логи контейнера:")
        print("   docker logs postgres-local")
        return False

if __name__ == "__main__":
    test_connection()
