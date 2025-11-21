#!/usr/bin/env python3
"""
Скрипт для тестирования алертов Grafana
Проверяет существующие метрики и создает тестовые алерты
"""

import requests
import json
import time
import sys
from datetime import datetime

# Конфигурация
PROMETHEUS_URL = "http://91.218.230.151:9090"
GRAFANA_URL = "http://91.218.230.151:3002"
ALERTMANAGER_URL = "http://91.218.230.151:9093"

def test_prometheus_metrics():
    """Тестирует доступность метрик в Prometheus"""
    print("🔍 Проверка метрик в Prometheus...")
    
    try:
        # Проверяем доступность Prometheus
        response = requests.get(f"{PROMETHEUS_URL}/api/v1/status/config", timeout=10)
        if response.status_code == 200:
            print("✅ Prometheus доступен")
        else:
            print(f"❌ Prometheus недоступен: {response.status_code}")
            return False
            
        # Проверяем метрики
        metrics_to_check = [
            "node_cpu_seconds_total",
            "node_memory_MemTotal_bytes", 
            "node_filesystem_size_bytes",
            "up{job=\"backend-api\"}",
            "up{job=\"node-exporter\"}"
        ]
        
        for metric in metrics_to_check:
            try:
                response = requests.get(
                    f"{PROMETHEUS_URL}/api/v1/query",
                    params={"query": metric},
                    timeout=10
                )
                if response.status_code == 200:
                    data = response.json()
                    if data["data"]["result"]:
                        print(f"✅ Метрика {metric} найдена")
                    else:
                        print(f"⚠️ Метрика {metric} не найдена")
                else:
                    print(f"❌ Ошибка запроса метрики {metric}: {response.status_code}")
            except Exception as e:
                print(f"❌ Ошибка при проверке метрики {metric}: {e}")
                
        return True
        
    except Exception as e:
        print(f"❌ Ошибка подключения к Prometheus: {e}")
        return False

def test_grafana_alerts():
    """Тестирует алерты в Grafana"""
    print("\n🔍 Проверка алертов в Grafana...")
    
    try:
        # Проверяем доступность Grafana
        response = requests.get(f"{GRAFANA_URL}/api/health", timeout=10)
        if response.status_code == 200:
            print("✅ Grafana доступен")
        else:
            print(f"❌ Grafana недоступен: {response.status_code}")
            return False
            
        # Проверяем алерты
        response = requests.get(f"{GRAFANA_URL}/api/ruler/grafana/api/v1/rules", timeout=10)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Найдено {len(data)} групп алертов")
            
            for group_name, group_data in data.items():
                print(f"  📁 Группа: {group_name}")
                for rule in group_data:
                    print(f"    📋 Правило: {rule.get('name', 'Unknown')}")
                    print(f"    📊 Состояние: {rule.get('state', 'Unknown')}")
        else:
            print(f"❌ Ошибка получения алертов: {response.status_code}")
            
        return True
        
    except Exception as e:
        print(f"❌ Ошибка подключения к Grafana: {e}")
        return False

def test_alertmanager():
    """Тестирует Alertmanager"""
    print("\n🔍 Проверка Alertmanager...")
    
    try:
        # Проверяем доступность Alertmanager
        response = requests.get(f"{ALERTMANAGER_URL}/api/v1/status", timeout=10)
        if response.status_code == 200:
            print("✅ Alertmanager доступен")
        else:
            print(f"❌ Alertmanager недоступен: {response.status_code}")
            return False
            
        # Проверяем активные алерты
        response = requests.get(f"{ALERTMANAGER_URL}/api/v1/alerts", timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data["data"]:
                print(f"✅ Найдено {len(data['data'])} активных алертов")
                for alert in data["data"]:
                    print(f"  🚨 Алерт: {alert.get('labels', {}).get('alertname', 'Unknown')}")
                    print(f"  📊 Состояние: {alert.get('status', {}).get('state', 'Unknown')}")
            else:
                print("ℹ️ Активных алертов нет")
        else:
            print(f"❌ Ошибка получения алертов: {response.status_code}")
            
        return True
        
    except Exception as e:
        print(f"❌ Ошибка подключения к Alertmanager: {e}")
        return False

def create_test_alert():
    """Создает тестовый алерт для проверки"""
    print("\n🧪 Создание тестового алерта...")
    
    # Тестовый алерт для высокой загрузки CPU
    test_alert_query = "100 - (avg by(instance) (rate(node_cpu_seconds_total{mode=\"idle\"}[5m])) * 100) > 5"
    
    try:
        # Проверяем, сработает ли алерт
        response = requests.get(
            f"{PROMETHEUS_URL}/api/v1/query",
            params={"query": test_alert_query},
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if data["data"]["result"]:
                print("✅ Тестовый алерт сработал (CPU > 5%)")
                return True
            else:
                print("ℹ️ Тестовый алерт не сработал (CPU <= 5%)")
                return True
        else:
            print(f"❌ Ошибка выполнения тестового алерта: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Ошибка создания тестового алерта: {e}")
        return False

def main():
    """Основная функция"""
    print("🚀 Тестирование системы алертов Grafana")
    print("=" * 50)
    
    # Тестируем компоненты
    prometheus_ok = test_prometheus_metrics()
    grafana_ok = test_grafana_alerts()
    alertmanager_ok = test_alertmanager()
    
    # Создаем тестовый алерт
    test_alert_ok = create_test_alert()
    
    print("\n" + "=" * 50)
    print("📊 РЕЗУЛЬТАТЫ ТЕСТИРОВАНИЯ:")
    print(f"Prometheus: {'✅ OK' if prometheus_ok else '❌ FAIL'}")
    print(f"Grafana: {'✅ OK' if grafana_ok else '❌ FAIL'}")
    print(f"Alertmanager: {'✅ OK' if alertmanager_ok else '❌ FAIL'}")
    print(f"Тестовый алерт: {'✅ OK' if test_alert_ok else '❌ FAIL'}")
    
    if all([prometheus_ok, grafana_ok, alertmanager_ok, test_alert_ok]):
        print("\n🎉 Все компоненты работают корректно!")
        return 0
    else:
        print("\n⚠️ Есть проблемы с некоторыми компонентами")
        return 1

if __name__ == "__main__":
    sys.exit(main())
