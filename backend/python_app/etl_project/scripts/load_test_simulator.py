
import asyncio
import random
import time
import logging
from datetime import datetime
from pathlib import Path
import json
import sys
import os

import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("etl-load-test")

async def send_critical_alert(message, data):
    logger.error(f"CRITICAL ALERT: {message} - {data}")

async def send_warning_alert(message, data):
    logger.warning(f"WARNING ALERT: {message} - {data}")

class LoadTestSimulator:
    def __init__(self):
        self.stats = {
            'start_time': datetime.now(),
            'companies_processed': 0,
            'success_count': 0,
            'error_count': 0,
            'timeout_count': 0,
            'total_duration': 0,
            'memory_usage': [],
            'response_times': []
        }
        
    def generate_mock_company_data(self, inn: str):
        return {
            "items": [{
                "ЮЛ": {
                    "ИНН": inn,
                    "ОГРН": f"10{inn[:2]}{random.randint(1000000, 9999999)}",
                    "НаимПолнЮЛ": f"ОБЩЕСТВО С ОГРАНИЧЕННОЙ ОТВЕТСТВЕННОСТЬЮ \"ТЕСТОВАЯ КОМПАНИЯ {inn}\"",
                    "НаимСокрЮЛ": f"ООО \"ТЕСТ-{inn[:4]}\"",
                    "Статус": random.choice(["Действующее", "Ликвидированное", "В процессе ликвидации"]),
                    "Адрес": {
                        "АдресПолн": f"г. Москва, ул. Тестовая, д. {random.randint(1, 100)}"
                    },
                    "ДатаРег": f"{random.randint(2010, 2023)}-{random.randint(1, 12):02d}-{random.randint(1, 28):02d}",
                    "Учредители": [
                        {
                            "Наим": f"Учредитель {random.randint(1, 5)}",
                            "Доля": {"Процент": random.randint(10, 90)}
                        }
                    ]
                }
            }]
        }
    
    async def simulate_api_call(self, inn: str):
        start_time = time.time()
        
        response_time = random.uniform(0.1, 2.0)
        await asyncio.sleep(response_time)
        
        response_scenario = random.random()
        
        if response_scenario < 0.85:
            data = self.generate_mock_company_data(inn)
            logger.info(f"Mock API success for INN {inn}", extra={
                "event_type": "etl_mock_api_success",
                "inn": inn,
                "response_time": response_time,
                "service": "etl"
            })
            self.stats['success_count'] += 1
            
        elif response_scenario < 0.95:
            logger.error(f"Mock API error for INN {inn}", extra={
                "event_type": "etl_mock_api_error",
                "inn": inn,
                "response_time": response_time,
                "service": "etl"
            })
            self.stats['error_count'] += 1
            data = None
            
        else:
            logger.error(f"Mock API timeout for INN {inn}", extra={
                "event_type": "etl_mock_api_timeout",
                "inn": inn,
                "response_time": response_time,
                "service": "etl"
            })
            self.stats['timeout_count'] += 1
            data = None
        
        actual_time = time.time() - start_time
        self.stats['response_times'].append(actual_time)
        
        return data
    
    async def process_companies_batch(self, inn_list: list, batch_size: int = 10):
        
        logger.info(f"Starting batch processing of {len(inn_list)} companies", extra={
            "event_type": "etl_batch_start",
            "total_companies": len(inn_list),
            "batch_size": batch_size,
            "service": "etl"
        })
        
        for i in range(0, len(inn_list), batch_size):
            batch = inn_list[i:i + batch_size]
            
            tasks = []
            for inn in batch:
                task = asyncio.create_task(self.simulate_api_call(inn))
                tasks.append(task)
            
            results = await asyncio.gather(*tasks, return_exceptions=True)
            
            for result in results:
                if not isinstance(result, Exception):
                    self.stats['companies_processed'] += 1
            
            logger.info(f"Processed batch {i//batch_size + 1}", extra={
                "event_type": "etl_batch_complete",
                "batch_number": i//batch_size + 1,
                "batch_size": len(batch),
                "total_processed": self.stats['companies_processed'],
                "service": "etl"
            })
            
            await asyncio.sleep(0.5)
    
    def generate_performance_report(self):
        
        duration = (datetime.now() - self.stats['start_time']).total_seconds()
        self.stats['total_duration'] = duration
        
        if self.stats['response_times']:
            avg_response_time = sum(self.stats['response_times']) / len(self.stats['response_times'])
            min_response_time = min(self.stats['response_times'])
            max_response_time = max(self.stats['response_times'])
        else:
            avg_response_time = min_response_time = max_response_time = 0
        
        success_rate = (self.stats['success_count'] / self.stats['companies_processed'] * 100) if self.stats['companies_processed'] > 0 else 0
        companies_per_second = self.stats['companies_processed'] / duration if duration > 0 else 0
        
        report = {
            "test_summary": {
                "total_companies": self.stats['companies_processed'],
                "duration_seconds": duration,
                "companies_per_second": round(companies_per_second, 2),
                "success_rate_percent": round(success_rate, 2)
            },
            "performance_metrics": {
                "avg_response_time_seconds": round(avg_response_time, 3),
                "min_response_time_seconds": round(min_response_time, 3),
                "max_response_time_seconds": round(max_response_time, 3),
                "success_count": self.stats['success_count'],
                "error_count": self.stats['error_count'],
                "timeout_count": self.stats['timeout_count']
            },
            "test_timestamp": datetime.now().isoformat()
        }
        
        report_file = Path("logs/performance_report.json")
        report_file.parent.mkdir(exist_ok=True)
        
        with open(report_file, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
        
        logger.info(f"Load test completed", extra={
            "event_type": "etl_load_test_complete",
            "service": "etl",
            **report["test_summary"],
            **report["performance_metrics"]
        })
        
        return report
    
    async def run_load_test(self, inn_file: str = "input/inn_list_load_test.txt"):
        
        logger.info("Starting ETL load test simulation", extra={
            "event_type": "etl_load_test_start",
            "service": "etl",
            "inn_file": inn_file
        })
        
        try:
            inn_path = Path(inn_file)
            if not inn_path.exists():
                logger.error(f"INN file not found: {inn_file}")
                return
            
            with open(inn_path, 'r', encoding='utf-8') as f:
                inn_list = [line.strip() for line in f if line.strip()]
            
            logger.info(f"Loaded {len(inn_list)} companies for load testing", extra={
                "event_type": "etl_companies_loaded",
                "service": "etl",
                "count": len(inn_list)
            })
            
            await self.process_companies_batch(inn_list, batch_size=20)
            
            report = self.generate_performance_report()
            
            if self.stats['error_count'] > 0:
                await send_warning_alert(
                    f"ETL Load Test completed with {self.stats['error_count']} errors",
                    report["test_summary"]
                )
            else:
                logger.info("ETL Load Test completed successfully", extra={
                    "event_type": "etl_load_test_success",
                    "service": "etl"
                })
            
            print("\n" + "="*50)
            print("📊 ОТЧЕТ ПО НАГРУЗОЧНОМУ ТЕСТИРОВАНИЮ ETL")
            print("="*50)
            print(f"📈 Обработано компаний: {report['test_summary']['total_companies']}")
            print(f"⏱️  Время выполнения: {report['test_summary']['duration_seconds']:.1f} сек")
            print(f"🚀 Производительность: {report['test_summary']['companies_per_second']:.2f} компаний/сек")
            print(f"✅ Успешность: {report['test_summary']['success_rate_percent']:.1f}%")
            print(f"📊 Среднее время ответа: {report['performance_metrics']['avg_response_time_seconds']:.3f} сек")
            print(f"❌ Ошибки: {report['performance_metrics']['error_count']}")
            print(f"⏰ Таймауты: {report['performance_metrics']['timeout_count']}")
            print(f"📁 Отчет сохранен: logs/performance_report.json")
            print("="*50)
            
        except Exception as e:
            logger.error(f"Load test failed: {str(e)}", extra={
                "event_type": "etl_load_test_failed",
                "service": "etl"
            })
            await send_critical_alert(
                "ETL Load Test Failed",
                {"error": str(e), "stats": self.stats}
            )
            raise

async def main():
    simulator = LoadTestSimulator()
    
    inn_file = "input/inn_list_load_test.txt"
    if len(sys.argv) > 1:
        inn_file = sys.argv[1]
    
    await simulator.run_load_test(inn_file)

if __name__ == "__main__":
    asyncio.run(main())
