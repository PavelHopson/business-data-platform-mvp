

import json
import argparse
import sys
import os
from datetime import datetime, timedelta
from pathlib import Path
import requests
import asyncio

import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("etl-report-generator")

class PerformanceReportGenerator:
    def __init__(self, prometheus_url="http://prometheus:9090", grafana_url="http://grafana:3000"):
        self.prometheus_url = prometheus_url
        self.grafana_url = grafana_url
        self.report_data = {
            "generated_at": datetime.now().isoformat(),
            "test_period": {},
            "performance_metrics": {},
            "resource_usage": {},
            "error_analysis": {},
            "recommendations": []
        }
    
    def query_prometheus(self, query: str, time_range: str = "1h"):
        
        try:
            url = f"{self.prometheus_url}/api/v1/query"
            params = {
                'query': query,
                'time': datetime.now().isoformat()
            }
            
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            if data['status'] == 'success' and data['data']['result']:
                return data['data']['result'][0]['value'][1]
            return "0"
            
        except Exception as e:
            logger.error(f"Prometheus query failed: {str(e)}", extra={
                "event_type": "prometheus_query_error",
                "query": query,
                "error": str(e)
            })
            return "0"
    
    def collect_performance_metrics(self):
        
        logger.info("Collecting performance metrics from Prometheus", extra={
            "event_type": "etl_metrics_collection_start"
        })
        
        total_processed = self.query_prometheus('sum(etl_companies_processed_total)')
        
        success_count = self.query_prometheus('sum(etl_companies_processed_total{status="success"})')
        
        error_count = self.query_prometheus('sum(etl_companies_processed_total{status="error"})')
        
        avg_processing_time = self.query_prometheus('avg(etl_processing_duration_seconds)')
        
        p95_processing_time = self.query_prometheus('histogram_quantile(0.95, rate(etl_processing_duration_seconds_bucket[5m]))')
        
        processing_rate = self.query_prometheus('rate(etl_companies_processed_total[5m])')
        
        self.report_data["performance_metrics"] = {
            "total_companies_processed": int(float(total_processed)),
            "successful_processes": int(float(success_count)),
            "failed_processes": int(float(error_count)),
            "success_rate_percent": round((float(success_count) / float(total_processed) * 100) if float(total_processed) > 0 else 0, 2),
            "average_processing_time_seconds": round(float(avg_processing_time), 3),
            "p95_processing_time_seconds": round(float(p95_processing_time), 3),
            "processing_rate_per_second": round(float(processing_rate), 2)
        }
        
        logger.info("Performance metrics collected successfully", extra={
            "event_type": "etl_metrics_collection_success",
            **self.report_data["performance_metrics"]
        })
    
    def collect_resource_usage(self):
        
        logger.info("Collecting resource usage metrics", extra={
            "event_type": "etl_resource_metrics_start"
        })
        
        memory_usage = self.query_prometheus('etl_memory_usage_bytes')
        
        cpu_usage = self.query_prometheus('etl_cpu_usage_percent')
        
        queue_size = self.query_prometheus('etl_queue_size')
        
        active_jobs = self.query_prometheus('etl_active_jobs')
        
        self.report_data["resource_usage"] = {
            "memory_usage_bytes": int(float(memory_usage)),
            "memory_usage_mb": round(float(memory_usage) / (1024 * 1024), 2),
            "cpu_usage_percent": round(float(cpu_usage), 2),
            "queue_size": int(float(queue_size)),
            "active_jobs": int(float(active_jobs))
        }
        
        logger.info("Resource usage metrics collected", extra={
            "event_type": "etl_resource_metrics_success",
            **self.report_data["resource_usage"]
        })
    
    def analyze_errors(self):
        
        logger.info("Analyzing error patterns", extra={
            "event_type": "etl_error_analysis_start"
        })
        
        total_errors = self.query_prometheus('sum(etl_errors_total)')
        
        api_errors = self.query_prometheus('sum(etl_errors_total{error_type="api_error"})')
        timeout_errors = self.query_prometheus('sum(etl_errors_total{error_type="timeout_error"})')
        processing_errors = self.query_prometheus('sum(etl_errors_total{error_type="processing_error"})')
        
        self.report_data["error_analysis"] = {
            "total_errors": int(float(total_errors)),
            "api_errors": int(float(api_errors)),
            "timeout_errors": int(float(timeout_errors)),
            "processing_errors": int(float(processing_errors)),
            "error_rate_percent": round((float(total_errors) / max(float(self.report_data["performance_metrics"]["total_companies_processed"]), 1) * 100), 2)
        }
        
        logger.info("Error analysis completed", extra={
            "event_type": "etl_error_analysis_success",
            **self.report_data["error_analysis"]
        })
    
    def generate_recommendations(self):
        
        logger.info("Generating optimization recommendations", extra={
            "event_type": "etl_recommendations_start"
        })
        
        recommendations = []
        
        if self.report_data["performance_metrics"]["success_rate_percent"] < 90:
            recommendations.append({
                "category": "Reliability",
                "priority": "High",
                "issue": f"Low success rate: {self.report_data['performance_metrics']['success_rate_percent']}%",
                "recommendation": "Implement retry logic and improve error handling for API calls"
            })
        
        if self.report_data["performance_metrics"]["p95_processing_time_seconds"] > 5:
            recommendations.append({
                "category": "Performance",
                "priority": "Medium",
                "issue": f"Slow processing: P95 = {self.report_data['performance_metrics']['p95_processing_time_seconds']}s",
                "recommendation": "Optimize API calls, implement parallel processing, or increase timeout values"
            })
        
        if self.report_data["resource_usage"]["memory_usage_mb"] > 1000:
            recommendations.append({
                "category": "Resources",
                "priority": "Medium",
                "issue": f"High memory usage: {self.report_data['resource_usage']['memory_usage_mb']}MB",
                "recommendation": "Implement memory optimization, reduce batch sizes, or increase container memory limits"
            })
        
        if self.report_data["resource_usage"]["cpu_usage_percent"] > 70:
            recommendations.append({
                "category": "Resources",
                "priority": "Medium",
                "issue": f"High CPU usage: {self.report_data['resource_usage']['cpu_usage_percent']}%",
                "recommendation": "Optimize processing algorithms, implement caching, or increase CPU resources"
            })
        
        if self.report_data["error_analysis"]["error_rate_percent"] > 5:
            recommendations.append({
                "category": "Reliability",
                "priority": "High",
                "issue": f"High error rate: {self.report_data['error_analysis']['error_rate_percent']}%",
                "recommendation": "Review error logs, improve API reliability, implement circuit breaker pattern"
            })
        
        if self.report_data["performance_metrics"]["processing_rate_per_second"] < 1:
            recommendations.append({
                "category": "Performance",
                "priority": "Low",
                "issue": f"Low processing rate: {self.report_data['performance_metrics']['processing_rate_per_second']} companies/sec",
                "recommendation": "Consider implementing parallel processing or optimizing API endpoints"
            })
        
        self.report_data["recommendations"] = recommendations
        
        logger.info(f"Generated {len(recommendations)} recommendations", extra={
            "event_type": "etl_recommendations_success",
            "recommendations_count": len(recommendations)
        })
    
    def save_report(self, output_file: str):
        
        report_path = Path(output_file)
        report_path.parent.mkdir(parents=True, exist_ok=True)
        
        with open(report_path, 'w', encoding='utf-8') as f:
            json.dump(self.report_data, f, indent=2, ensure_ascii=False)
        
        logger.info(f"Performance report saved to {output_file}", extra={
            "event_type": "etl_report_saved",
            "output_file": output_file
        })
        
        return report_path
    
    def print_summary(self):
        
        print("\n" + "="*60)
        print("📊 ОТЧЕТ ПО ПРОИЗВОДИТЕЛЬНОСТИ ETL СИСТЕМЫ")
        print("="*60)
        print(f"📅 Дата генерации: {self.report_data['generated_at']}")
        print(f"📈 Обработано компаний: {self.report_data['performance_metrics']['total_companies_processed']}")
        print(f"✅ Успешность: {self.report_data['performance_metrics']['success_rate_percent']}%")
        print(f"⏱️  Среднее время обработки: {self.report_data['performance_metrics']['average_processing_time_seconds']}s")
        print(f"📊 P95 время обработки: {self.report_data['performance_metrics']['p95_processing_time_seconds']}s")
        print(f"🚀 Скорость обработки: {self.report_data['performance_metrics']['processing_rate_per_second']} компаний/сек")
        print(f"🧠 Использование памяти: {self.report_data['resource_usage']['memory_usage_mb']}MB")
        print(f"💻 Использование CPU: {self.report_data['resource_usage']['cpu_usage_percent']}%")
        print(f"❌ Общее количество ошибок: {self.report_data['error_analysis']['total_errors']}")
        print(f"📋 Рекомендаций: {len(self.report_data['recommendations'])}")
        print("="*60)
        
        if self.report_data['recommendations']:
            print("\n🔧 КЛЮЧЕВЫЕ РЕКОМЕНДАЦИИ:")
            for i, rec in enumerate(self.report_data['recommendations'][:3], 1):
                print(f"{i}. [{rec['priority']}] {rec['recommendation']}")
            print("="*60)

