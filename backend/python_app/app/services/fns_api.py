import httpx
from typing import Dict, Any, Optional, List
from app.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)


class FNSAPIService:
    
    def __init__(self):
        self.api_key = settings.FNS_API_KEY
        self.base_url = settings.FNS_API_BASE_URL
        self.timeout = 30.0
        
    async def _make_request(
        self, method: str, params: Dict[str, Any]
    ) -> Dict[str, Any]:
        params['key'] = self.api_key
        
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            try:
                url = f"{self.base_url}/{method}"
                logger.info(f"Making FNS API request to: {url}")
                logger.info(f"Request params: {params}")
                
                response = await client.get(url, params=params)
                
                logger.info(f"Response status: {response.status_code}")
                logger.info(f"Response headers: {dict(response.headers)}")
                
                response.raise_for_status()
                
                response_text = response.text
                logger.info(f"Response text (first 500 chars): {response_text[:500]}")
                
                if not response_text.strip():
                    logger.error("Empty response from FNS API")
                    raise Exception("Пустой ответ от API ФНС")
                
                try:
                    json_data = response.json()
                    if isinstance(json_data, dict):
                        return json_data
                    else:
                        logger.error(
                            f"Unexpected JSON response type: {type(json_data)}"
                        )
                        raise Exception("Неожиданный тип ответа от API ФНС")
                except Exception as json_error:
                    logger.error(f"JSON decode error: {json_error}")
                    logger.error(f"Response text: {response_text}")
                    raise Exception(f"Ошибка парсинга JSON от API ФНС: {json_error}")
                    
            except httpx.HTTPStatusError as e:
                if e.response.status_code == 403:
                    logger.warning(
                        "🚫 FNS API access forbidden (403). "
                        "API key may be blocked or inactive."
                    )
                    return self._get_fallback_data(method, params)
                else:
                    logger.error(f"HTTP error in FNS API request: {e}")
                    raise Exception(f"Ошибка подключения к API ФНС: {e}")
            except httpx.HTTPError as e:
                logger.error(f"HTTP error in FNS API request: {e}")
                raise Exception(f"Ошибка подключения к API ФНС: {e}")
            except Exception as e:
                logger.error(f"Error in FNS API request: {e}")
                raise Exception(f"Ошибка API ФНС: {e}")
    
    def _get_fallback_data(self, method: str, params: Dict[str, Any]) -> Dict[str, Any]:
        logger.info(f"Using fallback data for method: {method}")
        
        if method == "search":
            query = params.get("q", "unknown")
            return {
                "items": [{
                    "inn": "1234567890",
                    "name": f"Результат поиска для '{query}' (API ФНС недоступен)",
                    "status": "api_unavailable",
                    "message": "API ФНС временно недоступен. Проверьте API ключ.",
                    "ogrn": "1234567890123",
                    "kpp": "123456789",
                    "address": "Адрес недоступен",
                    "director": "Информация недоступна",
                    "okved": "62.01.00",
                    "okved_text": (
                        "Деятельность консультативная и работы в области "
                        "компьютерных технологий"
                    )
                }]
            }
        elif method == "egr":
            return {
                "items": [{
                    "inn": params.get("req", "unknown"),
                    "name": "Данные временно недоступны",
                    "status": "api_unavailable",
                    "message": "API ФНС временно недоступен. Проверьте API ключ.",
                    "ogrn": "0000000000000",
                    "kpp": "000000000",
                    "address": "Адрес недоступен",
                    "director": "Информация недоступна",
                    "okved": "00.00.00",
                    "okved_text": "Деятельность недоступна"
                }]
            }
        else:
            return {
                "items": [],
                "message": f"API ФНС недоступен для метода {method}",
                "status": "api_unavailable"
            }
    
    async def search_company(
        self, query: str, search_type: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        try:
            query_clean = query.strip()
            
            if search_type:
                if search_type == "inn":
                    return await self._search_by_inn(query_clean)
                elif search_type == "ogrn":
                    return await self._search_by_ogrn(query_clean)
                elif search_type == "name":
                    return await self._search_by_name(query_clean)
                else:
                    return await self._search_general(query_clean)
            
            if query_clean.isdigit() and len(query_clean) in (10, 12):
                return await self._search_by_inn(query_clean)
            elif query_clean.isdigit() and len(query_clean) in (13, 15):
                return await self._search_by_ogrn(query_clean)
            else:
                return await self._search_general(query_clean)
                
        except Exception as e:
            logger.error(f"Error in search_company: {e}")
            return []
    
    async def _search_by_inn(self, inn: str) -> List[Dict[str, Any]]:
        try:
            result = await self._make_request("egr", {"req": inn})
            
            if result and "items" in result and result["items"]:
                company_data = result["items"][0]
                return [self._format_company_data(company_data)]
            
            return []
            
        except Exception as e:
            logger.error(f"Error searching by INN {inn}: {e}")
            return []
    
    async def _search_by_ogrn(self, ogrn: str) -> List[Dict[str, Any]]:
        try:
            result = await self._make_request("egr", {"req": ogrn})
            
            if result and "items" in result and result["items"]:
                company_data = result["items"][0]
                return [self._format_company_data(company_data)]
            
            return []
            
        except Exception as e:
            logger.error(f"Error searching by OGRN {ogrn}: {e}")
            return []
    
    async def _search_general(self, query: str) -> List[Dict[str, Any]]:
        try:
            result = await self._make_request("search", {"q": query})
            
            if result and "items" in result:
                companies = []
                for item in result["items"][:20]:
                    companies.append(
                        self._format_company_data(item)
                    )
                return companies
            
            return []
            
        except Exception as e:
            logger.error(f"Error in general search for {query}: {e}")
            return []
    
    async def _search_by_name(self, name: str) -> List[Dict[str, Any]]:
        return await self._search_general(name)
    
    def _format_company_data(
        self, data: Dict[str, Any]
    ) -> Dict[str, Any]:
        try:
            logger.info(f"Formatting company data: {data}")
            
            company_info = None
            
            if isinstance(data, dict):
                if "ЮЛ" in data:
                    company_info = data["ЮЛ"]
                elif "ИП" in data:
                    company_info = data["ИП"]
                elif "ИНН" in data:
                    company_info = data
                else:
                    company_info = data
            
            if not company_info:
                logger.warning("No company data found in API response")
                return {
                    "inn": "",
                    "ogrn": "",
                    "name": "",
                    "status": "",
                    "address": "",
                    "registration_date": None,
                    "kpp": "",
                    "okved": "",
                    "management": {},
                    "founders": [],
                    "source": "fns_api"
                }
            
            inn = company_info.get("ИНН", "").strip()
            ogrn = company_info.get("ОГРН", "").strip()
            name = company_info.get("Наименование", "").strip()
            address = company_info.get("Адрес", "").strip()
            status = company_info.get("Статус", "").strip()
            kpp = company_info.get("КПП", "").strip()
            
            if not name:
                for field_name in [
                    "Полное наименование",
                    "Сокращенное наименование",
                    "НаименованиеЮЛ",
                    "НаименованиеПолное",
                    "НаименованиеСокращенное",
                    "НаименованиеПолн",
                    "НаименованиеСокр",
                ]:
                    name = company_info.get(field_name, "").strip()
                    if name:
                        logger.info(f"Found name in field '{field_name}': {name}")
                        break
                
                if not name:
                    for key, value in company_info.items():
                        if "наимен" in key.lower() and value and str(value).strip():
                            name = str(value).strip()
                            logger.info(f"Found name in field '{key}': {name}")
                            break
            
            if not address:
                address_obj = company_info.get("Адрес", {})
                if isinstance(address_obj, dict):
                    address_parts = []
                    if "АдресПолн" in address_obj:
                        address_parts.append(address_obj["АдресПолн"])
                    if "Индекс" in address_obj:
                        address_parts.insert(0, address_obj["Индекс"])
                    address = ", ".join(filter(None, address_parts))
                    logger.info(f"Extracted address from dict: {address}")
                else:
                    address = str(address_obj)
                    logger.info(f"Address as string: {address}")
            
            if not address:
                for field_name in ["Юридический адрес", "АдресЮЛ", "АдресПолный"]:
                    address = company_info.get(field_name, "").strip()
                    if address:
                        break
            
            registration_date = None
            date_str = company_info.get("ДатаРег", "")
            if not date_str:
                date_str = company_info.get("Дата регистрации", "")
            if not date_str:
                date_str = company_info.get("ДатаРегистрации", "")
                
            if date_str:
                try:
                    from datetime import datetime
                    for date_format in [
                        "%Y-%m-%d",
                        "%d.%m.%Y",
                        "%Y-%m-%d %H:%M:%S",
                    ]:
                        try:
                            registration_date = datetime.strptime(
                                date_str, date_format
                            ).date()
                            break
                        except ValueError:
                            continue
                except Exception:
                    pass
            
            logger.info(f"Extracted data - INN: {inn}, Name: {name}, Status: {status}")
            logger.info(f"Address: {address}")
            logger.info(f"Registration date: {registration_date}")
            
            management = {}
            if "Руководитель" in company_info:
                management = {"name": company_info["Руководитель"]}
            elif "Директор" in company_info:
                management = {"name": company_info["Директор"]}
            
            founders = []
            if "Учредители" in company_info:
                founders = company_info["Учредители"]
            elif "Участники" in company_info:
                founders = company_info["Участники"]
            
            logger.info(f"Formatted data - INN: {inn}, Name: {name}, Status: {status}")
            
            return {
                "inn": inn,
                "ogrn": ogrn,
                "name": name,
                "status": status,
                "address": address,
                "registration_date": (
                    registration_date.isoformat() if registration_date else None
                ),
                "kpp": kpp,
                "okved": company_info.get("ОКВЭД", ""),
                "management": management,
                "founders": founders,
                "source": "fns_api"
            }
            
        except Exception as e:
            logger.error(f"Error formatting company data: {e}")
            return {
                "inn": str(data.get("inn", "")),
                "ogrn": str(data.get("ogrn", "")),
                "name": str(data.get("name", "")),
                "status": str(data.get("status", "")),
                "address": str(data.get("address", "")),
                "registration_date": None,
                "kpp": str(data.get("kpp", "")),
                "okved": str(data.get("okved", "")),
                "management": {},
                "founders": [],
                "source": "fns_api"
            }
    
    async def get_company_details(self, inn: str) -> Optional[Dict[str, Any]]:
        logger.info(f"FNS API: Getting company details for INN {inn}")
        try:
            result = await self._make_request("egr", {"req": inn})

            if result and isinstance(result, dict) and result.get("items"):
                company_data = result["items"][0]
                return self._format_detailed_company_data(company_data)

            if result:
                return self._format_detailed_company_data(result)

            logger.warning(f"Empty response from FNS API for INN {inn}")
            return None

        except Exception as e:
            logger.error(f"Error getting company details for INN {inn}: {e}")
            return None
    
    def _format_detailed_company_data(self, data: Dict[str, Any]) -> Dict[str, Any]:
        try:
            company_info = data.get("ЮЛ") or data.get("ИП") or data
            formatted = self._format_company_data(company_info)
            
            founders = []
            if "Учредители" in company_info:
                founders = company_info["Учредители"]
            elif "founders" in company_info:
                founders = company_info["founders"]
            
            financials = []
            if "Финансы" in company_info:
                financials = company_info["Финансы"]
            elif "financials" in company_info:
                financials = company_info["financials"]
            
            court_cases = []
            if "СудебныеДела" in company_info:
                court_cases = company_info["СудебныеДела"]
            elif "court_cases" in company_info:
                court_cases = company_info["court_cases"]
            
            contracts = []
            if "Контракты" in company_info:
                contracts = company_info["Контракты"]
            elif "contracts" in company_info:
                contracts = company_info["contracts"]
            
            formatted.update({
                "founders": founders,
                "financials": financials,
                "court_cases": court_cases,
                "contracts": contracts
            })
            
            return formatted
            
        except Exception as e:
            logger.error(f"Error formatting detailed company data: {e}")
            company_info = data.get("ЮЛ") or data.get("ИП") or data
            return self._format_company_data(company_info)
    async def get_company_purchases(self, inn: str) -> List[Dict[str, Any]]:
        try:
            result = await self._make_request("multinfo", {"inn": inn})
            
            if result and "items" in result and result["items"]:
                company_data = result["items"][0]
                purchases = company_data.get("purchases", [])
                
                formatted_purchases = []
                for purchase in purchases:
                    formatted_purchases.append({
                        "purchase_number": purchase.get("number", "N/A"),
                        "date": purchase.get("date", ""),
                        "amount": purchase.get("amount", 0),
                        "customer": purchase.get("customer", ""),
                        "status": purchase.get("status", ""),
                        "description": purchase.get("description", "")
                    })
                
                return formatted_purchases
            
            return []
            
        except Exception as e:
            logger.error(f"Error getting purchases for INN {inn}: {e}")
            return []
    
    async def get_company_financials(self, inn: str) -> List[Dict[str, Any]]:
        try:
            result = await self._make_request("multinfo", {"inn": inn})
            
            if result and "items" in result and result["items"]:
                company_data = result["items"][0]
                financials = company_data.get("financials", [])
                
                formatted_financials = []
                for financial in financials:
                    formatted_financials.append({
                        "year": financial.get("year", ""),
                        "revenue": financial.get("revenue", 0),
                        "profit": financial.get("profit", 0),
                        "assets": financial.get("assets", 0),
                        "liabilities": financial.get("liabilities", 0)
                    })
                
                return formatted_financials
            
            return []
            
        except Exception as e:
            logger.error(f"Error getting financials for INN {inn}: {e}")
            return []
    
    async def get_company_court_cases(self, inn: str) -> List[Dict[str, Any]]:
        try:
            result = await self._make_request("multinfo", {"inn": inn})
            
            if result and "items" in result and result["items"]:
                company_data = result["items"][0]
                court_cases = company_data.get("court_cases", [])
                
                formatted_cases = []
                for case in court_cases:
                    formatted_cases.append({
                        "case_number": case.get("number", ""),
                        "date": case.get("date", ""),
                        "status": case.get("status", ""),
                        "type": case.get("type", ""),
                        "court": case.get("court", ""),
                        "description": case.get("description", "")
                    })
                
                return formatted_cases
            
            return []
            
        except Exception as e:
            logger.error(f"Error getting court cases for INN {inn}: {e}")
            return []
    
    async def get_company_founders(self, inn: str) -> List[Dict[str, Any]]:
        try:
            result = await self._make_request("multinfo", {"inn": inn})
            
            if result and "items" in result and result["items"]:
                company_data = result["items"][0]
                founders = company_data.get("founders", [])
                
                formatted_founders = []
                for founder in founders:
                    formatted_founders.append({
                        "name": founder.get("name", ""),
                        "share": founder.get("share", 0),
                        "type": founder.get("type", ""),
                        "inn": founder.get("inn", ""),
                        "ogrn": founder.get("ogrn", "")
                    })
                
                return formatted_founders
            
            return []
            
        except Exception as e:
            logger.error(f"Error getting founders for INN {inn}: {e}")
            return []


fns_service = FNSAPIService()
