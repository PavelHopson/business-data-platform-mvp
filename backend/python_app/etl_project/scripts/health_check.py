import os
import sys
import asyncio
import logging
from datetime import datetime, timedelta
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from config.database import SessionLocal
from src.models import Company
import logging

def get_logger(name):
    return logging.getLogger(name)

def log_error(message, context=None):
    logger.error(f"{message} - Context: {context}")

def send_critical_alert(message, context=None):
    print(f"CRITICAL ALERT: {message} - Context: {context}")

logger = get_logger("etl-health")

async def check_etl_health():
    logger.info("Starting ETL health check", extra={
        "event_type": "etl_health_check",
        "service": "etl"
    })
    
    try:
        db: Session = SessionLocal()
        
        db.execute("SELECT 1")
        
        recent_companies = db.query(Company).filter(
            Company.updated_at >= datetime.now() - timedelta(hours=24)
        ).count()
        
        if recent_companies == 0:
            await send_critical_alert(
                "ETL Health Check: No companies updated in last 24 hours",
                {"recent_companies": recent_companies}
            )
        
        logger.info(f"ETL health check completed", extra={
            "event_type": "etl_health_success",
            "service": "etl",
            "recent_companies": recent_companies
        })
        
        db.close()
        
    except Exception as e:
        log_error(e, context={
            "event_type": "etl_health_error",
            "service": "etl"
        })
        await send_critical_alert(
            "ETL Health Check Failed",
            {"error": str(e)}
        )

if __name__ == "__main__":
    asyncio.run(check_etl_health())
