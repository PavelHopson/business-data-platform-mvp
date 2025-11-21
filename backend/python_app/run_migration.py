"""
Скрипт для запуска миграции базы данных
"""

import os
import sys
from sqlalchemy import create_engine, text
from app.config import settings

def run_migration():
    """Запускает миграцию для добавления JSON полей"""
    
    print("🔄 Запуск миграции базы данных...")
    
    # Создаем подключение к базе данных
    engine = create_engine(settings.DATABASE_URL)
    
    try:
        with engine.connect() as connection:
            # Читаем файл миграции
            migration_file = "migrations/002_add_json_fields_to_companies.sql"
            
            if not os.path.exists(migration_file):
                print(f"❌ Файл миграции не найден: {migration_file}")
                return False
            
            with open(migration_file, 'r', encoding='utf-8') as f:
                migration_sql = f.read()
            
            print(f"📄 Выполняем миграцию из файла: {migration_file}")
            
            # Выполняем миграцию
            connection.execute(text(migration_sql))
            connection.commit()
            
            print("✅ Миграция выполнена успешно!")
            print("📋 Добавлены поля:")
            print("  - raw_fns_data (TEXT)")
            print("  - raw_scraper_data (TEXT)")
            print("  - last_fns_update (TIMESTAMP)")
            print("  - last_scraper_update (TIMESTAMP)")
            print("  - created_at (TIMESTAMP)")
            print("  - updated_at (TIMESTAMP)")
            print("  - Индексы для оптимизации")
            
            return True
            
    except Exception as e:
        print(f"❌ Ошибка при выполнении миграции: {e}")
        return False

if __name__ == "__main__":
    success = run_migration()
    if success:
        print("\n🎉 Миграция завершена успешно!")
        print("Теперь можно использовать ETL сервис с поддержкой JSON данных.")
    else:
        print("\n💥 Миграция завершилась с ошибкой!")
        sys.exit(1)




