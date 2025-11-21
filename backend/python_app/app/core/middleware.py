
import time
import uuid
from datetime import datetime
from typing import Callable, Optional, List, Awaitable
from fastapi import Request, Response
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

from app.core.logging import log_request, get_logger

logger = get_logger(__name__)

# Простые счетчики для метрик
request_counters = {
    "GET_200": 0,
    "POST_200": 0,
    "GET_404": 0,
    "POST_500": 0,
}


class LoggingMiddleware(BaseHTTPMiddleware):
    
    
    def __init__(self, app, exclude_paths: Optional[List[str]] = None):
        super().__init__(app)
        self.exclude_paths = exclude_paths or [
            "/health", "/metrics", "/docs", "/redoc", "/openapi.json"
        ]
    
    async def dispatch(
        self, request: Request, call_next: Callable[[Request], Awaitable[Response]]
    ) -> Response:
        request_id = str(uuid.uuid4())
        request.state.request_id = request_id
        
        client_ip = self._get_client_ip(request)
        
        start_time = time.time()
        
        if not any(request.url.path.startswith(path) for path in self.exclude_paths):
            logger.info(
                f"Incoming request: {request.method} {request.url.path}",
                extra={
                    "request_id": request_id,
                    "method": request.method,
                    "url": str(request.url),
                    "client_ip": client_ip,
                    "user_agent": request.headers.get("user-agent"),
                    "event_type": "request_start"
                }
            )
        
        try:
            response: Response = await call_next(request)
            
            process_time = time.time() - start_time
            
            response.headers["X-Request-ID"] = request_id
            response.headers["X-Process-Time"] = str(round(process_time * 1000, 2))
            
            if not any(
                request.url.path.startswith(path) for path in self.exclude_paths
            ):
                log_request(
                    method=request.method,
                    url=str(request.url),
                    status_code=response.status_code,
                    duration=process_time,
                    ip=client_ip
                )
                
                # Обновляем счетчики метрик
                key = f"{request.method}_{response.status_code}"
                if key in request_counters:
                    request_counters[key] += 1
            
            return response
            
        except Exception as e:
            process_time = time.time() - start_time
            
            logger.error(
                f"Request failed: {request.method} {request.url.path}",
                extra={
                    "request_id": request_id,
                    "method": request.method,
                    "url": str(request.url),
                    "client_ip": client_ip,
                    "error": str(e),
                    "process_time": process_time,
                    "event_type": "request_error"
                },
                exc_info=True
            )
            
            error_response = JSONResponse(
                status_code=500,
                content={
                    "success": False,
                    "error": {
                        "code": "INTERNAL_SERVER_ERROR",
                        "message": "Внутренняя ошибка сервера",
                        "request_id": request_id,
                        "timestamp": datetime.utcnow().isoformat() + 'Z'
                    }
                },
                headers={
                    "X-Request-ID": request_id,
                    "X-Process-Time": str(round(process_time * 1000, 2))
                }
            )
            return error_response
    
    def _get_client_ip(self, request: Request) -> str:
        
        forwarded_for = request.headers.get("X-Forwarded-For")
        if forwarded_for:
            return str(forwarded_for.split(",")[0].strip())
        
        real_ip = request.headers.get("X-Real-IP")
        if real_ip:
            return str(real_ip)
        
        return str(request.client.host) if request.client else "unknown"


class ErrorHandlingMiddleware(BaseHTTPMiddleware):
    
    
    async def dispatch(
        self, request: Request, call_next: Callable[[Request], Awaitable[Response]]
    ) -> Response:
        try:
            response: Response = await call_next(request)
            
            if (
                response.status_code >= 400 and 
                response.headers.get("content-type", "").startswith("application/json")
            ):
                
                body = b""
                if hasattr(response, 'body_iterator'):
                    async for chunk in response.body_iterator:
                        body += chunk
                else:
                    body = getattr(response, 'body', b"")
                
                try:
                    import json
                    content = json.loads(body.decode())
                    if isinstance(content, dict) and "error" in content:
                        content["error"]["timestamp"] = (
                            datetime.utcnow().isoformat() + 'Z'
                        )
                        
                        updated_response = JSONResponse(
                            status_code=response.status_code,
                            content=content,
                            headers=dict(response.headers)
                        )
                        return updated_response
                except (json.JSONDecodeError, KeyError):
                    pass
                
                fallback_response = Response(
                    content=body,
                    status_code=response.status_code,
                    headers=dict(response.headers)
                )
                return fallback_response
            
            return response
            
        except Exception as e:
            logger.error(f"Error in ErrorHandlingMiddleware: {e}", exc_info=True)
            return await call_next(request)


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    
    
    async def dispatch(
        self, request: Request, call_next: Callable[[Request], Awaitable[Response]]
    ) -> Response:
        response: Response = await call_next(request)
        
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = (
            "strict-origin-when-cross-origin"
        )
        
        return response
