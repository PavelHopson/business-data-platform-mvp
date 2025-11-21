#!/bin/bash

# Скрипт для быстрой сборки Docker образа

echo "🚀 Начинаем быструю сборку..."

# Очищаем кэш Docker
echo "🧹 Очищаем кэш Docker..."
docker system prune -f

# Собираем только frontend с оптимизациями
echo "🔨 Собираем frontend..."
docker-compose -f docker-compose.build.yml build --parallel --no-cache frontend

# Показываем размер образа
echo "📊 Размер образа:"
docker images | grep frontend

echo "✅ Сборка завершена!"
