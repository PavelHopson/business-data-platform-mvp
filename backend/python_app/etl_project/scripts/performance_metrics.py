

import time
import psutil
import asyncio
from datetime import datetime
from prometheus_client import Counter, Histogram, Gauge, start_http_server
import logging
import sys
import os

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("etl-metrics")

etl_companies_processed = Counter(
    'etl_companies_processed_total',
    'Total number of companies processed by ETL',
    ['status', 'service']
)

etl_processing_duration = Histogram(
    'etl_processing_duration_seconds',
    'Time spent processing companies',
    ['service'],
    buckets=[0.1, 0.5, 1.0, 2.0, 5.0, 10.0, 30.0, 60.0, 120.0]
)

etl_api_response_time = Histogram(
    'etl_api_response_time_seconds',
    'API response time for company data fetching',
    ['api', 'service'],
    buckets=[0.1, 0.5, 1.0, 2.0, 5.0, 10.0, 30.0]
)

etl_memory_usage = Gauge(
    'etl_memory_usage_bytes',
    'Memory usage of ETL process',
    ['service']
)

etl_cpu_usage = Gauge(
    'etl_cpu_usage_percent',
    'CPU usage of ETL process',
    ['service']
)

etl_queue_size = Gauge(
    'etl_queue_size',
    'Number of companies in processing queue',
    ['service']
)

etl_active_jobs = Gauge(
    'etl_active_jobs',
    'Number of active ETL jobs',
    ['service']
)

etl_errors_total = Counter(
    'etl_errors_total',
    'Total number of ETL errors',
    ['error_type', 'service']
)

class PerformanceMonitor:
    def __init__(self, service_name="etl"):
        self.service_name = service_name
        self.start_time = time.time()
        self.process = psutil.Process()
        
    def record_company_processed(self, status="success"):
        
        etl_companies_processed.labels(
            status=status,
            service=self.service_name
        ).inc()
        
        logger.debug(f"Company processed: {status}", extra={
            "event_type": "etl_company_processed",
            "status": status,
            "service": self.service_name
        })
    
    def record_processing_duration(self, duration_seconds):
        
        etl_processing_duration.labels(
            service=self.service_name
        ).observe(duration_seconds)
        
        logger.debug(f"Processing duration recorded: {duration_seconds}s", extra={
            "event_type": "etl_processing_duration",
            "duration_seconds": duration_seconds,
            "service": self.service_name
        })
    
    def record_api_response_time(self, api_name, response_time):
        
        etl_api_response_time.labels(
            api=api_name,
            service=self.service_name
        ).observe(response_time)
        
        logger.debug(f"API response time recorded: {api_name} - {response_time}s", extra={
            "event_type": "etl_api_response_time",
            "api": api_name,
            "response_time": response_time,
            "service": self.service_name
        })
    
    def record_error(self, error_type):
        
        etl_errors_total.labels(
            error_type=error_type,
            service=self.service_name
        ).inc()
        
        logger.warning(f"ETL error recorded: {error_type}", extra={
            "event_type": "etl_error",
            "error_type": error_type,
            "service": self.service_name
        })
    
    def update_system_metrics(self):
        
        try:
            memory_info = self.process.memory_info()
            etl_memory_usage.labels(service=self.service_name).set(memory_info.rss)
            
            cpu_percent = self.process.cpu_percent()
            etl_cpu_usage.labels(service=self.service_name).set(cpu_percent)
            
            logger.debug(f"System metrics updated: CPU={cpu_percent}%, Memory={memory_info.rss} bytes", extra={
                "event_type": "etl_system_metrics",
                "cpu_percent": cpu_percent,
                "memory_bytes": memory_info.rss,
                "service": self.service_name
            })
            
        except Exception as e:
            logger.error(f"Failed to update system metrics: {str(e)}", extra={
                "event_type": "etl_metrics_error",
                "error": str(e),
                "service": self.service_name
            })
    
    def set_queue_size(self, size):
        
        etl_queue_size.labels(service=self.service_name).set(size)
    
    def set_active_jobs(self, count):
        
        etl_active_jobs.labels(service=self.service_name).set(count)

