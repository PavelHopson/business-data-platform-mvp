
import subprocess
import sys
from pathlib import Path

def run_tests() -> int:
    
    try:
        result = subprocess.run([
            "python", "-m", "pytest", 
            "tests/", 
            "-v",
            "--tb=short",
            "--color=yes"
        ], cwd=Path(__file__).parent)
        return result.returncode
    except Exception as e:
        print(f"Error running tests: {e}")
        return 1

if __name__ == "__main__":
    sys.exit(run_tests())
