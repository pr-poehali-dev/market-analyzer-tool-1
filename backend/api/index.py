"""
API для работы с данными MarketAnalyzer
Управление товарами, позициями, конкурентами и аналитикой
"""
import json
import os
from datetime import datetime, timedelta
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    """Подключение к базе данных"""
    dsn = os.environ.get('DATABASE_URL')
    return psycopg2.connect(dsn, cursor_factory=RealDictCursor)

def handler(event: dict, context) -> dict:
    """Главный обработчик API запросов"""
    method = event.get('httpMethod', 'GET')
    params = event.get('queryStringParameters', {}) or {}
    action = params.get('action', 'products')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    try:
        conn = get_db_connection()
        
        if method == 'GET':
            if action == 'products':
                result = get_products(conn, event)
            elif action == 'stats':
                result = get_stats(conn, event)
            elif action == 'sales-history':
                result = get_sales_history(conn, event)
            elif action == 'position-history':
                result = get_position_history(conn, event)
            elif action == 'competitors':
                result = get_competitors(conn, event)
            elif action == 'keywords':
                result = get_keywords(conn, event)
            elif action == 'reviews':
                result = get_reviews(conn, event)
            elif action == 'ctr-metrics':
                result = get_ctr_metrics(conn, event)
            elif action == 'notifications':
                result = get_notifications(conn, event)
            else:
                result = {'error': 'Unknown action'}
                
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            action = body.get('action', 'add-product')
            
            if action == 'add-product':
                result = add_product(conn, body)
            elif action == 'add-position':
                result = add_position_history(conn, body)
            elif action == 'add-sales':
                result = add_sales_history(conn, body)
            elif action == 'add-competitor':
                result = add_competitor(conn, body)
            elif action == 'add-review':
                result = add_review(conn, body)
            else:
                result = {'error': 'Unknown action'}
        else:
            result = {'error': 'Method not allowed'}
        
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps(result, default=str),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }

def get_products(conn, event):
    """Получить список товаров пользователя"""
    params = event.get('queryStringParameters', {}) or {}
    user_id = params.get('user_id', 1)
    platform = params.get('platform')
    
    cursor = conn.cursor()
    
    if platform and platform != 'all':
        query = """
            SELECT p.*, 
                   COALESCE(ph.position, 0) as current_position,
                   COALESCE(ctr.ctr, 0) as ctr
            FROM products p
            LEFT JOIN LATERAL (
                SELECT position 
                FROM position_history 
                WHERE product_id = p.id 
                ORDER BY date DESC 
                LIMIT 1
            ) ph ON true
            LEFT JOIN LATERAL (
                SELECT ctr 
                FROM ctr_metrics 
                WHERE product_id = p.id 
                ORDER BY date DESC 
                LIMIT 1
            ) ctr ON true
            WHERE p.user_id = %s AND p.platform = %s
            ORDER BY p.created_at DESC
        """
        cursor.execute(query, (user_id, platform))
    else:
        query = """
            SELECT p.*, 
                   COALESCE(ph.position, 0) as current_position,
                   COALESCE(ctr.ctr, 0) as ctr
            FROM products p
            LEFT JOIN LATERAL (
                SELECT position 
                FROM position_history 
                WHERE product_id = p.id 
                ORDER BY date DESC 
                LIMIT 1
            ) ph ON true
            LEFT JOIN LATERAL (
                SELECT ctr 
                FROM ctr_metrics 
                WHERE product_id = p.id 
                ORDER BY date DESC 
                LIMIT 1
            ) ctr ON true
            WHERE p.user_id = %s
            ORDER BY p.created_at DESC
        """
        cursor.execute(query, (user_id,))
    
    products = cursor.fetchall()
    cursor.close()
    
    return {'products': products}

def get_stats(conn, event):
    """Получить общую статистику"""
    params = event.get('queryStringParameters', {}) or {}
    user_id = params.get('user_id', 1)
    days = int(params.get('days', 30))
    
    cursor = conn.cursor()
    
    date_from = (datetime.now() - timedelta(days=days)).date()
    
    query = """
        SELECT 
            COALESCE(SUM(sh.revenue), 0) as total_revenue,
            COALESCE(SUM(sh.sales_count), 0) as total_sales,
            COALESCE(AVG(ph.position), 0) as avg_position,
            COALESCE(AVG(ctr.ctr), 0) as avg_ctr
        FROM products p
        LEFT JOIN sales_history sh ON sh.product_id = p.id AND sh.date >= %s
        LEFT JOIN position_history ph ON ph.product_id = p.id AND ph.date >= %s
        LEFT JOIN ctr_metrics ctr ON ctr.product_id = p.id AND ctr.date >= %s
        WHERE p.user_id = %s
    """
    
    cursor.execute(query, (date_from, date_from, date_from, user_id))
    stats = cursor.fetchone()
    cursor.close()
    
    return dict(stats) if stats else {}

