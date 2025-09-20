import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Newspaper, Clock, ExternalLink } from 'lucide-react';
import { NewsItem } from '@/hooks/useNewsData';

interface NewsPanelProps {
  news: NewsItem[];
  loading: boolean;
}

export const NewsPanel: React.FC<NewsPanelProps> = ({ news, loading }) => {
  const formatTimeAgo = (dateString: string) => {
    const diffMs = new Date().getTime() - new Date(dateString).getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    return diffHours > 0 ? `${diffHours}h ago` : 'Just now';
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Newspaper className="w-5 h-5 text-primary" />
          Market Catalysts ({news.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse p-4 border rounded-lg">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {news.map((item) => (
              <div key={item.id} className="p-4 border rounded-lg bg-muted/30">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex gap-2">
                    <Badge variant="outline">{item.sentiment}</Badge>
                    <Badge variant="outline">{item.impact}</Badge>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {formatTimeAgo(item.publishedAt)}
                  </div>
                </div>
                
                <h3 className="font-semibold text-sm mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{item.summary}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{item.source}</span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => window.open(item.url, '_blank')}
                  >
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};