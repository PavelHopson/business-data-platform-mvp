"""
Улучшенный ETL скрипт с поддержкой обновления данных при повторной выгрузке
Интегрирует API парсеры и сохраняет JSON данные в БД
"""

import sys
import os
import asyncio
from datetime import datetime
from typing import List, Dict, Any

# Добавляем путь к основному приложению
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.services.etl_service import ETLService
from app.core.logging import get_logger

logger = get_logger(__name__)


class EnhancedETLProcessor:
    """Улучшенный ETL процессор с поддержкой обновления данных"""
    
    def __init__(self):
        self.db: Session = SessionLocal()
        self.etl_service = ETLService(self.db)
    
    async def process_inn_list(self, inn_list: List[str], force_update: bool = False) -> Dict[str, Any]:
        """
        Обрабатывает список ИНН с поддержкой обновления данных
        
        Args:
            inn_list: Список ИНН для обработки
            force_update: Принудительное обновление всех данных
            
        Returns:
            Результаты обработки
        """
        logger.info(f"Starting ETL processing for {len(inn_list)} companies")
        logger.info(f"Force update: {force_update}")
        
        start_time = datetime.now()
        
        try:
            # Обрабатываем компании в пакетном режиме
            results = await self.etl_service.batch_process_companies(inn_list, force_update)
            
            end_time = datetime.now()
            processing_time = (end_time - start_time).total_seconds()
            
            # Добавляем метрики времени
            results["processing_time_seconds"] = processing_time
            results["start_time"] = start_time.isoformat()
            results["end_time"] = end_time.isoformat()
            
            logger.info(f"ETL processing completed in {processing_time:.2f} seconds")
            logger.info(f"Results: {results}")
            
            return results
            
        except Exception as e:
            logger.error(f"ETL processing failed: {e}", exc_info=True)
            raise
        finally:
            self.db.close()
    
    def load_inn_list_from_file(self, file_path: str) -> List[str]:
        """
        Загружает список ИНН из файла
        
        Args:
            file_path: Путь к файлу с ИНН
            
        Returns:
            Список ИНН
        """
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                inn_list = [line.strip() for line in f if line.strip()]
            
            logger.info(f"Loaded {len(inn_list)} INNs from {file_path}")
            return inn_list
            
        except FileNotFoundError:
            logger.error(f"File not found: {file_path}")
            raise
        except Exception as e:
            logger.error(f"Error loading INN list: {e}")
            raise
    
    async def process_single_company(self, inn: str, force_update: bool = False) -> Dict[str, Any]:
        """
        Обрабатывает одну компанию
        
        Args:
            inn: ИНН компании
            force_update: Принудительное обновление
            
        Returns:
            Результат обработки
        """
        logger.info(f"Processing single company: {inn}")
        
        try:
            result = await self.etl_service.process_company_data(inn, force_update)
            logger.info(f"Company {inn} processed: {result}")
            return result
            
        except Exception as e:
            logger.error(f"Failed to process company {inn}: {e}")
            raise
        finally:
            self.db.close()
    
    def get_company_json_data(self, inn: str) -> Dict[str, Any]:
        """
        Получает JSON данные компании из базы
        
        Args:
            inn: ИНН компании
            
        Returns:
            JSON данные компании
        """
        try:
            data = self.etl_service.get_company_json_data(inn)
            logger.info(f"Retrieved JSON data for company {inn}")
            return data
            
        except Exception as e:
            logger.error(f"Failed to get JSON data for company {inn}: {e}")
            raise
        finally:
            self.db.close()
    
    def verify_json_storage(self, inn_list: List[str]) -> Dict[str, Any]:
        """
        Проверяет сохранение JSON данных в БД
        
        Args:
            inn_list: Список ИНН для проверки
            
        Returns:
            Результаты проверки
        """
        verification_results = {
            "total_checked": len(inn_list),
            "with_fns_data": 0,
            "with_scraper_data": 0,
            "with_both_data": 0,
            "missing_data": 0,
            "details": []
        }
        
        try:
            for inn in inn_list:
                data = self.etl_service.get_company_json_data(inn)
                
                has_fns = bool(data.get("raw_fns_data"))
                has_scraper = bool(data.get("raw_scraper_data"))
                
                if has_fns:
                    verification_results["with_fns_data"] += 1
                if has_scraper:
                    verification_results["with_scraper_data"] += 1
                if has_fns and has_scraper:
                    verification_results["with_both_data"] += 1
                if not has_fns and not has_scraper:
                    verification_results["missing_data"] += 1
                
                verification_results["details"].append({
                    "inn": inn,
                    "has_fns_data": has_fns,
                    "has_scraper_data": has_scraper,
                    "last_fns_update": data.get("last_fns_update"),
                    "last_scraper_update": data.get("last_scraper_update")
                })
            
            logger.info(f"JSON storage verification completed: {verification_results}")
            return verification_results
            
        except Exception as e:
            logger.error(f"JSON storage verification failed: {e}")
            raise
        finally:
            self.db.close()


async def main():
    """Основная функция для запуска ETL процесса"""
    processor = EnhancedETLProcessor()
    
    try:
        # Загружаем список ИНН из файла
        inn_list = processor.load_inn_list_from_file("input/inn_list.txt")
        
        if not inn_list:
            logger.warning("No INNs found in input file")
            return
        
        # Обрабатываем компании
        results = await processor.process_inn_list(inn_list, force_update=False)
        
        # Проверяем сохранение JSON данных
        verification = processor.verify_json_storage(inn_list)
        
        # Выводим результаты
        print("\n" + "="*50)
        print("ETL PROCESSING RESULTS")
        print("="*50)
        print(f"Total companies processed: {results['total']}")
        print(f"Successfully processed: {results['processed']}")
        print(f"FNS data updated: {results['fns_updated']}")
        print(f"Scraper data updated: {results['scraper_updated']}")
        print(f"Errors: {results['errors']}")
        print(f"Processing time: {results['processing_time_seconds']:.2f} seconds")
        
        print("\n" + "="*50)
        print("JSON STORAGE VERIFICATION")
        print("="*50)
        print(f"Companies with FNS data: {verification['with_fns_data']}")
        print(f"Companies with scraper data: {verification['with_scraper_data']}")
        print(f"Companies with both data: {verification['with_both_data']}")
        print(f"Companies missing data: {verification['missing_data']}")
        
        # Показываем детали для первых 3 компаний
        print("\n" + "="*50)
        print("SAMPLE COMPANY DATA")
        print("="*50)
        for i, inn in enumerate(inn_list[:3]):
            data = processor.get_company_json_data(inn)
            print(f"\nCompany {i+1} (INN: {inn}):")
            print(f"  Name: {data.get('name', 'N/A')}")
            print(f"  Status: {data.get('status', 'N/A')}")
            print(f"  Has FNS data: {bool(data.get('raw_fns_data'))}")
            print(f"  Has scraper data: {bool(data.get('raw_scraper_data'))}")
            print(f"  Last FNS update: {data.get('last_fns_update', 'N/A')}")
            print(f"  Last scraper update: {data.get('last_scraper_update', 'N/A')}")
        
    except Exception as e:
        logger.error(f"ETL process failed: {e}", exc_info=True)
        raise


if __name__ == "__main__":
    asyncio.run(main())




