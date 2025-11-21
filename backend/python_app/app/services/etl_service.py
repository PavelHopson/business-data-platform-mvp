"""
ETL Service для интеграции API парсеров с базой данных
Поддерживает обновление данных при повторной выгрузке
"""

import json
from datetime import datetime
from typing import Dict, Any, Optional, List
from sqlalchemy.orm import Session

from app.models.company import Company
from app.models.founder import Founder
from app.services.fns_api import fns_service
from app.services.scraper_service import scraper_service
from app.core.logging import get_logger

logger = get_logger(__name__)


class ETLService:
    """Сервис для ETL операций с поддержкой обновления данных"""
    
    def __init__(self, db: Session):
        self.db = db
    
    async def process_company_data(
        self, inn: str, force_update: bool = False
    ) -> Dict[str, Any]:
        """
        Обрабатывает данные компании из всех доступных источников
        
        Args:
            inn: ИНН компании
            force_update: Принудительное обновление даже если данные свежие
            
        Returns:
            Словарь с результатами обработки
        """
        result: Dict[str, Any] = {
            "inn": inn,
            "fns_updated": False,
            "scraper_updated": False,
            "errors": [],
            "company_id": None
        }
        
        try:
            # Проверяем, есть ли компания в БД и нужно ли обновление
            company = (
                self.db.query(Company)
                .filter(Company.inn == inn)  # type: ignore
            .first()
            )
            company_data = {}
            
            # Проверяем нужно ли обновлять данные скрапера
            if self._should_update_scraper_data(company, force_update):
                logger.info(f"Updating scraper data for INN {inn}")
                scraper_result = await self._get_scraper_data(inn)
                if scraper_result["success"]:
                    company_data.update(scraper_result["data"])
                    result["scraper_updated"] = True
                else:
                    error_msg = scraper_result.get('error', 'Unknown error')
                    result["errors"].append(f"Scraper failed: {error_msg}")
            else:
                logger.info(f"Using cached scraper data for INN {inn}")
                result["scraper_updated"] = False
            
            # ФНС API пока отключен, но код оставлен для будущего использования
            # if self._should_update_fns_data(company, force_update):
            #     fns_result = await self._get_fns_data(inn)
            #     if fns_result["success"]:
            #         company_data.update(fns_result["data"])
            #         result["fns_updated"] = True
            
            # Создаем или обновляем компанию с данными от парсеров
            if company_data:  # Только если есть новые данные
                company = self._get_or_create_company_with_data(inn, company_data)
            elif not company:  # Если компании нет в БД, создаем с минимальными данными
                company = self._get_or_create_company_with_data(inn, {})
            result["company_id"] = company.id
            
            # Обновляем общее время обновления
            company.updated_at = datetime.now()  # type: ignore
            self.db.commit()
            
            logger.info(f"ETL processing completed for INN {inn}: {result}")
            return result
            
        except Exception as e:
            logger.error(f"ETL processing failed for INN {inn}: {e}", exc_info=True)
            self.db.rollback()
            result["errors"].append(str(e))
            return result
    
    async def _get_scraper_data(self, inn: str) -> Dict[str, Any]:
        """Получает данные от скрапера"""
        try:
            data = await scraper_service.scrape_company(inn)
            if data:
                return {"success": True, "data": {"scraper_data": data}}
            else:
                return {"success": False, "error": "No data from scraper"}
        except Exception as e:
            logger.error(f"Scraper data fetch failed for INN {inn}: {e}")
            return {"success": False, "error": str(e)}
    
    async def _get_fns_data(self, inn: str) -> Dict[str, Any]:
        """Получает данные от ФНС API"""
        try:
            data = await fns_service.search_company(inn, "inn")
            if data:
                return {"success": True, "data": {"fns_data": data}}
            else:
                return {"success": False, "error": "No data from FNS API"}
        except Exception as e:
            logger.error(f"FNS data fetch failed for INN {inn}: {e}")
            return {"success": False, "error": str(e)}
    
    def _get_or_create_company_with_data(
        self, inn: str, company_data: Dict[str, Any]
    ) -> Company:
        """Создает или получает компанию с данными от парсеров"""
        company = (
            self.db.query(Company)
            .filter(Company.inn == inn)  # type: ignore
            .first()
        )
        
        # Извлекаем данные от парсеров
        fns_data = company_data.get("fns_data", {})
        scraper_data = company_data.get("scraper_data", {})
        
        # Приоритет: сначала скрапер, потом ФНС (если включен)
        ogrn = scraper_data.get("ogrn") or fns_data.get("ogrn")
        name = (
            scraper_data.get("company_name") or 
            scraper_data.get("name") or 
            fns_data.get("name", f"Company {inn}")
        )
        status = scraper_data.get("status") or fns_data.get("status")
        address = scraper_data.get("address") or fns_data.get("address")
        registration_date = (
            scraper_data.get("registration_date") or 
            fns_data.get("registration_date")
        )
        
        # Если нет данных от парсеров, не создаем запись
        if not scraper_data and not fns_data:
            raise ValueError("No data from parsers to create company")
        
        if not company:
            # Создаем новую компанию с данными от парсеров
            company = Company(
                inn=inn,
                ogrn=ogrn or f"TEMP_{inn[:8]}{datetime.now().strftime('%H%M%S')}"[:13],
                name=name,
                status=status,
                address=address,
                registration_date=registration_date,
                raw_fns_data=(
                    json.dumps(fns_data, ensure_ascii=False) if fns_data else None
                ),
                raw_scraper_data=(
                    json.dumps(scraper_data, ensure_ascii=False)
                    if scraper_data
                    else None
                ),
                created_at=datetime.now(),
                updated_at=datetime.now()
            )
            self.db.add(company)
            self.db.flush()
            logger.info(f"Created new company record for INN {inn} with OGRN: {ogrn}")
        else:
            # Обновляем существующую компанию
            if ogrn:
                company.ogrn = ogrn
            if name:
                company.name = name
            if status:
                company.status = status
            if address:
                company.address = address
            if registration_date:
                company.registration_date = registration_date  # type: ignore
            
            # Обновляем JSON данные
            if fns_data:
                company.raw_fns_data = json.dumps(  # type: ignore
                    fns_data, ensure_ascii=False
                )
                company.last_fns_update = datetime.now()  # type: ignore
            if scraper_data:
                company.raw_scraper_data = json.dumps(  # type: ignore
                    scraper_data, ensure_ascii=False
                )
                company.last_scraper_update = datetime.now()  # type: ignore
            
            company.updated_at = datetime.now()  # type: ignore
            logger.info(f"Updated existing company record for INN {inn}")
        
        return company

    def _get_or_create_company(self, inn: str) -> Company:
        """Получает существующую компанию или создает новую"""
        company = (
            self.db.query(Company)
            .filter(Company.inn == inn)  # type: ignore
            .first()
        )
        
        if not company:
            try:
                # Создаем компанию с временным OGRN для избежания конфликта
                # OGRN должен быть максимум 13 символов, используем короткий формат
                temp_ogrn = f"T{inn[:8]}{datetime.now().strftime('%H%M%S')}"[:13]
                company = Company(
                    inn=inn,
                    ogrn=temp_ogrn,  # Временный OGRN, будет заменен из API
                    name=f"Company {inn}",  # Временное имя
                    created_at=datetime.now(),
                    updated_at=datetime.now()
                )
                self.db.add(company)
                self.db.flush()
                logger.info(
                    f"Created new company record for INN {inn} "
                    f"with temp OGRN {temp_ogrn}"
                )
            except Exception as e:
                # Если не удалось создать, попробуем найти существующую компанию
                error_msg = f"Failed to create company for INN {inn}: {e}"
                logger.warning(
                    f"{error_msg}. Trying to find existing."
                )
                company = (
                    self.db.query(Company)
                    .filter(Company.inn == inn)  # type: ignore
                    .first()
                )
                if not company:
                    raise e
        
        return company
    
    def _should_update_fns_data(
        self, company: Optional[Company], force_update: bool = False
    ) -> bool:
        """Проверяет нужно ли обновлять данные ФНС"""
        if force_update:
            return True  # type: ignore
        
        if not company or not company.last_fns_update:
            return True  # type: ignore
        
        # Если raw_fns_data пустой, значит данных нет - обновляем
        if not company.raw_fns_data:
            return True  # type: ignore
        
        # Обновляем данные ФНС если прошло больше 7 дней
        if company.last_fns_update:
            time_diff = datetime.now() - company.last_fns_update
            return bool(time_diff.total_seconds() > 7 * 24 * 3600)
        return True  # type: ignore
    
    def _should_update_scraper_data(
        self, company: Optional[Company], force_update: bool = False
    ) -> bool:
        """Проверяет нужно ли обновлять данные скрапера"""
        if force_update:
            return True  # type: ignore
        
        if not company or not company.last_scraper_update:
            return True  # type: ignore
        
        # Если raw_scraper_data пустой, значит данных нет - обновляем
        if not company.raw_scraper_data:
            return True  # type: ignore
        
        # Проверяем наличие важных полей в существующих данных
        # Если их нет - обновляем (значит парсер был улучшен)
        if company.raw_scraper_data:
            try:
                existing_data = (
                    json.loads(company.raw_scraper_data)
                    if isinstance(company.raw_scraper_data, str)
                    else company.raw_scraper_data
                )
                # Список критически важных полей
                critical_fields = ['address', 'name', 'general_director']
                missing_fields = [
                    f for f in critical_fields
                    if not existing_data.get(f) or existing_data.get(f) == "Адрес не найден"
                ]
                if missing_fields:
                    logger.info(
                        f"Found missing/invalid fields in company {company.inn}: "
                        f"{missing_fields}. Will update."
                    )
                    return True  # type: ignore
            except (json.JSONDecodeError, AttributeError, TypeError):
                # Если не можем распарсить - обновляем
                return True  # type: ignore
        
        # Обновляем данные скрапера если прошло больше 24 часов
        if company.last_scraper_update:
            time_diff = datetime.now() - company.last_scraper_update
            return bool(time_diff.total_seconds() > 24 * 3600)
        return True  # type: ignore
    
    async def _update_fns_data(self, company: Company) -> Dict[str, Any]:
        """Обновляет данные компании из ФНС API"""
        try:
            # Получаем данные из ФНС API
            fns_data = await fns_service.search_company(str(company.inn), "inn")
            
            if not fns_data:
                return {"success": False, "error": "No data from FNS API"}
            
            # Берем первую запись (должна быть одна для ИНН)
            company_data = fns_data[0]
            
            # Сохраняем сырые JSON данные
            company.raw_fns_data = json.dumps(  # type: ignore
                company_data, ensure_ascii=False, indent=2
            )
            company.last_fns_update = datetime.now()  # type: ignore
            
            # Обновляем структурированные данные
            self._update_company_from_fns_data(company, company_data)
            
            # Обновляем связанные данные
            await self._update_related_data_from_fns(company, company_data)
            
            self.db.flush()
            logger.info(f"FNS data updated for company {company.inn}")
            
            return {"success": True}
            
        except Exception as e:
            logger.error(f"Failed to update FNS data for company {company.inn}: {e}")
            return {"success": False, "error": str(e)}
    
    async def _update_scraper_data(self, company: Company) -> Dict[str, Any]:
        """Обновляет данные компании из скрапера"""
        try:
            # Получаем данные из скрапера
            scraper_data = await scraper_service.scrape_company(str(company.inn))
            
            if not scraper_data:
                return {"success": False, "error": "No data from scraper"}
            
            # Сохраняем сырые JSON данные
            company.raw_scraper_data = json.dumps(  # type: ignore
                scraper_data, ensure_ascii=False, indent=2
            )
            company.last_scraper_update = datetime.now()  # type: ignore
            
            # Обновляем структурированные данные из скрапера
            self._update_company_from_scraper_data(company, scraper_data)
            
            self.db.flush()
            logger.info(f"Scraper data updated for company {company.inn}")
            
            return {"success": True}
            
        except Exception as e:
            logger.error(
                f"Failed to update scraper data for company {company.inn}: {e}"
            )
            return {"success": False, "error": str(e)}
    
    def _update_company_from_fns_data(self, company: Company, fns_data: Dict[str, Any]):
        """Обновляет данные компании из ФНС данных"""
        # Обновляем OGRN только если он получен и не пустой
        if "ogrn" in fns_data and fns_data["ogrn"] and fns_data["ogrn"].strip():
            company.ogrn = fns_data["ogrn"].strip()
        elif company.ogrn.startswith("TEMP_"):
            # Если OGRN не получен, но у нас временный OGRN, оставляем его
            logger.warning(
                f"No OGRN received from FNS for company {company.inn}, "
                f"keeping temp OGRN"
            )
        
        if "name" in fns_data and fns_data["name"] and fns_data["name"].strip():
            company.name = fns_data["name"].strip()
        
        if "status" in fns_data and fns_data["status"] and fns_data["status"].strip():
            company.status = fns_data["status"].strip()
        
        if (
            "address" in fns_data and 
            fns_data["address"] and 
            fns_data["address"].strip()
        ):
            company.address = fns_data["address"].strip()
        
        if "registration_date" in fns_data and fns_data["registration_date"]:
            try:
                company.registration_date = datetime.strptime(  # type: ignore
                    fns_data["registration_date"], "%Y-%m-%d"
                ).date()
            except ValueError:
                logger.warning(f"Invalid date format: {fns_data['registration_date']}")
    
    def _update_company_from_scraper_data(
        self, company: Company, scraper_data: Dict[str, Any]
    ):
        """Обновляет данные компании из данных скрапера"""
        # Здесь можно добавить логику обновления данных из скрапера
        # Например, если скрапер находит дополнительную информацию
        pass
    
    async def _update_related_data_from_fns(
        self, company: Company, fns_data: Dict[str, Any]
    ):
        """Обновляет связанные данные (учредители, финансы и т.д.) из ФНС данных"""
        # Обновляем учредителей
        if "founders" in fns_data and fns_data["founders"]:
            # Удаляем старых учредителей
            self.db.query(Founder).filter(Founder.company_id == company.id).delete()
            
            # Добавляем новых учредителей
            for founder_data in fns_data["founders"]:
                founder = Founder(
                    company_id=company.id,
                    name=founder_data.get("name", ""),
                    share=founder_data.get("share", 0)
                )
                self.db.add(founder)
        
        # Здесь можно добавить обновление других связанных данных
        # (финансы, судебные дела, контракты) если они есть в ФНС API
    
    async def batch_process_companies(
        self, inn_list: List[str], force_update: bool = False
    ) -> Dict[str, Any]:
        """
        Обрабатывает список компаний в пакетном режиме
        
        Args:
            inn_list: Список ИНН для обработки
            force_update: Принудительное обновление
            
        Returns:
            Сводная статистика обработки
        """
        results: Dict[str, Any] = {
            "total": len(inn_list),
            "processed": 0,
            "fns_updated": 0,
            "scraper_updated": 0,
            "errors": 0,
            "details": []
        }
        
        for inn in inn_list:
            try:
                result = await self.process_company_data(inn, force_update)
                results["details"].append(result)
                results["processed"] += 1
                
                if result["fns_updated"]:
                    results["fns_updated"] += 1
                if result["scraper_updated"]:
                    results["scraper_updated"] += 1
                if result["errors"]:
                    results["errors"] += 1
                    
            except Exception as e:
                logger.error(f"Failed to process INN {inn}: {e}")
                results["errors"] += 1
                results["details"].append({
                    "inn": inn,
                    "errors": [str(e)],
                    "fns_updated": False,
                    "scraper_updated": False
                })
        
        logger.info(f"Batch processing completed: {results}")
        return results
    
    def get_company_json_data(self, inn: str) -> Dict[str, Any]:
        """Получает JSON данные компании из базы"""
        company = (
            self.db.query(Company)
            .filter(Company.inn == inn)  # type: ignore
            .first()
        )
        
        if not company:
            return {}
        
        result = {
            "inn": company.inn,
            "ogrn": company.ogrn,
            "name": company.name,
            "status": company.status,
            "address": company.address,
            "registration_date": (
                company.registration_date.isoformat() 
                if company.registration_date else None
            ),
            "created_at": (
                company.created_at.isoformat() 
                if company.created_at else None
            ),
            "updated_at": (
                company.updated_at.isoformat() 
                if company.updated_at else None
            ),
            "last_fns_update": (
                company.last_fns_update.isoformat() 
                if company.last_fns_update else None
            ),
            "last_scraper_update": (
                company.last_scraper_update.isoformat() 
                if company.last_scraper_update else None
            )
        }
        
        # Добавляем сырые JSON данные если они есть
        if company.raw_fns_data:
            try:
                result["raw_fns_data"] = json.loads(str(company.raw_fns_data))
            except json.JSONDecodeError:
                result["raw_fns_data"] = company.raw_fns_data
        
        if company.raw_scraper_data:
            try:
                result["raw_scraper_data"] = json.loads(str(company.raw_scraper_data))
            except json.JSONDecodeError:
                result["raw_scraper_data"] = company.raw_scraper_data
        
        return result

