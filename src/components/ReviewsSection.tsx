import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { api, Review } from '@/lib/api';

export const ReviewsSection = ({ productId }: { productId: number }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await api.getReviews(productId);
        setReviews(data);
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-success/10 border-success/20 text-success';
      case 'negative':
        return 'bg-destructive/10 border-destructive/20 text-destructive';
      default:
        return 'bg-muted border-border text-foreground';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'ThumbsUp';
      case 'negative':
        return 'ThumbsDown';
      default:
        return 'Minus';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        </CardContent>
      </Card>
    );
  }

  const avgRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : '0';

  const sentimentCounts = reviews.reduce((acc, r) => {
    acc[r.sentiment] = (acc[r.sentiment] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Анализ отзывов</CardTitle>
          <CardDescription>Мнения покупателей и оценки товара</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            <div className="p-4 border rounded-lg text-center">
              <div className="text-3xl font-bold mb-1">{avgRating}</div>
              <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                <Icon name="Star" size={16} className="fill-warning text-warning" />
                Средний рейтинг
              </div>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <div className="text-3xl font-bold mb-1">{reviews.length}</div>
              <div className="text-sm text-muted-foreground">Всего отзывов</div>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <div className="flex gap-2 justify-center mb-2">
                <Badge variant="outline" className="text-success">
                  {sentimentCounts.positive || 0} позитивных
                </Badge>
                <Badge variant="outline" className="text-destructive">
                  {sentimentCounts.negative || 0} негативных
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">Анализ тональности</div>
            </div>
          </div>

          <div className="space-y-3">
            {reviews.map((review) => (
              <div
                key={review.id}
                className={`p-4 border rounded-lg ${getSentimentColor(review.sentiment)}`}
              >
                <div className="flex items-start gap-3">
                  <Icon name={getSentimentIcon(review.sentiment)} size={20} className="mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{review.author}</span>
                        <div className="flex">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Icon
                              key={i}
                              name="Star"
                              size={14}
                              className="fill-warning text-warning"
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(review.date).toLocaleDateString('ru-RU')}
                      </span>
                    </div>
                    <p className="text-sm">{review.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewsSection;
