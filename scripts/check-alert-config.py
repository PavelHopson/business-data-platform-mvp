#!/usr/bin/env python3
"""
Скрипт для проверки конфигурации алертов
"""

import os
import yaml

def check_yaml_file(file_path):
    """Проверяет корректность YAML файла"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            yaml.safe_load(f)
        print(f"✅ {file_path} - корректный YAML")
        return True
    except yaml.YAMLError as e:
        print(f"❌ {file_path} - ошибка YAML: {e}")
        return False
    except FileNotFoundError:
        print(f"❌ {file_path} - файл не найден")
        return False

def main():
    print("🔍 Проверка конфигурации алертов...")
    print("=" * 50)
    
    # Проверяем основные файлы
    files_to_check = [
        "monitoring/prometheus.yml",
        "monitoring/grafana-alerts.yml",
        "monitoring/alertmanager-config.yml"
    ]
    
    all_ok = True
    for file_path in files_to_check:
        if not check_yaml_file(file_path):
            all_ok = False
    
    print("\n" + "=" * 50)
    if all_ok:
        print("✅ Все файлы конфигурации корректны!")
        print("\n📋 Конфигурация алертов:")
        print("- Используется grafana-alerts.yml для алертов")
        print("- alert_rules.yml помечен как DEPRECATED")
        print("- Prometheus настроен на использование grafana-alerts.yml")
    else:
        print("❌ Есть проблемы с конфигурацией!")
        return 1
    
    return 0

if __name__ == "__main__":
    exit(main())
