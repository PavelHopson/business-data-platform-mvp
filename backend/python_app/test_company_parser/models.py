from dataclasses import dataclass, asdict
from typing import Dict, List, Optional, Any
import json
import re

@dataclass
class CompanyData:
    
    inn: str
    ogrn: Optional[str] = None
    company_name: Optional[str] = None
    general_director: Optional[str] = None
    founders: Optional[List[str]] = None
    revenue: Optional[Dict[str, int]] = None
    profit: Optional[Dict[str, int]] = None
    employees_count: Optional[int] = None
    activity: Optional[Dict[str, str]] = None 
    contacts: Optional[Dict[str, str]] = None
    court_cases: Optional[int] = None
    
    def __post_init__(self):
        
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
        
        return asdict(self)
    
    def to_json(self) -> str:
        
        return json.dumps(self.to_dict(), ensure_ascii=False, indent=2)
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'CompanyData':
        
        model_fields = cls.__annotations__.keys()
        filtered_data = {k: v for k, v in data.items() if k in model_fields}
        return cls(**filtered_data)

@dataclass
class ParsingResult:
    
    inn: str
    success: bool
    data: Optional[CompanyData] = None
    error: Optional[str] = None
    sources_used: List[str] = None
    start_time: Optional[str] = None 
    
    def __post_init__(self):
        if self.sources_used is None:
            self.sources_used = []