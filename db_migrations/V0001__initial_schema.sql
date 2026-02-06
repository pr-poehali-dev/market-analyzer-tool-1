-- MarketAnalyzer Database Schema
-- Таблица пользователей
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица товаров
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    platform VARCHAR(50) NOT NULL,
    external_id VARCHAR(255) NOT NULL,
    name VARCHAR(500) NOT NULL,
    price DECIMAL(10, 2),
    url TEXT,
    image_url TEXT,
    category VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(platform, external_id)
);

-- Таблица истории позиций
CREATE TABLE IF NOT EXISTS position_history (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id),
    position INTEGER NOT NULL,
    keyword VARCHAR(255),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, keyword, date)
);

-- Таблица продаж
CREATE TABLE IF NOT EXISTS sales_history (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    sales_count INTEGER DEFAULT 0,
    revenue DECIMAL(12, 2) DEFAULT 0,
    orders_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, date)
);

-- Таблица конкурентов
CREATE TABLE IF NOT EXISTS competitors (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id),
    name VARCHAR(500) NOT NULL,
    platform VARCHAR(50) NOT NULL,
    external_id VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2),
    position INTEGER,
    rating DECIMAL(2, 1),
    reviews_count INTEGER DEFAULT 0,
    sales_estimate INTEGER DEFAULT 0,
    url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, platform, external_id)
);

-- Таблица CTR метрик
CREATE TABLE IF NOT EXISTS ctr_metrics (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    ctr DECIMAL(5, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, date)
);

-- Таблица ключевых слов
CREATE TABLE IF NOT EXISTS keywords (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id),
    keyword VARCHAR(255) NOT NULL,
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    ctr DECIMAL(5, 2) DEFAULT 0,
    position DECIMAL(5, 2),
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, keyword)
);

-- Таблица отзывов
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id),
    platform VARCHAR(50) NOT NULL,
    external_id VARCHAR(255),
    rating INTEGER NOT NULL,
    text TEXT,
    author VARCHAR(255),
    date DATE,
    sentiment VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, platform, external_id)
);

-- Таблица рекламных кампаний
CREATE TABLE IF NOT EXISTS ad_campaigns (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    product_id INTEGER REFERENCES products(id),
    platform VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    budget DECIMAL(10, 2) DEFAULT 0,
    spent DECIMAL(10, 2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'active',
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица уведомлений
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица настроек пользователя
CREATE TABLE IF NOT EXISTS user_settings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) UNIQUE,
    price_change_alerts BOOLEAN DEFAULT TRUE,
    position_change_alerts BOOLEAN DEFAULT TRUE,
    ctr_alerts BOOLEAN DEFAULT TRUE,
    low_stock_alerts BOOLEAN DEFAULT FALSE,
    email_notifications BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для оптимизации
CREATE INDEX IF NOT EXISTS idx_products_user ON products(user_id);
CREATE INDEX IF NOT EXISTS idx_products_platform ON products(platform);
CREATE INDEX IF NOT EXISTS idx_position_history_product ON position_history(product_id);
CREATE INDEX IF NOT EXISTS idx_position_history_date ON position_history(date);
CREATE INDEX IF NOT EXISTS idx_sales_history_product ON sales_history(product_id);
CREATE INDEX IF NOT EXISTS idx_sales_history_date ON sales_history(date);
CREATE INDEX IF NOT EXISTS idx_competitors_product ON competitors(product_id);
CREATE INDEX IF NOT EXISTS idx_ctr_metrics_product ON ctr_metrics(product_id);
CREATE INDEX IF NOT EXISTS idx_keywords_product ON keywords(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
