from sqlalchemy import Column, Integer, String, Date, Float, ForeignKey, DateTime
from sqlalchemy.sql import func
from config.database import Base

class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    inn = Column(String(12), unique=True, index=True, nullable=False)
    ogrn = Column(String(13), unique=True, index=True)
    name = Column(String(255), nullable=False)
    status = Column(String(50))
    address = Column(String(500))
    registration_date = Column(Date)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

class Founder(Base):
    __tablename__ = "founders"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    name = Column(String(255), nullable=False)
    share = Column(Float)
    created_at = Column(DateTime, default=func.now())

class Financial(Base):
    __tablename__ = "financials"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    year = Column(Integer, nullable=False)
    revenue = Column(Float)
    profit = Column(Float)
    assets = Column(Float)
    created_at = Column(DateTime, default=func.now())

class CourtCase(Base):
    __tablename__ = "court_cases"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    case_number = Column(String(100), nullable=False)
    date = Column(Date)
    status = Column(String(50))
    type = Column(String(100))
    created_at = Column(DateTime, default=func.now())

class Contract(Base):
    __tablename__ = "contracts"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    customer = Column(String(255))
    amount = Column(Float)
    date = Column(Date)
    created_at = Column(DateTime, default=func.now())