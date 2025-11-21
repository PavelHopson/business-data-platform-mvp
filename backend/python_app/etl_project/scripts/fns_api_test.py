import sys
import os
import asyncio
import aiohttp
import time
import json
import logging
from datetime import datetime
from typing import Dict, List, Any
import random

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class FNSAPITester:
    def __init__(self):
        self.results = {
            'total_requests': 0,
            'success': 0,
            'errors': 0,
            'timeouts': 0,
            'rate_limits': 0,
            'forbidden': 0,
            'response_times': [],
            'start_time': None,
            'end_time': None
        }
        self.api_key = '1a146f7e6f9942181e2352e63c71402d207f0248'

    async def test_fns_api(self, session: aiohttp.ClientSession, inn: str) -> Dict[str, Any]:
        url = f"https://api-fns.ru/api/egr?req={inn}&key={self.api_key}"
        
        try:
            start_time = time.time()
            async with session.get(url, timeout=aiohttp.ClientTimeout(total=30)) as response:
                response_time = time.time() - start_time
                
                if response.status == 200:
                    self.results['success'] += 1
                    self.results['response_times'].append(response_time)
                    return {
                        'inn': inn,
                        'status': 'success',
                        'response_time': response_time,
                        'status_code': response.status
                    }
                elif response.status == 403:
                    self.results['forbidden'] += 1
                    return {
                        'inn': inn,
                        'status': 'forbidden',
                        'response_time': response_time,
                        'status_code': response.status
                    }
                elif response.status == 429:
                    self.results['rate_limits'] += 1
                    return {
                        'inn': inn,
                        'status': 'rate_limit',
                        'response_time': response_time,
                        'status_code': response.status
                    }
                else:
                    self.results['errors'] += 1
                    return {
                        'inn': inn,
                        'status': 'error',
                        'response_time': response_time,
                        'status_code': response.status
                    }
        except asyncio.TimeoutError:
            self.results['timeouts'] += 1
            return {
                'inn': inn,
                'status': 'timeout',
                'response_time': 30.0,
                'status_code': 0
            }
        except Exception as e:
            self.results['errors'] += 1
            return {
                'inn': inn,
                'status': 'exception',
                'response_time': 0.0,
                'status_code': 0,
                'error': str(e)
            }

    async def run_test(self, inn_list: List[str], concurrent_requests: int = 20):
        self.results['start_time'] = time.time()
        self.results['total_requests'] = len(inn_list)
        
        print("=" * 80)
        print("FNS API TEST")
        print("=" * 80)
        print(f"Companies: {len(inn_list)}")
        print(f"Concurrent: {concurrent_requests}")
        print(f"API: FNS")
        print("=" * 80)
        
        connector = aiohttp.TCPConnector(limit=concurrent_requests, limit_per_host=concurrent_requests)
        timeout = aiohttp.ClientTimeout(total=30)
        
        async with aiohttp.ClientSession(connector=connector, timeout=timeout) as session:
            semaphore = asyncio.Semaphore(concurrent_requests)
            
            async def test_single_inn(inn: str):
                async with semaphore:
                    return await self.test_fns_api(session, inn)
            
            tasks = [test_single_inn(inn) for inn in inn_list]
            results = await asyncio.gather(*tasks, return_exceptions=True)
        
        self.results['end_time'] = time.time()

    def generate_report(self) -> Dict[str, Any]:
        duration = self.results['end_time'] - self.results['start_time'] if self.results['end_time'] and self.results['start_time'] else 0
        success_rate = (self.results['success'] / self.results['total_requests'] * 100) if self.results['total_requests'] > 0 else 0
        
        avg_response_time = sum(self.results['response_times']) / len(self.results['response_times']) if self.results['response_times'] else 0
        p95_response_time = sorted(self.results['response_times'])[int(len(self.results['response_times']) * 0.95)] if self.results['response_times'] else 0
        
        performance = self.results['total_requests'] / duration if duration > 0 else 0
        
        report = {
            'test_info': {
                'start_time': datetime.fromtimestamp(self.results['start_time']).isoformat() if self.results['start_time'] else None,
                'end_time': datetime.fromtimestamp(self.results['end_time']).isoformat() if self.results['end_time'] else None,
                'duration_seconds': round(duration, 2),
                'total_requests': self.results['total_requests'],
                'performance_requests_per_second': round(performance, 2)
            },
            'results': {
                'success_rate_percent': round(success_rate, 2),
                'total_success': self.results['success'],
                'total_errors': self.results['errors'],
                'timeouts': self.results['timeouts'],
                'rate_limits': self.results['rate_limits'],
                'forbidden': self.results['forbidden']
            },
            'performance': {
                'avg_response_time_seconds': round(avg_response_time, 3),
                'p95_response_time_seconds': round(p95_response_time, 3),
                'min_response_time_seconds': round(min(self.results['response_times']), 3) if self.results['response_times'] else 0,
                'max_response_time_seconds': round(max(self.results['response_times']), 3) if self.results['response_times'] else 0
            },
            'recommendations': self.generate_recommendations(success_rate, avg_response_time, performance)
        }
        
        return report

    def generate_recommendations(self, success_rate: float, avg_response_time: float, performance: float) -> List[str]:
        recommendations = []
        
        if success_rate < 70:
            recommendations.append("🔴 КРИТИЧНО: Низкая успешность FNS API - проверьте API ключ и лимиты")
        elif success_rate < 85:
            recommendations.append("🟡 ВНИМАНИЕ: Успешность FNS API ниже оптимальной - мониторьте API")
        else:
            recommendations.append("✅ ОТЛИЧНО: FNS API работает стабильно")
        
        if avg_response_time > 2.0:
            recommendations.append("🟡 ВНИМАНИЕ: Медленные ответы FNS API - проверьте сеть")
        elif avg_response_time < 0.5:
            recommendations.append("✅ ОТЛИЧНО: Быстрые ответы FNS API")
        
        if performance < 5:
            recommendations.append("🟡 ВНИМАНИЕ: Низкая производительность - увеличьте параллельность")
        elif performance > 15:
            recommendations.append("✅ ОТЛИЧНО: Высокая производительность")
        
        return recommendations

    def print_summary(self, report: Dict[str, Any]):
        print("\n" + "=" * 80)
        print("FNS API TEST REPORT")
        print("=" * 80)
        print(f"Total requests: {report['test_info']['total_requests']}")
        print(f"Duration: {report['test_info']['duration_seconds']} sec")
        print(f"Performance: {report['test_info']['performance_requests_per_second']} req/sec")
        print(f"Success rate: {report['results']['success_rate_percent']}%")
        print(f"Avg response: {report['performance']['avg_response_time_seconds']} sec")
        print(f"P95 response: {report['performance']['p95_response_time_seconds']} sec")
        print(f"Errors: {report['results']['total_errors']}")
        print(f"Timeouts: {report['results']['timeouts']}")
        print(f"Rate limits: {report['results']['rate_limits']}")
        print(f"Forbidden: {report['results']['forbidden']}")
        
        print(f"\nRecommendations:")
        for i, rec in enumerate(report['recommendations'], 1):
            print(f"   {i}. {rec}")
        
        print("=" * 80)

async def main():
    if len(sys.argv) < 2:
        print("Использование: python fns_api_test.py <inn_file> [concurrent_requests]")
        sys.exit(1)
    
    inn_file = sys.argv[1]
    concurrent_requests = int(sys.argv[2]) if len(sys.argv) > 2 else 20
    
    try:
        with open(inn_file, 'r', encoding='utf-8') as f:
            inn_list = [line.strip() for line in f if line.strip()]
        
        tester = FNSAPITester()
        await tester.run_test(inn_list, concurrent_requests)
        report = tester.generate_report()
        tester.print_summary(report)
        
        os.makedirs('logs', exist_ok=True)
        with open('logs/fns_api_test_report.json', 'w', encoding='utf-8') as f:
            json.dump(report, f, ensure_ascii=False, indent=2)
        
        print(f"\n📁 Полный отчет сохранен: logs/fns_api_test_report.json")
        
    except Exception as e:
        logger.error(f"Ошибка при тестировании FNS API: {e}")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())
