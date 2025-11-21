from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import PlainTextResponse
from app.api.v1.endpoints import router as v1_router
from app.api.v1.auth import router as auth_router
from app.api.internal.telegram_webhook import router as telegram_webhook_router
from app.database import engine
from app.models.base import Base
from app.core.logging import get_logger
from app.core.middleware import LoggingMiddleware, ErrorHandlingMiddleware
from app.core.exceptions import (
    general_exception_handler,
    business_logic_error_handler,
    NotFoundError,
)
from app.config import settings
import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

logger = get_logger(__name__)

app = FastAPI(
    title="Company Analysis API",
    description="API для анализа компаний и поиска по ИНН",
    version="1.0.0",
    debug=settings.DEBUG,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(LoggingMiddleware)
app.add_middleware(ErrorHandlingMiddleware)

app.add_exception_handler(NotFoundError, business_logic_error_handler)
app.add_exception_handler(Exception, general_exception_handler)

app.include_router(v1_router, prefix="/v1")
app.include_router(auth_router, prefix="/v1/auth")
app.include_router(telegram_webhook_router)

@app.on_event("startup")
async def startup_event():
    import time
    import os
    import glob
    from app.core.logging import get_logger
    from sqlalchemy import text
    
    startup_logger = get_logger(__name__)
    
    max_retries = 30
    retry_count = 0
    
    while retry_count < max_retries:
        try:
            with engine.connect() as conn:
                conn.execute(text("SELECT 1"))
                startup_logger.info("Подключение к базе данных успешно")
            
            # Создаем таблицы из моделей
            Base.metadata.create_all(bind=engine)
            startup_logger.info("Таблицы созданы успешно")
            
            # Применяем миграции
            migrations_dir = os.path.join(
                os.path.dirname(os.path.dirname(__file__)), 
                "migrations"
            )
            if os.path.exists(migrations_dir):
                migration_files = sorted(
                    glob.glob(os.path.join(migrations_dir, "*.sql"))
                )
                for migration_file in migration_files:
                    try:
                        with open(migration_file, "r", encoding="utf-8") as f:
                            sql_content = f.read()
                        
                        try:
                            with engine.connect() as conn:
                                # Выполняем всю миграцию целиком
                                conn.execute(text(sql_content))
                                conn.commit()
                        except Exception as stmt_error:
                            # Игнорируем ошибки если объект уже существует
                            error_msg = str(stmt_error).lower()
                            if "already exists" not in error_msg:
                                startup_logger.warning(
                                    f"Ошибка в миграции "
                                    f"{os.path.basename(migration_file)}: "
                                    f"{stmt_error}"
                                )
                        
                        startup_logger.info(
                            f"Миграция {os.path.basename(migration_file)} применена"
                        )
                    except Exception as mig_error:
                        startup_logger.warning(
                            f"Не удалось применить миграцию "
                            f"{os.path.basename(migration_file)}: {mig_error}"
                        )
            
            # Загружаем тестовые данные
            try:
                from init_db import load_test_data
                load_test_data()
                startup_logger.info("Тестовые данные успешно загружены")
            except Exception as data_error:
                startup_logger.warning(
                    f"Не удалось загрузить тестовые данные: {data_error}"
                )
            
            startup_logger.info("Инициализация БД завершена успешно")
            return
            
        except Exception as e:
            retry_count += 1
            startup_logger.warning(f"Попытка {retry_count}/{max_retries}: {e}")
            if retry_count < max_retries:
                time.sleep(2)
            else:
                startup_logger.error(
                    f"Не удалось инициализировать данные после "
                    f"{max_retries} попыток: {e}"
                )


@app.get("/")
async def root() -> dict[str, str]:
    return {"message": "Company Analysis API", "version": "1.0.0"}


@app.get("/health")
async def health_check() -> dict[str, str]:
    return {"status": "healthy", "version": "1.0.0"}


@app.get("/metrics")
async def metrics() -> PlainTextResponse:
    from app.core.middleware import request_counters
    
    # Базовые метрики для Prometheus
    metrics_data = f"""# HELP http_requests_total Total number of HTTP requests
# TYPE http_requests_total counter
http_requests_total{{method="GET",status="200"}} {request_counters.get("GET_200", 0)}
http_requests_total{{method="POST",status="200"}} {request_counters.get("POST_200", 0)}
http_requests_total{{method="GET",status="404"}} {request_counters.get("GET_404", 0)}
http_requests_total{{method="POST",status="500"}} {request_counters.get("POST_500", 0)}

# HELP http_request_duration_seconds HTTP request duration in seconds
# TYPE http_request_duration_seconds histogram
http_request_duration_seconds_bucket{{le="0.1"}} 0
http_request_duration_seconds_bucket{{le="0.5"}} 0
http_request_duration_seconds_bucket{{le="1.0"}} 0
http_request_duration_seconds_bucket{{le="2.0"}} 0
http_request_duration_seconds_bucket{{le="5.0"}} 0
http_request_duration_seconds_bucket{{le="+Inf"}} 0
http_request_duration_seconds_sum 0
http_request_duration_seconds_count 0

# HELP up Service availability
# TYPE up gauge
up{{job="backend-api"}} 1
"""
    return PlainTextResponse(metrics_data)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
