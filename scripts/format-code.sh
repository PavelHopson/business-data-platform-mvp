#!/bin/bash

echo "🔧 Форматирование Python кода..."

cd backend/python_app

if ! command -v black &> /dev/null; then
    echo "📦 Устанавливаем Black..."
    pip install black flake8 mypy
fi

echo "🎨 Форматирование с Black..."
black app/ --line-length=88

echo "🔍 Проверка с flake8..."
python -m flake8 app/ --max-line-length=88 --ignore=E203,W503

echo "📝 Проверка типов с mypy..."
python -m mypy app/ --ignore-missing-imports

echo "✅ Форматирование завершено!"
