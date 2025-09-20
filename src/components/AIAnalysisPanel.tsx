import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, TrendingUp, TrendingDown, Eye, AlertTriangle } from "lucide-react";

const mockAnalysis = [
  {
    symbol: "NVEI",
    pattern: "Bullish Flag",
    confidence: 87,
    recommendation: "Strong Buy",
    reasoning: "Chart shows clear breakout pattern with high volume confirmation. RSI indicates oversold bounce potential.",
    targetPrice: 4.20,
    stopLoss: 3.10,
  },
  {
    symbol: "SIRI", 
    pattern: "Ascending Triangle",
    confidence: 92,
    recommendation: "Buy",
    reasoning: "Multiple higher lows with resistance at $5.00. Volume increasing on each test of resistance.",
    targetPrice: 5.75,
    stopLoss: 4.50,
  },
  {
    symbol: "AMC",
    pattern: "Cup and Handle",
    confidence: 74,
    recommendation: "Hold",
    reasoning: "Pattern formation complete but needs volume confirmation. Market sentiment mixed.",
    targetPrice: 2.80,
    stopLoss: 1.95,
  },
];

export const AIAnalysisPanel = () => {
  return (
    <div className="space-y-6">
      <Card className="p-6 trading-card-glow">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Brain className="w-6 h-6 text-ai-glow" />
            <h2 className="text-xl font-bold">AI Chart Analysis</h2>
          </div>
          <Badge className="bg-ai-glow/10 text-ai-glow border-ai-glow/20">
            GPT-Vision Powered
          </Badge>
        </div>

        <div className="space-y-4">
          {mockAnalysis.map((analysis) => (
            <div
              key={analysis.symbol}
              className="p-5 rounded-lg border border-border bg-card/50 hover:bg-card/70 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold">{analysis.symbol}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="outline" className="border-ai-glow/50 text-ai-glow">
                      <Eye className="w-3 h-3 mr-1" />
                      {analysis.pattern}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Confidence: {analysis.confidence}%
                    </span>
                  </div>
                </div>
                <Badge
                  className={`${
                    analysis.recommendation === "Strong Buy" || analysis.recommendation === "Buy"
                      ? "bg-bullish/10 text-bullish border-bullish/20"
                      : "bg-neutral/10 text-neutral border-neutral/20"
                  }`}
                >
                  {analysis.recommendation === "Strong Buy" && <TrendingUp className="w-3 h-3 mr-1" />}
                  {analysis.recommendation === "Buy" && <TrendingUp className="w-3 h-3 mr-1" />}
                  {analysis.recommendation === "Hold" && <AlertTriangle className="w-3 h-3 mr-1" />}
                  {analysis.recommendation}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                {analysis.reasoning}
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
                <div>
                  <p className="text-xs text-muted-foreground">Target Price</p>
                  <p className="text-lg font-bold text-bullish">${analysis.targetPrice}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Stop Loss</p>
                  <p className="text-lg font-bold text-bearish">${analysis.stopLoss}</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border/50">
                <Button size="sm" className="mr-2 bg-primary hover:bg-primary/90">
                  View Chart
                </Button>
                <Button size="sm" variant="outline">
                  Trade Now
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 trading-card-glow">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Brain className="w-5 h-5 mr-2 text-ai-glow" />
          AI Trading Signals
        </h3>
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-bullish/10 border border-bullish/20">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-bullish">Market Momentum</span>
              <span className="text-xs text-bullish">BULLISH</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Small-cap momentum accelerating across sectors
            </p>
          </div>
          <div className="p-3 rounded-lg bg-ai-glow/10 border border-ai-glow/20">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-ai-glow">Pattern Recognition</span>
              <span className="text-xs text-ai-glow">HIGH</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Multiple breakout patterns forming
            </p>
          </div>
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-primary">News Sentiment</span>
              <span className="text-xs text-primary">POSITIVE</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Earnings season showing strong results
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};