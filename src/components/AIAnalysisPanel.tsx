import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Brain, TrendingUp, Loader2 } from 'lucide-react';
import { useAIAnalysis } from '@/hooks/useAIAnalysis';

interface AIAnalysisPanelProps {
  selectedStock: string | null;
}

export const AIAnalysisPanel: React.FC<AIAnalysisPanelProps> = ({ selectedStock }) => {
  const { analysis, loading, analyzeStock } = useAIAnalysis();

  useEffect(() => {
    if (selectedStock) {
      analyzeStock(selectedStock);
    }
  }, [selectedStock]);

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          AI Analysis {selectedStock && `- ${selectedStock}`}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="ml-2">Analyzing {selectedStock}...</span>
          </div>
        )}

        {!selectedStock && !loading && (
          <div className="text-center py-8 text-muted-foreground">
            Select a stock to view AI analysis
          </div>
        )}

        {analysis && !loading && (
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">{analysis.symbol}</h3>
                <Badge variant={analysis.recommendation.action === 'BUY' ? "default" : "secondary"}>
                  {analysis.recommendation.action}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                <div>
                  <span className="text-muted-foreground">Confidence:</span>
                  <span className="ml-2 font-medium">{analysis.recommendation.confidence}%</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Target:</span>
                  <span className="ml-2 font-medium text-green-500">${analysis.recommendation.priceTarget.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="p-2 bg-primary/10 rounded text-xs text-primary">
                💡 {analysis.recommendation.reasoning}
              </div>
            </div>

            <Button 
              className="w-full"
              onClick={() => window.open(`https://www.tradingview.com/chart/?symbol=${analysis.symbol}`, '_blank')}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Trade {analysis.symbol} on TradingView
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};