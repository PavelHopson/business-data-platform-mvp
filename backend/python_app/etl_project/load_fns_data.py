import sys
import os
import asyncio
import logging
import time
import random
import concurrent.futures
from datetime import datetime
from typing import Optional, Dict, Any, List
from threading import Lock
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import requests
import pandas as pd
from sqlalchemy.orm import Session
from sqlalchemy.pool import QueuePool
from src.models import Company, Founder, Financial, CourtCase, Contract
from config.database import SessionLocal
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

def get_logger(name):
    return logging.getLogger(name)

def log_business_event(message, extra=None):
    logger = logging.getLogger("business")
    logger.info(message, extra=extra)

def log_error(error, context=None):
    logger = logging.getLogger("error")
    logger.error(f"Error: {error}", extra=context)

async def send_critical_alert(message, data=None):
    logger = logging.getLogger("alerts")
    logger.critical(f"CRITICAL ALERT: {message} - {data}")

async def send_warning_alert(message, data=None):
    logger = logging.getLogger("alerts")
    logger.warning(f"WARNING ALERT: {message} - {data}")

logger = get_logger("etl")
API_KEY = os.getenv('FNS_API_KEY', '1a146f7e6f9942181e2352e63c71402d207f0248')

session = requests.Session()
retry_strategy = Retry(
    total=3,
    backoff_factor=1,
    status_forcelist=[429, 500, 502, 503, 504],
)
adapter = HTTPAdapter(max_retries=retry_strategy, pool_connections=20, pool_maxsize=100)
session.mount("http://", adapter)
session.mount("https://", adapter)

class OptimizedCircuitBreaker:
    def __init__(self, failure_threshold=5, recovery_timeout=60):
        self.failure_threshold = failure_threshold
        self.recovery_timeout = recovery_timeout
        self.failure_count = 0
        self.last_failure_time = None
        self.state = 'CLOSED'
        self.lock = Lock()
    
    def call(self, func, *args, **kwargs):
        with self.lock:
            if self.state == 'OPEN':
                if time.time() - self.last_failure_time > self.recovery_timeout:
                    self.state = 'HALF_OPEN'
                else:
                    raise Exception("Circuit breaker is OPEN")
        
        try:
            result = func(*args, **kwargs)
            with self.lock:
                if self.state == 'HALF_OPEN':
                    self.state = 'CLOSED'
                    self.failure_count = 0
            return result
        except Exception as e:
            with self.lock:
                self.failure_count += 1
                self.last_failure_time = time.time()
                
                if self.failure_count >= self.failure_threshold:
                    self.state = 'OPEN'
                    logger.error(f"Circuit breaker opened due to {self.failure_count} failures")
            
            raise e

circuit_breaker = OptimizedCircuitBreaker(failure_threshold=3, recovery_timeout=30)

def retry_with_exponential_backoff(func, max_retries=5, base_delay=0.3, max_delay=30):
    for attempt in range(max_retries + 1):
        try:
            return func()
        except (requests.Timeout, requests.ConnectionError, requests.exceptions.ChunkedEncodingError) as e:
            if attempt == max_retries:
                raise e
            
            delay = min(base_delay * (2 ** attempt) + random.uniform(0, 0.5), max_delay)
            logger.warning(f"Retry {attempt + 1}/{max_retries} after {delay:.2f}s delay")
            time.sleep(delay)
        except Exception as e:
            raise e

def fetch_company_data_sync(inn: str) -> Optional[Dict[Any, Any]]:
    url = f"https://api-fns.ru/api/egr?req={inn}&key={API_KEY}"
    
    logger.info(f"Fetching company data from FNS API", extra={
        "event_type": "etl_fns_request",
        "inn": inn,
        "api": "fns",
        "service": "etl"
    })
    
    def make_request():
        return session.get(url, timeout=120, headers={
            'User-Agent': 'ETL-System-Optimized/4.0',
            'Accept': 'application/json',
            'Connection': 'keep-alive',
            'Cache-Control': 'no-cache'
        })
    
    try:
        response = circuit_breaker.call(retry_with_exponential_backoff, make_request)
        
        if response.status_code == 200:
            data = response.json()
            logger.info(f"FNS API request successful", extra={
                "event_type": "etl_fns_success",
                "inn": inn,
                "api": "fns",
                "service": "etl",
                "items_count": len(data.get('items', [])),
                "response_time": response.elapsed.total_seconds()
            })
            return data
        elif response.status_code == 403:
            logger.error(f"FNS API access forbidden (403)", extra={
                "event_type": "etl_fns_error",
                "inn": inn,
                "api": "fns",
                "service": "etl",
                "status_code": 403
            })
            time.sleep(5)
            return None
        elif response.status_code == 429:
            logger.warning(f"FNS API rate limit exceeded (429)", extra={
                "event_type": "etl_fns_rate_limit",
                "inn": inn,
                "api": "fns",
                "service": "etl",
                "status_code": 429
            })
            time.sleep(10)
            return None
        else:
            logger.error(f"FNS API error", extra={
                "event_type": "etl_fns_error",
                "inn": inn,
                "api": "fns",
                "service": "etl",
                "status_code": response.status_code
            })
            return None
            
    except requests.Timeout:
        logger.error(f"FNS API timeout", extra={
            "event_type": "etl_fns_timeout",
            "inn": inn,
            "api": "fns",
            "service": "etl"
        })
        return None
    except requests.ConnectionError as e:
        logger.error(f"FNS API connection error", extra={
            "event_type": "etl_fns_connection_error",
            "inn": inn,
            "api": "fns",
            "service": "etl",
            "error": str(e)
        })
        return None
    except Exception as e:
        log_error(e, context={
            "event_type": "etl_fns_exception",
            "inn": inn,
            "api": "fns",
            "service": "etl"
        })
        return None

