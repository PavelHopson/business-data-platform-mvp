import json
import os
import datetime
import logging
from typing import List, Dict, Optional, Any
from parsers import ListOrgParser, RusprofileParser, PbNalogParser
from config import FINAL_JSON_DIR

def setup_logging():
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler('parser.log', encoding='utf-8'),
            logging.StreamHandler()
        ]
    )

def _check_match(base_data: Dict, check_data: Dict) -> bool:
    """
    Проверяет совпадение ключевых полей между источниками.
    """
    if not check_data:
        return False
    
    for field in ['inn']:
        base_value = base_data.get(field)
        other_value = check_data.get(field)
        if base_value and other_value:
            base_clean = str(base_value).strip()
            other_clean = str(other_value).strip()
            if base_clean != other_clean:
                logging.warning(f"Несовпадение {field}: {base_clean} (base) != {other_clean} (other)")
                return False
    return True

def process_and_save_company_data(inn: str) -> Optional[Dict[str, Any]]:
    """
    Парсит данные о компании с трех источников и объединяет их.
    """
    logging.info(f"Парсинг компании с ИНН: {inn}")
    
    # Инициализация парсеров
    pb_nalog_parser = PbNalogParser()
    list_org_parser = ListOrgParser()
    rusprofile_parser = RusprofileParser()
    
    try:
        # Получение данных
        pb_nalog_data = pb_nalog_parser.parse_company(inn)
        list_org_data = list_org_parser.parse_company(inn)
        rusprofile_data = rusprofile_parser.parse_company(inn)
        
        # Закрытие Selenium-драйвера
        pb_nalog_parser.close()
        
        # Формирование базового JSON
        # Используем pb_nalog как основной источник, но если он не работает,
        # берём данные из других источников
        if pb_nalog_data:
            final_data = {
                'inn': pb_nalog_data.get('inn'),
                'name': pb_nalog_data.get('name'),
                'status': pb_nalog_data.get('status'),
                'activity': pb_nalog_data.get('activity', {})
            }
        elif list_org_data:
            # Если pb_nalog не сработал, используем list-org как базовый источник
            final_data = {
                'inn': list_org_data.get('inn', inn),
                'name': list_org_data.get('company_name'),
                'status': None,
                'activity': list_org_data.get('activity', {})
            }
            logging.warning(f"Используем list-org как базовый источник для ИНН: {inn}")
        elif rusprofile_data:
            # Если и list-org не сработал, используем rusprofile
            final_data = {
                'inn': rusprofile_data.get('inn', inn),
                'name': rusprofile_data.get('company_name') or rusprofile_data.get('name'),
                'status': rusprofile_data.get('status'),
                'activity': rusprofile_data.get('activity', {})
            }
            logging.warning(f"Используем rusprofile как базовый источник для ИНН: {inn}")
        else:
            # Если ни один источник не сработал, возвращаем детальную информацию
            error_details = {
                "inn": inn,
                "error": "No data from any source",
                "sources_attempted": {
                    "pb_nalog": "failed" if not pb_nalog_data else "success",
                    "list_org": "failed" if not list_org_data else "success",
                    "rusprofile": "failed" if not rusprofile_data else "success"
                }
            }
            logging.error(
                f"Не удалось получить данные ни из одного источника для ИНН: {inn}. "
                f"Статус источников: pb_nalog={error_details['sources_attempted']['pb_nalog']}, "
                f"list_org={error_details['sources_attempted']['list_org']}, "
                f"rusprofile={error_details['sources_attempted']['rusprofile']}"
            )
            return None
        
        # Проверка соответствия
        verified_sources = []
        
        # Добавляем источник, который был использован как базовый
        if pb_nalog_data:
            verified_sources.append("pb_nalog")
        
        list_org_matches = _check_match(final_data, list_org_data)
        rusprofile_matches = _check_match(final_data, rusprofile_data)
        
        if list_org_matches:
            verified_sources.append("list-org")
        if rusprofile_matches:
            verified_sources.append("rusprofile")
        
        # Если list-org или rusprofile были базовым источником, они уже в списке
        if list_org_data and not list_org_matches and not pb_nalog_data:
            verified_sources.append("list-org")
        if rusprofile_data and not rusprofile_matches and not pb_nalog_data and not list_org_data:
            verified_sources.append("rusprofile")
        
        # Поля для объединения
        simple_fields = ['ogrn', 'registration_date', 'address']
        object_fields = ['general_director', 'employees_count', 'revenue', 'contacts', 'court_cases', 'profit']
        list_fields = ['founders']
        
        # Обработка простых полей
        for field in simple_fields:
            if list_org_matches and field in list_org_data and list_org_data[field] is not None:
                final_data[field] = list_org_data[field]
            elif rusprofile_matches and field in rusprofile_data and rusprofile_data[field] is not None:
                final_data[field] = rusprofile_data[field]
        
        # Обработка названия компании (может быть в разных полях)
        if not final_data.get('name') or final_data.get('name') == '':
            if list_org_matches and list_org_data.get('company_name'):
                final_data['name'] = list_org_data['company_name']
            elif rusprofile_matches and rusprofile_data.get('company_name'):
                final_data['name'] = rusprofile_data['company_name']
        
        # Обработка статуса
        if not final_data.get('status'):
            if list_org_matches and list_org_data.get('status'):
                final_data['status'] = list_org_data['status']
            elif rusprofile_matches and rusprofile_data.get('status'):
                final_data['status'] = rusprofile_data['status']
        
        # Обработка полей-объектов
        for field in object_fields:
            value = None
            source = None
            if list_org_matches and field in list_org_data and list_org_data[field] is not None:
                value = list_org_data[field]
                source = "list-org"
            elif rusprofile_matches and field in rusprofile_data and rusprofile_data[field] is not None:
                value = rusprofile_data[field]
                source = "rusprofile"
            if value is not None:
                if isinstance(value, dict):
                    value['source'] = source
                else:
                    value = {'value': value, 'source': source}
                final_data[field] = value
        
        # Обработка полей-списков
        for field in list_fields:
            value = None
            source = None
            if list_org_matches and field in list_org_data and list_org_data[field] is not None:
                value = list_org_data[field]
                source = "list-org"
            elif rusprofile_matches and field in rusprofile_data and rusprofile_data[field] is not None:
                value = rusprofile_data[field]
                source = "rusprofile"
            if value is not None and isinstance(value, list):
                sourced_list = []
                for item in value:
                    if isinstance(item, dict):
                        item['source'] = source
                    else:
                        item = {'name': item, 'source': source}
                    sourced_list.append(item)
                final_data[field] = sourced_list
        
        # Добавление метаданных
        timestamp = datetime.datetime.now(datetime.timezone.utc).isoformat().replace('+00:00', 'Z')
        final_data['meta'] = {
            'sources': verified_sources,
            'timestamp': timestamp
        }
        
        # Сохранение файла
        os.makedirs(FINAL_JSON_DIR, exist_ok=True)
        json_filename = f"{inn}.json"
        json_filepath = os.path.join(FINAL_JSON_DIR, json_filename)
        try:
            with open(json_filepath, 'w', encoding='utf-8') as f:
                json.dump(final_data, f, ensure_ascii=False, indent=2)
            logging.info(f"Финальный JSON сохранен: {json_filepath}")
            print(f"\n--- Финальный JSON для ИНН {inn} ---\n{json.dumps(final_data, ensure_ascii=False, indent=2)}\n--- Конец JSON ---\n")
            return final_data
        except (IOError, TypeError) as e:
            logging.error(f"Ошибка записи JSON файла {json_filepath}: {e}")
            return None
    
    finally:
        pb_nalog_parser.close()

def process_companies(inns: List[str], output_file: str) -> List[Dict[str, Any]]:
    """
    Парсит данные для списка ИНН и сохраняет результаты в выходной файл.
    """
    logging.info(f"Начинаем парсинг {len(inns)} компаний...")
    results = []
    successful_parses = 0
    sources_used = set()
    
    for inn in inns:
        result = process_and_save_company_data(inn.strip())
        if result:
            successful_parses += 1
            sources_used.update(result['meta']['sources'])
            results.append(result)
    
    # Сохранение результатов в выходной файл
    if output_file and results:
        os.makedirs(os.path.dirname(output_file), exist_ok=True)
        try:
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(results, f, ensure_ascii=False, indent=2)
            logging.info(f"Результаты сохранены в {output_file}")
        except (IOError, TypeError) as e:
            logging.error(f"Ошибка записи выходного файла {output_file}: {e}")
    
    # Логирование статистики
    total_companies = len(inns)
    success_rate = f"{(successful_parses / total_companies * 100):.1f}%" if total_companies > 0 else "0.0%"
    logging.info(f"Статистика: total_companies={total_companies}, successful_parses={successful_parses}, success_rate={success_rate}, sources_used={list(sources_used)}")
    
    return results