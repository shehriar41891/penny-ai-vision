import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  avgVolume: number;
  relativeVolume: number;
  marketCap: number;
  float: number;
  gapUp: number;
  news: string;
  aiScore: number;
  recommendation: 'BUY' | 'SELL' | 'HOLD';
  chartPattern: string;
}

export const useStockData = () => {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchStocks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stock-screener`, {
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
        setStocks(result.data);
        toast({
          title: "Stock Data Updated",
          description: `Found ${result.data.length} momentum stocks under $5`,
        });
      } else {
        throw new Error(result.error || 'Failed to fetch stock data');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch stock data';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks();
    
    // Auto-refresh every 30 seconds for real-time data
    const interval = setInterval(fetchStocks, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    stocks,
    loading,
    error,
    refetch: fetchStocks
  };
};