import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StockScreener } from "./StockScreener";
import { AIAnalysisPanel } from "./AIAnalysisPanel";
import { TradingFilters } from "./TradingFilters";
import { NewsPanel } from "./NewsPanel";
import { RefreshCw, TrendingUp, Brain, Filter } from "lucide-react";

export const TradingDashboard = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [activeTab, setActiveTab] = useState("screener");

  const handleScan = () => {
    setIsScanning(true);
    // Simulate AI scanning process
    setTimeout(() => setIsScanning(false), 3000);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-ai-glow bg-clip-text text-transparent">
              AI Trading Terminal
            </h1>
            <p className="text-muted-foreground mt-2">
              AI-powered stock analysis and trading recommendations
            </p>
          </div>
          <Button 
            onClick={handleScan}
            disabled={isScanning}
            className="ai-glow bg-gradient-to-r from-primary to-ai-glow hover:opacity-90 transition-all duration-300"
          >
            <Brain className="w-4 h-4 mr-2" />
            {isScanning ? "Scanning..." : "AI Scan"}
            {isScanning && <RefreshCw className="w-4 h-4 ml-2 animate-spin" />}
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 mb-6 bg-secondary/50 p-1 rounded-lg backdrop-blur-sm">
        {[
          { id: "screener", label: "Stock Screener", icon: TrendingUp },
          { id: "ai", label: "AI Analysis", icon: Brain },
          { id: "filters", label: "Filters", icon: Filter },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center px-4 py-2 rounded-md transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-primary text-primary-foreground shadow-lg"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            <tab.icon className="w-4 h-4 mr-2" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Primary Panel */}
        <div className="lg:col-span-2">
          {activeTab === "screener" && <StockScreener isScanning={isScanning} />}
          {activeTab === "ai" && <AIAnalysisPanel />}
          {activeTab === "filters" && <TradingFilters />}
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          <NewsPanel />
          {activeTab === "screener" && (
            <Card className="p-6 trading-card-glow">
              <h3 className="text-lg font-semibold mb-4 text-ai-glow">AI Insights</h3>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-secondary/30 border border-bullish/20">
                  <p className="text-sm text-bullish font-medium">Strong Buy Signal</p>
                  <p className="text-xs text-muted-foreground">3 stocks match momentum criteria</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/30 border border-ai-glow/20">
                  <p className="text-sm text-ai-glow font-medium">Pattern Recognition</p>
                  <p className="text-xs text-muted-foreground">Bullish flags detected in 2 charts</p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};