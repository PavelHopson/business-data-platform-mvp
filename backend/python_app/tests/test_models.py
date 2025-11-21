import pytest
from app.models.user import User


def test_user_model() -> None:
    user = User(
        name="Test User",
        email="test@example.com",
        inn="1234567890",
        password_hash="hashed_password",
        role="user"
    )
    assert user.name == "Test User"
    assert user.email == "test@example.com"
    assert user.inn == "1234567890"
    assert user.password_hash == "hashed_password"
    assert user.role == "user"


def test_user_model_defaults() -> None:
    user = User(
        name="Test User",
        email="test@example.com",
        inn="1234567890",
        password_hash="hashed_password",
        role="user",
        is_active=True
    )
    assert user.name == "Test User"
    assert user.role == "user"
    assert user.is_active is True


def test_user_model_column_defaults() -> None:
    role_column = User.__table__.columns['role']
    is_active_column = User.__table__.columns['is_active']
    
    assert role_column.default.arg == "user"
    assert is_active_column.default.arg is True