
import sys
import os
import subprocess

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def test_black_formatting():
    
    print("🎨 Проверяем форматирование с Black...")
    
    try:
        result = subprocess.run([
            sys.executable, "-m", "black", "app/", "--line-length=88", "--check"
        ], capture_output=True, text=True, cwd=os.path.dirname(__file__))
        
        if result.returncode == 0:
            print("✅ Black форматирование: OK")
            return True
        else:
            print("❌ Black форматирование: ОШИБКИ")
            print(result.stdout)
            return False
            
    except Exception as e:
        print(f"❌ Ошибка Black: {e}")
        return False

def test_flake8():
    
    print("\n📝 Проверяем стиль кода с Flake8...")
    
    try:
        result = subprocess.run([
            sys.executable, "-m", "flake8", "app/", 
            "--max-line-length=88", "--ignore=E203,W503"
        ], capture_output=True, text=True, cwd=os.path.dirname(__file__))
        
        if result.returncode == 0:
            print("✅ Flake8 стиль кода: OK")
            return True
        else:
            print("❌ Flake8 стиль кода: ОШИБКИ")
            print(result.stdout)
            return False
            
    except Exception as e:
        print(f"❌ Ошибка Flake8: {e}")
        return False

def test_mypy():
    
    print("\n🔍 Проверяем типизацию с MyPy...")
    
    try:
        result = subprocess.run([
            sys.executable, "-m", "mypy", "app/", "--ignore-missing-imports"
        ], capture_output=True, text=True, cwd=os.path.dirname(__file__))
        
        if result.returncode == 0:
            print("✅ MyPy типизация: OK")
            return True
        else:
            print("❌ MyPy типизация: ОШИБКИ")
            print(result.stdout)
            return False
            
    except Exception as e:
        print(f"❌ Ошибка MyPy: {e}")
        return False

def main():
    
    print("🚀 Проверка соответствия стандартам качества кода\n")
    
    results = []
    
    results.append(("Black форматирование", test_black_formatting()))
    
    results.append(("Flake8 стиль кода", test_flake8()))
    
    results.append(("MyPy типизация", test_mypy()))
    
    print("\n" + "="*50)
    print("📊 РЕЗУЛЬТАТЫ ПРОВЕРКИ КАЧЕСТВА:")
    print("="*50)
    
    all_passed = True
    for component, passed in results:
        status = "✅ ПРОЙДЕНО" if passed else "❌ ОШИБКА"
        print(f"{component:20} {status}")
        if not passed:
            all_passed = False
    
    print("="*50)
    if all_passed:
        print("🎉 ВСЕ ПРОВЕРКИ ПРОЙДЕНЫ!")
        print("💡 Код соответствует стандартам качества")
        print("🚀 Готов к production!")
    else:
        print("⚠️ ЕСТЬ ПРОБЛЕМЫ!")
        print("💡 Исправьте ошибки выше")
    
    return all_passed

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
