from sqlalchemy import Column, Integer, String, Date, ForeignKey
from app.models.base import Base
from sqlalchemy.orm import relationship

class CourtCase(Base):
    __tablename__ = "court_cases"
    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    case_number = Column(String(255))
    date = Column(Date)
    status = Column(String(100))
    type = Column(String(100))

    company = relationship("Company", back_populates="court_cases")