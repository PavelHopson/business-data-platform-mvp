# Business Analysis Platform

Web application for comprehensive company analysis and verification.

## 🚀 Quick Start

```bash
make init
make etl-up
```

## 📁 Project Structure

```
├── backend/          # FastAPI backend
│   └── python_app/
│       └── etl_project/  # ETL парсинг с cron
├── frontend/         # Next.js frontend  
├── monitoring/       # Prometheus, Grafana, Loki
├── scripts/          # Utility scripts
└── docker-compose.yml
```

## 🔧 Development

```bash
make dev          # Start development environment
make logs         # View all logs
make test         # Run tests
make clean        # Clean up containers
```

## 🕐 ETL Парсинг

### Основные команды:
```bash
make etl-build    # Сборка ETL контейнера
make etl-up       # Запуск ETL планировщика
make etl-logs     # Логи ETL процессов
make etl-run      # Ручной запуск ETL
make etl-health   # Проверка здоровья ETL
make etl-status   # Статус ETL сервиса
```

### Нагрузочное тестирование:
```bash
make load-test-generate  # Генерация тестовых данных (200 компаний)
make load-test-run       # Запуск симуляции нагрузки
make load-test-report    # Генерация отчета производительности
make load-test-full      # Полный цикл тестирования
```

### Расписание cron:
- **Каждый час в 5 минут** - загрузка данных ФНС
- **Каждый день в 2:00** - полная синхронизация
- **Каждые 30 минут** - проверка здоровья ETL
- **Каждые 15 минут** - мониторинг API

### Мониторинг ETL:
```bash
make monitoring   # Запуск мониторинга
```

**Grafana**: http://91.218.230.151:3002 (admin/xWRd2ttyUxdAC@)
- Дашборд "ETL Monitoring" - статус парсинга
- Дашборд "ETL Performance" - метрики производительности
- Логи ETL: `{service="etl"}`

**Loki Queries**:
```logql
{service="etl"} | json
{service="etl", level="ERROR"}
{service="etl", event_type="etl_job_complete"}
{service="etl", event_type="etl_load_test_complete"}
```

**Prometheus Metrics**:
- ETL метрики: http://91.218.230.151:8002/metrics
- Производительность: `etl_companies_processed_total`
- Ресурсы: `etl_memory_usage_bytes`, `etl_cpu_usage_percent`

## 📊 Мониторинг

- **Grafana**: http://91.218.230.151:3002 (admin/xWRd2ttyUxdAC@)
- **Prometheus**: http://91.218.230.151:9090
- **Loki**: http://91.218.230.151:3100
- **Alertmanager**: http://91.218.230.151:9093

## 🚨 Алерты

### ETL Алерты:
- `ETLJobFailed` - ошибка в ETL процессе
- `ETLNoActivity` - нет активности 2+ часа
- `FNSAPIErrors` - ошибки API ФНС
- `FNSAPIForbidden` - блокировка API ключа

### Telegram уведомления:
Настройте в `.env`:
```env
TELEGRAM_BOT_TOKEN=7900245095:AAGGV1LntnHPjuid26UCPGB0bmwW_-KwvsI
TELEGRAM_CHAT_ID=-1003055636021
TELEGRAM_ALERTS_ENABLED=true
```

## 🔄 CI/CD

Автоматический деплой ETL:
- **Расписание**: каждый день в 2:00 UTC
- **Ручной запуск**: GitHub Actions → "ETL CI/CD Pipeline"
- **Health Check**: автоматическая проверка после деплоя

## 🛠️ Environment Variables

Create `.env` file with:

```env
POSTGRES_DB=myapp_dev
POSTGRES_USER=devuser
POSTGRES_PASSWORD=devpass
FNS_API_KEY=your_api_key
TELEGRAM_BOT_TOKEN=7900245095:AAGGV1LntnHPjuid26UCPGB0bmwW_-KwvsI
TELEGRAM_CHAT_ID=-1003055636021
TELEGRAM_ALERTS_ENABLED=true

NEXT_PUBLIC_API_BASE_URL=http://91.218.230.151:8000
GF_SERVER_ROOT_URL=http://91.218.230.151:3002
GF_SECURITY_ADMIN_PASSWORD=xWRd2ttyUxdAC@
```

## 📝 License

MIT
