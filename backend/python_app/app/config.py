from pydantic_settings import BaseSettings



class Settings(BaseSettings):
    DATABASE_URL: str = (
        "postgresql://postgres:killer2005@localhost:5432/"
        "etl_database"
    )
    REDIS_URL: str = "redis://redis:6379/0"
    SECRET_KEY: str = "dev-secret-key-change-in-production"
    JWT_SECRET: str = "jwt-secret-key-change-in-production"
    JWT_EXPIRE: str = "24h"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    LOG_LEVEL: str = "INFO"
    LOG_DIR: str = "logs"
    LOG_FORMAT: str = "json"
    LOG_ROTATION_SIZE: str = "10MB"
    LOG_RETENTION_DAYS: int = 30

    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    SHOW_ERROR_DETAILS: bool = True

    FNS_API_KEY: str = ""
    FNS_API_BASE_URL: str = "https://api-fns.ru/api"

    TELEGRAM_BOT_TOKEN: str = ""
    TELEGRAM_CHAT_ID: str = ""
    TELEGRAM_ALERTS_ENABLED: str = "false"

    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()