def get_sales_history(conn, event):
    """Получить историю продаж"""
    params = event.get('queryStringParameters', {}) or {}
    product_id = params.get('product_id')
    user_id = params.get('user_id', 1)
    days = int(params.get('days', 30))
    
    cursor = conn.cursor()
    date_from = (datetime.now() - timedelta(days=days)).date()
    
    if product_id:
        query = """
            SELECT date, sales_count, revenue, orders_count
            FROM sales_history
            WHERE product_id = %s AND date >= %s
            ORDER BY date ASC
        """
        cursor.execute(query, (product_id, date_from))
    else:
        query = """
            SELECT sh.date, 
                   SUM(sh.sales_count) as sales_count, 
                   SUM(sh.revenue) as revenue,
                   SUM(sh.orders_count) as orders_count
            FROM sales_history sh
            JOIN products p ON p.id = sh.product_id
            WHERE p.user_id = %s AND sh.date >= %s
            GROUP BY sh.date
            ORDER BY sh.date ASC
        """
        cursor.execute(query, (user_id, date_from))
    
    history = cursor.fetchall()
    cursor.close()
    
    return {'history': history}

def get_position_history(conn, event):
    """Получить историю позиций"""
    params = event.get('queryStringParameters', {}) or {}
    product_id = params.get('product_id')
    days = int(params.get('days', 30))
    
    if not product_id:
        return {'error': 'product_id required'}
    
    cursor = conn.cursor()
    date_from = (datetime.now() - timedelta(days=days)).date()
    
    query = """
        SELECT date, position, keyword
        FROM position_history
        WHERE product_id = %s AND date >= %s
        ORDER BY date ASC
    """
    
    cursor.execute(query, (product_id, date_from))
    history = cursor.fetchall()
    cursor.close()
    
    return {'history': history}

def get_competitors(conn, event):
    """Получить список конкурентов"""
    params = event.get('queryStringParameters', {}) or {}
    product_id = params.get('product_id')
    
    if not product_id:
        return {'error': 'product_id required'}
    
    cursor = conn.cursor()
    
    query = """
        SELECT *
        FROM competitors
        WHERE product_id = %s
        ORDER BY position ASC
    """
    
    cursor.execute(query, (product_id,))
    competitors = cursor.fetchall()
    cursor.close()
    
    return {'competitors': competitors}

def get_keywords(conn, event):
    """Получить ключевые слова"""
    params = event.get('queryStringParameters', {}) or {}
    product_id = params.get('product_id')
    user_id = params.get('user_id', 1)
    
    cursor = conn.cursor()
    
    if product_id:
        query = """
            SELECT *
            FROM keywords
            WHERE product_id = %s
            ORDER BY impressions DESC
        """
        cursor.execute(query, (product_id,))
    else:
        query = """
            SELECT k.*
            FROM keywords k
            JOIN products p ON p.id = k.product_id
            WHERE p.user_id = %s
            ORDER BY k.impressions DESC
            LIMIT 20
        """
        cursor.execute(query, (user_id,))
    
    keywords = cursor.fetchall()
    cursor.close()
    
    return {'keywords': keywords}

def get_reviews(conn, event):
    """Получить отзывы"""
    params = event.get('queryStringParameters', {}) or {}
    product_id = params.get('product_id')
    
    if not product_id:
        return {'error': 'product_id required'}
    
    cursor = conn.cursor()
    
    query = """
        SELECT *
        FROM reviews
        WHERE product_id = %s
        ORDER BY date DESC
        LIMIT 100
    """
    
    cursor.execute(query, (product_id,))
    reviews = cursor.fetchall()
    cursor.close()
    
    return {'reviews': reviews}

def get_ctr_metrics(conn, event):
    """Получить CTR метрики"""
    params = event.get('queryStringParameters', {}) or {}
    product_id = params.get('product_id')
    user_id = params.get('user_id', 1)
    
    cursor = conn.cursor()
    
    if product_id:
        query = """
            SELECT *
            FROM ctr_metrics
            WHERE product_id = %s
            ORDER BY date DESC
            LIMIT 1
        """
        cursor.execute(query, (product_id,))
    else:
        query = """
            SELECT 
                SUM(impressions) as total_impressions,
                SUM(clicks) as total_clicks,
                SUM(conversions) as total_conversions,
                CASE 
                    WHEN SUM(impressions) > 0 
                    THEN ROUND((SUM(clicks)::numeric / SUM(impressions) * 100), 2)
                    ELSE 0 
                END as ctr
            FROM ctr_metrics cm
            JOIN products p ON p.id = cm.product_id
            WHERE p.user_id = %s
        """
        cursor.execute(query, (user_id,))
    
    metrics = cursor.fetchone()
    cursor.close()
    
    return dict(metrics) if metrics else {}

