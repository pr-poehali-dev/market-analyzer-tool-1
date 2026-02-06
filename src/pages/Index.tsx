import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [selectedPlatform, setSelectedPlatform] = useState('wildberries');

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
  ];

  const competitors = [
    {
      name: 'Конкурент А',
      price: '₽18,990',
      position: 3,
      rating: 4.8,
      reviews: 2341,
    },
    {
      name: 'Конкурент Б',
      price: '₽17,450',
      position: 5,
      rating: 4.6,
      reviews: 1876,
    },
    {
      name: 'Конкурент В',
      price: '₽19,990',
      position: 7,
      rating: 4.7,
      reviews: 3104,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">MarketAnalyzer</h1>
            <p className="text-muted-foreground">Аналитика маркетплейсов в реальном времени</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Icon name="Settings" size={20} />
            </Button>
            <Button variant="outline" size="icon">
              <Icon name="Bell" size={20} />
            </Button>
          </div>
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
                  {products.map((product) => (
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
                        <Button variant="outline" size="sm">
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
                <div className="h-80 flex items-center justify-center border-2 border-dashed rounded-lg bg-muted/20">
                  <div className="text-center">
                    <Icon name="BarChart3" size={48} className="mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">График продаж будет здесь</p>
                  </div>
                </div>
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
                  {competitors.map((competitor, index) => (
                    <div
                      key={index}
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
                        <Button variant="outline" size="sm">
                          <Icon name="Eye" size={16} className="mr-2" />
                          Смотреть
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ctr" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Анализ кликабельности</CardTitle>
                <CardDescription>CTR и конверсия карточек товаров</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center border-2 border-dashed rounded-lg bg-muted/20">
                  <div className="text-center">
                    <Icon name="MousePointerClick" size={48} className="mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Данные о кликабельности будут здесь</p>
                  </div>
                </div>
              </CardContent>
            </Card>
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
                {['смартфон недорого', 'телефон купить', 'android phone', 'мобильный'].map(
                  (keyword, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <span className="font-medium">{keyword}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{Math.floor(Math.random() * 5000 + 1000)} показов</Badge>
                        <Button variant="ghost" size="sm">
                          <Icon name="Plus" size={16} />
                        </Button>
                      </div>
                    </div>
                  )
                )}
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
    </div>
  );
};

export default Index;
