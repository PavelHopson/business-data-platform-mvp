from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from sqlalchemy import text
from datetime import date
from app.schemas.company import ContractBase
from app.schemas.search import SearchRequest
from app.schemas.court_case import CourtCaseResponse
from app.crud.company import (
    get_company_purchases_fns,
    get_company_financials_fns,
    get_company_court_cases_fns as get_court_cases_from_fns,
    get_company_founders_fns as get_founders_from_fns,
)
from app.crud.court_case import get_court_cases_by_company_inn
from app.crud.contract import get_contracts_by_company_inn
from app.database import get_db
from app.core.logging import get_logger, log_business_event
from app.core.exceptions import NotFoundError, DatabaseError
from app.services.fns_api import fns_service

# Импортируем ETL роутер
from app.api.v1.etl import router as etl_router

router = APIRouter()

# Включаем ETL роутер
router.include_router(etl_router, prefix="/etl", tags=["ETL"])
logger = get_logger(__name__)


@router.get("/company/{inn}")
async def get_company(inn: str) -> Dict[str, Any]:
    logger.info(f"=== ENDPOINT CALLED: /v1/company/{inn} ===")
    logger.info("GETTING COMPANY DATA FROM FNS API - METHOD 'egr'")

    if not inn or len(inn) not in [10, 12]:
        raise HTTPException(status_code=422, detail="Некорректный формат ИНН")

    try:
        log_business_event("company_lookup", {"inn": inn})

        logger.info(f"Getting company data from FNS API for INN: {inn}")
        company_data = await fns_service.get_company_details(inn)

        if company_data:
            logger.info(f"Company data retrieved for INN: {inn}")
            return {
                "success": True,
                "data": {
                    "inn": inn,
                    "company_data": company_data,
                },
                "message": "Данные компании получены",
            }

        logger.warning(f"Company with INN {inn} not found or access forbidden")
        return {
            "success": False,
            "data": {
                "inn": inn,
                "company_data": None,
            },
            "message": "Компания не найдена или доступ к данным ФНС ограничен",
        }

    except NotFoundError:
        raise
    except Exception as e:
        logger.error(f"Error in get_company for INN {inn}: {e}", exc_info=True)
        raise DatabaseError("Ошибка при получении данных компании")


