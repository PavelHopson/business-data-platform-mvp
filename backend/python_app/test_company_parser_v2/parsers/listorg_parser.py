import re
from typing import Optional, Dict, Any, List
from .base_parser import BaseParser
import logging
import os
import json
from config import LISTORG_JSON_DIR

class ListOrgParser(BaseParser):
    """Парсер данных с list-org.com"""
    
    def __init__(self):
        super().__init__()
        self.base_url = "https://www.list-org.com"
    
    def parse_company(self, inn: str) -> Optional[Dict[str, Any]]:
        """
        Парсить данные компании с list-org.com в два этапа:
        1. Поиск ID компании по ИНН
        2. Парсинг страницы компании по ID
        """
        logging.info(f"Парсинг {inn} с list-org.com...")
        
        os.makedirs(LISTORG_JSON_DIR, exist_ok=True)
        
        # --- Шаг 1: Поиск по ИНН ---
        search_url = f"{self.base_url}/search"
        search_params = {"val": inn} 
        
        soup = self.make_request(search_url, params=search_params)
        
        if not soup:
            logging.warning(f"Не удалось загрузить страницу поиска для ИНН {inn}")
            return None
        
        # --- Шаг 2: Извлечение ID компании из HTML ---
        company_id = self._find_company_id(soup, inn)
        
        if not company_id:
            logging.warning(f"Компания с ИНН {inn} не найдена на list-org.com")
            return None
        
        logging.info(f"Найден ID компании: {company_id} для ИНН {inn}")

        # --- Шаг 3: Парсинг страницы компании ---
        company_url = f"{self.base_url}/company/{company_id}"
        company_soup = self.make_request(company_url)
        
        if not company_soup:
            logging.warning(f"Не удалось загрузить страницу компании (ID: {company_id}) для ИНН {inn}")
            return None
        
        # Парсим данные и добавляем ИНН, т.к. на странице компании его может не быть
        data = self._extract_company_data(company_soup)
        if "inn" not in data or not data["inn"]:
            data["inn"] = inn

        # Сохраняем JSON
        json_filename = f"{inn}_listorg.json"
        json_filepath = os.path.join(LISTORG_JSON_DIR, json_filename)
        with open(json_filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        logging.info(f"JSON сохранен: {json_filepath}")
        
        return data
    
    def _find_company_id(self, soup, inn: str) -> Optional[str]:
        """
        Найти ID компании на странице поиска.
        Ищем по якорю <div class='org_list'> и ИНН в тексте.
        """
        # Находим блок <div class='org_list'>
        org_list_div = soup.find('div', class_='org_list')
        
        if not org_list_div:
            logging.warning(f"Не найден <div class='org_list'> на странице поиска ИНН {inn}.")
            return None

        # Ищем все ссылки, содержащие ИНН в своем тексте или тексте родителя
        # Пример: <a href='/company/1619'>...</a>...<i>инн/кпп</i>: 7707083893...
        parent_p = org_list_div.find('p', string=re.compile(inn))
        
        if not parent_p:
            first_link = org_list_div.find('a', href=re.compile(r'/company/\d+'))
            if first_link:
                href = first_link.get('href')
                match = re.search(r'/company/(\d+)', href)
                if match:
                    return match.group(1)
            return None

        # Если ИНН найден, ищем ссылку в этом же блоке <p>
        link = parent_p.find('a', href=re.compile(r'/company/\d+'))
        if link:
            href = link.get('href') # /company/1619
            match = re.search(r'/company/(\d+)', href)
            if match:
                return match.group(1) # 1619
                
        return None
    
    def _extract_company_data(self, soup) -> Dict[str, Any]:
        """Извлечь данные компании со страницы"""
        data = {
            "inn": None,
            "ogrn": None,
            "company_name": None,
            "address": None,
            "general_director": None,
            "founders": [],
            "revenue": {},
            "profit": {},
            "employees_count": None,
            "activity": {},
            "contacts": {},
            "notes": ""
        }

        # ИНН
        inn_tag = soup.find('i', string='ИНН:')
        if inn_tag:
            parent_p = inn_tag.find_parent('p')
            if parent_p:
                inn_span = parent_p.find('span', class_='clipboard')
                if inn_span:
                    inner_span = inn_span.find('span')
                    if inner_span:
                        data["inn"] = self.clean_text(inner_span.get_text())

        # ОГРН
        ogrn_tag = soup.find('i', string='ОГРН:')
        if ogrn_tag:
            parent_p = ogrn_tag.find_parent('p')
            if parent_p:
                ogrn_span = parent_p.find('span', class_='clipboard')
                if ogrn_span:
                    inner_span = ogrn_span.find('span')
                    if inner_span:
                        data["ogrn"] = self.clean_text(inner_span.get_text())

        # Название компании
        name_link = soup.find('a', class_='link')
        if name_link:
            data["company_name"] = self.clean_text(name_link.get_text())

        # Адрес
        address_tag = soup.find('i', string='Адрес:')
        if address_tag:
            parent_p = address_tag.find_parent('p')
            if parent_p:
                address_span = parent_p.find('span')
                if address_span:
                    data["address"] = self.clean_text(address_span.get_text())
        
        # Если адрес не найден, пробуем альтернативный селектор
        if not data["address"]:
            address_tag = soup.find('td', string='Адрес:')
            if address_tag:
                address_cell = address_tag.find_next_sibling('td')
                if address_cell:
                    data["address"] = self.clean_text(address_cell.get_text())

        # Генеральный директор
        dir_tag = soup.find(lambda tag: tag.name == 'td' and 'Руководитель:' in tag.get_text())
        if dir_tag:
            dir_cell = dir_tag.find_next_sibling('td')
            if dir_cell:
                dir_link = dir_cell.find('a')
                if dir_link:
                    data["general_director"] = self.clean_text(dir_link.get_text())

        # Учредители
        founders_table = soup.find('table', attrs={'class': re.compile('tt f08m')})  # Правопредшественники или учредители
        if founders_table:
            rows = founders_table.find_all('tr')[1:]  # Пропустить header
            for row in rows:
                cells = row.find_all('td')
                if len(cells) >= 2:
                    name = cells[0].text.strip()
                    share = cells[1].text.strip() if len(cells) > 1 else ''
                    data["founders"].append(f"{name} ({share})")
        else:
            data["notes"] += " Учредители не найдены."

        # Финансы
        revenue_tag = soup.find('td', string='Выручка')
        if revenue_tag:
            revenue_value_tag = revenue_tag.find_next('td', class_='nwr')
            if revenue_value_tag:
                revenue_value = revenue_value_tag.text.strip().replace('000', '')  
                data["revenue"]["2024"] = int(revenue_value) * 1000000  
    
        profit_tag = soup.find('td', string=re.compile('Чистая прибыль \\(убыток\\)'))
        if profit_tag:
            profit_value_tag = profit_tag.find_next('td', class_='nwr')
            if profit_value_tag:
                profit_value = profit_value_tag.text.strip().replace('-', '').replace('000', '')
                sign = -1 if '-' in profit_value_tag.text else 1
                data["profit"]["2024"] = sign * int(profit_value) * 1000000

        # Сотрудники
        employees_tag = soup.find(lambda tag: tag.name == 'td' and 'Численность персонала:' in tag.get_text())
        if employees_tag:
            data["employees_count"] = int(employees_tag.find_next_sibling('td').get_text(strip=True))

        # Вид деятельности
        act_tag = soup.find('span', string=re.compile(r'Основной \(по коду ОКВЭД ред\.2\):'))
        if act_tag:
            code_tag = act_tag.parent.find_next_sibling('a')
            if code_tag:
                data["activity"]["code"] = self.clean_text(code_tag.get_text())
                desc = code_tag.next_sibling
                if desc:
                    data["activity"]["desc"] = self.clean_text(str(desc).strip(' -'))

        # Контакты
        phone_tag = soup.find('i', string=re.compile('Телефон:'))
        if phone_tag:
            phone_link = phone_tag.find_next_sibling('a')
            if phone_link and phone_link.find('span'):
                data["contacts"]["phone"] = self.clean_text(phone_link.find('span').text)
        
        email_tag = soup.find('i', string=re.compile('E-mail:'))
        if email_tag:
            email_data = email_tag.find_next_sibling(['a', 'span'])
            if email_data:
                data["contacts"]["email"] = self.clean_text(email_data.get_text())

        website_tag = soup.find('i', string=re.compile('Сайт:'))
        if website_tag:
            website_data = website_tag.find_next_sibling(['a', 'span'])
            if website_data:
                data["contacts"]["website"] = self.clean_text(website_data.get_text())
        
        return data