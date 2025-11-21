-- Миграция для создания всех таблиц и добавления недостающих колонок
-- Создает таблицы если их нет и добавляет колонки если их нет

-- Таблица пользователей
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    inn VARCHAR(12),
    role VARCHAR(20) DEFAULT 'user' NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_inn ON users(inn);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Таблица компаний
CREATE TABLE IF NOT EXISTS companies (
    id SERIAL PRIMARY KEY,
    inn VARCHAR(12) UNIQUE NOT NULL,
    ogrn VARCHAR(13) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    status VARCHAR(50),
    address VARCHAR(500),
    registration_date DATE,
    raw_fns_data TEXT,
    raw_scraper_data TEXT,
    last_fns_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_scraper_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_companies_inn ON companies(inn);
CREATE INDEX IF NOT EXISTS idx_companies_ogrn ON companies(ogrn);
CREATE INDEX IF NOT EXISTS idx_companies_name ON companies(name);

-- Таблица учредителей
CREATE TABLE IF NOT EXISTS founders (
    id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    share FLOAT
);

CREATE INDEX IF NOT EXISTS idx_founders_company_id ON founders(company_id);

-- Таблица финансов
CREATE TABLE IF NOT EXISTS financials (
    id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    year INTEGER NOT NULL,
    revenue FLOAT,
    profit FLOAT,
    assets FLOAT
);

CREATE INDEX IF NOT EXISTS idx_financials_company_id ON financials(company_id);
CREATE INDEX IF NOT EXISTS idx_financials_year ON financials(year);

-- Таблица судебных дел
CREATE TABLE IF NOT EXISTS court_cases (
    id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    case_number VARCHAR(255),
    date DATE,
    status VARCHAR(100),
    type VARCHAR(100)
);

CREATE INDEX IF NOT EXISTS idx_court_cases_company_id ON court_cases(company_id);
CREATE INDEX IF NOT EXISTS idx_court_cases_case_number ON court_cases(case_number);

-- Таблица контрактов
CREATE TABLE IF NOT EXISTS contracts (
    id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    customer VARCHAR(255),
    amount FLOAT NOT NULL,
    date DATE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_contracts_company_id ON contracts(company_id);
CREATE INDEX IF NOT EXISTS idx_contracts_date ON contracts(date);

-- Добавляем недостающие колонки в существующую таблицу companies
-- Это нужно для обновления старых серверов
DO $$ 
BEGIN
    -- Добавляем raw_fns_data если не существует
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='companies' AND column_name='raw_fns_data'
    ) THEN
        ALTER TABLE companies ADD COLUMN raw_fns_data TEXT;
    END IF;

    -- Добавляем raw_scraper_data если не существует
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='companies' AND column_name='raw_scraper_data'
    ) THEN
        ALTER TABLE companies ADD COLUMN raw_scraper_data TEXT;
    END IF;

    -- Добавляем last_fns_update если не существует
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='companies' AND column_name='last_fns_update'
    ) THEN
        ALTER TABLE companies 
        ADD COLUMN last_fns_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    END IF;

    -- Добавляем last_scraper_update если не существует
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='companies' AND column_name='last_scraper_update'
    ) THEN
        ALTER TABLE companies 
        ADD COLUMN last_scraper_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    END IF;

    -- Добавляем created_at если не существует
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='companies' AND column_name='created_at'
    ) THEN
        ALTER TABLE companies 
        ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    END IF;

    -- Добавляем updated_at если не существует
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='companies' AND column_name='updated_at'
    ) THEN
        ALTER TABLE companies 
        ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    END IF;
END $$;

-- Создаём индексы для новых колонок (после того как они добавлены)
CREATE INDEX IF NOT EXISTS idx_companies_last_fns_update 
    ON companies(last_fns_update);
CREATE INDEX IF NOT EXISTS idx_companies_last_scraper_update 
    ON companies(last_scraper_update);
CREATE INDEX IF NOT EXISTS idx_companies_created_at 
    ON companies(created_at);
CREATE INDEX IF NOT EXISTS idx_companies_updated_at 
    ON companies(updated_at);

-- Добавляем недостающие колонки в существующую таблицу users
-- Это нужно для обновления старых серверов
DO $$ 
BEGIN
    -- Добавляем name если не существует
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='users' AND column_name='name'
    ) THEN
        ALTER TABLE users 
        ADD COLUMN name VARCHAR(255) DEFAULT 'User' NOT NULL;
    END IF;

    -- Добавляем is_active если не существует
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='users' AND column_name='is_active'
    ) THEN
        ALTER TABLE users 
        ADD COLUMN is_active BOOLEAN DEFAULT TRUE NOT NULL;
    END IF;
END $$;

