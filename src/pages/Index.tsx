import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { api, Product, SalesData, Competitor, Keyword } from '@/lib/api';
import ReviewsSection from '@/components/ReviewsSection';

const Index = () => {
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [dateRange, setDateRange] = useState('30');
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [competitorDialogOpen, setCompetitorDialogOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [reviewsDialogOpen, setReviewsDialogOpen] = useState(false);
  const [notifications, setNotifications] = useState({
    priceChanges: true,
    positionChanges: true,
    ctrAlerts: true,
    lowStock: false,
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [salesHistory, setSalesHistory] = useState<SalesData[]>([]);
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [stats, setStats] = useState<any>({});
  const [ctrMetrics, setCtrMetrics] = useState<any>({});
  const [positionHistory, setPositionHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [selectedPlatform, dateRange]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [productsData, statsData, salesData, keywordsData, ctrData] = await Promise.all([
        api.getProducts(1, selectedPlatform),
        api.getStats(1, parseInt(dateRange)),
        api.getSalesHistory(1, parseInt(dateRange)),
        api.getKeywords(1),
        api.getCtrMetrics(1),
      ]);

      setProducts(productsData);
      setStats(statsData);
      setSalesHistory(salesData);
      setKeywords(keywordsData);
      setCtrMetrics(ctrData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPositionHistory = async (productId: number) => {
    try {
      const history = await api.getPositionHistory(productId, parseInt(dateRange));
      setPositionHistory(history);
    } catch (error) {
      console.error('Failed to load position history:', error);
    }
  };

  const loadCompetitors = async (productId: number) => {
    try {
      const competitorsData = await api.getCompetitors(productId);
      setCompetitors(competitorsData);
    } catch (error) {
      console.error('Failed to load competitors:', error);
    }
  };

  const handleViewHistory = (productId: number) => {
    setSelectedProduct(productId);
    loadPositionHistory(productId);
    setHistoryDialogOpen(true);
  };

  const handleViewCompetitors = (productId: number) => {
    setSelectedProduct(productId);
    loadCompetitors(productId);
    setCompetitorDialogOpen(true);
  };

  const handleViewReviews = (productId: number) => {
    setSelectedProduct(productId);
    setReviewsDialogOpen(true);
  };

  const ctrChartData = ctrMetrics.total_impressions ? [
    { name: 'Показы', value: ctrMetrics.total_impressions, color: '#0EA5E9' },
    { name: 'Клики', value: ctrMetrics.total_clicks, color: '#8B5CF6' },
    { name: 'Покупки', value: ctrMetrics.total_conversions, color: '#10B981' },
  ] : [];

  const handleExportReport = () => {
    const csvContent = `Товар,Платформа,Позиция,CTR\n${products.map(p => 
      `${p.name},${p.platform},${p.current_position || 'N/A'},${p.ctr}%`
    ).join('\n')}`;
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `market_analyzer_report_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
  };

  const statsCards = [
    {
      title: 'Продажи за период',
      value: `₽${Math.round(stats.total_revenue || 0).toLocaleString('ru-RU')}`,
      change: '+23.5%',
      trend: 'up',
      icon: 'TrendingUp',
    },
    {
      title: 'Средняя позиция',
      value: Math.round(stats.avg_position || 0).toString(),
      change: '+8 позиций',
      trend: 'up',
      icon: 'BarChart3',
    },
    {
      title: 'CTR карточек',
      value: `${(ctrMetrics.ctr || 0).toFixed(1)}%`,
      change: '+1.2%',
      trend: 'up',
      icon: 'MousePointerClick',
    },
    {
      title: 'Всего товаров',
      value: products.length.toString(),
      change: `${stats.total_sales || 0} продаж`,
      trend: 'up',
      icon: 'Package',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Загрузка данных...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">MarketAnalyzer</h1>
            <p className="text-muted-foreground">Аналитика маркетплейсов в реальном времени</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportReport}>
              <Icon name="Download" size={20} className="mr-2" />
              Экспорт
            </Button>
            <Button variant="outline" size="icon" onClick={() => setSettingsDialogOpen(true)}>
              <Icon name="Settings" size={20} />
            </Button>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все платформы</SelectItem>
              <SelectItem value="wildberries">Wildberries</SelectItem>
              <SelectItem value="ozon">Ozon</SelectItem>
              <SelectItem value="yandex">Яндекс Маркет</SelectItem>
            </SelectContent>
          </Select>

          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 дней</SelectItem>
              <SelectItem value="14">14 дней</SelectItem>
              <SelectItem value="30">30 дней</SelectItem>
              <SelectItem value="90">90 дней</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8 animate-scale-in">
          {statsCards.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon
                  name={stat.icon}
                  size={20}
                  className={stat.trend === 'up' ? 'text-success' : 'text-destructive'}
                />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <p className={`text-sm flex items-center gap-1 ${stat.trend === 'up' ? 'text-success' : 'text-muted-foreground'}`}>
                  {stat.trend === 'up' && <Icon name="ArrowUp" size={16} />}
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="positions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto">
            <TabsTrigger value="positions">Позиции</TabsTrigger>
            <TabsTrigger value="sales">Продажи</TabsTrigger>
            <TabsTrigger value="competitors">Конкуренты</TabsTrigger>
            <TabsTrigger value="ctr">CTR</TabsTrigger>
            <TabsTrigger value="reviews">Отзывы</TabsTrigger>
          </TabsList>

          <TabsContent value="positions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Мониторинг позиций</CardTitle>
                <CardDescription>Отслеживание карточек в результатах поиска</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{product.name}</h3>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <Badge variant="outline">{product.platform}</Badge>
                          <span className="flex items-center gap-1">
                            <Icon name="MousePointerClick" size={14} />
                            CTR {product.ctr}%
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">
                            #{product.current_position || 'N/A'}
                          </div>
                          <div className="text-sm text-muted-foreground">Позиция</div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleViewHistory(product.id)}>
                            <Icon name="ChartLine" size={16} className="mr-2" />
                            История
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleViewReviews(product.id)}>
                            <Icon name="MessageSquare" size={16} className="mr-2" />
                            Отзывы
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sales">
            <Card>
              <CardHeader>
                <CardTitle>Динамика продаж</CardTitle>
                <CardDescription>Анализ продаж за выбранный период</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={salesHistory}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="date"
                      stroke="#64748b"
                      fontSize={12}
                      tickFormatter={(value) => format(new Date(value), 'dd MMM', { locale: ru })}
                    />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#0EA5E9" 
                      strokeWidth={2}
                      fill="url(#colorRevenue)" 
                      name="Выручка (₽)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="competitors">
            <Card>
              <CardHeader>
                <CardTitle>Анализ конкурентов</CardTitle>
                <CardDescription>Выберите товар для просмотра конкурентов</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => handleViewCompetitors(product.id)}
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{product.name}</h3>
                        <Badge variant="outline">{product.platform}</Badge>
                      </div>
                      <Button variant="outline" size="sm">
                        <Icon name="Eye" size={16} className="mr-2" />
                        Смотреть конкурентов
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ctr">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Воронка конверсии</CardTitle>
                  <CardDescription>От показа до покупки</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  {ctrChartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={ctrChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={100}
                          dataKey="value"
                        >
                          {ctrChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-muted-foreground">Нет данных</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Эффективность ключевых слов</CardTitle>
                  <CardDescription>CTR по поисковым запросам</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={keywords.slice(0, 7)} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis type="number" stroke="#64748b" fontSize={12} />
                      <YAxis type="category" dataKey="keyword" stroke="#64748b" fontSize={12} width={80} />
                      <Tooltip />
                      <Bar dataKey="clicks" fill="#10B981" radius={[0, 8, 8, 0]} name="Клики" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reviews">
            {products.length > 0 ? (
              <div className="space-y-4">
                {products.map((product) => (
                  <div key={product.id}>
                    <h3 className="text-lg font-semibold mb-4">{product.name}</h3>
                    <ReviewsSection productId={product.id} />
                  </div>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">Нет товаров для анализа отзывов</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={historyDialogOpen} onOpenChange={setHistoryDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>История позиций</DialogTitle>
            <DialogDescription>Динамика изменения позиций за выбранный период</DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={positionHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="date"
                  stroke="#64748b"
                  fontSize={12}
                  tickFormatter={(value) => format(new Date(value), 'dd MMM', { locale: ru })}
                />
                <YAxis stroke="#64748b" fontSize={12} reversed />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="position" 
                  stroke="#0EA5E9" 
                  strokeWidth={3}
                  dot={{ fill: '#0EA5E9', r: 4 }}
                  name="Позиция"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={competitorDialogOpen} onOpenChange={setCompetitorDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Конкуренты</DialogTitle>
            <DialogDescription>Сравнение с похожими товарами</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-4">
            {competitors.map((comp) => (
              <div key={comp.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{comp.name}</h3>
                  <div className="flex gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Icon name="Star" size={14} className="fill-warning text-warning" />
                      {comp.rating}
                    </span>
                    <span>{comp.reviews_count} отзывов</span>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="text-right">
                    <div className="text-lg font-bold">₽{comp.price}</div>
                    <div className="text-sm text-muted-foreground">Цена</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">#{comp.position}</div>
                    <div className="text-sm text-muted-foreground">Позиция</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={settingsDialogOpen} onOpenChange={setSettingsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Настройки уведомлений</DialogTitle>
            <DialogDescription>Управление оповещениями</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Изменения цен</div>
                <div className="text-sm text-muted-foreground">Уведомлять об изменении цен конкурентов</div>
              </div>
              <Button
                variant={notifications.priceChanges ? "default" : "outline"}
                size="sm"
                onClick={() => setNotifications(prev => ({ ...prev, priceChanges: !prev.priceChanges }))}
              >
                {notifications.priceChanges ? 'Вкл' : 'Выкл'}
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Изменения позиций</div>
                <div className="text-sm text-muted-foreground">Уведомлять о скачках в позициях</div>
              </div>
              <Button
                variant={notifications.positionChanges ? "default" : "outline"}
                size="sm"
                onClick={() => setNotifications(prev => ({ ...prev, positionChanges: !prev.positionChanges }))}
              >
                {notifications.positionChanges ? 'Вкл' : 'Выкл'}
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Оповещения CTR</div>
                <div className="text-sm text-muted-foreground">Уведомлять при изменении кликабельности</div>
              </div>
              <Button
                variant={notifications.ctrAlerts ? "default" : "outline"}
                size="sm"
                onClick={() => setNotifications(prev => ({ ...prev, ctrAlerts: !prev.ctrAlerts }))}
              >
                {notifications.ctrAlerts ? 'Вкл' : 'Выкл'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
