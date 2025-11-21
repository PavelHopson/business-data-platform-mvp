
import subprocess
import sys
from pathlib import Path

def run_command(command: list[str]) -> tuple[int, str, str]:
    try:
        result = subprocess.run(
            command, 
            capture_output=True, 
            text=True, 
            cwd=Path(__file__).parent
        )
        return result.returncode, result.stdout, result.stderr
    except Exception as e:
        return 1, "", str(e)

def check_black() -> bool:
    print("🔍 Checking code formatting with Black...")
    exit_code, stdout, stderr = run_command(["python", "-m", "black", "app/", "--check", "--line-length=88"])
    
    if exit_code == 0:
        print("✅ Black formatting is correct")
        return True
    else:
        print("❌ Black formatting issues found:")
        print(stdout)
        print(stderr)
        return False

def check_flake8() -> bool:
    print("🔍 Checking code style with Flake8...")
    exit_code, stdout, stderr = run_command([
        "python", "-m", "flake8", "app/", 
        "--max-line-length=88", 
        "--ignore=E203,W503"
    ])
    
    if exit_code == 0:
        print("✅ Flake8 style check passed")
        return True
    else:
        print("❌ Flake8 style issues found:")
        print(stdout)
        print(stderr)
        return False

def check_mypy() -> bool:
    print("🔍 Checking types with MyPy...")
    exit_code, stdout, stderr = run_command([
        "python", "-m", "mypy", "app/", 
        "--ignore-missing-imports"
    ])
    
    if exit_code == 0:
        print("✅ MyPy type check passed")
        return True
    else:
        print("❌ MyPy type issues found:")
        print(stdout)
        print(stderr)
        return False

def main() -> int:
    print("🚀 Running Python code quality checks...\n")
    
    checks = [
        check_black(),
        check_flake8(), 
        check_mypy()
    ]
    
    if all(checks):
        print("\n🎉 All quality checks passed!")
        return 0
    else:
        print("\n❌ Some quality checks failed!")
        return 1

if __name__ == "__main__":
    sys.exit(main())
