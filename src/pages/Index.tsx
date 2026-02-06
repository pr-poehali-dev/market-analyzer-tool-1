import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { format, subDays } from 'date-fns';
import { ru } from 'date-fns/locale';

const Index = () => {
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [dateRange, setDateRange] = useState('30');
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [competitorDialogOpen, setCompetitorDialogOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [notifications, setNotifications] = useState({
    priceChanges: true,
    positionChanges: true,
    ctrAlerts: true,
    lowStock: false,
  });

  const salesData = Array.from({ length: 30 }, (_, i) => ({
    date: format(subDays(new Date(), 29 - i), 'dd MMM', { locale: ru }),
    sales: Math.floor(Math.random() * 50000 + 30000),
    orders: Math.floor(Math.random() * 200 + 100),
  }));

  const positionHistory = Array.from({ length: 30 }, (_, i) => ({
    date: format(subDays(new Date(), 29 - i), 'dd MMM', { locale: ru }),
    position: Math.floor(Math.random() * 20 + 5),
  }));

  const ctrData = [
    { name: 'Показы', value: 45231, color: '#0EA5E9' },
    { name: 'Клики', value: 2174, color: '#8B5CF6' },
    { name: 'Покупки', value: 523, color: '#10B981' },
  ];

  const keywordPerformance = Array.from({ length: 7 }, (_, i) => ({
    keyword: ['смартфон', 'телефон', 'android', 'мобильный', 'недорого', 'купить', 'акция'][i],
    impressions: Math.floor(Math.random() * 5000 + 1000),
    clicks: Math.floor(Math.random() * 300 + 50),
    ctr: (Math.random() * 5 + 1).toFixed(1),
  }));

  const stats = [
    {
      title: 'Продажи за месяц',
      value: '₽1,247,350',
      change: '+23.5%',
      trend: 'up',
      icon: 'TrendingUp',
    },
    {
      title: 'Средняя позиция',
      value: '12',
      change: '+8 позиций',
      trend: 'up',
      icon: 'BarChart3',
    },
    {
      title: 'CTR карточек',
      value: '4.8%',
      change: '+1.2%',
      trend: 'up',
      icon: 'MousePointerClick',
    },
    {
      title: 'Конверсия',
      value: '2.3%',
      change: '-0.3%',
      trend: 'down',
      icon: 'Target',
    },
  ];

  const products = [
    {
      id: 1,
      name: 'Смартфон XYZ Pro Max',
      position: 8,
      prevPosition: 15,
      sales: 234,
      revenue: '₽428,900',
      ctr: 5.2,
      platform: 'wildberries',
    },
    {
      id: 2,
      name: 'Наушники BT-500',
      position: 23,
      prevPosition: 18,
      sales: 156,
      revenue: '₽187,200',
      ctr: 3.8,
      platform: 'wildberries',
    },
    {
      id: 3,
      name: 'Чехол Premium Silicone',
      position: 5,
      prevPosition: 7,
      sales: 892,
      revenue: '₽178,400',
      ctr: 6.4,
      platform: 'ozon',
    },
    {
      id: 4,
      name: 'Защитное стекло 9H',
      position: 12,
      prevPosition: 10,
      sales: 567,
      revenue: '₽113,400',
      ctr: 4.2,
      platform: 'yandex',
    },
  ];

  const competitors = [
    {
      id: 1,
      name: 'Конкурент А',
      price: '₽18,990',
      position: 3,
      rating: 4.8,
      reviews: 2341,
      sales: 450,
    },
    {
      id: 2,
      name: 'Конкурент Б',
      price: '₽17,450',
      position: 5,
      rating: 4.6,
      reviews: 1876,
      sales: 380,
    },
    {
      id: 3,
      name: 'Конкурент В',
      price: '₽19,990',
      position: 7,
      rating: 4.7,
      reviews: 3104,
      sales: 520,
    },
  ];

  const filteredProducts = selectedPlatform === 'all' 
    ? products 
    : products.filter(p => p.platform === selectedPlatform);

  const handleExportReport = () => {
    const csvContent = `Товар,Позиция,Продажи,Выручка,CTR\n${products.map(p => 
      `${p.name},${p.position},${p.sales},${p.revenue},${p.ctr}%`
    ).join('\n')}`;
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `market_analyzer_report_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
  };

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
            <Button variant="outline" size="icon">
              <Icon name="Bell" size={20} />
            </Button>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Платформа" />
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
              <SelectValue placeholder="Период" />
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
          {stats.map((stat, index) => (
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
                <p
                  className={`text-sm flex items-center gap-1 ${
                    stat.trend === 'up' ? 'text-success' : 'text-destructive'
                  }`}
                >
                  <Icon
                    name={stat.trend === 'up' ? 'ArrowUp' : 'ArrowDown'}
                    size={16}
                  />
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="positions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto">
            <TabsTrigger value="positions">Позиции</TabsTrigger>
            <TabsTrigger value="sales">Продажи</TabsTrigger>
            <TabsTrigger value="competitors">Конкуренты</TabsTrigger>
            <TabsTrigger value="ctr">CTR</TabsTrigger>
          </TabsList>

          <TabsContent value="positions" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Мониторинг позиций</CardTitle>
                    <CardDescription>Отслеживание карточек в результатах поиска</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge
                      variant={selectedPlatform === 'wildberries' ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => setSelectedPlatform('wildberries')}
                    >
                      <Icon name="ShoppingBag" size={14} className="mr-1" />
                      Wildberries
                    </Badge>
                    <Badge
                      variant={selectedPlatform === 'ozon' ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => setSelectedPlatform('ozon')}
                    >
                      <Icon name="Package" size={14} className="mr-1" />
                      Ozon
                    </Badge>
                    <Badge
                      variant={selectedPlatform === 'yandex' ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => setSelectedPlatform('yandex')}
                    >
                      <Icon name="Store" size={14} className="mr-1" />
                      Яндекс
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{product.name}</h3>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Icon name="TrendingUp" size={14} />
                            {product.sales} продаж
                          </span>
                          <span className="flex items-center gap-1">
                            <Icon name="DollarSign" size={14} />
                            {product.revenue}
                          </span>
                          <span className="flex items-center gap-1">
                            <Icon name="MousePointerClick" size={14} />
                            CTR {product.ctr}%
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">#{product.position}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            {product.position < product.prevPosition ? (
                              <>
                                <Icon name="ArrowUp" size={14} className="text-success" />
                                <span className="text-success">
                                  +{product.prevPosition - product.position}
                                </span>
                              </>
                            ) : (
                              <>
                                <Icon name="ArrowDown" size={14} className="text-destructive" />
                                <span className="text-destructive">
                                  -{product.position - product.prevPosition}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedProduct(product.id);
                            setHistoryDialogOpen(true);
                          }}
                        >
                          <Icon name="ChartLine" size={16} className="mr-2" />
                          История
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sales" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Динамика продаж</CardTitle>
                <CardDescription>Анализ продаж за последние 30 дней</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={salesData}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="sales" 
                      stroke="#0EA5E9" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorSales)" 
                      name="Выручка (₽)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Количество заказов</CardTitle>
                <CardDescription>Динамика заказов по дням</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="orders" fill="#8B5CF6" radius={[8, 8, 0, 0]} name="Заказы" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="competitors" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Анализ конкурентов</CardTitle>
                <CardDescription>Сравнение цен и позиций похожих товаров</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {competitors.map((competitor) => (
                    <div
                      key={competitor.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{competitor.name}</h3>
                        <div className="flex gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Icon name="Star" size={14} className="fill-warning text-warning" />
                            {competitor.rating}
                          </span>
                          <span>{competitor.reviews} отзывов</span>
                          <span>{competitor.sales} продаж/мес</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="text-lg font-bold">{competitor.price}</div>
                          <div className="text-sm text-muted-foreground">Цена</div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-primary">#{competitor.position}</div>
                          <div className="text-sm text-muted-foreground">Позиция</div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setCompetitorDialogOpen(true)}
                        >
                          <Icon name="Eye" size={16} className="mr-2" />
                          Детали
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ctr" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Воронка конверсии</CardTitle>
                  <CardDescription>От показа до покупки</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={ctrData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {ctrData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Эффективность ключевых слов</CardTitle>
                  <CardDescription>CTR по поисковым запросам</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={keywordPerformance} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis type="number" stroke="#64748b" fontSize={12} />
                      <YAxis type="category" dataKey="keyword" stroke="#64748b" fontSize={12} width={80} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#fff', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="clicks" fill="#10B981" radius={[0, 8, 8, 0]} name="Клики" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Ключевые слова</CardTitle>
              <CardDescription>Топ запросов для оптимизации</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {keywordPerformance.map((keyword, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <span className="font-medium">{keyword.keyword}</span>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">{keyword.impressions} показов</Badge>
                      <Badge variant="outline">{keyword.ctr}% CTR</Badge>
                      <Button variant="ghost" size="sm">
                        <Icon name="Plus" size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Уведомления</CardTitle>
              <CardDescription>Важные изменения и события</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-success/10 border border-success/20 rounded-lg">
                  <Icon name="ArrowUp" size={20} className="text-success mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">Рост позиции</p>
                    <p className="text-sm text-muted-foreground">Смартфон XYZ поднялся на 7 позиций</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-warning/10 border border-warning/20 rounded-lg">
                  <Icon name="AlertTriangle" size={20} className="text-warning mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">Изменение цены конкурента</p>
                    <p className="text-sm text-muted-foreground">Конкурент А снизил цену на 15%</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-primary/10 border border-primary/20 rounded-lg">
                  <Icon name="TrendingUp" size={20} className="text-primary mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">Рост CTR</p>
                    <p className="text-sm text-muted-foreground">CTR наушников вырос до 5.8%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={historyDialogOpen} onOpenChange={setHistoryDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>История позиций</DialogTitle>
            <DialogDescription>
              Динамика изменения позиций за последние 30 дней
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={positionHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={12} 
                  reversed 
                  label={{ value: 'Позиция', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
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
            <DialogTitle>Детальный анализ конкурента</DialogTitle>
            <DialogDescription>
              Полная информация о товаре конкурента
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Текущая цена</div>
                <div className="text-2xl font-bold">₽18,990</div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Рейтинг</div>
                <div className="text-2xl font-bold flex items-center gap-2">
                  4.8 <Icon name="Star" size={20} className="fill-warning text-warning" />
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Продаж в месяц</div>
                <div className="text-2xl font-bold">450</div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Позиция</div>
                <div className="text-2xl font-bold text-primary">#3</div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button className="flex-1">
                <Icon name="ExternalLink" size={16} className="mr-2" />
                Открыть на маркетплейсе
              </Button>
              <Button variant="outline">
                <Icon name="Bell" size={16} className="mr-2" />
                Отслеживать
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={settingsDialogOpen} onOpenChange={setSettingsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Настройки уведомлений</DialogTitle>
            <DialogDescription>
              Управление оповещениями и уведомлениями
            </DialogDescription>
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
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Низкие остатки</div>
                <div className="text-sm text-muted-foreground">Предупреждать о необходимости пополнения</div>
              </div>
              <Button
                variant={notifications.lowStock ? "default" : "outline"}
                size="sm"
                onClick={() => setNotifications(prev => ({ ...prev, lowStock: !prev.lowStock }))}
              >
                {notifications.lowStock ? 'Вкл' : 'Выкл'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
