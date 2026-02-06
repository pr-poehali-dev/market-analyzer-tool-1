const API_URL = 'https://functions.poehali.dev/523fc7e5-f93b-4c3c-a292-a9470493fd1a';

export interface Product {
  id: number;
  name: string;
  platform: string;
  price: number;
  current_position: number;
  ctr: number;
}

export interface SalesData {
  date: string;
  sales_count: number;
  revenue: number;
  orders_count: number;
}

export interface PositionHistory {
  date: string;
  position: number;
}

export interface Competitor {
  id: number;
  name: string;
  price: string;
  position: number;
  rating: number;
  reviews_count: number;
  sales_estimate: number;
}

export interface Keyword {
  keyword: string;
  impressions: number;
  clicks: number;
  ctr: string;
  position: number;
}

export interface Review {
  id: number;
  rating: number;
  text: string;
  author: string;
  date: string;
  sentiment: string;
}

export interface Stats {
  total_revenue: number;
  total_sales: number;
  avg_position: number;
  avg_ctr: number;
}

export const api = {
  async getProducts(userId = 1, platform?: string): Promise<Product[]> {
    const params = new URLSearchParams({
      action: 'products',
      user_id: userId.toString(),
    });
    
    if (platform && platform !== 'all') {
      params.append('platform', platform);
    }
    
    const response = await fetch(`${API_URL}?${params}`);
    const data = await response.json();
    return data.products || [];
  },

  async getStats(userId = 1, days = 30): Promise<Stats> {
    const params = new URLSearchParams({
      action: 'stats',
      user_id: userId.toString(),
      days: days.toString(),
    });
    
    const response = await fetch(`${API_URL}?${params}`);
    return await response.json();
  },

  async getSalesHistory(userId = 1, days = 30, productId?: number): Promise<SalesData[]> {
    const params = new URLSearchParams({
      action: 'sales-history',
      user_id: userId.toString(),
      days: days.toString(),
    });
    
    if (productId) {
      params.append('product_id', productId.toString());
    }
    
    const response = await fetch(`${API_URL}?${params}`);
    const data = await response.json();
    return data.history || [];
  },

  async getPositionHistory(productId: number, days = 30): Promise<PositionHistory[]> {
    const params = new URLSearchParams({
      action: 'position-history',
      product_id: productId.toString(),
      days: days.toString(),
    });
    
    const response = await fetch(`${API_URL}?${params}`);
    const data = await response.json();
    return data.history || [];
  },

  async getCompetitors(productId: number): Promise<Competitor[]> {
    const params = new URLSearchParams({
      action: 'competitors',
      product_id: productId.toString(),
    });
    
    const response = await fetch(`${API_URL}?${params}`);
    const data = await response.json();
    return data.competitors || [];
  },

  async getKeywords(userId = 1, productId?: number): Promise<Keyword[]> {
    const params = new URLSearchParams({
      action: 'keywords',
      user_id: userId.toString(),
    });
    
    if (productId) {
      params.append('product_id', productId.toString());
    }
    
    const response = await fetch(`${API_URL}?${params}`);
    const data = await response.json();
    return data.keywords || [];
  },

  async getReviews(productId: number): Promise<Review[]> {
    const params = new URLSearchParams({
      action: 'reviews',
      product_id: productId.toString(),
    });
    
    const response = await fetch(`${API_URL}?${params}`);
    const data = await response.json();
    return data.reviews || [];
  },

  async getCtrMetrics(userId = 1, productId?: number) {
    const params = new URLSearchParams({
      action: 'ctr-metrics',
      user_id: userId.toString(),
    });
    
    if (productId) {
      params.append('product_id', productId.toString());
    }
    
    const response = await fetch(`${API_URL}?${params}`);
    return await response.json();
  },
};
