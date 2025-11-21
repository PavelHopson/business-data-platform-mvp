import os
import sys
import asyncio
import requests
from datetime import datetime
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import logging

def get_logger(name):
    return logging.getLogger(name)

def send_critical_alert(message, context=None):
    print(f"CRITICAL ALERT: {message} - Context: {context}")

logger = get_logger("etl-monitor")
API_KEY = os.getenv('FNS_API_KEY', '1a146f7e6f9942181e2352e63c71402d207f0248')

async def monitor_api():
    logger.info("Starting API monitoring", extra={
        "event_type": "api_monitor_start",
        "service": "etl"
    })
    
    try:
        url = f"https://api-fns.ru/api/egr?req=7707083893&key={API_KEY}"
        response = requests.get(url, timeout=10)
        
        if response.status_code == 403:
            await send_critical_alert(
                "FNS API Key blocked or expired",
                {"status_code": 403, "timestamp": datetime.now().isoformat()}
            )
        
        logger.info(f"API monitoring completed", extra={
            "event_type": "api_monitor_success",
            "service": "etl",
            "status_code": response.status_code
        })
        
    except Exception as e:
        logger.error(f"API monitoring failed", extra={
            "event_type": "api_monitor_error",
            "service": "etl",
            "error": str(e)
        })

if __name__ == "__main__":
    asyncio.run(monitor_api())
