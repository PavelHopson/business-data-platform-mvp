# Скрипт для быстрой сборки Docker образа

Write-Host "🚀 Начинаем быструю сборку..." -ForegroundColor Green

# Очищаем кэш Docker
Write-Host "🧹 Очищаем кэш Docker..." -ForegroundColor Yellow
docker system prune -f

# Собираем только frontend с оптимизациями
Write-Host "🔨 Собираем frontend..." -ForegroundColor Blue
docker-compose -f docker-compose.build.yml build --parallel --no-cache frontend

# Показываем размер образа
Write-Host "📊 Размер образа:" -ForegroundColor Cyan
docker images | findstr frontend

Write-Host "✅ Сборка завершена!" -ForegroundColor Green
