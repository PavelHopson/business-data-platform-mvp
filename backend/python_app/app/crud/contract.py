from typing import List
from sqlalchemy.orm import Session
from app.models.contract import Contract
from app.schemas.company import ContractBase


def get_contracts_by_company_inn(db: Session, inn: str) -> List[ContractBase]:
    
    contracts = (
        db.query(Contract)
        .join(Contract.company)
        .filter(Contract.company.has(inn=inn))
        .all()
    )
    
    from datetime import date as date_type
    
    return [
        ContractBase(
            customer=str(contract.customer),
            amount=float(contract.amount),
            date=contract.date if isinstance(contract.date, date_type) else contract.date.date()
        )
        for contract in contracts
    ]
