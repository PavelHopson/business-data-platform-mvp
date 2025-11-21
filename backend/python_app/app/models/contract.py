from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.models.base import Base

class Contract(Base):
    __tablename__ = "contracts"
    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id", ondelete="CASCADE"), nullable=False)
    customer = Column(String(255))
    amount = Column(Float, nullable=False)
    date = Column(Date, nullable=False)
    
    company = relationship("Company", back_populates="contracts")