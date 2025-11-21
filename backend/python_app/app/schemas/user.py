from pydantic import BaseModel, EmailStr, validator
from typing import Optional
from datetime import datetime
import re

class UserBase(BaseModel):
    name: str
    email: EmailStr
    inn: Optional[str] = None

class UserCreate(UserBase):
    password: str
    
    @validator('name')
    def validate_name(cls, v):
        if not v or len(v.strip()) < 2:
            raise ValueError('Имя должно содержать минимум 2 символа')
        if len(v) > 255:
            raise ValueError('Имя слишком длинное (максимум 255 символов)')
        return v.strip()
    
    @validator('email')
    def validate_email(cls, v):
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_pattern, v):
            raise ValueError('Некорректный формат email')
        return v
    
    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Пароль должен содержать минимум 8 символов')
        if not any(c.isdigit() for c in v):
            raise ValueError('Пароль должен содержать цифры')
        if not any(c.isalpha() for c in v):
            raise ValueError('Пароль должен содержать буквы')
        return v
    
    @validator('inn')
    def validate_inn(cls, v):
        if v:
            v = v.replace(' ', '').replace('-', '')
            if not v.isdigit():
                raise ValueError('ИНН должен содержать только цифры')
            if len(v) not in [10, 12]:
                raise ValueError('ИНН должен содержать 10 или 12 цифр')
        return v

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: int
    role: str
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: Optional[UserResponse] = None
