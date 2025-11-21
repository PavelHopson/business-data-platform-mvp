from pydantic import BaseModel
from typing import List, Optional
from datetime import date
from app.schemas.court_case import CourtCaseBase
from pydantic import Field

class CompanyBase(BaseModel):
    inn: str
    ogrn: str
    name: str
    status: Optional[str] = None
    address: Optional[str] = None
    registration_date: Optional[date] = None

class Company(CompanyBase):
    id: int
    class Config:
        from_attributes = True

class FounderBase(BaseModel):
    name: str
    share: Optional[float] = None

class FinancialBase(BaseModel):
    year: int
    revenue: Optional[float] = None
    profit: Optional[float] = None
    assets: Optional[float] = None

class ContractBase(BaseModel):
    customer: str
    amount: float
    date: date  

class CompanyDetail(Company):
    founders: List[FounderBase] = []
    financials: List[FinancialBase] = []
    court_cases: List[CourtCaseBase] = []
    contracts: List[ContractBase] = []


class ScrapedActivity(BaseModel):
    code: Optional[str] = None
    desc: Optional[str] = None


class ScrapedContacts(BaseModel):
    phone: Optional[str] = None
    email: Optional[str] = None
    website: Optional[str] = None


class ScrapedMeta(BaseModel):
    sources: List[str] = []
    last_update: Optional[str] = None
    data_quality: Optional[str] = None


class ScrapedCompany(BaseModel):
    inn: str
    ogrn: Optional[str] = None
    company_name: Optional[str] = Field(default=None, alias="company_name")
    status: Optional[str] = None
    address: Optional[str] = None
    registration_date: Optional[str] = None
    general_director: Optional[str] = None
    founders: List[str] = []
    revenue: Optional[dict[str, int]] = None
    profit: Optional[dict[str, int]] = None
    employees_count: Optional[int] = None
    activity: Optional[ScrapedActivity] = None
    contacts: Optional[ScrapedContacts] = None
    court_cases: Optional[int] = None
    last_scraper_update: Optional[str] = None
    meta: Optional[ScrapedMeta] = None

    class Config:
        populate_by_name = True