@router.get("/company/{inn}/scrape", response_model=Dict[str, Any])
async def scrape_company(
    inn: str, force_update: bool = False, db: Session = Depends(get_db)
) -> Dict[str, Any]:
    logger.info(f"=== ENDPOINT CALLED: /v1/company/{inn}/scrape ===")
    if not inn or len(inn) not in [10, 12]:
        raise HTTPException(status_code=422, detail="Некорректный формат ИНН")

    try:
        log_business_event("company_scrape", {"inn": inn})

        # Используем ETL сервис для скрапинга и сохранения в БД
        from app.services.etl_service import ETLService
        
        etl_service = ETLService(db)
        
        # Запускаем ETL с возможностью принудительного обновления
        etl_result = await etl_service.process_company_data(
            inn, force_update=force_update
        )
        
        print("===== ETL RESULT =====")
        print(f"ETL result: {etl_result}")
        print(f"ETL result company_id: {etl_result.get('company_id')}")
        print(f"ETL result type: {type(etl_result.get('company_id'))}")
        print("======================")
        
        if etl_result.get("company_id"):
            print("===== INSIDE IF BLOCK =====")
            # Получаем обновленные данные из БД
            from app.models.company import Company
            company = (
                db.query(Company)
                .filter(Company.inn == inn)  # type: ignore
                .first()
            )
            
            if company:
                # Формируем ответ с данными из raw_scraper_data
                # (там есть ВСЕ поля!)
                scraped_data: Dict[str, Any] = {
                    "inn": company.inn,
                    "company_name": company.name,
                    "ogrn": company.ogrn,
                    "status": company.status,
                    "address": company.address,
                    "registration_date": (
                        company.registration_date.isoformat() 
                        if company.registration_date else None
                    ),
                    "last_scraper_update": (
                        company.last_scraper_update.isoformat() 
                        if company.last_scraper_update else None
                    )
                }
                
                # Добавляем данные из raw_scraper_data если они есть
                if company.raw_scraper_data:
                    try:
                        import json
                        raw_data = json.loads(str(company.raw_scraper_data))
                        # Добавляем ВСЕ поля из raw_scraper_data
                        scraped_data.update({
                            "general_director": raw_data.get("general_director"),
                            "founders": raw_data.get("founders", []),
                            "revenue": raw_data.get("revenue"),
                            "profit": raw_data.get("profit"),
                            "employees_count": raw_data.get("employees_count"),
                            "activity": raw_data.get("activity"),
                            "contacts": raw_data.get("contacts"),
                            "court_cases": raw_data.get("court_cases"),
                            # Добавляем основные поля из raw_scraper_data
                            "status": raw_data.get("status") or company.status,
                            "address": (raw_data.get("address") or 
                                       company.address or 
                                       "Адрес не найден"),
                            "registration_date": (
                                raw_data.get("registration_date") or 
                                (
                                    company.registration_date.isoformat() 
                                    if company.registration_date else None
                                )
                            ),
                            # Добавляем meta информацию из raw_scraper_data
                            "meta": raw_data.get("meta", {
                                "sources": [
                                    "pb.nalog.ru", 
                                    "rusprofile.ru", 
                                    "list-org.com"
                                ],
                                "last_update": (
                                    company.last_scraper_update.isoformat() 
                                    if company.last_scraper_update else None
                                ),
                                "data_quality": "verified"
                            })
                        })
                    except json.JSONDecodeError:
                        logger.warning(
                            f"Failed to parse raw_scraper_data for INN {inn}"
                        )
                        # Добавляем meta информацию с источниками и временем
                        scraped_data["meta"] = {
                            "sources": [
                                "pb.nalog.ru", 
                                "rusprofile.ru", 
                                "list-org.com"
                            ],
                            "last_update": (
                                company.last_scraper_update.isoformat() 
                                if company.last_scraper_update else None
                            ),
                            "data_quality": "basic"
                        }
                else:
                    # Если нет raw_scraper_data, добавляем null поля
                    scraped_data.update({
                        "general_director": None,
                        "founders": [],
                        "revenue": None,
                        "profit": None,
                        "employees_count": None,
                        "activity": None,
                        "contacts": None,
                        "court_cases": None,
                        "meta": {
                            "sources": [
                                "pb.nalog.ru", 
                                "rusprofile.ru", 
                                "list-org.com"
                            ],
                            "last_update": (
                                company.last_scraper_update.isoformat() 
                                if company.last_scraper_update else None
                            ),
                            "data_quality": "basic"
                        }
                    })
                
                # Логируем финальные данные
                print("===== FINAL SCRAPED DATA =====")
                print(f"Keys: {list(scraped_data.keys())}")
                print(f"Status: {scraped_data.get('status')}")
                print(f"Address: {scraped_data.get('address')}")
                print(f"Registration date: {scraped_data.get('registration_date')}")
                print(f"Meta: {scraped_data.get('meta')}")
                print("==============================")
                
                # Возвращаем данные напрямую БЕЗ валидации Pydantic
                return {
                    "success": True,
                    "data": scraped_data,  # Возвращаем данные напрямую!
                    "etl_result": {
                        "scraper_updated": etl_result.get("scraper_updated", False),
                        "company_id": etl_result.get("company_id"),
                        "errors": etl_result.get("errors", [])
                    }
                }

        return {
            "success": False,
            "data": None,
            "message": "Не удалось получить данные с list-org.com",
            "etl_result": etl_result
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error scraping company {inn}: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Ошибка при парсинге компании")


@router.get("/company/{inn}/cases", response_model=List[CourtCaseResponse])
def get_company_court_cases(
    inn: str, db: Session = Depends(get_db)
) -> List[CourtCaseResponse]:
    if not inn or len(inn) not in [10, 12]:
        raise HTTPException(status_code=422, detail="Некорректный формат ИНН")

    try:
        log_business_event("court_cases_lookup", {"inn": inn})

        court_cases = get_court_cases_by_company_inn(db, inn)

        if not court_cases:
            logger.info(f"No court cases found for INN: {inn}, returning fallback data")
            fallback_cases = [
                CourtCaseResponse(
                    case_id="NO-DATA",
                    date="1970-01-01",
                    type="info",
                    status="no_data",
                )
            ]
            return fallback_cases

        logger.info(
            f"Successfully retrieved {len(court_cases)} court cases for INN: {inn}"
        )
        return court_cases

    except Exception as e:
        logger.error(
            f"Error in get_company_court_cases for INN {inn}: {e}", exc_info=True
        )
        error_cases = [
            CourtCaseResponse(
                case_id="ERROR-FALLBACK",
                date="1970-01-01",
                type="error",
                status="service_unavailable",
            )
        ]
        return error_cases


@router.get("/company/{inn}/contracts", response_model=List[ContractBase])
def get_company_contracts(
    inn: str, db: Session = Depends(get_db)
) -> List[ContractBase]:
    if not inn or len(inn) not in [10, 12]:
        raise HTTPException(status_code=422, detail="Некорректный формат ИНН")

    try:
        log_business_event("contracts_lookup", {"inn": inn})

        contracts = get_contracts_by_company_inn(db, inn)

        if not contracts:
            logger.info(f"No contracts found for INN: {inn}, returning fallback data")
            fallback_contracts = [
                ContractBase(
                    customer="Данные недоступны",
                    amount=0.0,
                    date=date(1970, 1, 1)
                )
            ]
            return fallback_contracts

        logger.info(f"Successfully retrieved {len(contracts)} contracts for INN: {inn}")
        return contracts

    except Exception as e:
        logger.error(
            f"Error in get_company_contracts for INN {inn}: {e}", exc_info=True
        )
        error_contracts = [
            ContractBase(
                customer="Сервис временно недоступен",
                amount=0.0,
                date=date(1970, 1, 1)
            )
        ]
        return error_contracts




@router.post("/search")
async def search_companies_endpoint(
    search: SearchRequest, db: Session = Depends(get_db)
) -> Dict[str, Any]:
    try:
        if not search.query or len(search.query.strip()) < 2:
            raise HTTPException(
                status_code=422,
                detail="Поисковый запрос должен содержать минимум 2 символа",
            )

        log_business_event(
            "company_search",
            {
                "query": search.query,
                "region": search.region,
                "status": search.status,
                "type": search.type,
            },
        )

        logger.info(
            f"Starting search for: '{search.query}' (type: {search.type})"
        )
        
        query_clean = search.query.strip()
        logger.info(
            f"Query: '{query_clean}', isdigit: {query_clean.isdigit()}, "
            f"len: {len(query_clean)}"
        )
        
        # Сначала ищем в БД
        from app.models.company import Company
        from app.services.etl_service import ETLService
        
        db_results = []
        if query_clean.isdigit() and len(query_clean) in (10, 12):
            # Поиск по ИНН в БД
            company = (
                db.query(Company)
                .filter(Company.inn == query_clean)  # type: ignore
                .first()
            )
            if company:
                db_results = [{
                    "inn": company.inn,
                    "name": company.name,
                    "ogrn": company.ogrn,
                    "status": company.status,
                    "address": company.address,
                    "registration_date": (
                        company.registration_date.isoformat() 
                        if company.registration_date else None
                    ),
                    "source": "database"
                }]
                logger.info(f"Found company in database: {company.name}")
            else:
                # Если не найдено в БД - запускаем ETL
                logger.info(
                    f"Company not found in DB, running ETL for INN: {query_clean}"
                )
                etl_service = ETLService(db)
                etl_result = await etl_service.process_company_data(query_clean)
                
                if etl_result.get("company_id"):
                    # Получаем обновленные данные из БД
                    company = (
                        db.query(Company)
                        .filter(Company.inn == query_clean)  # type: ignore
                        .first()
                    )
                    if company:
                        db_results = [{
                            "inn": company.inn,
                            "name": company.name,
                            "ogrn": company.ogrn,
                            "status": company.status,
                            "address": company.address,
                            "registration_date": (
                        company.registration_date.isoformat() 
                        if company.registration_date else None
                    ),
                            "source": "etl"
                        }]
                        logger.info(f"Company added via ETL: {company.name}")
        else:
            # Поиск по названию в БД
            companies = db.query(Company).filter(  # type: ignore
                Company.name.ilike(f"%{query_clean}%")  # type: ignore
            ).limit(10).all()
            
            db_results = [{
                "inn": company.inn,
                "name": company.name,
                "ogrn": company.ogrn,
                "status": company.status,
                "address": company.address,
                "registration_date": (
                    company.registration_date.isoformat()
                    if company.registration_date else None
                ),
                "source": "database"
            } for company in companies]
            
            logger.info(f"Found {len(db_results)} companies in database by name")

        # Если не найдено в БД - ищем через ФНС API
        if not db_results:
            logger.info("No results in DB, searching via FNS API")
            if query_clean.isdigit() and len(query_clean) in (10, 12):
                logger.info(f"Using EGR method for INN: {query_clean}")
                result = await fns_service._make_request("egr", {"req": query_clean})
                logger.info(f"EGR result: {result}")
                
                if result and "items" in result and result["items"]:
                    company_data = result["items"][0]
                    company_data["source"] = "fns_api"
                    db_results = [company_data]
            else:
                logger.info(f"Using SEARCH method for query: {query_clean}")
                result = await fns_service._make_request("search", {"q": query_clean})
                logger.info(f"SEARCH result: {result}")
                results = result.get("items", []) if result else []
                for item in results:
                    item["source"] = "fns_api"
                db_results = results

        logger.info(f"Search completed: found {len(db_results)} results")

        if not db_results:
            return {
                "success": True,
                "data": {
                    "results": [],
                    "totalCount": 0,
                    "page": 1,
                    "totalPages": 0,
                    "query": search.query,
                    "search_type": search.type or "auto"
                },
                "message": "Компании не найдены"
            }

        return {
            "success": True,
            "data": {
                "results": db_results,
                "totalCount": len(db_results),
                "page": 1,
                "totalPages": 1,
                "query": search.query,
                "search_type": search.type or "auto"
            },
            "message": f"Найдено {len(db_results)} компаний"
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in search_companies_endpoint: {e}", exc_info=True)

        return {
            "success": False,
            "data": {
                "results": [],
                "totalCount": 0,
                "page": 1,
                "totalPages": 0,
                "query": search.query,
                "search_type": search.type or "auto",
                "error": "Поиск временно недоступен"
            },
            "message": "Ошибка при выполнении поиска"
        }


@router.get("/company/{inn}/check")
async def check_company_reliability(inn: str) -> Dict[str, Any]:
    try:
        if not inn or len(inn) not in [10, 12]:
            raise HTTPException(status_code=422, detail="Некорректный формат ИНН")

        log_business_event("company_reliability_check", {"inn": inn})
        logger.info(f"Checking company reliability for INN: {inn}")

        result = await fns_service._make_request("check", {"req": inn})
        
        if result and "items" in result:
            logger.info(f"Reliability check completed for INN: {inn}")
            return {
                "success": True,
                "data": {
                    "inn": inn,
                    "reliability_data": result["items"],
                    "total_checks": len(result["items"]) if result["items"] else 0
                },
                "message": "Проверка контрагента завершена"
            }
        else:
            logger.info(f"No reliability issues found for INN: {inn}")
            return {
                "success": True,
                "data": {
                    "inn": inn,
                    "reliability_data": [],
                    "total_checks": 0
                },
                "message": "Признаков недобросовестности не обнаружено"
            }

    except Exception as e:
        logger.error(
            f"Error checking company reliability for INN {inn}: {e}", 
            exc_info=True
        )
        return {
            "success": False,
            "data": {
                "inn": inn,
                "reliability_data": [],
                "total_checks": 0,
                "error": "Ошибка при проверке контрагента"
            },
            "message": "Ошибка при выполнении проверки"
        }


@router.get("/company/{inn}/purchases")
async def get_company_purchases(
    inn: str, db: Session = Depends(get_db)
) -> Dict[str, Any]:
    try:
        if not inn or len(inn) not in [10, 12]:
            raise HTTPException(status_code=422, detail="Некорректный формат ИНН")

        log_business_event("company_purchases_lookup", {"inn": inn})

        purchases = await get_company_purchases_fns(inn)

        logger.info(f"Retrieved {len(purchases)} purchases for company with INN: {inn}")

        return {
            "success": True,
            "data": {
                "purchases": purchases,
                "totalCount": len(purchases),
                "inn": inn
            }
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting purchases for INN {inn}: {e}", exc_info=True)
        return {
            "success": False,
            "data": {
                "purchases": [],
                "totalCount": 0,
                "inn": inn,
                "error": "Ошибка при получении данных о закупках"
            }
        }


@router.get("/company/{inn}/financials")
async def get_company_financials(
    inn: str, db: Session = Depends(get_db)
) -> Dict[str, Any]:
    try:
        if not inn or len(inn) not in [10, 12]:
            raise HTTPException(status_code=422, detail="Некорректный формат ИНН")

        log_business_event("company_financials_lookup", {"inn": inn})

        financials = await get_company_financials_fns(inn)

        logger.info(
            f"Retrieved {len(financials)} financial records for company with INN: {inn}"
        )

        return {
            "success": True,
            "data": {
                "financials": financials,
                "totalCount": len(financials),
                "inn": inn
            }
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting financials for INN {inn}: {e}", exc_info=True)
        return {
            "success": False,
            "data": {
                "financials": [],
                "totalCount": 0,
                "inn": inn,
                "error": "Ошибка при получении финансовых данных"
            }
        }


@router.get("/company/{inn}/court-cases")
async def get_company_court_cases_via_fns(
    inn: str, db: Session = Depends(get_db)
) -> Dict[str, Any]:
    try:
        if not inn or len(inn) not in [10, 12]:
            raise HTTPException(status_code=422, detail="Некорректный формат ИНН")

        log_business_event("company_court_cases_lookup", {"inn": inn})

        court_cases = await get_court_cases_from_fns(inn)

        logger.info(
            f"Retrieved {len(court_cases)} court cases for company with INN: {inn}"
        )

        return {
            "success": True,
            "data": {
                "court_cases": court_cases,
                "totalCount": len(court_cases),
                "inn": inn
            }
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting court cases for INN {inn}: {e}", exc_info=True)
        return {
            "success": False,
            "data": {
                "court_cases": [],
                "totalCount": 0,
                "inn": inn,
                "error": "Ошибка при получении данных о судебных делах"
            }
        }


@router.get("/company/{inn}/founders")
async def get_company_founders_via_fns(
    inn: str, db: Session = Depends(get_db)
) -> Dict[str, Any]:
    try:
        if not inn or len(inn) not in [10, 12]:
            raise HTTPException(status_code=422, detail="Некорректный формат ИНН")

        log_business_event("company_founders_lookup", {"inn": inn})

        founders = await get_founders_from_fns(inn)

        logger.info(f"Retrieved {len(founders)} founders for company with INN: {inn}")

        return {
            "success": True,
            "data": {
                "founders": founders,
                "totalCount": len(founders),
                "inn": inn
            }
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting founders for INN {inn}: {e}", exc_info=True)
        return {
            "success": False,
            "data": {
                "founders": [],
                "totalCount": 0,
                "inn": inn,
                "error": "Ошибка при получении данных об учредителях"
            }
        }


@router.get("/health/db")
def check_db_connection(
    db: Session = Depends(get_db)
) -> Dict[str, str]:

    try:
        db.execute(text("SELECT 1"))
        logger.info("Database health check passed")
        return {
            "status": "healthy",
            "message": "Database connected",
            "service": "database",
        }
    except Exception as e:
        logger.error(f"Database health check failed: {e}", exc_info=True)

        error_message = str(e)
        error_response = {
            "status": "unhealthy",
            "message": "Database connection failed",
            "service": "database",
            "error": error_message,
        }
        return error_response
