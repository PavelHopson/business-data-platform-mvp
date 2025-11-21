"""
API эндпоинты для управления ETL процессом
"""

from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, BackgroundTasks
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database import get_db
from app.services.etl_service import ETLService
from app.core.logging import get_logger

logger = get_logger(__name__)

router = APIRouter()


class ETLProcessRequest(BaseModel):
    """Запрос на обработку ETL"""
    inn_list: List[str]
    force_update: bool = False


class ETLProcessResponse(BaseModel):
    """Ответ на запрос обработки ETL"""
    success: bool
    message: str
    results: Optional[Dict[str, Any]] = None
    errors: Optional[List[str]] = None


class JSONDataResponse(BaseModel):
    """Ответ с JSON данными компании"""
    success: bool
    data: Optional[Dict[str, Any]] = None
    error: Optional[str] = None


@router.post("/process", response_model=ETLProcessResponse)
async def process_companies(
    request: ETLProcessRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """
    Обрабатывает список компаний через ETL процесс
    
    Args:
        request: Запрос с списком ИНН и параметрами
        background_tasks: Фоновые задачи FastAPI
        db: Сессия базы данных
        
    Returns:
        Результат обработки
    """
    try:
        etl_service = ETLService(db)
        
        # Обрабатываем компании
        results = await etl_service.batch_process_companies(
            request.inn_list, 
            request.force_update
        )
        
        logger.info(f"ETL processing completed: {results}")
        
        return ETLProcessResponse(
            success=True,
            message=f"Successfully processed {results['processed']} companies",
            results=results
        )
        
    except Exception as e:
        logger.error(f"ETL processing failed: {e}", exc_info=True)
        return ETLProcessResponse(
            success=False,
            message="ETL processing failed",
            errors=[str(e)]
        )


@router.post("/process/{inn}", response_model=ETLProcessResponse)
async def process_single_company(
    inn: str,
    force_update: bool = False,
    db: Session = Depends(get_db)
):
    """
    Обрабатывает одну компанию по ИНН
    
    Args:
        inn: ИНН компании
        force_update: Принудительное обновление
        db: Сессия базы данных
        
    Returns:
        Результат обработки
    """
    try:
        etl_service = ETLService(db)
        
        result = await etl_service.process_company_data(inn, force_update)
        
        if result["errors"]:
            return ETLProcessResponse(
                success=False,
                message=f"Processing completed with errors for INN {inn}",
                results=result,
                errors=result["errors"]
            )
        else:
            return ETLProcessResponse(
                success=True,
                message=f"Successfully processed company {inn}",
                results=result
            )
        
    except Exception as e:
        logger.error(f"Failed to process company {inn}: {e}", exc_info=True)
        return ETLProcessResponse(
            success=False,
            message=f"Failed to process company {inn}",
            errors=[str(e)]
        )


@router.get("/company/{inn}/json", response_model=JSONDataResponse)
async def get_company_json_data(
    inn: str,
    db: Session = Depends(get_db)
):
    """
    Получает JSON данные компании из базы данных
    
    Args:
        inn: ИНН компании
        db: Сессия базы данных
        
    Returns:
        JSON данные компании
    """
    try:
        etl_service = ETLService(db)
        data = etl_service.get_company_json_data(inn)
        
        if not data:
            return JSONDataResponse(
                success=False,
                error=f"Company with INN {inn} not found"
            )
        
        return JSONDataResponse(
            success=True,
            data=data
        )
        
    except Exception as e:
        logger.error(f"Failed to get JSON data for company {inn}: {e}", exc_info=True)
        return JSONDataResponse(
            success=False,
            error=str(e)
        )


@router.get("/verify-json-storage")
async def verify_json_storage(
    inn_list: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Проверяет сохранение JSON данных в базе данных
    
    Args:
        inn_list: Список ИНН через запятую (опционально)
        db: Сессия базы данных
        
    Returns:
        Результаты проверки
    """
    try:
        etl_service = ETLService(db)
        
        if inn_list:
            # Используем переданный список ИНН
            inns = [inn.strip() for inn in inn_list.split(",") if inn.strip()]
        else:
            # Получаем все ИНН из базы
            from app.models.company import Company
            companies = db.query(Company).all()
            inns = [str(company.inn) for company in companies]
        
        if not inns:
            return {
                "success": False,
                "error": "No INNs found for verification"
            }
        
        # Проверяем каждую компанию
        verification_results: Dict[str, Any] = {
            "total_checked": len(inns),
            "with_fns_data": 0,
            "with_scraper_data": 0,
            "with_both_data": 0,
            "missing_data": 0,
            "details": []
        }
        
        for inn in inns:
            data = etl_service.get_company_json_data(inn)
            
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
        
        return {
            "success": True,
            "verification_results": verification_results
        }
        
    except Exception as e:
        logger.error(
            f"JSON storage verification failed: {e}",
            exc_info=True
        )
        return {
            "success": False,
            "error": str(e)
        }


@router.get("/status")
async def get_etl_status(db: Session = Depends(get_db)):
    """
    Получает статус ETL системы
    
    Returns:
        Статус системы
    """
    try:
        from app.models.company import Company
        
        # Получаем статистику по компаниям
        total_companies = db.query(Company).count()
        companies_with_fns = (
            db.query(Company)
            .filter(Company.raw_fns_data.isnot(None))  # type: ignore
            .count()
        )
        companies_with_scraper = (
            db.query(Company)
            .filter(Company.raw_scraper_data.isnot(None))  # type: ignore
            .count()
        )
        
        # Получаем последние обновления
        latest_fns_update = db.query(Company.last_fns_update).filter(  # type: ignore
            Company.last_fns_update.isnot(None)  # type: ignore
        ).order_by(Company.last_fns_update.desc()).first()  # type: ignore
        
        latest_scraper_update = (
            db.query(Company.last_scraper_update)
            .filter(Company.last_scraper_update.isnot(None))  # type: ignore
            .order_by(Company.last_scraper_update.desc())  # type: ignore
            .first()
        )
        
        return {
            "success": True,
            "status": {
                "total_companies": total_companies,
                "companies_with_fns_data": companies_with_fns,
                "companies_with_scraper_data": companies_with_scraper,
                "latest_fns_update": (
                    latest_fns_update[0].isoformat()
                    if latest_fns_update and latest_fns_update[0] else None
                ),
                "latest_scraper_update": (
                    latest_scraper_update[0].isoformat()
                    if latest_scraper_update and latest_scraper_update[0] else None
                )
            }
        }
        
    except Exception as e:
        logger.error(f"Failed to get ETL status: {e}", exc_info=True)
        return {
            "success": False,
            "error": str(e)
        }




