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
      
      const response = await fetch('/functions/v1/stock-screener', {
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
      // Fallback to mock data in dev if functions proxy isn't available
      const mockStocks: StockData[] = [
        { symbol: 'SOXL', name: 'Direxion Daily Semiconductor Bull 3X', price: 4.85, change: 0.45, changePercent: 10.2, volume: 25400000, avgVolume: 4200000, relativeVolume: 6.05, marketCap: 890000000, float: 18500000, gapUp: 12.8, news: 'Semiconductor sector rallies on AI chip demand surge', aiScore: 95, recommendation: 'BUY', chartPattern: 'Bullish breakout above resistance' },
        { symbol: 'TQQQ', name: 'ProShares UltraPro QQQ', price: 3.92, change: 0.38, changePercent: 10.7, volume: 18900000, avgVolume: 3100000, relativeVolume: 6.10, marketCap: 4200000000, float: 17200000, gapUp: 11.4, news: 'Tech stocks surge on strong earnings outlook', aiScore: 92, recommendation: 'BUY', chartPattern: 'Cup and handle formation' },
        { symbol: 'SPXL', name: 'Direxion Daily S&P 500 Bull 3X', price: 4.67, change: 0.51, changePercent: 12.3, volume: 8750000, avgVolume: 1650000, relativeVolume: 5.30, marketCap: 2100000000, float: 19800000, gapUp: 13.2, news: 'Broad market rally on Fed dovish comments', aiScore: 88, recommendation: 'BUY', chartPattern: 'Ascending triangle breakout' },
      ];
      setStocks(mockStocks);
      toast({
        title: 'Using mock data',
        description: 'Edge functions not reachable in preview. Showing sample results.',
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