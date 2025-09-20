import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface AIAnalysis {
  symbol: string;
  technicalAnalysis: {
    trend: string;
    support: number;
    resistance: number;
    rsi: number;
    macd: string;
    volume: string;
    pattern: string;
  };
  fundamentalAnalysis: {
    sector: string;
    marketCap: number;
    peRatio: number | null;
    momentum: string;
    catalysts: string[];
  };
  recommendation: {
    action: string;
    confidence: number;
    priceTarget: number;
    stopLoss: number;
    timeHorizon: string;
    reasoning: string;
  };
  riskFactors: string[];
  timestamp: string;
}

export const useAIAnalysis = () => {
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const analyzeStock = async (symbol: string, chartData?: any, newsData?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/functions/v1/ai-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          symbol,
          chartData,
          newsData
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setAnalysis(result.data);
        toast({
          title: "AI Analysis Complete",
          description: `Generated analysis for ${symbol}`,
        });
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to analyze stock');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze stock';
      setError(errorMessage);
      toast({
        title: "Analysis Error",
        description: errorMessage,
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    analysis,
    loading,
    error,
    analyzeStock
  };
};