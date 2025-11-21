#!/usr/bin/env python3
"""
Простой скрипт для тестирования алертов
"""

import requests
import time
import sys

def test_url(url, name):
    """Тестирует доступность URL"""
    try:
        response = requests.get(url, timeout=5)
        if response.status_code == 200:
            print(f"✅ {name}: Доступен")
            return True
        else:
            print(f"❌ {name}: Ошибка {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ {name}: Недоступен - {e}")
        return False

def main():
    print("🧪 ТЕСТИРОВАНИЕ СИСТЕМЫ АЛЕРТОВ")
    print("=" * 50)
    
    # Тестируем компоненты
    services = [
        ("http://91.218.230.151:3002/api/health", "Grafana"),
        ("http://91.218.230.151:9090/-/healthy", "Prometheus"),
        ("http://91.218.230.151:9093/-/healthy", "Alertmanager"),
        ("http://91.218.230.151:8000/health", "Backend"),
        ("http://91.218.230.151:9100/metrics", "Node Exporter"),
    ]
    
    results = []
    for url, name in services:
        results.append(test_url(url, name))
        time.sleep(1)
    
    print("\n" + "=" * 50)
    print("📊 РЕЗУЛЬТАТЫ:")
    
    if all(results):
        print("🎉 Все сервисы работают!")
        print("\n📋 ДАШБОРДЫ GRAFANA:")
        print("- Node Exporter: http://91.218.230.151:3002/d/node-exporter-full")
        print("- Backend Monitoring: http://91.218.230.151:3002/d/backend-monitoring")
        print("- ETL Performance: http://91.218.230.151:3002/d/etl-performance")
        print("- Log Search: http://91.218.230.151:3002/d/log-search")
        
        print("\n🚨 АЛЕРТЫ:")
        print("- Grafana Alerts: http://91.218.230.151:3002/alerting/list")
        print("- Prometheus Alerts: http://91.218.230.151:9090/alerts")
        print("- Alertmanager: http://91.218.230.151:9093")
        
        print("\n🧪 ТЕСТИРОВАНИЕ:")
        print("1. Откройте Grafana и перейдите в Alerting → Alert rules")
        print("2. Проверьте, что алерты настроены для ваших метрик")
        print("3. Остановите backend контейнер для тестирования алерта BackendDown")
        
    else:
        print("⚠️ Есть проблемы с некоторыми сервисами")
        return 1
    
    return 0

if __name__ == "__main__":
    sys.exit(main())
