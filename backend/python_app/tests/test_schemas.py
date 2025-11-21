import pytest
from pydantic import ValidationError
from datetime import datetime
from app.schemas.user import UserCreate, UserResponse


def test_user_create_valid() -> None:
    user_data = UserCreate(
        name="Test User",
        email="test@example.com",
        inn="1234567890",
        password="testpassword123"
    )
    assert user_data.name == "Test User"
    assert user_data.email == "test@example.com"
    assert user_data.inn == "1234567890"
    assert user_data.password == "testpassword123"


def test_user_create_invalid_email() -> None:
    with pytest.raises(ValidationError):
        UserCreate(
            name="Test User",
            email="invalid-email",
            inn="1234567890",
            password="testpassword123"
        )


def test_user_response() -> None:
    user_response = UserResponse(
        id=1,
        name="Test User",
        email="test@example.com",
        inn="1234567890",
        role="user",
        is_active=True,
        created_at=datetime.now()
    )
    assert user_response.id == 1
    assert user_response.name == "Test User"
    assert user_response.email == "test@example.com"
    assert user_response.role == "user"
    assert user_response.is_active is True