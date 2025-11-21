
import time
import logging
from http.server import HTTPServer, BaseHTTPRequestHandler
from prometheus_client import Counter, Histogram, Gauge, generate_latest
import threading
import json
import os
from datetime import datetime

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("metrics-server")

etl_requests_total = Counter('etl_requests_total', 'Total ETL requests', ['status', 'api'])
etl_request_duration = Histogram('etl_request_duration_seconds', 'ETL request duration', ['api'])
etl_companies_processed = Gauge('etl_companies_processed_total', 'Total companies processed')
etl_errors_total = Counter('etl_errors_total', 'Total ETL errors', ['error_type'])
etl_circuit_breaker_state = Gauge('etl_circuit_breaker_state', 'Circuit breaker state (0=CLOSED, 1=OPEN, 2=HALF_OPEN)')
etl_job_duration = Histogram('etl_job_duration_seconds', 'ETL job duration')
etl_success_rate = Gauge('etl_success_rate', 'ETL success rate percentage')
etl_api_403_errors_total = Counter('etl_api_403_errors_total', 'Total 403 errors from FNS API')

class MetricsHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/metrics':
            self.send_response(200)
            self.send_header('Content-Type', 'text/plain; charset=utf-8')
            self.end_headers()
            self.wfile.write(generate_latest())
        elif self.path == '/health':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            health_data = {
                "status": "healthy",
                "timestamp": datetime.now().isoformat(),
                "metrics_available": True
            }
            self.wfile.write(json.dumps(health_data).encode())
        else:
            self.send_response(404)
            self.end_headers()

def simulate_metrics():
    logger.info("Starting metrics simulation for Grafana dashboard")
    
    while True:
        try:
            etl_companies_processed.set(150 + int(time.time()) % 100)
            etl_success_rate.set(85 + int(time.time()) % 15)
            
            if int(time.time()) % 10 == 0:
                etl_requests_total.labels(status='success', api='fns').inc(5)
                etl_requests_total.labels(status='error', api='fns').inc(1)
                etl_request_duration.labels(api='fns').observe(0.5 + (int(time.time()) % 100) / 100.0)
            
            if int(time.time()) % 30 == 0:
                etl_errors_total.labels(error_type='timeout').inc(1)
                etl_api_403_errors_total.inc(1)
            
            if int(time.time()) % 60 == 0:
                etl_circuit_breaker_state.set(int(time.time()) % 3)
            
            time.sleep(5)
            
        except Exception as e:
            logger.error(f"Error in metrics simulation: {e}")
            time.sleep(10)

def start_metrics_server():
    port = int(os.getenv('METRICS_PORT', '8001'))
    
    server = HTTPServer(('0.0.0.0', port), MetricsHandler)
    
    metrics_thread = threading.Thread(target=simulate_metrics, daemon=True)
    metrics_thread.start()
    
    logger.info(f"Metrics server starting on port {port}")
    logger.info(f"Metrics endpoint: http://0.0.0.0:{port}/metrics")
    logger.info(f"Health endpoint: http://0.0.0.0:{port}/health")
    
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        logger.info("Metrics server stopped")
        server.shutdown()

if __name__ == "__main__":
    start_metrics_server()
