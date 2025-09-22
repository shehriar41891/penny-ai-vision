import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  publishedAt: string;
  symbols: string[];
  sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  url: string;
}

export const useNewsData = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/functions/v1/news-catalyst', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error('Unexpected response from function');
      }

      const result = await response.json();
      
      if (result.success) {
        setNews(result.data);
      } else {
        throw new Error(result.error || 'Failed to fetch news data');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch news data';
      setError(errorMessage);
      // Fallback to mock news in dev
      const mockNews: NewsItem[] = [
        { id: '1', title: 'Tech stocks rally on AI optimism', summary: 'AI chipmakers lead gains as demand outlook improves.', source: 'MarketWatch', publishedAt: new Date().toISOString(), symbols: ['SOXL','TQQQ'], sentiment: 'POSITIVE', impact: 'HIGH', url: 'https://example.com/article1' },
        { id: '2', title: 'Fed signals steady rates', summary: 'Officials monitor inflation as markets digest guidance.', source: 'Bloomberg', publishedAt: new Date().toISOString(), symbols: ['SPXL'], sentiment: 'NEUTRAL', impact: 'MEDIUM', url: 'https://example.com/article2' },
      ];
      setNews(mockNews);
      toast({
        title: 'Using mock news',
        description: 'Edge functions not reachable in preview. Showing sample news.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    
    // Auto-refresh every 5 minutes for news updates
    const interval = setInterval(fetchNews, 300000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    news,
    loading,
    error,
    refetch: fetchNews
  };
};