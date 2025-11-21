import random
from fake_useragent import UserAgent

# Список тестовых ИНН (используется, если не заданы аргументы)
TEST_INNS = [
    "7707083893",  # Сбербанк
    "7736207543",  # Яндекс 
    "9703073496",  # Иннотех
]

# Настройки для обхода блокировок
USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
]

# Задержки между запросами (секунды)
MIN_DELAY = 1
MAX_DELAY = 3

# Таймауты
REQUEST_TIMEOUT = 30

# Пути для сохранения результатов
import os
OUTPUT_DIR = os.path.join(os.getcwd(), "output")
PB_NALOG_TABLE_DIR = os.path.join(OUTPUT_DIR, "pb_nalog_table")
PB_NALOG_JSON_DIR = os.path.join(OUTPUT_DIR, "pb_nalog_JSON")
LISTORG_JSON_DIR = os.path.join(OUTPUT_DIR, "listorg_JSON")
RUSPROFILE_JSON_DIR = os.path.join(OUTPUT_DIR, "rusprofile_JSON")
FINAL_JSON_DIR = os.path.join(OUTPUT_DIR, "final_JSON")
DEFAULT_OUTPUT_JSON = os.path.join(FINAL_JSON_DIR, "output.json")  # Для нескольких ИНН, но для одного - {inn}.json

def get_random_user_agent():
    """Получить случайный User-Agent"""
    try:
        return UserAgent().random
    except:
        return random.choice(USER_AGENTS)

def get_random_delay():
    """Получить случайную задержку"""
    return random.uniform(MIN_DELAY, MAX_DELAY)