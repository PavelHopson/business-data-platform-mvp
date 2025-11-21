
import json
import os
from datetime import datetime
from pathlib import Path

def generate_simple_report():
    report_file = Path("logs/performance_report.json")
    
    if not report_file.exists():
        print("❌ Отчет не найден. Сначала запустите нагрузочное тестирование.")
        return
    
    try:
        with open(report_file, 'r', encoding='utf-8') as f:
            report = json.load(f)
        
        print("\n" + "="*60)
        print("📊 ОТЧЕТ ПО ПРОИЗВОДИТЕЛЬНОСТИ ETL СИСТЕМЫ")
        print("="*60)
        print(f"📅 Дата генерации: {report.get('test_timestamp', 'Неизвестно')}")
        print(f"📈 Обработано компаний: {report['test_summary']['total_companies']}")
        print(f"✅ Успешность: {report['test_summary']['success_rate_percent']}%")
        print(f"⏱️  Время выполнения: {report['test_summary']['duration_seconds']:.1f} сек")
        print(f"🚀 Производительность: {report['test_summary']['companies_per_second']:.2f} компаний/сек")
        print(f"📊 Среднее время ответа: {report['performance_metrics']['avg_response_time_seconds']:.3f} сек")
        print(f"📊 P95 время ответа: {report['performance_metrics']['max_response_time_seconds']:.3f} сек")
        print(f"❌ Общее количество ошибок: {report['performance_metrics']['error_count']}")
        print(f"⏰ Таймауты: {report['performance_metrics']['timeout_count']}")
        print("="*60)
        
        if report['performance_metrics']['error_count'] > 0:
            print("\n⚠️  РЕКОМЕНДАЦИИ:")
            print("- Проверьте стабильность API соединений")
            print("- Рассмотрите увеличение timeout значений")
            print("- Оптимизируйте количество воркеров и размер батчей")
        else:
            print("\n✅ Все тесты прошли успешно!")
            
        success_rate = report['test_summary']['success_rate_percent']
        performance = report['test_summary']['companies_per_second']
        
        print(f"\n📊 АНАЛИЗ ПРОИЗВОДИТЕЛЬНОСТИ:")
        if success_rate >= 90:
            print("✅ Отличная стабильность системы")
        elif success_rate >= 80:
            print("🟡 Удовлетворительная стабильность")
        else:
            print("🔴 Требуется оптимизация стабильности")
            
        if performance >= 15:
            print("✅ Высокая производительность")
        elif performance >= 10:
            print("🟡 Средняя производительность")
        else:
            print("🔴 Низкая производительность - требуется оптимизация")
            
        print(f"\n📁 Полный отчет: {report_file}")
        
    except Exception as e:
        print(f"❌ Ошибка чтения отчета: {str(e)}")

if __name__ == "__main__":
    generate_simple_report()
