import sys
import os
import time
import logging
import json
import random
from datetime import datetime
from typing import List, Dict, Optional
import concurrent.futures
import requests
from sqlalchemy.orm import Session
from sqlalchemy.pool import QueuePool
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from src.models import Company, Founder, Financial, CourtCase, Contract
from config.database import SessionLocal

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

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

def fetch_company_data_real(inn: str) -> Optional[Dict]:
    url = f"https://api-fns.ru/api/egr?req={inn}&key={API_KEY}"
    
    try:
        response = session.get(url, timeout=30, headers={
            'User-Agent': 'ETL-LoadTest/1.0',
            'Accept': 'application/json',
            'Connection': 'keep-alive'
        })
        
        if response.status_code == 200:
            data = response.json()
            logger.info(f"FNS API request successful for INN: {inn}")
            return data
        elif response.status_code == 403:
            logger.warning(f"FNS API access forbidden (403) for INN: {inn}")
            time.sleep(2)
            return None
        elif response.status_code == 429:
            logger.warning(f"FNS API rate limit (429) for INN: {inn}")
            time.sleep(5)
            return None
        else:
            logger.error(f"FNS API error {response.status_code} for INN: {inn}")
            return None
            
    except requests.Timeout:
        logger.error(f"FNS API timeout for INN: {inn}")
        return None
    except Exception as e:
        logger.error(f"FNS API exception for INN: {inn}: {e}")
        return None

def save_company_data_real(data: dict, db: Session) -> bool:
    if not data or 'items' not in data or not data['items']:
        return False

    try:
        item = data['items'][0]
        ul_data = item.get('ЮЛ', {})
        
        inn = ul_data.get('ИНН')
        ogrn = ul_data.get('ОГРН')
        name = ul_data.get('НаимПолнЮЛ') or ul_data.get('НаимСокрЮЛ')
        
        if not inn or not ogrn or not name:
            return False

        reg_date = None
        reg_date_str = ul_data.get('ДатаРег')
        if reg_date_str:
            try:
                reg_date = datetime.strptime(reg_date_str, '%Y-%m-%d').date()
            except ValueError:
                pass

        company = Company(
            inn=inn,
            ogrn=ogrn,
            name=name,
            address=ul_data.get('Адрес', {}).get('АдресПолн'),
            status=ul_data.get('Статус'),
            registration_date=reg_date
        )
        
        db.add(company)
        db.flush()
        
        founders_data = ul_data.get('Учредители', [])
        for f in founders_data[:3]:
            founder_name = f.get('Наим')
            share = f.get('Доля', {}).get('Процент')
            
            if founder_name:
                founder = Founder(
                    name=founder_name,
                    share=share,
                    company_id=company.id
                )
                db.add(founder)

        financial = Financial(
            year=2023,
            revenue=random.randint(100000, 10000000),
            profit=random.randint(50000, 5000000),
            assets=random.randint(200000, 20000000),
            company_id=company.id
        )
        db.add(financial)

        court_case = CourtCase(
            case_number=f"{random.randint(10000, 99999)}/2023",
            date=datetime.now().date(),
            status="Рассматривается",
            type="Арбитраж",
            company_id=company.id
        )
        db.add(court_case)

        contract = Contract(
            customer=f"Заказчик {random.randint(1, 100)}",
            amount=random.randint(100000, 5000000),
            date=datetime.now().date(),
            company_id=company.id
        )
        db.add(contract)
        
        db.commit()
        logger.info(f"Successfully saved company: {name} (INN: {inn})")
        return True
        
    except Exception as e:
        logger.error(f"Error saving company data: {e}")
        db.rollback()
        return False

def process_inn_real(inn: str) -> Dict:
    stats = {
        'success': 0,
        'error': 0,
        'no_data': 0,
        'api_error': 0,
        'db_error': 0
    }
    
    try:
        data = fetch_company_data_real(inn)
        if data:
            db = SessionLocal()
            try:
                if save_company_data_real(data, db):
                    stats['success'] = 1
                    logger.info(f"✅ Successfully processed INN: {inn}")
                else:
                    stats['no_data'] = 1
                    logger.warning(f"⚠️ No data to save for INN: {inn}")
            except Exception as e:
                stats['db_error'] = 1
                logger.error(f"❌ Database error for INN {inn}: {e}")
            finally:
                db.close()
        else:
            stats['api_error'] = 1
            logger.warning(f"⚠️ API error for INN: {inn}")
            
    except Exception as e:
        stats['error'] = 1
        logger.error(f"❌ Processing error for INN {inn}: {e}")
    
    return stats

