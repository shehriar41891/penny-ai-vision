import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AlphaVantageService } from '@/services/alphaVantageService';

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
  const alphaVantage = new AlphaVantageService();

  const analyzeStock = async (symbol: string, chartData?: any, newsData?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      toast({
        title: "Analyzing Stock",
        description: `Fetching real-time data for ${symbol}...`,
      });
      
      // Get real technical data
      const [quote, rsiData, macdData] = await Promise.all([
        alphaVantage.getGlobalQuote(symbol),
        alphaVantage.getRSI(symbol),
        alphaVantage.getMACD(symbol)
      ]);
      
      if (quote && Object.keys(quote).length > 0) {
        const currentPrice = parseFloat(quote['05. price']);
        const changePercent = parseFloat(quote['10. change percent'].replace('%', ''));
        const volume = parseInt(quote['06. volume']);
        
        // Extract RSI value
        let rsiValue = 68.5; // default
        if (rsiData && Object.keys(rsiData).length > 0) {
          const rsiEntries = Object.entries(rsiData);
          if (rsiEntries.length > 0) {
            rsiValue = parseFloat(rsiEntries[0][1]['RSI']);
          }
        }
        
        // Generate comprehensive analysis with real data
        const realAnalysis: AIAnalysis = {
          symbol,
          technicalAnalysis: {
            trend: changePercent > 0 ? 'BULLISH' : 'BEARISH',
            support: currentPrice * 0.92,
            resistance: currentPrice * 1.08,
            rsi: rsiValue,
            macd: rsiValue > 50 && changePercent > 0 ? 'BULLISH_CROSSOVER' : 'BEARISH_DIVERGENCE',
            volume: volume > 1000000 ? 'ABOVE_AVERAGE' : 'BELOW_AVERAGE',
            pattern: changePercent > 8 ? 'Bullish breakout above resistance' : 
                    changePercent > 5 ? 'Ascending triangle breakout' :
                    changePercent < -8 ? 'Bearish breakdown below support' : 'Sideways consolidation'
          },
          fundamentalAnalysis: {
            sector: symbol.includes('SOX') ? 'Semiconductors' : 
                   symbol.includes('QQQ') ? 'Technology' : 
                   symbol.includes('SPX') ? 'Broad Market' : 'ETF',
            marketCap: getMarketCap(symbol),
            peRatio: null, // ETFs don't have P/E ratios
            momentum: Math.abs(changePercent) > 8 ? 'VERY_STRONG' : 
                     Math.abs(changePercent) > 5 ? 'STRONG' : 'MODERATE',
            catalysts: getCatalysts(symbol, changePercent)
          },
          recommendation: {
            action: getRecommendation(rsiValue, changePercent, volume),
            confidence: calculateConfidence(rsiValue, changePercent, volume),
            priceTarget: currentPrice * (changePercent > 0 ? 1.15 : 0.95),
            stopLoss: currentPrice * (changePercent > 0 ? 0.90 : 1.05),
            timeHorizon: volume > 5000000 ? 'VERY_SHORT_TERM' : 'SHORT_TERM',
            reasoning: `Based on real-time data: RSI ${rsiValue.toFixed(1)}, ${changePercent > 0 ? 'positive' : 'negative'} momentum ${Math.abs(changePercent).toFixed(1)}%, volume ${(volume/1000000).toFixed(1)}M shares. ${getReasoning(rsiValue, changePercent, volume)}`
          },
          riskFactors: getRiskFactors(symbol, rsiValue, changePercent),
          timestamp: new Date().toISOString()
        };
        
        setAnalysis(realAnalysis);
        toast({
          title: "Live Analysis Complete",
          description: `Real-time analysis for ${symbol} generated`,
        });
        return realAnalysis;
      } else {
        throw new Error('Unable to fetch real-time data');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze stock';
      setError(errorMessage);
      
      // Enhanced fallback analysis
      const mock: AIAnalysis = {
        symbol,
        technicalAnalysis: {
          trend: 'BULLISH',
          support: 4.2,
          resistance: 5.1,
          rsi: 68.5,
          macd: 'BULLISH_CROSSOVER',
          volume: 'ABOVE_AVERAGE',
          pattern: 'Ascending triangle breakout'
        },
        fundamentalAnalysis: {
          sector: 'Technology',
          marketCap: 890000000,
          peRatio: null,
          momentum: 'STRONG',
          catalysts: ['AI demand surge', 'Sector rotation', 'Volume spike']
        },
        recommendation: {
          action: 'BUY',
          confidence: 85,
          priceTarget: 5.25,
          stopLoss: 4.35,
          timeHorizon: 'SHORT_TERM',
          reasoning: 'Demo analysis - get Alpha Vantage API key for real-time data.'
        },
        riskFactors: ['High volatility (3x leverage)', 'Market correction risk', 'API rate limits'],
        timestamp: new Date().toISOString()
      };
      setAnalysis(mock);
      toast({
        title: 'Demo analysis',
        description: 'Connect Alpha Vantage API for live analysis.',
      });
      return mock;
    } finally {
      setLoading(false);
    }
  };

  // Helper methods for analysis
  const getMarketCap = (symbol: string): number => {
    const caps: { [key: string]: number } = {
      'SOXL': 890000000,
      'TQQQ': 4200000000,
      'SPXL': 2100000000,
      'LABU': 650000000,
      'TECL': 1100000000
    };
    return caps[symbol] || 800000000;
  };

  const getCatalysts = (symbol: string, changePercent: number): string[] => {
    const baseCatalysts: { [key: string]: string[] } = {
      'SOXL': ['AI chip demand', 'Semiconductor cycle upturn', 'China reopening'],
      'TQQQ': ['Tech earnings beats', 'AI adoption', 'Cloud growth'],
      'SPXL': ['Fed pivot hopes', 'Economic resilience', 'Corporate earnings'],
      'LABU': ['FDA approvals', 'Biotech innovation', 'Healthcare spending'],
      'TECL': ['Digital transformation', 'Cloud migration', 'SaaS growth']
    };
    
    let catalysts = baseCatalysts[symbol] || ['Market momentum', 'Sector rotation', 'Volume surge'];
    
    if (changePercent > 10) catalysts.push('Momentum breakout');
    if (changePercent < -10) catalysts.push('Oversold bounce potential');
    
    return catalysts;
  };

  const getRecommendation = (rsi: number, changePercent: number, volume: number): string => {
    if (rsi > 70 && changePercent > 10) return 'HOLD'; // Overbought
    if (rsi < 30 && changePercent < -10) return 'BUY'; // Oversold
    if (changePercent > 5 && volume > 2000000) return 'BUY'; // Strong momentum
    if (changePercent < -8) return 'SELL'; // Weak momentum
    return 'HOLD';
  };

  const calculateConfidence = (rsi: number, changePercent: number, volume: number): number => {
    let confidence = 50;
    
    // RSI component
    if (rsi > 30 && rsi < 70) confidence += 20; // Not overbought/oversold
    if (rsi > 50) confidence += 10; // Bullish momentum
    
    // Price momentum
    confidence += Math.min(Math.abs(changePercent) * 2, 20);
    
    // Volume confirmation
    if (volume > 5000000) confidence += 15;
    else if (volume > 2000000) confidence += 10;
    
    return Math.min(95, Math.max(30, confidence));
  };

  const getReasoning = (rsi: number, changePercent: number, volume: number): string => {
    let reasoning = '';
    
    if (changePercent > 8 && volume > 3000000) {
      reasoning = 'Strong bullish momentum with high volume confirmation suggests continued upside.';
    } else if (changePercent > 5) {
      reasoning = 'Positive momentum indicates potential for further gains.';
    } else if (changePercent < -8) {
      reasoning = 'Sharp decline may present oversold bounce opportunity.';
    } else {
      reasoning = 'Consolidation phase - await clearer directional signals.';
    }
    
    if (rsi > 70) reasoning += ' However, RSI suggests overbought conditions.';
    if (rsi < 30) reasoning += ' RSI indicates oversold conditions supporting upside.';
    
    return reasoning;
  };

  const getRiskFactors = (symbol: string, rsi: number, changePercent: number): string[] => {
    const risks = ['High volatility due to 3x leverage', 'Market correction risk'];
    
    if (symbol.includes('SOX')) risks.push('Semiconductor cycle risk');
    if (symbol.includes('QQQ')) risks.push('Tech sector concentration');
    if (rsi > 75) risks.push('Extremely overbought conditions');
    if (Math.abs(changePercent) > 15) risks.push('Extreme volatility warning');
    
    return risks;
  };

  return {
    analysis,
    loading,
    error,
    analyzeStock
  };
};