class MetricsServer:
    def __init__(self, port=8001):
        self.port = port
        self.server = None
        
    def start(self):
        
        try:
            start_http_server(self.port)
            logger.info(f"Prometheus metrics server started on port {self.port}", extra={
                "event_type": "etl_metrics_server_start",
                "port": self.port,
                "service": "etl"
            })
            return True
        except Exception as e:
            logger.error(f"Failed to start metrics server: {str(e)}", extra={
                "event_type": "etl_metrics_server_error",
                "error": str(e),
                "service": "etl"
            })
            return False
    
    async def run_metrics_collection(self, monitor: PerformanceMonitor, interval=10):
        
        logger.info(f"Starting metrics collection with {interval}s interval", extra={
            "event_type": "etl_metrics_collection_start",
            "interval": interval,
            "service": "etl"
        })
        
        while True:
            try:
                monitor.update_system_metrics()
                await asyncio.sleep(interval)
            except Exception as e:
                logger.error(f"Metrics collection error: {str(e)}", extra={
                    "event_type": "etl_metrics_collection_error",
                    "error": str(e),
                    "service": "etl"
                })
                await asyncio.sleep(interval)

def measure_performance(monitor: PerformanceMonitor, operation_name: str):
    def decorator(func):
        async def async_wrapper(*args, **kwargs):
            start_time = time.time()
            try:
                result = await func(*args, **kwargs)
                duration = time.time() - start_time
                monitor.record_processing_duration(duration)
                logger.info(f"{operation_name} completed", extra={
                    "event_type": f"etl_{operation_name}_complete",
                    "duration_seconds": duration,
                    "service": "etl"
                })
                return result
            except Exception as e:
                duration = time.time() - start_time
                monitor.record_error(f"{operation_name}_error")
                logger.error(f"{operation_name} failed: {str(e)}", extra={
                    "event_type": f"etl_{operation_name}_error",
                    "error": str(e),
                    "duration_seconds": duration,
                    "service": "etl"
                })
                raise
        
        def sync_wrapper(*args, **kwargs):
            start_time = time.time()
            try:
                result = func(*args, **kwargs)
                duration = time.time() - start_time
                monitor.record_processing_duration(duration)
                logger.info(f"{operation_name} completed", extra={
                    "event_type": f"etl_{operation_name}_complete",
                    "duration_seconds": duration,
                    "service": "etl"
                })
                return result
            except Exception as e:
                duration = time.time() - start_time
                monitor.record_error(f"{operation_name}_error")
                logger.error(f"{operation_name} failed: {str(e)}", extra={
                    "event_type": f"etl_{operation_name}_error",
                    "error": str(e),
                    "duration_seconds": duration,
                    "service": "etl"
                })
                raise
        
        return async_wrapper if asyncio.iscoroutinefunction(func) else sync_wrapper
    return decorator

async def main():
    
    logger.info("Starting ETL Performance Metrics Server", extra={
        "event_type": "etl_metrics_start",
        "service": "etl"
    })
    
    metrics_server = MetricsServer(port=8001)
    if not metrics_server.start():
        logger.error("Failed to start metrics server")
        return
    
    monitor = PerformanceMonitor()
    
    try:
        await metrics_server.run_metrics_collection(monitor, interval=5)
    except KeyboardInterrupt:
        logger.info("Metrics server stopped by user", extra={
            "event_type": "etl_metrics_stop",
            "service": "etl"
        })
    except Exception as e:
        logger.error(f"Metrics server error: {str(e)}", extra={
            "event_type": "etl_metrics_error",
            "error": str(e),
            "service": "etl"
        })

if __name__ == "__main__":
    asyncio.run(main())