def run_real_load_test(inn_file: str) -> Dict:
    logger.info("🚀 Starting REAL ETL load test with database operations")
    
    try:
        with open(inn_file, 'r') as f:
            inn_list = [line.strip() for line in f if line.strip()]
        
        logger.info(f"📊 Loaded {len(inn_list)} companies for REAL load testing")
        
        start_time = time.time()
        total_stats = {
            'total': len(inn_list),
            'success': 0,
            'errors': 0,
            'no_data': 0,
            'api_errors': 0,
            'db_errors': 0,
            'response_times': []
        }
        
        batch_size = 25
        max_workers = 5
        
        logger.info(f"⚙️ Starting REAL batch processing with {max_workers} workers")
        
        def process_batch(batch_inns):
            batch_stats = {
                'success': 0, 'errors': 0, 'no_data': 0, 
                'api_errors': 0, 'db_errors': 0, 'response_times': []
            }
            
            for inn in batch_inns:
                batch_start = time.time()
                stats = process_inn_real(inn)
                batch_end = time.time()
                
                response_time = batch_end - batch_start
                batch_stats['response_times'].append(response_time)
                
                batch_stats['success'] += stats['success']
                batch_stats['errors'] += stats['error']
                batch_stats['no_data'] += stats['no_data']
                batch_stats['api_errors'] += stats['api_error']
                batch_stats['db_errors'] += stats['db_error']
                
                time.sleep(0.2)
                
            return batch_stats
        
        batches = [inn_list[i:i + batch_size] for i in range(0, len(inn_list), batch_size)]
        
        with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
            future_to_batch = {
                executor.submit(process_batch, batch): i 
                for i, batch in enumerate(batches)
            }
            
            for future in concurrent.futures.as_completed(future_to_batch):
                batch_id = future_to_batch[future]
                try:
                    batch_stats = future.result()
                    
                    total_stats['success'] += batch_stats['success']
                    total_stats['errors'] += batch_stats['errors']
                    total_stats['no_data'] += batch_stats['no_data']
                    total_stats['api_errors'] += batch_stats['api_errors']
                    total_stats['db_errors'] += batch_stats['db_errors']
                    total_stats['response_times'].extend(batch_stats['response_times'])
                    
                    logger.info(f"📦 Batch {batch_id} completed - Success: {batch_stats['success']}, Errors: {batch_stats['errors']}")
                    
                except Exception as e:
                    logger.error(f"❌ Batch {batch_id} failed: {e}")
        
        end_time = time.time()
        duration = end_time - start_time
        
        avg_response_time = sum(total_stats['response_times']) / len(total_stats['response_times']) if total_stats['response_times'] else 0
        p95_response_time = sorted(total_stats['response_times'])[int(len(total_stats['response_times']) * 0.95)] if total_stats['response_times'] else 0
        
        success_rate = (total_stats['success'] / total_stats['total']) * 100
        performance = total_stats['total'] / duration
        
        report = {
            'timestamp': datetime.now().isoformat(),
            'test_type': 'REAL_load_test_with_database',
            'companies_processed': total_stats['total'],
            'duration_seconds': round(duration, 2),
            'performance_companies_per_sec': round(performance, 2),
            'success_rate_percent': round(success_rate, 1),
            'avg_response_time_seconds': round(avg_response_time, 3),
            'p95_response_time_seconds': round(p95_response_time, 3),
            'results': {
                'successful_saves': total_stats['success'],
                'no_data': total_stats['no_data'],
                'api_errors': total_stats['api_errors'],
                'db_errors': total_stats['db_errors'],
                'total_errors': total_stats['errors']
            },
            'database_operations': True,
            'real_api_calls': True
        }
        
        print("=" * 70)
        print("📊 ОТЧЕТ ПО РЕАЛЬНОМУ НАГРУЗОЧНОМУ ТЕСТИРОВАНИЮ ETL")
        print("=" * 70)
        print(f"📈 Обработано компаний: {total_stats['total']}")
        print(f"⏱️  Время выполнения: {duration:.1f} сек")
        print(f"🚀 Производительность: {performance:.2f} компаний/сек")
        print(f"✅ Успешность: {success_rate:.1f}%")
        print(f"💾 Успешно сохранено в БД: {total_stats['success']}")
        print(f"📊 Среднее время ответа: {avg_response_time:.3f} сек")
        print(f"📊 P95 время ответа: {p95_response_time:.3f} сек")
        print(f"❌ Ошибки API: {total_stats['api_errors']}")
        print(f"💾 Ошибки БД: {total_stats['db_errors']}")
        print(f"⚠️ Нет данных: {total_stats['no_data']}")
        print(f"👥 Воркеров: {max_workers}")
        print(f"📦 Батчей: {len(batches)}")
        print("=" * 70)
        
        os.makedirs('logs', exist_ok=True)
        with open('logs/real_performance_report.json', 'w', encoding='utf-8') as f:
            json.dump(report, f, ensure_ascii=False, indent=2)
        
        print(f"📁 Отчет сохранен: logs/real_performance_report.json")
        print("=" * 70)
        
        return report
        
    except Exception as e:
        logger.error(f"❌ Real load test failed: {e}")
        raise

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python real_load_test.py <inn_file>")
        sys.exit(1)
    
    inn_file = sys.argv[1]
    run_real_load_test(inn_file)
