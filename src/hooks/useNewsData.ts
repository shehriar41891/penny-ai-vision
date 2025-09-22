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
      
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/news-catalyst`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
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
      toast({
        title: "News Error",
        description: errorMessage,
        variant: "destructive",
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