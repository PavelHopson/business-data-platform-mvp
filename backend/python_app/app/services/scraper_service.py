import os
import sys
import asyncio
from typing import Dict, Any, Optional

from app.core.logging import get_logger


logger = get_logger(__name__)


def _ensure_parser_on_path() -> None:
    """Add the test_company_parser_v2 folder to sys.path for imports."""
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
    parser_dir = os.path.join(project_root, "test_company_parser_v2")
    if parser_dir not in sys.path:
        sys.path.append(parser_dir)


class ScraperService:
    """Service wrapper to execute the test_company_parser_v2 in a safe way."""

    def __init__(self) -> None:
        _ensure_parser_on_path()
        # Lazy import to avoid import cost if unused
        from process_company import process_and_save_company_data  # type: ignore

        self._process_function = process_and_save_company_data

    def _scrape_sync(self, inn: str) -> Optional[Dict[str, Any]]:
        
        try:
            # Используем новую функцию process_and_save_company_data
            result = self._process_function(inn)
            if result:
                # Преобразуем результат в формат, совместимый со старым API
                return self._convert_v2_to_v1_format(result)
            return None
        except Exception as e:
            logger.error(f"Scrape failed for INN {inn}: {e}", exc_info=True)
            return None

    def _convert_v2_to_v1_format(self, v2_data: Dict[str, Any]) -> Dict[str, Any]:
        """Конвертирует данные из формата v2 в формат v1 для совместимости"""
        try:
            # Извлекаем основные поля
            converted = {
                "inn": v2_data.get("inn"),
                "company_name": v2_data.get("name"),
                "ogrn": v2_data.get("ogrn"),
                "status": v2_data.get("status"),
                "registration_date": v2_data.get("registration_date"),
                "activity": v2_data.get("activity", {}),
            }
            
            # Обрабатываем поля с источниками
            general_director = v2_data.get("general_director")
            if general_director:
                if isinstance(general_director, dict):
                    converted["general_director"] = general_director.get("value") or general_director.get("name")
                else:
                    converted["general_director"] = general_director
            
            # Обрабатываем учредителей
            founders = v2_data.get("founders", [])
            if founders:
                converted["founders"] = []
                for founder in founders:
                    if isinstance(founder, dict):
                        name = founder.get("name") or founder.get("value")
                        if name:
                            converted["founders"].append(name)
                    else:
                        converted["founders"].append(str(founder))
            
            # Обрабатываем финансовые данные
            revenue = v2_data.get("revenue")
            if revenue:
                if isinstance(revenue, dict):
                    # Извлекаем значение из объекта с источником
                    converted["revenue"] = revenue.get("value") or {k: v for k, v in revenue.items() if k != "source"}
                else:
                    converted["revenue"] = revenue
            
            profit = v2_data.get("profit")
            if profit:
                if isinstance(profit, dict):
                    converted["profit"] = profit.get("value") or {k: v for k, v in profit.items() if k != "source"}
                else:
                    converted["profit"] = profit
            
            # Обрабатываем количество сотрудников
            employees_count = v2_data.get("employees_count")
            if employees_count:
                if isinstance(employees_count, dict):
                    converted["employees_count"] = employees_count.get("value")
                else:
                    converted["employees_count"] = employees_count
            
            # Обрабатываем контакты
            contacts = v2_data.get("contacts")
            if contacts:
                if isinstance(contacts, dict):
                    # Убираем поле source из контактов
                    converted["contacts"] = {k: v for k, v in contacts.items() if k != "source"}
                else:
                    converted["contacts"] = contacts
            
            # Обрабатываем судебные дела
            court_cases = v2_data.get("court_cases")
            if court_cases:
                if isinstance(court_cases, dict):
                    converted["court_cases"] = court_cases.get("value") or court_cases.get("total")
                else:
                    converted["court_cases"] = court_cases
            
            logger.info(f"Successfully converted v2 data for INN {v2_data.get('inn')}")
            return converted
            
        except Exception as e:
            logger.error(f"Error converting v2 data to v1 format: {e}", exc_info=True)
            # Возвращаем базовые данные в случае ошибки
            return {
                "inn": v2_data.get("inn"),
                "company_name": v2_data.get("name"),
                "ogrn": v2_data.get("ogrn"),
                "status": v2_data.get("status"),
            }

    async def scrape_company(self, inn: str) -> Optional[Dict[str, Any]]:
        
        return await asyncio.to_thread(self._scrape_sync, inn)


scraper_service = ScraperService()
