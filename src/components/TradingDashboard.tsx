import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { StockScreener } from './StockScreener';
import { AIAnalysisPanel } from './AIAnalysisPanel';
import { NewsPanel } from './NewsPanel';
import { TradingFilters } from './TradingFilters';
import { Activity, TrendingUp, Brain, Newspaper, RefreshCcw } from 'lucide-react';
import { useStockData } from '@/hooks/useStockData';
import { useNewsData } from '@/hooks/useNewsData';
import { useToast } from '@/hooks/use-toast';

export const TradingDashboard = () => {
  const { stocks, loading: stocksLoading, refetch: refetchStocks } = useStockData();
  const { news, loading: newsLoading, refetch: refetchNews } = useNewsData();
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const { toast } = useToast();

  const handleRefreshAll = async () => {
    toast({
      title: "Refreshing Data",
      description: "Updating all market data...",
    });
    
    await Promise.all([refetchStocks(), refetchNews()]);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Activity className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">AI Trading Hub</h1>
                <p className="text-sm text-muted-foreground">Professional momentum trading platform</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                onClick={handleRefreshAll}
                disabled={stocksLoading || newsLoading}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <RefreshCcw className={`w-4 h-4 ${(stocksLoading || newsLoading) ? 'animate-spin' : ''}`} />
                Refresh Data
              </Button>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Market Open</span>
                </div>
                <div>Last Updated: {new Date().toLocaleTimeString()}</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Stocks</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{stocks.length}</div>
              <p className="text-xs text-muted-foreground">Momentum stocks under $5</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Signals</CardTitle>
              <Brain className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">
                {stocks.filter(s => s.recommendation === 'BUY').length}
              </div>
              <p className="text-xs text-muted-foreground">Strong buy signals</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Volume</CardTitle>
              <Activity className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-500">
                {stocks.length > 0 ? (stocks.reduce((acc, s) => acc + s.relativeVolume, 0) / stocks.length).toFixed(1) + 'x' : '0x'}
              </div>
              <p className="text-xs text-muted-foreground">Above average</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">News Catalysts</CardTitle>
              <Newspaper className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">{news.length}</div>
              <p className="text-xs text-muted-foreground">High impact events</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <TradingFilters />
            <StockScreener 
              stocks={stocks} 
              loading={stocksLoading} 
              onStockSelect={setSelectedStock}
              selectedStock={selectedStock}
            />
          </div>
          
          <div className="space-y-6">
            <AIAnalysisPanel selectedStock={selectedStock} />
            <NewsPanel news={news} loading={newsLoading} />
          </div>
        </div>
      </main>
    </div>
  );
};