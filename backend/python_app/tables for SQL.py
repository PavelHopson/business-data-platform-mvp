

CREATE TABLE companies (
    id SERIAL PRIMARY KEY,
    inn VARCHAR(12) UNIQUE NOT NULL,      -- ИНН
    ogrn VARCHAR(13) UNIQUE,              -- ОГРН
    name TEXT NOT NULL,                   -- Название компании
    status VARCHAR(50),                   -- Статус (например: "Действующее", "Ликвидировано")
    address TEXT,                         -- Адрес
    registration_date DATE,               -- Дата регистрации
    created_at TIMESTAMP DEFAULT NOW(),   -- Дата создания записи
    updated_at TIMESTAMP DEFAULT NOW()    -- Дата обновления записи
);


---



CREATE TABLE founders (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,  -- ID компании (связь с companies)
    name TEXT NOT NULL,                                             -- Имя учредителя
    share FLOAT,                                                    -- Доля учредителя
    created_at TIMESTAMP DEFAULT NOW()                              -- Дата создания записи
);


---



CREATE TABLE financials (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,  -- ID компании (связь с companies)
    year INTEGER NOT NULL,                                          -- Год
    revenue FLOAT,                                                  -- Выручка
    profit FLOAT,                                                   -- Прибыль
    assets FLOAT,                                                   -- Активы
    created_at TIMESTAMP DEFAULT NOW(),                             -- Дата создания записи
    UNIQUE (company_id, year)                                       -- Уникальная пара: company_id + year
);


---



CREATE TABLE court_cases (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,  -- ID компании (связь с companies)
    case_number VARCHAR(100) NOT NULL,                              -- Номер дела
    date DATE,                                                      -- Дата
    status VARCHAR(50),                                             -- Статус (например: "Рассматривается", "Завершено")
    type VARCHAR(100),                                              -- Тип дела
    created_at TIMESTAMP DEFAULT NOW()                              -- Дата создания записи
);


---


CREATE TABLE contracts (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,  -- ID компании (связь с companies)
    customer TEXT,                                                  -- Заказчик
    amount FLOAT,                                                   -- Сумма
    date DATE,                                                      -- Дата
    created_at TIMESTAMP DEFAULT NOW()                              -- Дата создания записи
);

