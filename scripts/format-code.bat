@echo off
REM Скрипт для автоматического форматирования кода (Windows)
echo 🔧 Форматирование Python кода...

REM Переходим в директорию backend
cd backend\python_app

REM Устанавливаем зависимости если нужно
where black >nul 2>nul
if %errorlevel% neq 0 (
    echo 📦 Устанавливаем Black...
    pip install black flake8 mypy
)

REM Форматируем код с помощью Black
echo 🎨 Форматирование с Black...
black app/ --line-length=88

REM Проверяем линтер
echo 🔍 Проверка с flake8...
python -m flake8 app/ --max-line-length=88 --ignore=E203,W503

REM Проверяем типы
echo 📝 Проверка типов с mypy...
python -m mypy app/ --ignore-missing-imports

echo ✅ Форматирование завершено!
pause
