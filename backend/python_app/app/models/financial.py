from sqlalchemy import Column, Integer, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.models.base import Base

class Financial(Base):
    __tablename__ = "financials"
    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id", ondelete="CASCADE"), nullable=False)
    year = Column(Integer, nullable=False)
    revenue = Column(Float)
    profit = Column(Float)
    assets = Column(Float)
    
    company = relationship("Company", back_populates="financials")