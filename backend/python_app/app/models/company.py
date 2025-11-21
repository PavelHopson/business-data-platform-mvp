from sqlalchemy import Column, Integer, String, Date, DateTime, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.models.base import Base

class Company(Base):
    __tablename__ = "companies"
    id = Column(Integer, primary_key=True, index=True)
    inn = Column(String(12), unique=True, index=True, nullable=False)
    ogrn = Column(String(13), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    status = Column(String(50))
    address = Column(String(500))
    registration_date = Column(Date)
    
    # Поля для хранения JSON данных от API парсеров
    raw_fns_data = Column(Text)  # JSON данные от ФНС API
    raw_scraper_data = Column(Text)  # JSON данные от скрапера
    last_fns_update = Column(DateTime, default=func.now())
    last_scraper_update = Column(DateTime, default=func.now())
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    founders = relationship("Founder", back_populates="company", cascade="all, delete-orphan")
    financials = relationship("Financial", back_populates="company", cascade="all, delete-orphan")
    court_cases = relationship("CourtCase", back_populates="company", cascade="all, delete-orphan")
    contracts = relationship("Contract", back_populates="company", cascade="all, delete-orphan")