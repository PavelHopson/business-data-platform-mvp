import os
import json
from typing import List, Dict, Any, Optional
from datetime import datetime
import logging

from models import CompanyData, ParsingResult
from parsers.listorg_parser import ListOrgParser
 

from config import OUTPUT_DIR

class CompanyParser:
    
    
    def __init__(self):
        self.parsers = [
            ListOrgParser()
             
        ]
        self.results: List[ParsingResult] = []
        
        os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    def parse_company(self, inn: str) -> ParsingResult:
        
        logging.info(f"Парсинг компании с ИНН: {inn}")
        
        start_time = datetime.now()
        combined_data = {"inn": inn}
        sources_used = []
        errors = []
        
        for parser in self.parsers:
            try:
                parser_name = parser.__class__.__name__
                logging.info(f"Попытка парсинга с {parser_name}...")
                
                data = parser.parse_company(inn)
                
                if data:
                    combined_data = self._merge_data(combined_data, data)
                    sources_used.append(parser_name)
                    logging.info(f"✓ Данные получены с {parser_name}")
                else:
                    logging.warning(f"✗ Данные не получены с {parser_name}")
                    errors.append(f"Данные не получены с {parser_name}")
                    
            except Exception as e:
                error_msg = f"Ошибка в {parser.__class__.__name__}: {str(e)}"
                errors.append(error_msg)
                logging.error(error_msg, exc_info=True)
        
        company_data = None
        if len(combined_data) > 1:
            try:
                company_data = CompanyData.from_dict(combined_data)
            except Exception as e:
                errors.append(f"Ошибка создания объекта CompanyData: {str(e)}")
                logging.error(f"Ошибка создания объекта CompanyData: {str(e)}")
        
        success = company_data is not None and self._has_required_data(company_data)
        
        result = ParsingResult(
            inn=inn,
            success=success,
            data=company_data,
            error="; ".join(errors) if errors else None,
            sources_used=sources_used,
            start_time=start_time.strftime('%Y-%m-%d %H:%M:%S')
        )
        
        self.results.append(result)
        return result
    
    def _merge_data(self, base_data: Dict[str, Any], new_data: Dict[str, Any]) -> Dict[str, Any]:
        
        merged = base_data.copy()
        
        for key, value in new_data.items():
            if value is not None and value != "" and value != [] and value != {}:
                merged[key] = value
        
        return merged
    
    def _has_required_data(self, company_data: CompanyData) -> bool:
        
        return bool(company_data.company_name or company_data.ogrn)
    
    def parse_companies(self, inns: List[str]) -> List[ParsingResult]:
        
        logging.info(f"Начинаем парсинг {len(inns)} компаний...")
        logging.info(f"Время начала: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
        results = []
        for inn in inns:
            results.append(self.parse_company(inn))
        
        logging.info(f"Парсинг завершен!")
        logging.info(f"Время окончания: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
        return results
    
    def get_statistics(self) -> Dict[str, Any]:
        
        total = len(self.results)
        successful = len([r for r in self.results if r.success])
        failed = total - successful
        
        sources = set()
        for r in self.results:
            sources.update(r.sources_used)
        
        return {
            "total_companies": total,
            "successful_parses": successful,
            "failed_parses": failed,
            "success_rate": f"{(successful/total*100):.1f}%" if total > 0 else "0%",
            "sources_used": list(sources)
        }