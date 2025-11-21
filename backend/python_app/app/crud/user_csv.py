import csv
import os
from typing import List, Optional
from datetime import datetime
import bcrypt
from app.schemas.user import UserCreate

class CSVUserCRUD:
    def __init__(self, csv_file_path: str = "data/users.csv"):
        try:
            self.csv_file_path = csv_file_path
            print(f"CSVUserCRUD инициализируется с путем: {self.csv_file_path}")
            print(f"Текущая рабочая директория: {os.getcwd()}")
            print(f"Полный путь к файлу: {os.path.abspath(self.csv_file_path)}")
            self._ensure_csv_exists()
        except Exception as e:
            print(f"Ошибка при инициализации CSVUserCRUD: {e}")
            raise
    
    def _ensure_csv_exists(self):
        try:
            if not os.path.exists(self.csv_file_path):
                os.makedirs(os.path.dirname(self.csv_file_path), exist_ok=True)
                with open(
                    self.csv_file_path, 'w', newline='', encoding='utf-8'
                ) as file:
                    writer = csv.writer(file)
                    writer.writerow([
                        'id', 'email', 'inn', 'password_hash', 'role', 'created_at'
                    ])
        except Exception as e:
            print(f"Ошибка при создании CSV файла: {e}")
            raise
    
    def _read_users(self) -> List[dict]:
        users = []
        try:
            if os.path.exists(self.csv_file_path):
                with open(
                    self.csv_file_path, 'r', newline='', encoding='utf-8'
                ) as file:
                    reader = csv.DictReader(file)
                    for row in reader:
                        users.append(row)
        except Exception as e:
            print(f"Ошибка при чтении CSV: {e}")
            raise
        return users
    
    def _write_users(self, users: List[dict]):
        try:
            with open(self.csv_file_path, 'w', newline='', encoding='utf-8') as file:
                if users:
                    fieldnames = users[0].keys()
                    writer = csv.DictWriter(file, fieldnames=fieldnames)
                    writer.writeheader()
                    writer.writerows(users)
        except Exception as e:
            print(f"Ошибка при записи в CSV: {e}")
            raise
    
    def _get_next_id(self) -> int:
        try:
            users = self._read_users()
            if not users:
                return 1
            max_id = max(int(user['id']) for user in users)
            return max_id + 1
        except Exception as e:
            print(f"Ошибка при получении следующего ID: {e}")
            return 1
    
    def get_password_hash(self, password: str) -> str:
        try:
            salt = bcrypt.gensalt()
            hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
            return str(hashed.decode('utf-8'))
        except Exception as e:
            print(f"Ошибка при хешировании пароля: {e}")
            raise
    
    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        try:
            result = bcrypt.checkpw(
                plain_password.encode('utf-8'), 
                hashed_password.encode('utf-8')
            )
            return bool(result)
        except Exception as e:
            print(f"Ошибка при проверке пароля: {e}")
            return False
    
    def get_user_by_email(self, email: str) -> Optional[dict]:
        try:
            users = self._read_users()
            for user in users:
                if user['email'] == email:
                    return user
            return None
        except Exception as e:
            print(f"Ошибка при поиске пользователя по email: {e}")
            return None
    
    def get_user_by_id(self, user_id: int) -> Optional[dict]:
        try:
            users = self._read_users()
            for user in users:
                if int(user['id']) == user_id:
                    return user
            return None
        except Exception as e:
            print(f"Ошибка при поиске пользователя по ID: {e}")
            return None
    
    def create_user(self, user: UserCreate) -> dict:
        try:
            print(f"Создание пользователя: {user.email}")
            print(f"Путь к CSV файлу: {self.csv_file_path}")
            
            if self.get_user_by_email(user.email):
                raise ValueError("Email already registered")
            
            new_user = {
                'id': str(self._get_next_id()),
                'email': user.email,
                'inn': user.inn or '',
                'password_hash': self.get_password_hash(user.password),
                'role': 'user',
                'created_at': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            }
            
            print(f"Новый пользователь создан: {new_user}")
            
            users = self._read_users()
            print(f"Текущее количество пользователей: {len(users)}")
            users.append(new_user)
            print(f"После добавления: {len(users)}")
            
            self._write_users(users)
            print(f"Пользователь записан в файл: {self.csv_file_path}")
            
            return new_user
        except Exception as e:
            print(f"Ошибка при создании пользователя: {e}")
            raise
    
    def authenticate_user(self, email: str, password: str) -> Optional[dict]:
        try:
            user = self.get_user_by_email(email)
            if not user:
                return None
            if not self.verify_password(password, user['password_hash']):
                return None
            return user
        except Exception as e:
            print(f"Ошибка при аутентификации пользователя: {e}")
            return None
    
    def get_all_users(self, skip: int = 0, limit: int = 100) -> List[dict]:
        try:
            users = self._read_users()
            return users[skip:skip + limit]
        except Exception as e:
            print(f"Ошибка при получении всех пользователей: {e}")
            return []

try:
    csv_user_crud: Optional[CSVUserCRUD] = CSVUserCRUD()
except Exception as e:
    print(f"Ошибка при создании глобального экземпляра CSVUserCRUD: {e}")
    csv_user_crud = None