def save_company_and_related_data(data: dict, db: Session):
    if not data or 'items' not in data:
        logger.warning("No data to save", extra={
            "event_type": "etl_no_data",
            "service": "etl"
        })
        return

    items = data.get('items', [])[:10]
    companies_to_add = []
    founders_to_add = []
    financials_to_add = []
    court_cases_to_add = []
    contracts_to_add = []

    for item in items:
        try:
            ul_data = item.get('ЮЛ', {})
            inn = ul_data.get('ИНН')
            ogrn = ul_data.get('ОГРН')
            name = ul_data.get('НаимПолнЮЛ') or ul_data.get('НаимСокрЮЛ')
            
            if not inn or not ogrn or not name:
                logger.warning(f"Skipping record: missing data", extra={
                    "event_type": "etl_skip_record",
                    "inn": inn,
                    "service": "etl"
                })
                continue

            reg_date = None
            reg_date_str = ul_data.get('ДатаРег')
            if reg_date_str:
                try:
                    reg_date = datetime.strptime(reg_date_str, '%Y-%m-%d').date()
                except ValueError:
                    logger.warning(f"Invalid date format: {reg_date_str}", extra={
                        "event_type": "etl_date_error",
                        "inn": inn,
                        "service": "etl"
                    })

            company = Company(
                inn=inn,
                ogrn=ogrn,
                name=name,
                address=ul_data.get('Адрес', {}).get('АдресПолн'),
                status=ul_data.get('Статус'),
                registration_date=reg_date
            )
            companies_to_add.append(company)
            
            logger.debug(f"Prepared company for bulk insert", extra={
                "event_type": "etl_company_prepared",
                "inn": inn,
                "name": name,
                "service": "etl"
            })

            founders_data = ul_data.get('Учредители', [])
            for f in founders_data:
                founder_name = f.get('Наим')
                share = f.get('Доля', {}).get('Процент')

                if not founder_name:
                    continue

                founder = Founder(
                    name=founder_name,
                    share=share
                )
                founders_to_add.append((founder, company))

            financial = Financial(
                year=2023,
                revenue=1000000.0,
                profit=500000.0,
                assets=2000000.0
            )
            financials_to_add.append((financial, company))

            court_case = CourtCase(
                case_number="12345/2023",
                date=datetime.now().date(),
                status="Рассматривается",
                type="Арбитраж"
            )
            court_cases_to_add.append((court_case, company))

            contract = Contract(
                customer="Тестовый заказчик",
                amount=500000.0,
                date=datetime.now().date()
            )
            contracts_to_add.append((contract, company))
            
        except Exception as e:
            log_error(e, context={
                "event_type": "etl_save_error",
                "inn": inn,
                "service": "etl"
            })

    try:
        db.bulk_save_objects(companies_to_add)
        db.flush()
        
        for founder, company in founders_to_add:
            founder.company_id = company.id
            db.add(founder)
        
        for financial, company in financials_to_add:
            financial.company_id = company.id
            db.add(financial)
            
        for court_case, company in court_cases_to_add:
            court_case.company_id = company.id
            db.add(court_case)
            
        for contract, company in contracts_to_add:
            contract.company_id = company.id
            db.add(contract)
        
        db.commit()
        logger.debug(f"Bulk transaction completed successfully", extra={
            "event_type": "etl_bulk_transaction_success",
            "service": "etl",
            "companies_processed": len(companies_to_add)
        })
    except Exception as e:
        log_error(e, context={
            "event_type": "etl_bulk_transaction_error",
            "service": "etl"
        })
        db.rollback()

