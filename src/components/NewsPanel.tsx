import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Newspaper, ExternalLink, Clock } from "lucide-react";

const mockNews = [
  {
    id: 1,
    headline: "Nuvei Partners with Major Fintech for Payment Solutions",
    symbol: "NVEI",
    time: "2 hours ago",
    sentiment: "Bullish",
    impact: "High",
    summary: "Strategic partnership expected to boost revenue growth and market share in the digital payments sector.",
  },
  {
    id: 2,
    headline: "Sirius XM Reports Strong Q4 Subscriber Growth",
    symbol: "SIRI", 
    time: "4 hours ago",
    sentiment: "Bullish",
    impact: "Medium",
    summary: "Streaming platform adds 1.2M subscribers, beating analyst expectations by 15%.",
  },
  {
    id: 3,
    headline: "AMC Entertainment Announces Theater Expansion Plan",
    symbol: "AMC",
    time: "6 hours ago", 
    sentiment: "Neutral",
    impact: "Medium",
    summary: "Company plans to open 25 new theaters across major metropolitan areas by end of 2024.",
  },
  {
    id: 4,
    headline: "Small-Cap Biotech Sector Sees Renewed Interest",
    symbol: "SECTOR",
    time: "1 day ago",
    sentiment: "Bullish",
    impact: "Low",
    summary: "Institutional investors increasing positions in undervalued biotech stocks.",
  },
];

export const NewsPanel = () => {
  return (
    <Card className="p-6 trading-card-glow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Newspaper className="w-5 h-5 text-ai-glow" />
          <h3 className="text-lg font-semibold">Market News</h3>
        </div>
        <Button variant="ghost" size="sm" className="text-ai-glow hover:text-ai-glow/80">
          View All
        </Button>
      </div>

      <div className="space-y-4">
        {mockNews.map((news) => (
          <div
            key={news.id}
            className="p-4 rounded-lg border border-border bg-card/30 hover:bg-card/50 transition-all duration-200 cursor-pointer"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2 mb-2">
                {news.symbol !== "SECTOR" && (
                  <Badge variant="outline" className="text-xs">
                    {news.symbol}
                  </Badge>
                )}
                <Badge
                  className={`text-xs ${
                    news.sentiment === "Bullish"
                      ? "bg-bullish/10 text-bullish border-bullish/20"
                      : news.sentiment === "Bearish"
                      ? "bg-bearish/10 text-bearish border-bearish/20"
                      : "bg-neutral/10 text-neutral border-neutral/20"
                  }`}
                >
                  {news.sentiment}
                </Badge>
                <Badge
                  variant="outline"
                  className={`text-xs ${
                    news.impact === "High"
                      ? "border-ai-glow/50 text-ai-glow"
                      : news.impact === "Medium"
                      ? "border-primary/50 text-primary"
                      : "border-muted-foreground/50 text-muted-foreground"
                  }`}
                >
                  {news.impact} Impact
                </Badge>
              </div>
              <Button variant="ghost" size="sm" className="p-1 h-auto">
                <ExternalLink className="w-3 h-3" />
              </Button>
            </div>
            
            <h4 className="font-medium text-sm leading-tight mb-2">
              {news.headline}
            </h4>
            
            <p className="text-xs text-muted-foreground leading-relaxed mb-2">
              {news.summary}
            </p>
            
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="w-3 h-3 mr-1" />
              {news.time}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-2">
            News sentiment analysis powered by AI
          </p>
          <div className="flex justify-center space-x-4 text-xs">
            <span className="text-bullish">↑ 68% Bullish</span>
            <span className="text-neutral">→ 24% Neutral</span>
            <span className="text-bearish">↓ 8% Bearish</span>
          </div>
        </div>
      </div>
    </Card>
  );
};