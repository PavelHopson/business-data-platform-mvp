import sys
import os
import time
import logging
import json
from datetime import datetime
from typing import List, Dict

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def simulate_optimized_api_call(inn: str) -> Dict:
    time.sleep(random.uniform(0.5, 2.0))
    
    error_chance = random.random()
    
    if error_chance < 0.05:
        return {"status": "timeout", "error": "Request timeout"}
    elif error_chance < 0.12:
        return {"status": "error", "error": "API error"}
    elif error_chance < 0.15:
        return {"status": "rate_limit", "error": "Rate limit exceeded"}
    else:
        return {
            "status": "success",
            "data": {
                "inn": inn,
                "name": f"Company {inn}",
                "response_time": random.uniform(0.3, 1.5)
            }
        }

def run_optimized_load_test(inn_file: str) -> Dict:
    logger.info("Starting optimized ETL load test simulation")
    
    try:
        with open(inn_file, 'r') as f:
            inn_list = [line.strip() for line in f if line.strip()]
        
        logger.info(f"Loaded {len(inn_list)} companies for optimized load testing")
        
        start_time = time.time()
        stats = {
            'total': len(inn_list),
            'success': 0,
            'errors': 0,
            'timeouts': 0,
            'rate_limits': 0,
            'response_times': []
        }
        
        batch_size = 25
        max_workers = 5
        
        logger.info(f"Starting optimized batch processing with {max_workers} workers")
        
        import concurrent.futures
        import random
        
        def process_batch(batch_inns):
            batch_stats = {'success': 0, 'errors': 0, 'timeouts': 0, 'rate_limits': 0, 'response_times': []}
            
            for inn in batch_inns:
                result = simulate_optimized_api_call(inn)
                
                if result['status'] == 'success':
                    batch_stats['success'] += 1
                    batch_stats['response_times'].append(result['data']['response_time'])
                elif result['status'] == 'timeout':
                    batch_stats['timeouts'] += 1
                elif result['status'] == 'rate_limit':
                    batch_stats['rate_limits'] += 1
                else:
                    batch_stats['errors'] += 1
                
                logger.info(f"Optimized processing: {inn} - {result['status']}")
            
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
                    
                    stats['success'] += batch_stats['success']
                    stats['errors'] += batch_stats['errors']
                    stats['timeouts'] += batch_stats['timeouts']
                    stats['rate_limits'] += batch_stats['rate_limits']
                    stats['response_times'].extend(batch_stats['response_times'])
                    
                    logger.info(f"Batch {batch_id} completed - Success: {batch_stats['success']}, Errors: {batch_stats['errors']}")
                    
                except Exception as e:
                    logger.error(f"Batch {batch_id} failed: {e}")
        
        end_time = time.time()
        duration = end_time - start_time
        
        avg_response_time = sum(stats['response_times']) / len(stats['response_times']) if stats['response_times'] else 0
        p95_response_time = sorted(stats['response_times'])[int(len(stats['response_times']) * 0.95)] if stats['response_times'] else 0
        
        success_rate = (stats['success'] / stats['total']) * 100
        performance = stats['total'] / duration
        
        report = {
            'timestamp': datetime.now().isoformat(),
            'test_type': 'optimized_load_test',
            'companies_processed': stats['total'],
            'duration_seconds': round(duration, 2),
            'performance_companies_per_sec': round(performance, 2),
            'success_rate_percent': round(success_rate, 1),
            'avg_response_time_seconds': round(avg_response_time, 3),
            'p95_response_time_seconds': round(p95_response_time, 3),
            'errors': {
                'total': stats['errors'],
                'timeouts': stats['timeouts'],
                'rate_limits': stats['rate_limits']
            },
            'optimization': {
                'max_workers': max_workers,
                'batch_size': batch_size,
                'batches_processed': len(batches)
            }
        }
        
        print("=" * 60)
        print("📊 ОТЧЕТ ПО НАГРУЗОЧНОМУ ТЕСТИРОВАНИЮ ETL")
        print("=" * 60)
        print(f"📈 Обработано компаний: {stats['total']}")
        print(f"⏱️  Время выполнения: {duration:.1f} сек")
        print(f"🚀 Производительность: {performance:.2f} компаний/сек")
        print(f"✅ Успешность: {success_rate:.1f}%")
        print(f"📊 Среднее время ответа: {avg_response_time:.3f} сек")
        print(f"📊 P95 время ответа: {p95_response_time:.3f} сек")
        print(f"❌ Ошибки: {stats['errors']}")
        print(f"⏰ Таймауты: {stats['timeouts']}")
        print(f"🔄 Rate limits: {stats['rate_limits']}")
        print(f"👥 Воркеров: {max_workers}")
        print(f"📦 Батчей: {len(batches)}")
        print("=" * 60)
        
        os.makedirs('logs', exist_ok=True)
        with open('logs/performance_report.json', 'w', encoding='utf-8') as f:
            json.dump(report, f, ensure_ascii=False, indent=2)
        
        print(f"📁 Отчет сохранен: logs/performance_report.json")
        print("=" * 60)
        
        return report
        
    except Exception as e:
        logger.error(f"Optimized load test failed: {e}")
        raise

if __name__ == "__main__":
    import random
    
    if len(sys.argv) != 2:
        print("Usage: python optimized_load_test.py <inn_file>")
        sys.exit(1)
    
    inn_file = sys.argv[1]
    run_optimized_load_test(inn_file)
