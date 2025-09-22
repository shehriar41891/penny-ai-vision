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

      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error('Unexpected response from function');
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
      // Fallback mock analysis so UI keeps working in preview
      const mock = {
        symbol,
        technicalAnalysis: {
          trend: 'BULLISH',
          support: 4.2,
          resistance: 5.1,
          rsi: 68.5,
          macd: 'BULLISH_CROSSOVER',
          volume: 'ABOVE_AVERAGE',
          pattern: 'ASCENDING_TRIANGLE',
        },
        fundamentalAnalysis: {
          sector: 'Technology',
          marketCap: 890000000,
          peRatio: null,
          momentum: 'STRONG',
          catalysts: ['AI chip demand', 'Semiconductor rally'],
        },
        recommendation: {
          action: 'BUY',
          confidence: 85,
          priceTarget: 5.25,
          stopLoss: 4.35,
          timeHorizon: 'SHORT_TERM',
          reasoning: 'Using mock analysis in preview mode while functions are unreachable.',
        },
        riskFactors: ['High volatility due to leverage'],
        timestamp: new Date().toISOString(),
      } as const;
      setAnalysis(mock as any);
      toast({
        title: 'Using mock analysis',
        description: 'Edge functions not reachable in preview. Showing sample analysis.',
      });
      return mock as any;
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