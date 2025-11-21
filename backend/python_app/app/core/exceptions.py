
from typing import Any, Dict, Optional
from fastapi import HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
import traceback

from app.core.logging import log_error, get_logger

logger = get_logger(__name__)


class BusinessLogicError(Exception):
    
    
    def __init__(self, message: str, error_code: str = "BUSINESS_ERROR", 
                 status_code: int = 400, details: Optional[Dict[str, Any]] = None):
        self.message = message
        self.error_code = error_code
        self.status_code = status_code
        self.details = details or {}
        super().__init__(self.message)


class DatabaseError(BusinessLogicError):
    
    
    def __init__(self, message: str = "Ошибка базы данных", 
                 details: Optional[Dict[str, Any]] = None):
        super().__init__(
            message=message,
            error_code="DATABASE_ERROR",
            status_code=500,
            details=details
        )


class ValidationError(BusinessLogicError):
    
    
    def __init__(self, message: str = "Ошибка валидации данных", 
                 details: Optional[Dict[str, Any]] = None):
        super().__init__(
            message=message,
            error_code="VALIDATION_ERROR",
            status_code=422,
            details=details
        )


class AuthenticationError(BusinessLogicError):
    
    
    def __init__(self, message: str = "Ошибка аутентификации"):
        super().__init__(
            message=message,
            error_code="AUTHENTICATION_ERROR",
            status_code=401
        )


class AuthorizationError(BusinessLogicError):
    
    
    def __init__(self, message: str = "Недостаточно прав доступа"):
        super().__init__(
            message=message,
            error_code="AUTHORIZATION_ERROR",
            status_code=403
        )


class NotFoundError(BusinessLogicError):
    
    
    def __init__(self, message: str = "Ресурс не найден", 
                 resource_type: Optional[str] = None):
        details = {"resource_type": resource_type} if resource_type else {}
        super().__init__(
            message=message,
            error_code="NOT_FOUND_ERROR",
            status_code=404,
            details=details
        )


class ExternalServiceError(BusinessLogicError):
    
    
    def __init__(self, message: str = "Ошибка внешнего сервиса", 
                 service_name: Optional[str] = None):
        details = {"service_name": service_name} if service_name else {}
        super().__init__(
            message=message,
            error_code="EXTERNAL_SERVICE_ERROR",
            status_code=502,
            details=details
        )


def create_error_response(
    message: str,
    error_code: str = "INTERNAL_ERROR",
    status_code: int = 500,
    details: Optional[Dict[str, Any]] = None,
    request_id: Optional[str] = None
) -> JSONResponse:
    
    error_dict: Dict[str, Any] = {
        "code": error_code,
        "message": message,
        "timestamp": None,
    }
    
    if details:
        error_dict["details"] = details
        
    if request_id:
        error_dict["request_id"] = request_id
    
    error_response = {
        "success": False,
        "error": error_dict
    }
    
    return JSONResponse(
        status_code=status_code,
        content=error_response
    )


async def business_logic_error_handler(
    request: Request, exc: Exception
) -> JSONResponse:
    
    
    if not isinstance(exc, BusinessLogicError):
        return await general_exception_handler(request, exc)
    
    error_context = {
        "url": str(request.url),
        "method": request.method,
        "error_code": exc.error_code,
        "details": exc.details
    }
    log_error(exc, context=error_context)
    
    return create_error_response(
        message=exc.message,
        error_code=exc.error_code,
        status_code=exc.status_code,
        details=exc.details,
        request_id=getattr(request.state, 'request_id', None)
    )


async def http_exception_handler(request: Request, exc: HTTPException) -> JSONResponse:
    
    
    error_codes = {
        400: "BAD_REQUEST",
        401: "UNAUTHORIZED",
        403: "FORBIDDEN",
        404: "NOT_FOUND",
        405: "METHOD_NOT_ALLOWED",
        422: "VALIDATION_ERROR",
        429: "TOO_MANY_REQUESTS",
        500: "INTERNAL_SERVER_ERROR",
        502: "BAD_GATEWAY",
        503: "SERVICE_UNAVAILABLE"
    }
    
    error_code = error_codes.get(exc.status_code, "HTTP_ERROR")
    
    if exc.status_code >= 500:
        error_context = {
            "url": str(request.url),
            "method": request.method,
            "status_code": exc.status_code
        }
        log_error(exc, context=error_context)
    
    return create_error_response(
        message=exc.detail,
        error_code=error_code,
        status_code=exc.status_code,
        request_id=getattr(request.state, 'request_id', None)
    )


async def validation_exception_handler(
    request: Request, exc: RequestValidationError
) -> JSONResponse:
    
    
    validation_errors = []
    for error in exc.errors():
        validation_errors.append({
            "field": ".".join(str(x) for x in error["loc"]),
            "message": error["msg"],
            "type": error["type"]
        })
    
    log_error(
        exc,
        context={
            "url": str(request.url),
            "method": request.method,
            "validation_errors": validation_errors
        }
    )
    
    return create_error_response(
        message="Ошибка валидации входных данных",
        error_code="VALIDATION_ERROR",
        status_code=422,
        details={"validation_errors": validation_errors},
        request_id=getattr(request.state, 'request_id', None)
    )


async def sqlalchemy_exception_handler(
    request: Request, exc: SQLAlchemyError
) -> JSONResponse:
    
    
    if isinstance(exc, IntegrityError):
        error_code = "INTEGRITY_ERROR"
        message = "Нарушение целостности данных"
        status_code = 409
    else:
        error_code = "DATABASE_ERROR"
        message = "Ошибка базы данных"
        status_code = 500
    
    log_error(
        exc,
        context={
            "url": str(request.url),
            "method": request.method,
            "error_type": type(exc).__name__
        }
    )
    
    return create_error_response(
        message=message,
        error_code=error_code,
        status_code=status_code,
        request_id=getattr(request.state, 'request_id', None)
    )


async def general_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    
    
    log_error(
        exc,
        context={
            "url": str(request.url),
            "method": request.method,
            "traceback": traceback.format_exc()
        }
    )
    
    return create_error_response(
        message="Внутренняя ошибка сервера",
        error_code="INTERNAL_SERVER_ERROR",
        status_code=500,
        request_id=getattr(request.state, 'request_id', None)
    )


def safe_execute(func, *args, fallback_value=None, **kwargs):
    
    try:
        return func(*args, **kwargs)
    except Exception as e:
        logger.warning(
            f"Safe execute failed for {func.__name__}: {e}",
            extra={
                "function": func.__name__,
                "args": str(args)[:200],
                "error": str(e)
            }
        )
        return fallback_value


async def safe_execute_async(func, *args, fallback_value=None, **kwargs):
    
    try:
        return await func(*args, **kwargs)
    except Exception as e:
        logger.warning(
            f"Safe execute async failed for {func.__name__}: {e}",
            extra={
                "function": func.__name__,
                "args": str(args)[:200],
                "error": str(e)
            }
        )
        return fallback_value
