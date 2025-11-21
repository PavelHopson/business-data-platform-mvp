.PHONY: help build up down logs clean restart init test

GREEN=\033[0;32m
YELLOW=\033[1;33m
RED=\033[0;31m
NC=\033[0m

help:
	@echo "$(GREEN)Доступные команды:$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-15s$(NC) %s\n", $$1, $$2}'

build:
	@echo "$(GREEN)Сборка контейнеров...$(NC)"
	docker compose build

up:
	@echo "$(GREEN)Запуск сервисов...$(NC)"
	docker compose up -d

down:
	@echo "$(GREEN)Остановка сервисов...$(NC)"
	docker compose down

logs:
	@echo "$(GREEN)Логи сервисов:$(NC)"
	docker compose logs -f

logs-backend:
	@echo "$(GREEN)Логи бэкенда:$(NC)"
	docker compose logs -f backend

logs-frontend:
	@echo "$(GREEN)Логи фронтенда:$(NC)"
	docker compose logs -f frontend

logs-db:
	@echo "$(GREEN)Логи базы данных:$(NC)"
	docker compose logs -f postgres

clean:
	@echo "$(GREEN)Очистка...$(NC)"
	docker compose down -v --rmi all --remove-orphans
	docker system prune -f

restart:
	@echo "$(GREEN)Перезапуск сервисов...$(NC)"
	docker compose restart

init: build up
	@echo "$(GREEN)Проект инициализирован!$(NC)"
	@echo "$(YELLOW)Фронтенд: http://91.218.230.151:3000$(NC)"
	@echo "$(YELLOW)Бэкенд API: http://91.218.230.151:8000$(NC)"
	@echo "$(YELLOW)API документация: http://91.218.230.151:8000/docs$(NC)"

test:
	@echo "$(GREEN)Запуск тестов...$(NC)"
	docker compose exec backend python -m pytest tests/ -v

status:
	@echo "$(GREEN)Статус сервисов:$(NC)"
	docker compose ps

shell-backend:
	docker compose exec backend bash

shell-frontend:
	docker compose exec frontend sh

shell-db:
	docker compose exec postgres psql -U devuser -d myapp_dev

dev:
	@echo "$(GREEN)Запуск в режиме разработки...$(NC)"
	docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d

prod:
	@echo "$(GREEN)Запуск в продакшене...$(NC)"
	docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d

etl-build:
	@echo "$(GREEN)Building ETL container...$(NC)"
	docker compose build etl-scheduler

etl-up:
	@echo "$(GREEN)Starting ETL scheduler...$(NC)"
	docker compose up -d etl-scheduler

etl-logs:
	@echo "$(GREEN)ETL scheduler logs:$(NC)"
	docker compose logs -f etl-scheduler

etl-run:
	@echo "$(GREEN)Running ETL job manually...$(NC)"
	docker compose exec etl-scheduler python load_fns_data.py

etl-health:
	@echo "$(GREEN)Checking ETL health...$(NC)"
	docker compose exec etl-scheduler python scripts/health_check.py

etl-shell:
	@echo "$(GREEN)Opening ETL shell...$(NC)"
	docker compose exec etl-scheduler bash

etl-status:
	@echo "$(GREEN)ETL scheduler status:$(NC)"
	docker compose ps etl-scheduler

monitoring:
	@echo "$(GREEN)Starting monitoring stack...$(NC)"
	docker compose up -d prometheus grafana loki alertmanager

monitoring-stop:
	@echo "$(GREEN)Stopping monitoring stack...$(NC)"
	docker compose stop prometheus grafana loki alertmanager

# Load Testing Commands
load-test-generate:
	@echo "$(GREEN)Generating test data for load testing...$(NC)"
	docker compose exec etl-scheduler python scripts/generate_test_data.py --count 200 --output input/inn_list_load_test.txt

load-test-run:
	@echo "$(GREEN)Running ETL load test simulation...$(NC)"
	docker compose exec etl-scheduler python scripts/simple_load_test.py input/inn_list_load_test.txt

load-test-report:
	@echo "$(GREEN)Generating performance report...$(NC)"
	docker compose exec etl-scheduler python scripts/simple_report.py

load-test-full:
	@echo "$(GREEN)Running full load test suite...$(NC)"
	@echo "$(YELLOW)1. Generating test data...$(NC)"
	$(MAKE) load-test-generate
	@echo "$(YELLOW)2. Running load test...$(NC)"
	$(MAKE) load-test-run
	@echo "$(YELLOW)3. Generating report...$(NC)"
	$(MAKE) load-test-report
	@echo "$(GREEN)Load test completed! Check logs/performance_report.json$(NC)"

api-stability-test:
	@echo "$(GREEN)Running API stability test...$(NC)"
	docker compose exec etl-scheduler python scripts/api_stability_test.py input/inn_list_load_test.txt 15

api-stability-report:
	@echo "$(GREEN)API stability test completed!$(NC)"
	@echo "$(YELLOW)Check logs/api_stability_report.json for detailed results$(NC)"

etl-performance-test:
	@echo "$(GREEN)Running ETL performance test on 300+ companies...$(NC)"
	@echo "$(YELLOW)1. Generating 350 test companies...$(NC)"
	docker compose exec etl-scheduler python scripts/generate_test_data.py --count 350 --output input/inn_list_performance_test.txt
	@echo "$(YELLOW)2. Running load test on 350 companies...$(NC)"
	docker compose exec etl-scheduler python scripts/optimized_load_test.py input/inn_list_performance_test.txt
	@echo "$(GREEN)Performance test completed!$(NC)"

load-test-500:
	@echo "$(GREEN)Running load test on 500 companies...$(NC)"
	@echo "$(YELLOW)1. Generating 500 test companies...$(NC)"
	docker compose exec etl-scheduler python scripts/generate_test_data.py --count 500 --output input/inn_list_500_test.txt
	@echo "$(YELLOW)2. Running ETL load test...$(NC)"
	docker compose exec etl-scheduler python scripts/optimized_load_test.py input/inn_list_500_test.txt
	@echo "$(GREEN)Load test completed!$(NC)"

fns-api-test:
	@echo "$(GREEN)Running FNS API stability test...$(NC)"
	@echo "$(YELLOW)Testing only FNS API (main API for the project)...$(NC)"
	docker compose exec etl-scheduler python scripts/fns_api_test.py input/inn_list_500_test.txt 25
	@echo "$(GREEN)FNS API test completed!$(NC)"

etl-test-500:
	@echo "$(GREEN)Running REAL ETL test on 500 companies...$(NC)"
	@echo "$(YELLOW)Testing REAL ETL with database operations...$(NC)"
	docker compose exec etl-scheduler python scripts/real_load_test.py input/inn_list_500_test.txt
	@echo "$(GREEN)REAL ETL test completed!$(NC)"

etl-test-simulation:
	@echo "$(GREEN)Running SIMULATION ETL test on 500 companies...$(NC)"
	@echo "$(YELLOW)Testing SIMULATION ETL without database...$(NC)"
	docker compose exec etl-scheduler python scripts/optimized_load_test_v2.py input/inn_list_500_test.txt
	@echo "$(GREEN)SIMULATION ETL test completed!$(NC)"

etl-metrics-check:
	@echo "$(GREEN)Checking ETL metrics server...$(NC)"
	docker compose exec etl-scheduler python scripts/check_metrics.py

etl-metrics-url:
	@echo "$(GREEN)ETL Metrics endpoints:$(NC)"
	@echo "$(YELLOW)Metrics: http://91.218.230.151:8002/metrics$(NC)"
	@echo "$(YELLOW)Health: http://91.218.230.151:8002/health$(NC)"

monitoring-status:
	@echo "$(GREEN)Checking monitoring stack status...$(NC)"
	docker compose ps prometheus grafana alertmanager loki

monitoring-logs:
	@echo "$(GREEN)Monitoring stack logs:$(NC)"
	docker compose logs -f prometheus grafana alertmanager loki

alerts-test:
	@echo "$(GREEN)Testing Telegram alerts...$(NC)"
	docker compose exec backend python -c "from app.core.telegram_alerts import get_telegram_alerter; import asyncio; alerter = get_telegram_alerter(); asyncio.run(alerter.send_alert('Test alert from monitoring system', 'INFO', {'test': 'true'}))"

alerts-test-full:
	@echo "$(GREEN)Running full Telegram alerts test...$(NC)"
	docker compose exec backend python -c "import os, sys, asyncio, requests, json; from datetime import datetime; from app.core.telegram_alerts import get_telegram_alerter; from app.core.logging import get_logger; logger = get_logger('telegram-test'); print('🚀 ТЕСТИРОВАНИЕ TELEGRAM АЛЕРТОВ'); print('=' * 60); bot_token = os.getenv('TELEGRAM_BOT_TOKEN'); chat_id = os.getenv('TELEGRAM_CHAT_ID'); enabled = os.getenv('TELEGRAM_ALERTS_ENABLED', 'false').lower() == 'true'; print(f'TELEGRAM_BOT_TOKEN: {\"✅ Установлен\" if bot_token else \"❌ НЕ УСТАНОВЛЕН\"}'); print(f'TELEGRAM_CHAT_ID: {\"✅ Установлен\" if chat_id else \"❌ НЕ УСТАНОВЛЕН\"}'); print(f'TELEGRAM_ALERTS_ENABLED: {\"✅ Включено\" if enabled else \"❌ ОТКЛЮЧЕНО\"}'); alerter = get_telegram_alerter(); print(f'Enabled: {alerter.enabled}'); print(f'Bot Token: {\"✅ Установлен\" if alerter.bot_token else \"❌ НЕ УСТАНОВЛЕН\"}'); print(f'Chat ID: {\"✅ Установлен\" if alerter.chat_id else \"❌ НЕ УСТАНОВЛЕН\"}'); print(f'API URL: {\"✅ Установлен\" if alerter.api_url else \"❌ НЕ УСТАНОВЛЕН\"}'); print('\\n🧪 ТЕСТИРОВАНИЕ ОТПРАВКИ СООБЩЕНИЯ:'); result = asyncio.run(alerter.send_alert('🧪 Тестовый алерт от системы мониторинга', 'INFO', {'test': 'true', 'timestamp': datetime.now().isoformat()})); print(f'Результат отправки: {\"✅ УСПЕШНО\" if result else \"❌ ОШИБКА\"}'); print('\\n✅ ТЕСТ ЗАВЕРШЕН!')"

alerts-status:
	@echo "$(GREEN)Alertmanager status:$(NC)"
	@echo "$(YELLOW)Alertmanager UI: http://91.218.230.151:9093$(NC)"
	@echo "$(YELLOW)Prometheus Alerts: http://91.218.230.151:9090/alerts$(NC)"

metrics-check-all:
	@echo "$(GREEN)Проверка всех метрик:$(NC)"
	@echo "$(YELLOW)Backend metrics:$(NC)"
	@curl -s http://localhost:8000/metrics | head -10
	@echo "$(YELLOW)ETL metrics:$(NC)"
	@curl -s http://localhost:8002/metrics | head -10
	@echo "$(YELLOW)Node exporter:$(NC)"
	@curl -s http://localhost:9100/metrics | head -5
	@echo "$(YELLOW)Cadvisor:$(NC)"
	@curl -s http://localhost:8080/metrics | head -5
	@echo "$(YELLOW)Grafana Dashboards: http://91.218.230.151:3002$(NC)"

health-check-all:
	@echo "$(GREEN)Checking health of all containers...$(NC)"
	docker compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"

containers-status:
	@echo "$(GREEN)Статус всех контейнеров:$(NC)"
	@echo "$(YELLOW)Backend:$(NC)"
	@docker compose exec backend curl -s http://localhost:8000/health || echo "Backend недоступен"
	@echo "$(YELLOW)ETL Scheduler:$(NC)"
	@docker compose exec etl-scheduler curl -s http://localhost:8001/health || echo "ETL Scheduler недоступен"
	@echo "$(YELLOW)Node Exporter:$(NC)"
	@curl -s http://localhost:9100/metrics | head -1 || echo "Node Exporter недоступен"
	@echo "$(YELLOW)Cadvisor:$(NC)"
	@curl -s http://localhost:8080/metrics | head -1 || echo "Cadvisor недоступен"

test-alert-chain:
	@echo "$(GREEN)Тестирование цепочки алертов:$(NC)"
	@echo "$(YELLOW)1. Проверка webhook endpoint:$(NC)"
	@curl -s http://localhost:8000/api/internal/webhook/telegram/health
	@echo ""
	@echo "$(YELLOW)2. Проверка Prometheus алертов:$(NC)"
	@curl -s "http://localhost:9090/api/v1/alerts" | grep -o '"alerts":\[[^]]*\]' || echo "Нет алертов"
	@echo "$(YELLOW)3. Проверка Alertmanager:$(NC)"
	@curl -s http://localhost:9093/api/v1/status | grep -o '"config"[^}]*}' || echo "Alertmanager недоступен"
	@echo "$(YELLOW)4. Тест отправки алерта:$(NC)"
	@curl -X POST http://localhost:8000/api/internal/webhook/telegram \
		-H "Content-Type: application/json" \
		-d '{"receiver":"telegram-critical","status":"firing","alerts":[{"status":"firing","labels":{"alertname":"TestAlert","severity":"critical"},"annotations":{"summary":"Тестовый алерт"}}]}' || echo "Ошибка отправки"

test-backend-down:
	@echo "$(GREEN)Тестирование алерта BackendDown:$(NC)"
	@echo "$(YELLOW)1. Останавливаем backend контейнер...$(NC)"
	@docker compose stop backend
	@echo "$(YELLOW)2. Ждем 2 минуты для срабатывания алерта...$(NC)"
	@sleep 120
	@echo "$(YELLOW)3. Запускаем backend обратно...$(NC)"
	@docker compose start backend
	@echo "$(YELLOW)4. Проверяем логи backend на предмет алертов:$(NC)"
	@docker compose logs backend | grep -E "(🚨|📋|🔔|📤|🤖|✅|❌)" | tail -10

prometheus-status:
	@echo "$(GREEN)Проверка статуса Prometheus:$(NC)"
	@echo "$(YELLOW)1. Проверка targets:$(NC)"
	@curl -s "http://localhost:9090/api/v1/targets" | grep -o '"job":"backend-api"[^}]*}' || echo "Backend target не найден"
	@echo "$(YELLOW)2. Проверка алертов:$(NC)"
	@curl -s "http://localhost:9090/api/v1/alerts" | grep -o '"alertname":"BackendDown"[^}]*}' || echo "BackendDown алерт не найден"
	@echo "$(YELLOW)3. Проверка метрик up:$(NC)"
	@curl -s "http://localhost:9090/api/v1/query?query=up{job=\"backend-api\"}" | grep -o '"value":\[[^]]*\]' || echo "Метрика up не найдена"

grafana-alerts-test:
	@echo "$(GREEN)Тестирование Grafana алертов...$(NC)"
	python scripts/test-grafana-alerts.py

grafana-status:
	@echo "$(GREEN)Проверка статуса Grafana:$(NC)"
	@echo "$(YELLOW)Grafana UI: http://91.218.230.151:3002$(NC)"
	@echo "$(YELLOW)Prometheus: http://91.218.230.151:9090$(NC)"
	@echo "$(YELLOW)Alertmanager: http://91.218.230.151:9093$(NC)"
	@curl -s http://localhost:3002/api/health | grep -o '"database":"[^"]*"' || echo "Grafana недоступен"

grafana-alerts-reload:
	@echo "$(GREEN)Перезагрузка алертов Prometheus...$(NC)"
	@curl -X POST http://localhost:9090/-/reload
	@echo "$(YELLOW)Алерты перезагружены!$(NC)"

grafana-dashboards:
	@echo "$(GREEN)Доступные дашборды Grafana:$(NC)"
	@echo "$(YELLOW)Node Exporter Full: http://91.218.230.151:3002/d/node-exporter-full$(NC)"
	@echo "$(YELLOW)Backend Monitoring: http://91.218.230.151:3002/d/backend-monitoring$(NC)"
	@echo "$(YELLOW)ETL Performance: http://91.218.230.151:3002/d/etl-performance$(NC)"
	@echo "$(YELLOW)Log Search: http://91.218.230.151:3002/d/log-search$(NC)"