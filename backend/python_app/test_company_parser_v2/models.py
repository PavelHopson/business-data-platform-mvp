from dataclasses import dataclass, asdict
from typing import Dict, List, Optional, Any
import json
import re

@dataclass
class CompanyData:
    """Модель данных компании"""
    inn: str
    name: Optional[str] = None
    status: Optional[str] = None
    ogrn: Optional[str] = None
    registration_date: Optional[str] = None
    general_director: Optional[Dict[str, Any]] = None  # {'name': str, 'source': str}
    founders: Optional[List[Dict[str, Any]]] = None  # [{'name': str, 'source': str}, ...]
    revenue: Optional[Dict[str, Any]] = None  # {'value': int, 'source': str} или {'2023': int, 'source': str}
    profit: Optional[Dict[str, Any]] = None  # Аналогично
    employees_count: Optional[Dict[str, Any]] = None  # {'value': int, 'source': str}
    activity: Optional[Dict[str, str]] = None 
    contacts: Optional[Dict[str, Any]] = None  # {'phone': str, ..., 'source': str}
    court_cases: Optional[Dict[str, Any]] = None  # {'total': int, 'source': str}
    meta: Optional[Dict[str, Any]] = None  # {'sources': list, 'timestamp': str}
    
    def __post_init__(self):
        """Валидация и очистка данных"""
        if self.inn and not re.match(r'^\d{10}$|^\d{12}$', self.inn):
            raise ValueError(f"Недопустимый ИНН: {self.inn}")
        if self.ogrn and not re.match(r'^\d{13}$', self.ogrn):
            self.ogrn = None
        if self.contacts:
            if "email" in self.contacts and self.contacts["email"]:
                if not re.match(r'^[\w\.-]+@[\w\.-]+\.\w+$', self.contacts["email"]):
                    self.contacts["email"] = None
            if "phone" in self.contacts and self.contacts["phone"]:
                 if not re.match(r'^\+?\d[\d\s\-()]+$', self.contacts["phone"]):
                    self.contacts["phone"] = None
    
    def to_dict(self) -> Dict[str, Any]:
        """Преобразовать в словарь"""
        return asdict(self)
    
    def to_json(self) -> str:
        """Преобразовать в JSON строку"""
        return json.dumps(self.to_dict(), ensure_ascii=False, indent=2)
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'CompanyData':
        """Создать из словаря"""
        model_fields = cls.__annotations__.keys()
        filtered_data = {k: v for k, v in data.items() if k in model_fields}
        return cls(**filtered_data)

@dataclass
class ParsingResult:
    """Результат парсинга одной компании"""
    inn: str
    success: bool
    data: Optional[CompanyData] = None
    error: Optional[str] = None
    sources_used: List[str] = None
    start_time: Optional[str] = None 
    
    def __post_init__(self):
        if self.sources_used is None:
            self.sources_used = []