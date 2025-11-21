import json
import requests
from fake_useragent import UserAgent
from bs4 import BeautifulSoup
import html
from typing import Optional, Dict, Any, List
from .base_parser import BaseParser
from config import RUSPROFILE_JSON_DIR, REQUEST_TIMEOUT, get_random_user_agent, get_random_delay  # Added get_random_delay
import logging
import time
import os

class RusprofileParser(BaseParser):
    """Парсер для rusprofile.ru"""
    
    def parse_company(self, inn: str) -> Optional[Dict[str, Any]]:
        logging.info(f"Парсинг {inn} с rusprofile.ru...")
        
        os.makedirs(RUSPROFILE_JSON_DIR, exist_ok=True)
        
        url = f"https://www.rusprofile.ru/search?query={inn}"
        headers = {
            'User-Agent': get_random_user_agent(),
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'ru-RU,ru;q=0.8,en-US;q=0.5,en;q=0.3',
        }
        
        try:
            time.sleep(get_random_delay())
            response = requests.get(url, headers=headers, timeout=REQUEST_TIMEOUT)
            if response.status_code != 200:
                logging.error(f"Ошибка HTTP {response.status_code} для {inn}")
                return None
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            data = {
                "inn": inn,
                "ogrn": None,
                "name": None,
                "status": None,
                "address": None,
                "registration_date": None,
                "general_director": {
                    "name": None
                },
                "founders": [],
                "activity": {
                    "code": None,
                    "desc": None
                },
                "court_cases": {
                    "total": None
                }
            }

            ogrn_tag = soup.find(id="clip_ogrn")
            if ogrn_tag:
                data["ogrn"] = ogrn_tag.get_text(strip=True)

            name_tag = soup.find('span', class_="flexpoint company-menu_home active")
            if name_tag:
                raw_name = name_tag.get('title', '')
                data["name"] = html.unescape(raw_name.strip())

            status_tag = soup.find('span', class_="company-header__icon success")
            if status_tag:
                full_status = status_tag.get_text(strip=True)
                data["status"] = ' '.join(full_status.split(' '))

            # Извлекаем адрес
            address_tag = soup.find('span', class_="company-info__text", itemprop="address")
            if address_tag:
                data["address"] = address_tag.get_text(strip=True)
            else:
                # Пробуем альтернативный селектор
                address_tag = soup.find('div', class_="company-info__text")
                if address_tag:
                    data["address"] = address_tag.get_text(strip=True)

            reg_date_tag = soup.find(itemprop="foundingDate")
            if reg_date_tag:
                date_str = reg_date_tag.get_text(strip=True)
                # Преобразуем дату из формата "14.09.2000" в "2000-09-14"
                try:
                    from datetime import datetime
                    parsed_date = datetime.strptime(date_str, "%d.%m.%Y")
                    data["registration_date"] = parsed_date.strftime("%Y-%m-%d")
                except ValueError:
                    # Если не удалось распарсить, оставляем как есть
                    data["registration_date"] = date_str

            director_tag = soup.find('span', class_="margin-right-s")
            if director_tag:
                data["general_director"]["name"] = director_tag.get_text(strip=True)

            founder_tags = soup.find_all('a', attrs={"data-track-click": "not_masked, ul_dash_founders, founder_item, name"})
            for tag in founder_tags:
                founder_name = tag.get_text(strip=True)
                cleaned_name = html.unescape(founder_name)
                data["founders"].append({"name": cleaned_name})

            activity_tag = soup.find('a', attrs={"data-track-click": "not_masked,ul_dash_main,history_company_okved,icon_link"})
            if activity_tag:
                parent_span = activity_tag.find_parent('span', class_='company-info__title')
                if parent_span:
                    activity_span = parent_span.find_next_sibling('span', class_='company-info__text')
                    if activity_span:
                        code_tag = activity_span.find('span', class_='bolder')
                        if code_tag:
                            data["activity"]["code"] = code_tag.get_text(strip=True).strip('()')
                        if activity_span.contents:
                            desc_text = activity_span.contents[0].strip()
                            data["activity"]["desc"] = desc_text

            cases_div = soup.find('div', class_="tab-item active", attrs={"data-tab_name": "cases_all_now"})
            if cases_div:
                cases_a_tag = cases_div.find('a', class_="num gtm_ar_1")
                if cases_a_tag:
                    total_text = cases_a_tag.contents[0].strip()
                    try:
                        data["court_cases"]["total"] = int(total_text)
                    except ValueError:
                        pass

            # Сохраняем JSON
            json_filename = f"{inn}_rusprofile.json"
            json_filepath = os.path.join(RUSPROFILE_JSON_DIR, json_filename)
            with open(json_filepath, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            logging.info(f"JSON сохранен: {json_filepath}")
            
            return data
        
        except Exception as e:
            logging.error(f"Ошибка парсинга rusprofile для {inn}: {e}")
            return None