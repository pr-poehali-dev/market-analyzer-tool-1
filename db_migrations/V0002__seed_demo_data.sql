-- Добавляем тестового пользователя и демо-данные
INSERT INTO users (id, email, name) VALUES (1, 'demo@marketanalyzer.com', 'Demo User') 
ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email, name = EXCLUDED.name;

-- Добавляем демо-товары
INSERT INTO products (id, user_id, platform, external_id, name, price, category, url) VALUES
(1, 1, 'wildberries', 'wb123456', 'Смартфон XYZ Pro Max', 18990.00, 'Электроника', 'https://wildberries.ru/product/123456'),
(2, 1, 'wildberries', 'wb123457', 'Наушники BT-500', 1200.00, 'Электроника', 'https://wildberries.ru/product/123457'),
(3, 1, 'ozon', 'oz789012', 'Чехол Premium Silicone', 199.99, 'Аксессуары', 'https://ozon.ru/product/789012'),
(4, 1, 'yandex', 'ym345678', 'Защитное стекло 9H', 299.00, 'Аксессуары', 'https://market.yandex.ru/product/345678')
ON CONFLICT (platform, external_id) DO NOTHING;

-- Добавляем историю позиций за последние 30 дней
INSERT INTO position_history (product_id, position, keyword, date)
SELECT 
    p.id,
    FLOOR(5 + RANDOM() * 20)::int,
    '',
    CURRENT_DATE - (n || ' days')::interval
FROM products p
CROSS JOIN generate_series(0, 29) AS n
ON CONFLICT (product_id, keyword, date) DO NOTHING;

-- Добавляем историю продаж
INSERT INTO sales_history (product_id, date, sales_count, revenue, orders_count)
SELECT 
    p.id,
    CURRENT_DATE - (n || ' days')::interval,
    FLOOR(50 + RANDOM() * 150)::int,
    FLOOR(30000 + RANDOM() * 50000)::numeric,
    FLOOR(100 + RANDOM() * 200)::int
FROM products p
CROSS JOIN generate_series(0, 29) AS n
ON CONFLICT (product_id, date) DO NOTHING;

-- Добавляем конкурентов
INSERT INTO competitors (product_id, name, platform, external_id, price, position, rating, reviews_count, sales_estimate) VALUES
(1, 'Конкурент А', 'wildberries', 'wb999001', 18990, 3, 4.8, 2341, 450),
(1, 'Конкурент Б', 'wildberries', 'wb999002', 17450, 5, 4.6, 1876, 380),
(1, 'Конкурент В', 'wildberries', 'wb999003', 19990, 7, 4.7, 3104, 520)
ON CONFLICT (product_id, platform, external_id) DO NOTHING;

-- Добавляем ключевые слова
INSERT INTO keywords (product_id, keyword, impressions, clicks, ctr, position) VALUES
(1, 'смартфон', 5234, 267, 5.1, 8.5),
(1, 'телефон', 3890, 189, 4.9, 12.3),
(1, 'android', 2145, 98, 4.6, 15.7),
(1, 'мобильный', 1876, 82, 4.4, 18.2),
(1, 'недорого', 4567, 312, 6.8, 6.1),
(1, 'купить', 3210, 156, 4.9, 11.4),
(1, 'акция', 2890, 178, 6.2, 9.8)
ON CONFLICT (product_id, keyword) DO NOTHING;

-- Добавляем CTR метрики
INSERT INTO ctr_metrics (product_id, date, impressions, clicks, conversions, ctr)
SELECT 
    p.id,
    CURRENT_DATE - (n || ' days')::interval,
    FLOOR(1000 + RANDOM() * 2000)::int,
    FLOOR(40 + RANDOM() * 100)::int,
    FLOOR(10 + RANDOM() * 30)::int,
    ROUND((RANDOM() * 5 + 2)::numeric, 2)
FROM products p
CROSS JOIN generate_series(0, 29) AS n
ON CONFLICT (product_id, date) DO NOTHING;

-- Добавляем отзывы
INSERT INTO reviews (product_id, platform, external_id, rating, text, author, date, sentiment) VALUES
(1, 'wildberries', 'rev001', 5, 'Отличный смартфон, быстрая доставка!', 'Иван П.', CURRENT_DATE - 5, 'positive'),
(1, 'wildberries', 'rev002', 4, 'Хороший телефон за свои деньги', 'Мария С.', CURRENT_DATE - 3, 'positive'),
(1, 'wildberries', 'rev003', 3, 'Не хватает функций камеры', 'Алексей К.', CURRENT_DATE - 1, 'neutral')
ON CONFLICT (product_id, platform, external_id) DO NOTHING;

-- Добавляем настройки пользователя
INSERT INTO user_settings (user_id, price_change_alerts, position_change_alerts, ctr_alerts, low_stock_alerts)
VALUES (1, TRUE, TRUE, TRUE, FALSE)
ON CONFLICT (user_id) DO NOTHING;

-- Обновляем sequence для users и products
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('products_id_seq', (SELECT MAX(id) FROM products));
