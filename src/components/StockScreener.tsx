import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { TrendingUp, TrendingDown, Volume2, Eye, ExternalLink } from 'lucide-react';
import { StockData } from '@/hooks/useStockData';

interface StockScreenerProps {
  stocks: StockData[];
  loading: boolean;
  onStockSelect: (symbol: string) => void;
  selectedStock: string | null;
}

export const StockScreener: React.FC<StockScreenerProps> = ({ 
  stocks, 
  loading, 
  onStockSelect, 
  selectedStock 
}) => {
  const handleTradeNow = (symbol: string) => {
    window.open(`https://www.tradingview.com/chart/?symbol=${symbol}`, '_blank');
  };

  const formatVolume = (volume: number) => {
    return volume >= 1000000 ? (volume / 1000000).toFixed(1) + 'M' : (volume / 1000).toFixed(1) + 'K';
  };

  if (loading) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Loading Momentum Stocks...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse p-4 rounded-lg border bg-muted/30">
                <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Top Momentum Stocks Under $5 ({stocks.length} found)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stocks.map((stock) => (
            <div
              key={stock.symbol}
              className={`flex items-center justify-between p-4 rounded-lg border transition-all cursor-pointer ${
                selectedStock === stock.symbol ? 'border-primary bg-primary/5' : 'border-border bg-muted/30 hover:bg-muted/50'
              }`}
              onClick={() => onStockSelect(stock.symbol)}
            >
              <div className="flex items-center gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground">{stock.symbol}</span>
                    <Badge variant={stock.recommendation === 'BUY' ? "default" : "secondary"}>
                      {stock.recommendation}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{stock.name}</p>
                </div>
                
                <div className="text-right">
                  <div className="font-bold">${stock.price.toFixed(2)}</div>
                  <div className="text-sm text-green-500">+{stock.changePercent.toFixed(1)}%</div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center gap-1 text-sm">
                    <Volume2 className="w-3 h-3" />
                    {formatVolume(stock.volume)}
                  </div>
                  <div className="text-xs text-primary">{stock.relativeVolume.toFixed(1)}x</div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); onStockSelect(stock.symbol); }}>
                  <Eye className="w-3 h-3" />
                  Analyze
                </Button>
                <Button size="sm" onClick={(e) => { e.stopPropagation(); handleTradeNow(stock.symbol); }}>
                  <ExternalLink className="w-3 h-3" />
                  Trade Now
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};