def process_inn_batch(inn_batch: List[str], batch_id: int) -> Dict[str, int]:
    stats = {
        'total': len(inn_batch),
        'success': 0,
        'errors': 0,
        'timeouts': 0,
        'rate_limits': 0,
        'connection_errors': 0
    }
    
    db: Session = SessionLocal()
    
    try:
        for i, inn in enumerate(inn_batch):
            logger.info(f"Processing INN {i+1}/{len(inn_batch)} in batch {batch_id}: {inn}", extra={
                "event_type": "etl_processing_inn",
                "inn": inn,
                "service": "etl",
                "batch_id": batch_id,
                "progress": f"{i+1}/{len(inn_batch)}"
            })
            
            try:
                data = fetch_company_data_sync(inn)
                if data:
                    save_company_and_related_data(data, db)
                    stats['success'] += 1
                else:
                    stats['errors'] += 1
                    logger.warning(f"No data for INN: {inn}", extra={
                        "event_type": "etl_no_data_for_inn",
                        "inn": inn,
                        "service": "etl",
                        "batch_id": batch_id
                    })
            except Exception as e:
                stats['errors'] += 1
                log_error(e, context={
                    "event_type": "etl_inn_processing_error",
                    "inn": inn,
                    "service": "etl",
                    "batch_id": batch_id
                })
            
            time.sleep(0.1)
                
            if circuit_breaker.state == 'OPEN':
                logger.error(f"Circuit breaker is OPEN, stopping batch {batch_id}")
                break
                
    finally:
        db.close()
    
    return stats

def split_into_batches(items: List[str], batch_size: int = 50) -> List[List[str]]:
    return [items[i:i + batch_size] for i in range(0, len(items), batch_size)]

async def main():
    start_time = datetime.now()
    logger.info("Starting ETL job", extra={
        "event_type": "etl_job_start",
        "service": "etl",
        "start_time": start_time.isoformat()
    })
    
    total_stats = {
        'total': 0,
        'success': 0,
        'errors': 0,
        'timeouts': 0,
        'rate_limits': 0,
        'connection_errors': 0
    }
    
    try:
        with open("input/inn_list.txt", "r", encoding="utf-8") as f:
            inn_list = [line.strip() for line in f if line.strip()]

        total_stats['total'] = len(inn_list)
        logger.info(f"Found {len(inn_list)} INNs to process", extra={
            "event_type": "etl_inns_loaded",
            "service": "etl",
            "count": len(inn_list)
        })

        batch_size = 50
        max_workers = 8
        
        inn_batches = split_into_batches(inn_list, batch_size)
        logger.info(f"Split into {len(inn_batches)} batches of {batch_size} items each", extra={
            "event_type": "etl_batches_created",
            "service": "etl",
            "batches_count": len(inn_batches),
            "batch_size": batch_size,
            "max_workers": max_workers
        })

        with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
            future_to_batch = {
                executor.submit(process_inn_batch, batch, i): i 
                for i, batch in enumerate(inn_batches)
            }
            
            for future in concurrent.futures.as_completed(future_to_batch):
                batch_id = future_to_batch[future]
                try:
                    batch_stats = future.result()
                    
                    for key in total_stats:
                        if key in batch_stats:
                            total_stats[key] += batch_stats[key]
                    
                    logger.info(f"Batch {batch_id} completed", extra={
                        "event_type": "etl_batch_complete",
                        "service": "etl",
                        "batch_id": batch_id,
                        "batch_stats": batch_stats
                    })
                    
                except Exception as e:
                    logger.error(f"Batch {batch_id} failed", extra={
                        "event_type": "etl_batch_error",
                        "service": "etl",
                        "batch_id": batch_id,
                        "error": str(e)
                    })
        
        duration = (datetime.now() - start_time).total_seconds()
        success_rate = (total_stats['success'] / total_stats['total']) * 100 if total_stats['total'] > 0 else 0
        
        logger.info(f"ETL job completed", extra={
            "event_type": "etl_job_complete",
            "service": "etl",
            "duration_seconds": duration,
            "companies_processed": total_stats['total'],
            "success_count": total_stats['success'],
            "error_count": total_stats['errors'],
            "success_rate": success_rate,
            "circuit_breaker_state": circuit_breaker.state,
            "batches_processed": len(inn_batches),
            "max_workers": max_workers
        })

        if success_rate < 80:
            await send_warning_alert(
                "ETL job completed with low success rate",
                {
                    "success_rate": success_rate,
                    "total": total_stats['total'],
                    "success": total_stats['success'],
                    "errors": total_stats['errors'],
                    "batches_processed": len(inn_batches)
                }
            )

    except Exception as e:
        log_error(e, context={
            "event_type": "etl_job_failed",
            "service": "etl"
        })
        await send_critical_alert(
            "ETL job failed",
            {"error": str(e), "stats": total_stats}
        )
        raise

if __name__ == "__main__":
    asyncio.run(main())

