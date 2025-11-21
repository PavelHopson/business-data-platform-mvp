
import logging
import logging.handlers
import sys
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, Optional
from pythonjsonlogger import jsonlogger


class CustomJSONFormatter(jsonlogger.JsonFormatter):
    
    
    def add_fields(self, log_record: Dict[str, Any], record: logging.LogRecord, message_dict: Dict[str, Any]) -> None:
        super().add_fields(log_record, record, message_dict)
        
        log_record['timestamp'] = datetime.utcnow().isoformat() + 'Z'
        
        log_record['level'] = record.levelname
        
        log_record['module'] = record.module
        log_record['function'] = record.funcName
        log_record['line'] = record.lineno
        
        log_record['service'] = 'company-api'


class LoggerSetup:
    
    
    def __init__(self, log_level: str = "INFO", log_dir: str = "logs"):
        self.log_level = getattr(logging, log_level.upper())
        self.log_dir = Path(log_dir)
        self.log_dir.mkdir(exist_ok=True)
        
    def setup_logger(self, name: str = "company_api") -> logging.Logger:
        
        logger = logging.getLogger(name)
        
        logger.handlers.clear()
        
        logger.setLevel(self.log_level)
        
        console_handler = logging.StreamHandler(sys.stdout)
        console_formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            datefmt='%Y-%m-%d %H:%M:%S'
        )
        console_handler.setFormatter(console_formatter)
        console_handler.setLevel(self.log_level)
        
        file_handler = logging.handlers.RotatingFileHandler(
            self.log_dir / "app.log",
            maxBytes=10 * 1024 * 1024,
            backupCount=5
        )
        json_formatter = CustomJSONFormatter(
            '%(timestamp)s %(level)s %(name)s %(module)s %(function)s '
            '%(line)d %(message)s'
        )
        file_handler.setFormatter(json_formatter)
        file_handler.setLevel(logging.INFO)
        
        error_handler = logging.handlers.RotatingFileHandler(
            self.log_dir / "errors.log",
            maxBytes=10 * 1024 * 1024,
            backupCount=10
        )
        error_handler.setFormatter(json_formatter)
        error_handler.setLevel(logging.ERROR)
        
        access_handler = logging.handlers.RotatingFileHandler(
            self.log_dir / "access.log",
            maxBytes=10 * 1024 * 1024,
            backupCount=5
        )
        access_handler.setFormatter(json_formatter)
        access_handler.setLevel(logging.INFO)
        
        logger.addHandler(console_handler)
        logger.addHandler(file_handler)
        logger.addHandler(error_handler)
        
        access_logger = logging.getLogger(f"{name}.access")
        access_logger.addHandler(access_handler)
        access_logger.setLevel(logging.INFO)
        access_logger.propagate = False
        
        return logger


def get_logger(name: str = "company_api") -> logging.Logger:
    
    return logging.getLogger(name)


def get_access_logger() -> logging.Logger:
    
    return logging.getLogger("company_api.access")


def log_request(method: str, url: str, status_code: int, duration: float, 
                user_id: Optional[int] = None, ip: Optional[str] = None) -> None:
    
    access_logger = get_access_logger()
    access_logger.info(
        "HTTP Request",
        extra={
            "method": method,
            "url": url,
            "status_code": status_code,
            "duration_ms": round(duration * 1000, 2),
            "user_id": user_id,
            "ip": ip,
            "event_type": "http_request"
        }
    )


def log_error(error: Exception, context: Optional[Dict[str, Any]] = None, 
              user_id: Optional[int] = None) -> None:
    
    logger = get_logger()
    
    error_context = {
        "error_type": type(error).__name__,
        "error_message": str(error),
        "user_id": user_id,
        "event_type": "error"
    }
    
    if context:
        error_context.update(context)
    
    logger.error(
        f"Error occurred: {error}",
        extra=error_context,
        exc_info=True
    )


def log_business_event(event_type: str, data: Dict[str, Any], 
                      user_id: Optional[int] = None) -> None:
    
    logger = get_logger()
    
    event_data = {
        "event_type": event_type,
        "user_id": user_id,
        **data
    }
    
    logger.info(
        f"Business event: {event_type}",
        extra=event_data
    )


logger_setup = LoggerSetup()
main_logger = logger_setup.setup_logger()
