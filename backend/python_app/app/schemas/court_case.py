from pydantic import BaseModel

class CourtCaseBase(BaseModel):
    case_number: str
    date: str | None = None
    status: str | None = None
    type: str | None = None
    
    class Config:
        from_attributes = True

class CourtCaseResponse(BaseModel):
    case_id: str
    date: str | None = None
    type: str | None = None
    status: str | None = None
    
    class Config:
        from_attributes = True