from pydantic import BaseModel
from typing import Optional, List, Dict, Any


class SearchRequest(BaseModel):
    query: str
    region: Optional[str] = None
    status: Optional[str] = None
    type: Optional[str] = None


class SearchResult(BaseModel):
    inn: str
    ogrn: Optional[str] = None
    name: str
    status: Optional[str] = None
    address: Optional[str] = None
    registration_date: Optional[str] = None
    kpp: Optional[str] = None
    okved: Optional[str] = None
    management: Optional[Dict[str, Any]] = None
    founders: Optional[List[Dict[str, Any]]] = None


class CompanySearchResponse(BaseModel):
    success: bool
    data: Dict[str, Any]
    message: Optional[str] = None
