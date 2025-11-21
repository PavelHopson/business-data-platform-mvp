from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate
from passlib.context import CryptContext
from typing import Optional
import bcrypt

try:
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
except Exception:
    pwd_context = None

def get_password_hash(password: str) -> str:
    if pwd_context:
        try:
            result = pwd_context.hash(password)
            if isinstance(result, str):
                return result
        except Exception:
            pass
    
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return str(hashed.decode('utf-8'))

def verify_password(plain_password: str, hashed_password: str) -> bool:
    if pwd_context:
        try:
            result = pwd_context.verify(plain_password, hashed_password)
            if isinstance(result, bool):
                return result
        except Exception:
            pass
    
    result = bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))
    return bool(result)

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email).first()

def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
    return db.query(User).filter(User.id == user_id).first()

def create_user(db: Session, user: UserCreate) -> User:
    hashed_password = get_password_hash(user.password)
    db_user = User(
        name=user.name,
        email=user.email,
        inn=user.inn,
        password_hash=hashed_password,
        role="user"
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
    user = get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, str(user.password_hash)):
        return None
    return user

def get_all_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(User).offset(skip).limit(limit).all()