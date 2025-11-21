import requests
import time
from abc import ABC, abstractmethod
from typing import Optional, Dict, Any
from bs4 import BeautifulSoup
from config import get_random_user_agent, get_random_delay, REQUEST_TIMEOUT
import logging

class BaseParser(ABC):
    
    
    def __init__(self):
        self.headers = {
            'User-Agent': get_random_user_agent(),
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'ru-RU,ru;q=0.8,en-US;q=0.5,en;q=0.3',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
        }
    
    def make_request(self, url: str, params: Optional[Dict] = None) -> Optional[BeautifulSoup]:
        
        try:
            time.sleep(get_random_delay())
            self.headers.update({'User-Agent': get_random_user_agent()})
            
            with requests.Session() as session:
                session.headers.update(self.headers)
                response = session.get(url, params=params, timeout=REQUEST_TIMEOUT, allow_redirects=True)
                
                if response.status_code == 200:
                    return BeautifulSoup(response.text, 'html.parser')
                else:
                    logging.error(f"Ошибка HTTP {response.status_code} для URL: {url}")
                    return None
                        
        except requests.exceptions.RequestException as e:
            logging.error(f"Ошибка запроса для {url}: {e}")
            return None
        except Exception as e:
            logging.error(f"Неожиданная ошибка для {url}: {e}")
            return None
    
    def clean_text(self, text: str) -> str:
        
        if not text:
            return ""
        import re
        return re.sub(r'\s+', ' ', text.strip())
    
    def extract_number(self, text: str) -> Optional[int]:
        
        if not text:
            return None
        import re
        cleaned_text = text.replace(' ', '').replace('\u00A0', '')
        numbers = re.findall(r'\d+', cleaned_text)
        if numbers:
            return int(''.join(numbers))
        return None
    
    @abstractmethod
    def parse_company(self, inn: str) -> Optional[Dict[str, Any]]:
        
        pass