import random
from fake_useragent import UserAgent

TEST_INNS = [
    "7707083893",
    "7736207543",
    "9703073496",
]

USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
]

MIN_DELAY = 1
MAX_DELAY = 3

REQUEST_TIMEOUT = 30

OUTPUT_DIR = "output"
DEFAULT_OUTPUT_JSON = f"{OUTPUT_DIR}/output.json"

def get_random_user_agent():
    
    try:
        return UserAgent().random
    except:
        return random.choice(USER_AGENTS)

def get_random_delay():
    
    return random.uniform(MIN_DELAY, MAX_DELAY)