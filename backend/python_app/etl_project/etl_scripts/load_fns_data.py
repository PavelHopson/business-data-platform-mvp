import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import requests
import pandas as pd
from datetime import datetime
from sqlalchemy.orm import Session
from src.models import Company, Founder, Financial, CourtCase, Contract
from config.database import SessionLocal

API_KEY = '1a146f7e6f9942181e2352e63c71402d207f0248'

def fetch_company_data(inn: str):
    url = f"https://api-fns.ru/api/egr?req={inn}&key={API_KEY}"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Данные по ИНН {inn}: {list(data.keys())}")
        return data
    else:
        print(f"❌ Ошибка при запросе к API: {response.status_code}")
        return None

def save_company_and_related_data(data: dict, db: Session):
    if not data or 'items' not in data:
        print("❌ Нет данных для сохранения")
        return

    items = data.get('items', [])[:10]

    for item in items:
        ul_data = item.get('ЮЛ', {})
        inn = ul_data.get('ИНН')
        ogrn = ul_data.get('ОГРН')
        name = ul_data.get('НаимПолнЮЛ') or ul_data.get('НаимСокрЮЛ')
        address = ul_data.get('Адрес', {}).get('АдресПолн')
        status = ul_data.get('Статус')
        reg_date_str = ul_data.get('ДатаРег')

        if not inn or not ogrn or not name:
            print(f"⚠️ Пропускаем запись: не хватает данных. ИНН: {inn}")
            continue

        reg_date = None
        if reg_date_str:
            try:
                reg_date = datetime.strptime(reg_date_str, '%Y-%m-%d').date()
            except ValueError:
                print(f"⚠️ Неверный формат даты: {reg_date_str}")

        company = db.query(Company).filter(Company.inn == inn).first()
        if not company:
            company = Company(
                inn=inn,
                ogrn=ogrn,
                name=name,
                address=address,
                status=status,
                registration_date=reg_date
            )
            db.add(company)
            db.flush()
        else:
            company.name = name
            company.address = address
            company.status = status
            company.registration_date = reg_date
            db.flush()

        founders_data = ul_data.get('Учредители', [])
        for f in founders_data:
            founder_name = f.get('Наим')
            share = f.get('Доля', {}).get('Процент')

            if not founder_name:
                continue

            founder = db.query(Founder).filter(Founder.company_id == company.id, Founder.name == founder_name).first()
            if not founder:
                founder = Founder(
                    company_id=company.id,
                    name=founder_name,
                    share=share
                )
                db.add(founder)

        financial = db.query(Financial).filter(Financial.company_id == company.id, Financial.year == 2023).first()
        if not financial:
            financial = Financial(
                company_id=company.id,
                year=2023,
                revenue=1000000.0,
                profit=500000.0,
                assets=2000000.0
            )
            db.add(financial)

        court_case = db.query(CourtCase).filter(CourtCase.company_id == company.id, CourtCase.case_number == "12345/2023").first()
        if not court_case:
            court_case = CourtCase(
                company_id=company.id,
                case_number="12345/2023",
                date=datetime.now().date(),
                status="Рассматривается",
                type="Арбитраж"
            )
            db.add(court_case)

        contract = db.query(Contract).filter(Contract.company_id == company.id, Contract.customer == "Тестовый заказчик").first()
        if not contract:
            contract = Contract(
                company_id=company.id,
                customer="Тестовый заказчик",
                amount=500000.0,
                date=datetime.now().date()
            )
            db.add(contract)

    try:
        db.commit()
        print("✅ Транзакция успешно завершена")
    except Exception as e:
        print(f"❌ Ошибка транзакции: {e}")
        db.rollback()

def main():
    print("🔍 Читаем список ИНН из файла...")
    with open("input/inn_list.txt", "r", encoding="utf-8") as f:
        inn_list = [line.strip() for line in f if line.strip()]

    print(f"📋 Найдено ИНН: {len(inn_list)}")
    print(f"📝 ИНН: {inn_list}")

    print("🔍 Подключаемся к базе...")
    db: Session = SessionLocal()
    print("✅ Подключение к базе успешно")

    for inn in inn_list:
        print(f"🔍 Обрабатываем ИНН: {inn}")
        data = fetch_company_data(inn)
        if data:
            save_company_and_related_data(data, db)
        else:
            print(f"⚠️ Нет данных для ИНН: {inn}")

    db.close()
    print("🔒 База закрыта")

if __name__ == "__main__":
    main()