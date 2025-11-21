from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from sqlalchemy import text
from app.schemas.company import CompanyDetail
from app.schemas.search import SearchRequest
from app.schemas.court_case import CourtCaseResponse
from app.crud.company import get_company_by_inn, search_companies
from app.crud.court_case import get_court_cases_by_company_inn
from app.database import get_db

router = APIRouter(prefix="/v1")



@router.get("/company/{inn}", response_model=CompanyDetail)
def get_company(inn: str, db: Session = Depends(get_db)):
    company = get_company_by_inn(db, inn)
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    return company



@router.post("/search", response_model=dict)
def search_companies_endpoint(search: SearchRequest, db: Session = Depends(get_db)):
    results, next_last_id = search_companies(
        db,
        search.query,
        search.region,
        search.status,
    )
    return {
        "success": True,
        "data": {
            "results": results,
            "totalCount": len(results),
            "page": 1,
            "totalPages": 1
        }
    }



@router.get("/company/{inn}/cases", response_model=List[CourtCaseResponse])
def get_company_court_cases(inn: str, db: Session = Depends(get_db)):
    court_cases = get_court_cases_by_company_inn(db, inn)
    if not court_cases:
        company = get_company_by_inn(db, inn)
        if not company:
            raise HTTPException(status_code=404, detail="Company not found")
        return []
    return court_cases



@router.get("/health/db")
def check_db_connection(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        return {"status": "success", "message": "Database connected"}
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Database connection failed: {str(e)}"
        )