def get_notifications(conn, event):
    """Получить уведомления"""
    params = event.get('queryStringParameters', {}) or {}
    user_id = params.get('user_id', 1)
    
    cursor = conn.cursor()
    
    query = """
        SELECT *
        FROM notifications
        WHERE user_id = %s
        ORDER BY created_at DESC
        LIMIT 50
    """
    
    cursor.execute(query, (user_id,))
    notifications = cursor.fetchall()
    cursor.close()
    
    return {'notifications': notifications}

def add_product(conn, body):
    """Добавить новый товар"""
    cursor = conn.cursor()
    
    query = """
        INSERT INTO products (user_id, platform, external_id, name, price, url, image_url, category)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (platform, external_id) 
        DO UPDATE SET 
            name = EXCLUDED.name,
            price = EXCLUDED.price,
            updated_at = CURRENT_TIMESTAMP
        RETURNING *
    """
    
    cursor.execute(query, (
        body.get('user_id', 1),
        body['platform'],
        body['external_id'],
        body['name'],
        body.get('price'),
        body.get('url'),
        body.get('image_url'),
        body.get('category')
    ))
    
    product = cursor.fetchone()
    conn.commit()
    cursor.close()
    
    return {'product': dict(product)}

def add_position_history(conn, body):
    """Добавить запись истории позиций"""
    cursor = conn.cursor()
    
    query = """
        INSERT INTO position_history (product_id, position, keyword, date)
        VALUES (%s, %s, %s, %s)
        ON CONFLICT (product_id, keyword, date) 
        DO UPDATE SET position = EXCLUDED.position
        RETURNING *
    """
    
    cursor.execute(query, (
        body['product_id'],
        body['position'],
        body.get('keyword', ''),
        body.get('date', datetime.now().date())
    ))
    
    record = cursor.fetchone()
    conn.commit()
    cursor.close()
    
    return {'record': dict(record)}

def add_sales_history(conn, body):
    """Добавить запись истории продаж"""
    cursor = conn.cursor()
    
    query = """
        INSERT INTO sales_history (product_id, date, sales_count, revenue, orders_count)
        VALUES (%s, %s, %s, %s, %s)
        ON CONFLICT (product_id, date) 
        DO UPDATE SET 
            sales_count = EXCLUDED.sales_count,
            revenue = EXCLUDED.revenue,
            orders_count = EXCLUDED.orders_count
        RETURNING *
    """
    
    cursor.execute(query, (
        body['product_id'],
        body.get('date', datetime.now().date()),
        body.get('sales_count', 0),
        body.get('revenue', 0),
        body.get('orders_count', 0)
    ))
    
    record = cursor.fetchone()
    conn.commit()
    cursor.close()
    
    return {'record': dict(record)}

def add_competitor(conn, body):
    """Добавить конкурента"""
    cursor = conn.cursor()
    
    query = """
        INSERT INTO competitors (product_id, name, platform, external_id, price, position, rating, reviews_count, sales_estimate, url)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (product_id, platform, external_id) 
        DO UPDATE SET 
            price = EXCLUDED.price,
            position = EXCLUDED.position,
            rating = EXCLUDED.rating,
            reviews_count = EXCLUDED.reviews_count,
            sales_estimate = EXCLUDED.sales_estimate,
            updated_at = CURRENT_TIMESTAMP
        RETURNING *
    """
    
    cursor.execute(query, (
        body['product_id'],
        body['name'],
        body['platform'],
        body['external_id'],
        body.get('price'),
        body.get('position'),
        body.get('rating'),
        body.get('reviews_count', 0),
        body.get('sales_estimate', 0),
        body.get('url')
    ))
    
    competitor = cursor.fetchone()
    conn.commit()
    cursor.close()
    
    return {'competitor': dict(competitor)}

def add_review(conn, body):
    """Добавить отзыв"""
    cursor = conn.cursor()
    
    query = """
        INSERT INTO reviews (product_id, platform, external_id, rating, text, author, date, sentiment)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (product_id, platform, external_id) 
        DO UPDATE SET 
            rating = EXCLUDED.rating,
            text = EXCLUDED.text,
            sentiment = EXCLUDED.sentiment
        RETURNING *
    """
    
    cursor.execute(query, (
        body['product_id'],
        body['platform'],
        body.get('external_id'),
        body['rating'],
        body.get('text'),
        body.get('author'),
        body.get('date', datetime.now().date()),
        body.get('sentiment')
    ))
    
    review = cursor.fetchone()
    conn.commit()
    cursor.close()
    
    return {'review': dict(review)}