def main():
    parser = argparse.ArgumentParser(description='Генератор отчета по производительности ETL')
    parser.add_argument('--prometheus-url', type=str, default='http://prometheus:9090',
                       help='URL Prometheus сервера')
    parser.add_argument('--output', type=str, default='logs/performance_report.json',
                       help='Путь к выходному файлу отчета')
    parser.add_argument('--format', type=str, choices=['json', 'html'], default='json',
                       help='Формат отчета')
    
    args = parser.parse_args()
    
    logger.info("Starting ETL performance report generation", extra={
        "event_type": "etl_report_start",
        "prometheus_url": args.prometheus_url,
        "output_file": args.output
    })
    
    try:
        generator = PerformanceReportGenerator(prometheus_url=args.prometheus_url)
        
        generator.collect_performance_metrics()
        generator.collect_resource_usage()
        generator.analyze_errors()
        generator.generate_recommendations()
        
        output_path = generator.save_report(args.output)
        
        generator.print_summary()
        
        logger.info("ETL performance report generated successfully", extra={
            "event_type": "etl_report_success",
            "output_file": str(output_path)
        })
        
        print(f"\n✅ Отчет сохранен: {output_path}")
        print(f"📊 Для просмотра в Grafana: http://91.218.230.151:3002")
        
    except Exception as e:
        logger.error(f"Failed to generate performance report: {str(e)}", extra={
            "event_type": "etl_report_error",
            "error": str(e)
        })
        print(f"❌ Ошибка генерации отчета: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()
