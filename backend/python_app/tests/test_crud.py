import pytest
from app.crud.user import get_user_by_email, create_user
from app.schemas.user import UserCreate


def test_get_user_by_email(db_session) -> None:
    user = get_user_by_email(db_session, "nonexistent@example.com")
    assert user is None


def test_create_user(db_session) -> None:
    user_data = UserCreate(
        name="Test User",
        email="test@example.com",
        inn="1234567890",
        password="testpassword123"
    )
    user = create_user(db_session, user_data)
    assert user.name == "Test User"
    assert user.email == "test@example.com"
    assert user.inn == "1234567890"
    assert user.password_hash is not None