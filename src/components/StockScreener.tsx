import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";

// Mock data for demonstration
const mockStocks = [
  {
    symbol: "NVEI",
    name: "Nuvei Corporation",
    price: 3.45,
    change: 0.32,
    changePercent: 10.2,
    volume: 2.5,
    relativeVolume: 6.2,
    float: 15.2,
    news: "Partnership with major fintech company announced",
  },
  {
    symbol: "SIRI",
    name: "Sirius XM Holdings",
    price: 4.87,
    change: 0.52,
    changePercent: 11.9,
    volume: 45.2,
    relativeVolume: 5.8,
    float: 18.7,
    news: "Streaming subscriber growth exceeds expectations",
  },
  {
    symbol: "AMC",
    name: "AMC Entertainment",
    price: 2.15,
    change: 0.21,
    changePercent: 10.8,
    volume: 89.3,
    relativeVolume: 7.1,
    float: 19.5,
    news: "Box office recovery accelerates with new releases",
  },
];

interface StockScreenerProps {
  isScanning: boolean;
}

export const StockScreener = ({ isScanning }: StockScreenerProps) => {
  return (
    <div className="space-y-6">
      <Card className="p-6 trading-card-glow">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Top Momentum Stocks Under $5</h2>
          <Badge variant="secondary" className="bg-ai-glow/10 text-ai-glow border-ai-glow/20">
            {isScanning ? "Scanning..." : "Live Data"}
          </Badge>
        </div>

        <div className="space-y-4">
          {mockStocks.map((stock, index) => (
            <div
              key={stock.symbol}
              className={`p-4 rounded-lg border transition-all duration-300 hover:shadow-lg ${
                isScanning ? "animate-pulse" : ""
              } ${
                stock.changePercent > 10
                  ? "border-bullish/30 bg-bullish/5 hover:border-bullish/50"
                  : "border-border bg-card/50"
              }`}
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Stock Info */}
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-lg">{stock.symbol}</h3>
                    {stock.changePercent >= 10 && (
                      <Badge className="bg-bullish text-white text-xs">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        HOT
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {stock.name}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xl font-bold">${stock.price}</span>
                    <span className={`text-sm font-medium ${
                      stock.change > 0 ? "text-bullish" : "text-bearish"
                    }`}>
                      {stock.change > 0 ? "+" : ""}{stock.change} ({stock.changePercent}%)
                    </span>
                  </div>
                </div>

                {/* Trading Metrics */}
                <div className="space-y-1">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Volume:</span>
                    <span className="ml-2 font-medium">{stock.volume}M</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Rel Vol:</span>
                    <span className={`ml-2 font-medium ${
                      stock.relativeVolume >= 5 ? "text-ai-glow" : ""
                    }`}>
                      {stock.relativeVolume}x
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Float:</span>
                    <span className="ml-2 font-medium">{stock.float}M</span>
                  </div>
                </div>

                {/* AI Indicators */}
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1">
                    {stock.changePercent >= 10 && (
                      <Badge variant="outline" className="border-bullish/50 text-bullish text-xs">
                        Gap Up ≥10%
                      </Badge>
                    )}
                    {stock.relativeVolume >= 5 && (
                      <Badge variant="outline" className="border-ai-glow/50 text-ai-glow text-xs">
                        High Rel Vol
                      </Badge>
                    )}
                    {stock.float < 20 && (
                      <Badge variant="outline" className="border-primary/50 text-primary text-xs">
                        Low Float
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center text-xs text-ai-glow">
                    <Activity className="w-3 h-3 mr-1" />
                    AI Score: {(85 + Math.random() * 10).toFixed(0)}%
                  </div>
                </div>

                {/* News Catalyst */}
                <div>
                  <p className="text-xs text-muted-foreground mb-1">News Catalyst:</p>
                  <p className="text-sm leading-tight">{stock.news}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};