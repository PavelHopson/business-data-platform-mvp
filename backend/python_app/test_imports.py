
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def test_imports():
    
    print("🔍 Тестируем импорты...")
    
    try:
        print("1. Тестируем FastAPI...")
        from fastapi import FastAPI
        print("✅ FastAPI импортирован")
        
        print("2. Тестируем SQLAlchemy...")
        from sqlalchemy import create_engine
        print("✅ SQLAlchemy импортирован")
        
        print("3. Тестируем Pydantic...")
        from pydantic import BaseModel
        print("✅ Pydantic импортирован")
        
        print("4. Тестируем httpx...")
        import httpx
        print("✅ httpx импортирован")
        
        print("5. Тестируем настройки...")
        from app.config import settings
        print(f"✅ Настройки загружены: {settings.FNS_API_KEY[:10]}...")
        
        print("6. Тестируем FNS API Service...")
        from app.services.fns_api import FNSAPIService
        fns_service = FNSAPIService()
        print(f"✅ FNS API Service создан: {fns_service.api_key[:10]}...")
        
        print("7. Тестируем модели...")
        from app.models.base import Base
        print("✅ Модели импортированы")
        
        print("8. Тестируем схемы...")
        from app.schemas.company import CompanyBase
        print("✅ Схемы импортированы")
        
        print("\n🎉 Все импорты работают корректно!")
        return True
        
    except Exception as e:
        print(f"❌ Ошибка при импорте: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = test_imports()
    sys.exit(0 if success else 1)
