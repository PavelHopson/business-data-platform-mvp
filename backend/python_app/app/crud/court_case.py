from typing import List, Optional
from datetime import date
from sqlalchemy.orm import Session
from app.models.court_case import CourtCase
from app.models.company import Company
from app.schemas.court_case import CourtCaseResponse

def get_court_cases_by_company_inn(db: Session, inn: str) -> List[CourtCaseResponse]:
    
    company = db.query(Company).filter(Company.inn == inn).first()  # type: ignore
    if not company:
        return []
    
    court_cases = (
        db.query(CourtCase)
        .filter(CourtCase.company_id == company.id)  # type: ignore
        .all()
    )
    
    return [
        CourtCaseResponse(
            case_id=str(case.case_number),
            date=case.date.isoformat() if case.date else None,
            type=str(case.type) if case.type else None,
            status=str(case.status) if case.status else None
        )
        for case in court_cases
    ]

def get_court_case_by_id(db: Session, case_id: int) -> Optional[CourtCase]:
    
    return db.query(CourtCase).filter(CourtCase.id == case_id).first()

def create_court_case(db: Session, company_id: int, case_number: str, 
                    date: Optional[date] = None, status: Optional[str] = None, 
                    type: Optional[str] = None) -> CourtCase:
    
    court_case = CourtCase(
        company_id=company_id,
        case_number=case_number,
        date=date,
        status=status,
        type=type
    )
    db.add(court_case)
    db.commit()
    db.refresh(court_case)
    return court_case
