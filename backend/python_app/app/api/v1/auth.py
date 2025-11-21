from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from datetime import datetime, timedelta
from typing import Optional
from jose import jwt, JWTError
from sqlalchemy.orm import Session

from app.crud import user as user_crud
from app.schemas.user import UserCreate, UserLogin, UserResponse, Token
from app.config import settings
from app.database import get_db

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    try:
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(hours=24)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(
            to_encode, settings.JWT_SECRET, algorithm=settings.ALGORITHM
        )
        return encoded_jwt
    except Exception as e:
        print(f"Ошибка при создании токена: {e}")
        raise


async def get_current_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token, settings.JWT_SECRET, algorithms=[settings.ALGORITHM]
        )
        user_id: int = int(payload.get("sub"))
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = user_crud.get_user_by_id(db, user_id)
    if user is None:
        raise credentials_exception
    return user


@router.post("/register", response_model=UserResponse, status_code=201)
async def register(user: UserCreate, db: Session = Depends(get_db)):
    try:
        print(f"Попытка регистрации пользователя: {user.email}")

        # Проверяем, существует ли пользователь с таким email
        existing_user = user_crud.get_user_by_email(db, user.email)
        if existing_user:
            raise HTTPException(
                status_code=400,
                detail="Email уже зарегистрирован"
            )

        # Создаём нового пользователя
        new_user = user_crud.create_user(db, user)
        print(f"Пользователь создан: {new_user.email}")

        # Pydantic автоматически конвертирует SQLAlchemy модель
        return UserResponse.from_orm(new_user)
    except HTTPException:
        raise
    except ValueError as e:
        print(f"Ошибка валидации: {e}")
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )
    except Exception as e:
        print(f"Ошибка в API регистрации: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"Внутренняя ошибка сервера: {str(e)}"
        )


@router.post("/login", response_model=Token)
async def login(user_login: UserLogin, db: Session = Depends(get_db)):
    try:
        user = user_crud.authenticate_user(db, user_login.email, user_login.password)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Неверный email или пароль",
                headers={"WWW-Authenticate": "Bearer"},
            )

        access_token_expires = timedelta(hours=24)
        access_token = create_access_token(
            data={"sub": str(user.id)}, expires_delta=access_token_expires
        )

        return Token(
            access_token=access_token,
            token_type="bearer",
            user=UserResponse.from_orm(user)
        )
    except HTTPException:
        raise
    except Exception as e:
        print(f"Ошибка в API входа: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Внутренняя ошибка сервера: {str(e)}"
        )


@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user = Depends(get_current_user)):
    try:
        # Pydantic автоматически конвертирует SQLAlchemy модель
        return UserResponse.from_orm(current_user)
    except Exception as e:
        print(f"Ошибка в API получения информации о пользователе: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Внутренняя ошибка сервера: {str(e)}"
        )
