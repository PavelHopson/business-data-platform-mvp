# Оптимизация Docker Build

## Проблема
Docker build занимает 1000+ секунд, что очень медленно.

## Решения

### 1. Быстрая сборка (рекомендуется)
```bash
# Windows PowerShell
.\build-fast.ps1

# Linux/Mac
./build-fast.sh
```

### 2. Ручная сборка с оптимизациями
```bash
# Включаем BuildKit
$env:DOCKER_BUILDKIT=1
$env:COMPOSE_DOCKER_CLI_BUILD=1

# Собираем только frontend
docker-compose -f docker-compose.build.yml build --parallel frontend
```

### 3. Сборка с кэшированием
```bash
# Собираем с кэшем
docker-compose build --parallel frontend
```

## Оптимизации

### Dockerfile
- ✅ Многоэтапная сборка
- ✅ Кэширование зависимостей
- ✅ BuildKit для ускорения
- ✅ Оптимизированные слои

### Next.js
- ✅ SWC минификатор
- ✅ Отключение ненужных функций
- ✅ Оптимизация webpack
- ✅ Быстрая сборка (`build:fast`)

### Docker
- ✅ .dockerignore для исключения ненужных файлов
- ✅ Параллельная сборка
- ✅ Ограничение ресурсов
- ✅ Кэширование слоев

## Ожидаемые результаты
- **Время сборки**: 200-400 секунд (вместо 1000+)
- **Размер образа**: уменьшен на 30-50%
- **Кэширование**: ускорение повторных сборок

## Команды для мониторинга
```bash
# Размер образов
docker images

# Время сборки
docker-compose build --progress=plain frontend

# Очистка кэша
docker system prune -f
```
