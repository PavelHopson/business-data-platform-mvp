
import asyncio
import random
import time
import logging
from datetime import datetime
from pathlib import Path
import json
import aiohttp
from typing import Dict, List, Any

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("api-stability-test")

class APIStabilityTester:
    def __init__(self):
        self.stats = {
            'start_time': datetime.now(),
            'total_requests': 0,
            'successful_requests': 0,
            'failed_requests': 0,
            'timeout_requests': 0,
            'connection_errors': 0,
            'rate_limit_errors': 0,
            'server_errors': 0,
            'response_times': [],
            'error_types': {},
            'circuit_breaker_activations': 0
        }
        self.circuit_breaker_failures = 0
        self.circuit_breaker_threshold = 5
        self.circuit_breaker_timeout = 30
        self.circuit_breaker_last_failure = None
        self.circuit_breaker_state = 'CLOSED'
    
    def update_circuit_breaker(self, success: bool):
        if success:
            if self.circuit_breaker_state == 'HALF_OPEN':
                self.circuit_breaker_state = 'CLOSED'
                self.circuit_breaker_failures = 0
        else:
            self.circuit_breaker_failures += 1
            self.circuit_breaker_last_failure = time.time()
            
            if self.circuit_breaker_failures >= self.circuit_breaker_threshold:
                self.circuit_breaker_state = 'OPEN'
                self.stats['circuit_breaker_activations'] += 1
                logger.warning(f"Circuit breaker activated after {self.circuit_breaker_failures} failures")
    
    def check_circuit_breaker(self):
        if self.circuit_breaker_state == 'OPEN':
            if time.time() - self.circuit_breaker_last_failure > self.circuit_breaker_timeout:
                self.circuit_breaker_state = 'HALF_OPEN'
                logger.info("Circuit breaker moved to HALF_OPEN state")
                return True
            return False
        return True
    
    async def simulate_api_call(self, inn: str, session: aiohttp.ClientSession) -> Dict[str, Any]:
        if not self.check_circuit_breaker():
            raise Exception("Circuit breaker is OPEN")
        
        request_start = time.time()
        
        try:
            await asyncio.sleep(random.uniform(0.1, 0.8))
            
            response_scenario = random.random()
            
            if response_scenario < 0.75:
                self.stats['successful_requests'] += 1
                self.update_circuit_breaker(True)
                return {
                    "inn": inn,
                    "status": "success",
                    "response_time": time.time() - request_start,
                    "data": {"name": f"Company {inn}", "revenue": random.randint(100000, 10000000)}
                }
            elif response_scenario < 0.85:
                self.stats['timeout_requests'] += 1
                self.update_circuit_breaker(False)
                raise asyncio.TimeoutError("Request timeout")
            elif response_scenario < 0.90:
                self.stats['connection_errors'] += 1
                self.update_circuit_breaker(False)
                raise aiohttp.ClientConnectionError("Connection failed")
            elif response_scenario < 0.95:
                self.stats['rate_limit_errors'] += 1
                self.update_circuit_breaker(False)
                raise Exception("Rate limit exceeded")
            else:
                self.stats['server_errors'] += 1
                self.update_circuit_breaker(False)
                raise Exception("Server error 500")
                
        except Exception as e:
            error_type = type(e).__name__
            if error_type not in self.stats['error_types']:
                self.stats['error_types'][error_type] = 0
            self.stats['error_types'][error_type] += 1
            
            self.stats['failed_requests'] += 1
            self.stats['response_times'].append(time.time() - request_start)
            self.stats['total_requests'] += 1
            
            raise e
    
    async def run_stability_test(self, inn_list_path: str, duration_minutes: int = 10):
        logger.info(f"🚀 Starting API stability test for {duration_minutes} minutes")
        
        try:
            with open(inn_list_path, 'r') as f:
                inns = [line.strip() for line in f if line.strip()]
        except FileNotFoundError:
            logger.error(f"❌ File {inn_list_path} not found")
            return
        
        end_time = time.time() + (duration_minutes * 60)
        
        async with aiohttp.ClientSession(
            timeout=aiohttp.ClientTimeout(total=30),
            connector=aiohttp.TCPConnector(limit=100, limit_per_host=30)
        ) as session:
            
            batch_size = 15
            batch_delay = 0.2
            
            while time.time() < end_time:
                batch = random.sample(inns, min(batch_size, len(inns)))
                
                tasks = []
                for inn in batch:
                    task = asyncio.create_task(self.simulate_api_call(inn, session))
                    tasks.append(task)
                
                results = await asyncio.gather(*tasks, return_exceptions=True)
                
                for result in results:
                    if isinstance(result, Exception):
                        logger.error(f"❌ {type(result).__name__}: {str(result)}")
                    else:
                        self.stats['response_times'].append(result['response_time'])
                        logger.info(f"✅ Success: {result['inn']} ({result['response_time']:.3f}s)")
                
                self.stats['total_requests'] += len(batch)
                
                elapsed = (time.time() - self.stats['start_time'].timestamp()) / 60
                success_rate = (self.stats['successful_requests'] / self.stats['total_requests']) * 100 if self.stats['total_requests'] > 0 else 0
                
                logger.info(f"📊 Progress: {elapsed:.1f}min, {self.stats['total_requests']} requests, {success_rate:.1f}% success, Circuit: {self.circuit_breaker_state}")
                
                await asyncio.sleep(batch_delay)
                
                if self.circuit_breaker_state == 'OPEN':
                    logger.warning("⏸️  Circuit breaker OPEN - waiting for recovery")
                    await asyncio.sleep(5)
    
    def generate_stability_report(self) -> Dict[str, Any]:
        duration = (datetime.now() - self.stats['start_time']).total_seconds()
        
        if self.stats['response_times']:
            avg_response_time = sum(self.stats['response_times']) / len(self.stats['response_times'])
            p95_response_time = sorted(self.stats['response_times'])[int(len(self.stats['response_times']) * 0.95)]
            p99_response_time = sorted(self.stats['response_times'])[int(len(self.stats['response_times']) * 0.99)]
        else:
            avg_response_time = p95_response_time = p99_response_time = 0
        
        success_rate = (self.stats['successful_requests'] / self.stats['total_requests']) * 100 if self.stats['total_requests'] > 0 else 0
        requests_per_minute = (self.stats['total_requests'] / duration) * 60 if duration > 0 else 0
        
        stability_score = self.calculate_stability_score()
        
        report = {
            "test_summary": {
                "test_duration_minutes": duration / 60,
                "total_requests": self.stats['total_requests'],
                "requests_per_minute": round(requests_per_minute, 2),
                "success_rate_percent": round(success_rate, 2),
                "stability_score": round(stability_score, 2)
            },
            "performance_metrics": {
                "avg_response_time_seconds": round(avg_response_time, 3),
                "p95_response_time_seconds": round(p95_response_time, 3),
                "p99_response_time_seconds": round(p99_response_time, 3),
                "successful_requests": self.stats['successful_requests'],
                "failed_requests": self.stats['failed_requests']
            },
            "error_analysis": {
                "timeout_requests": self.stats['timeout_requests'],
                "connection_errors": self.stats['connection_errors'],
                "rate_limit_errors": self.stats['rate_limit_errors'],
                "server_errors": self.stats['server_errors'],
                "error_types_distribution": self.stats['error_types']
            },
            "circuit_breaker_metrics": {
                "activations": self.stats['circuit_breaker_activations'],
                "current_state": self.circuit_breaker_state,
                "failure_threshold": self.circuit_breaker_threshold,
                "recovery_timeout": self.circuit_breaker_timeout
            },
            "recommendations": self.generate_recommendations(),
            "test_timestamp": datetime.now().isoformat()
        }
        
        report_file = Path("logs/api_stability_report.json")
        report_file.parent.mkdir(exist_ok=True)
        
        with open(report_file, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
        
        return report
    
    def calculate_stability_score(self) -> float:
        if self.stats['total_requests'] == 0:
            return 0.0
        
        success_rate = self.stats['successful_requests'] / self.stats['total_requests']
        error_penalty = sum(self.stats['error_types'].values()) / self.stats['total_requests']
        circuit_breaker_penalty = self.stats['circuit_breaker_activations'] * 0.1
        
        stability_score = (success_rate - error_penalty - circuit_breaker_penalty) * 100
        return max(0, min(100, stability_score))
    
    def generate_recommendations(self) -> List[str]:
        recommendations = []
        
        if self.stats['timeout_requests'] > self.stats['total_requests'] * 0.1:
            recommendations.append("Consider increasing timeout values for API calls")
        
        if self.stats['connection_errors'] > self.stats['total_requests'] * 0.05:
            recommendations.append("Review network connectivity and connection pooling")
        
        if self.stats['rate_limit_errors'] > self.stats['total_requests'] * 0.02:
            recommendations.append("Implement rate limiting and request throttling")
        
        if self.stats['circuit_breaker_activations'] > 0:
            recommendations.append("Circuit breaker activated - review API reliability")
        
        if len(self.stats['response_times']) > 0:
            avg_time = sum(self.stats['response_times']) / len(self.stats['response_times'])
            if avg_time > 2.0:
                recommendations.append("API response times are slow - consider optimization")
        
        if not recommendations:
            recommendations.append("API stability is good - no immediate concerns")
        
        return recommendations

async def main():
    tester = APIStabilityTester()
    
    import sys
    inn_file = sys.argv[1] if len(sys.argv) > 1 else "input/inn_list_load_test.txt"
    duration = int(sys.argv[2]) if len(sys.argv) > 2 else 10
    
    await tester.run_stability_test(inn_file, duration)
    
    report = tester.generate_stability_report()
    
    print("\n" + "="*70)
    print("📊 ОТЧЕТ ПО СТАБИЛЬНОСТИ API СОЕДИНЕНИЙ")
    print("="*70)
    print(f"⏱️  Длительность теста: {report['test_summary']['test_duration_minutes']:.1f} мин")
    print(f"📈 Всего запросов: {report['test_summary']['total_requests']}")
    print(f"🚀 Запросов в минуту: {report['test_summary']['requests_per_minute']:.1f}")
    print(f"✅ Успешность: {report['test_summary']['success_rate_percent']:.1f}%")
    print(f"🎯 Оценка стабильности: {report['test_summary']['stability_score']:.1f}/100")
    print(f"📊 Среднее время ответа: {report['performance_metrics']['avg_response_time_seconds']:.3f}s")
    print(f"📊 P95 время ответа: {report['performance_metrics']['p95_response_time_seconds']:.3f}s")
    print(f"⏰ Таймауты: {report['error_analysis']['timeout_requests']}")
    print(f"🔌 Ошибки соединения: {report['error_analysis']['connection_errors']}")
    print(f"🚫 Rate limit ошибки: {report['error_analysis']['rate_limit_errors']}")
    print(f"⚡ Активации Circuit Breaker: {report['circuit_breaker_metrics']['activations']}")
    print("="*70)
    print("💡 РЕКОМЕНДАЦИИ:")
    for rec in report['recommendations']:
        print(f"   • {rec}")
    print("="*70)
    print(f"📁 Полный отчет: logs/api_stability_report.json")

if __name__ == "__main__":
    asyncio.run(main())
