
import requests
import json
import sys

def check_metrics():
    try:
        response = requests.get('http://localhost:8001/metrics', timeout=5)
        if response.status_code == 200:
            print("✅ Metrics server is running")
            print(f"📊 Metrics data length: {len(response.text)} characters")
            
            lines = response.text.split('\n')
            metric_lines = [line for line in lines if not line.startswith('
            print(f"📈 Active metrics: {len(metric_lines)}")
            
            for line in metric_lines[:5]:
                print(f"   {line}")
            
            if len(metric_lines) > 5:
                print(f"   ... and {len(metric_lines) - 5} more")
                
        else:
            print(f"❌ Metrics server returned status: {response.status_code}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to metrics server on port 8001")
    except Exception as e:
        print(f"❌ Error checking metrics: {e}")

def check_health():
    try:
        response = requests.get('http://localhost:8001/health', timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Health check passed: {data}")
        else:
            print(f"❌ Health check failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Health check error: {e}")

if __name__ == "__main__":
    print("🔍 Checking ETL metrics server...")
    check_health()
    print()
    check_metrics()
