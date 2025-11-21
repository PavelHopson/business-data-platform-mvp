from typing import Optional, Tuple, List, cast
from datetime import date
from sqlalchemy.orm import Session, joinedload
from app.models.company import Company
from app.schemas.company import CompanyDetail, FounderBase, FinancialBase, ContractBase
from app.schemas.court_case import CourtCaseBase
from app.services.fns_api import fns_service
from app.core.logging import get_logger

logger = get_logger(__name__)


def get_company_by_inn(db: Session, inn: str) -> Optional[CompanyDetail]:
    company = (
        db.query(Company)
        .options(
            joinedload(Company.founders),
            joinedload(Company.financials),
            joinedload(Company.court_cases),
            joinedload(Company.contracts),
        )
        .filter(Company.inn == inn)  # type: ignore
        .first()
    )
    if not company:
        return None

    return CompanyDetail(
        id=int(company.id),
        inn=str(company.inn),
        ogrn=str(company.ogrn),
        name=str(company.name),
        status=str(company.status) if company.status else None,
        address=str(company.address) if company.address else None,
        registration_date=cast(
            Optional[date], company.registration_date
        ),
        founders=[
            FounderBase(name=founder.name, share=founder.share)
            for founder in company.founders
        ],
        financials=[
            FinancialBase(
                year=financial.year,
                revenue=financial.revenue,
                profit=financial.profit,
                assets=financial.assets,
            )
            for financial in company.financials
        ],
        court_cases=[
            CourtCaseBase(
                case_number=case.case_number,
                date=case.date.isoformat() if case.date else None,
                status=case.status,
                type=case.type,
            )
            for case in company.court_cases
        ],
        contracts=[
            ContractBase(
                customer=contract.customer, amount=contract.amount, date=contract.date
            )
            for contract in company.contracts
        ],
    )


def search_companies(
    db: Session,
    query: str,
    region: Optional[str] = None,
    status: Optional[str] = None,
    last_id: int = 0,
    page_size: int = 50,
) -> Tuple[List[dict], int]:
    if page_size > 100:
        page_size = 100
    if page_size < 1:
        page_size = 1

    from sqlalchemy import or_

    stmt = db.query(Company)
    query_clean = query.strip()

    search_conditions = []

    if query_clean.isdigit() and len(query_clean) in (10, 12):
        search_conditions.append(Company.inn == query_clean)

    if query_clean.isdigit() and len(query_clean) in (13, 15):
        search_conditions.append(Company.ogrn == query_clean)

        search_conditions.append(
            Company.name.ilike(f"%{query_clean}%")  # type: ignore
        )
        search_conditions.append(
            Company.address.ilike(f"%{query_clean}%")  # type: ignore
        )
    from app.models.founder import Founder

    search_conditions.append(
        Company.founders.any(Founder.name.ilike(f"%{query_clean}%"))  # type: ignore
    )

    if search_conditions:
        stmt = stmt.filter(or_(*search_conditions))  # type: ignore
    else:
        stmt = stmt.filter(Company.name.ilike(f"%{query_clean}%"))  # type: ignore

    if region:
        stmt = stmt.filter(Company.address.ilike(f"%{region.strip()}%"))  # type: ignore
    if status:
        stmt = stmt.filter(Company.status == status)

    stmt = stmt.filter(Company.id > last_id)  # type: ignore

    stmt = stmt.order_by(Company.id)  # type: ignore

    companies = stmt.limit(page_size).all()

    results = [
        {
            "id": str(company.id),
            "inn": company.inn,
            "name": company.name,
            "status": company.status,
            "address": company.address,
            "ogrn": company.ogrn,
            "registrationDate": (
                company.registration_date.isoformat()
                if company.registration_date
                else None
            ),
            "rating": {"score": 75, "level": "medium"},
        }
        for company in companies
    ]

    next_last_id = int(companies[-1].id) if companies else last_id

    return results, next_last_id


async def search_companies_fns(
    query: str,
    region: Optional[str] = None,
    status: Optional[str] = None,
) -> Tuple[List[dict], int]:
    try:
        companies = await fns_service.search_company(query)
        
        filtered_companies = companies
        
        if region:
            filtered_companies = [
                company for company in filtered_companies
                if company.get("address", "").lower().find(region.lower()) != -1
            ]
        
        if status:
            filtered_companies = [
                company for company in filtered_companies
                if company.get("status", "").lower() == status.lower()
            ]
        
        return filtered_companies, 0
        
    except Exception:
        return [], 0


async def get_company_by_inn_fns(inn: str) -> Optional[dict]:
    try:
        company_data = await fns_service.get_company_details(inn)
        return company_data
    except Exception:
        return None


async def get_company_purchases_fns(inn: str) -> List[dict]:
    try:
        purchases = await fns_service.get_company_purchases(inn)
        return purchases
    except Exception:
        return []


async def get_company_financials_fns(inn: str) -> List[dict]:
    try:
        result = await fns_service._make_request("bo", {"req": inn})
        
        if result and "items" in result and result["items"]:
            financials = []
            for item in result["items"]:
                financials.append({
                    "year": item.get("year", ""),
                    "revenue": item.get("revenue", 0),
                    "profit": item.get("profit", 0),
                    "assets": item.get("assets", 0),
                    "liabilities": item.get("liabilities", 0)
                })
            return financials
        
        return []
    except Exception as e:
        logger.error(f"Error getting financials for INN {inn}: {e}")
        return []


async def get_company_court_cases_fns(inn: str) -> List[dict]:
    try:
        result = await fns_service._make_request("check", {"req": inn})
        
        if result and "items" in result and result["items"]:
            court_cases = []
            for item in result["items"]:
                if item.get("type") == "судебные дела":
                    court_cases.append({
                        "case_number": item.get("number", ""),
                        "date": item.get("date", ""),
                        "status": item.get("status", ""),
                        "type": item.get("type", ""),
                        "court": item.get("court", ""),
                        "description": item.get("description", "")
                    })
            return court_cases
        
        return []
    except Exception as e:
        logger.error(f"Error getting court cases for INN {inn}: {e}")
        return []


async def get_company_founders_fns(inn: str) -> List[dict]:
    try:
        result = await fns_service._make_request("egr", {"req": inn})
        
        if result and "items" in result and result["items"]:
            company_data = result["items"][0]
            founders = []
            
            if "Учредители" in company_data:
                for founder in company_data["Учредители"]:
                    founders.append({
                        "name": founder.get("name", ""),
                        "share": founder.get("share", 0),
                        "type": founder.get("type", ""),
                        "inn": founder.get("inn", ""),
                        "ogrn": founder.get("ogrn", "")
                    })
            
            return founders
        
        return []
    except Exception as e:
        logger.error(f"Error getting founders for INN {inn}: {e}")
        return []
