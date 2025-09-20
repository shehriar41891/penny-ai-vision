import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Filter, Save, RotateCcw } from "lucide-react";

export const TradingFilters = () => {
  const [filters, setFilters] = useState({
    maxPrice: [5],
    minGapUp: [10],
    minRelativeVolume: [5],
    maxFloat: [20],
    hasNewsCatalyst: true,
    minVolume: [1],
    minMarketCap: [10],
  });

  const resetFilters = () => {
    setFilters({
      maxPrice: [5],
      minGapUp: [10],
      minRelativeVolume: [5],
      maxFloat: [20],
      hasNewsCatalyst: true,
      minVolume: [1],
      minMarketCap: [10],
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 trading-card-glow">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Filter className="w-6 h-6 text-ai-glow" />
            <h2 className="text-xl font-bold">AI Trading Filters</h2>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={resetFilters}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button size="sm" className="bg-ai-glow/10 text-ai-glow border-ai-glow/20 hover:bg-ai-glow/20">
              <Save className="w-4 h-4 mr-2" />
              Save Preset
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Price Filters */}
          <div className="space-y-6">
            <div>
              <Label className="text-sm font-medium mb-3 block">Maximum Price</Label>
              <div className="px-4">
                <Slider
                  value={filters.maxPrice}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, maxPrice: value }))}
                  max={10}
                  min={1}
                  step={0.5}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>$1</span>
                  <span className="font-medium">${filters.maxPrice[0]}</span>
                  <span>$10</span>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium mb-3 block">Minimum Gap Up %</Label>
              <div className="px-4">
                <Slider
                  value={filters.minGapUp}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, minGapUp: value }))}
                  max={50}
                  min={5}
                  step={1}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>5%</span>
                  <span className="font-medium text-bullish">{filters.minGapUp[0]}%</span>
                  <span>50%</span>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium mb-3 block">Minimum Relative Volume</Label>
              <div className="px-4">
                <Slider
                  value={filters.minRelativeVolume}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, minRelativeVolume: value }))}
                  max={20}
                  min={1}
                  step={0.5}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>1x</span>
                  <span className="font-medium text-ai-glow">{filters.minRelativeVolume[0]}x</span>
                  <span>20x</span>
                </div>
              </div>
            </div>
          </div>

          {/* Volume & Float Filters */}
          <div className="space-y-6">
            <div>
              <Label className="text-sm font-medium mb-3 block">Maximum Float (Millions)</Label>
              <div className="px-4">
                <Slider
                  value={filters.maxFloat}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, maxFloat: value }))}
                  max={100}
                  min={5}
                  step={1}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>5M</span>
                  <span className="font-medium">{filters.maxFloat[0]}M</span>
                  <span>100M</span>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium mb-3 block">Minimum Volume (Millions)</Label>
              <div className="px-4">
                <Slider
                  value={filters.minVolume}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, minVolume: value }))}
                  max={50}
                  min={0.1}
                  step={0.1}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>0.1M</span>
                  <span className="font-medium">{filters.minVolume[0]}M</span>
                  <span>50M</span>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium mb-3 block">Minimum Market Cap (Millions)</Label>
              <div className="px-4">
                <Slider
                  value={filters.minMarketCap}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, minMarketCap: value }))}
                  max={1000}
                  min={1}
                  step={1}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>$1M</span>
                  <span className="font-medium">${filters.minMarketCap[0]}M</span>
                  <span>$1B</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Options */}
        <div className="mt-8 pt-6 border-t border-border">
          <h3 className="text-lg font-semibold mb-4">Advanced Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-card/30">
              <div>
                <Label className="text-sm font-medium">News Catalyst Required</Label>
                <p className="text-xs text-muted-foreground">Only show stocks with recent news</p>
              </div>
              <Switch
                checked={filters.hasNewsCatalyst}
                onCheckedChange={(checked) => setFilters(prev => ({ ...prev, hasNewsCatalyst: checked }))}
              />
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-card/30">
              <div>
                <Label className="text-sm font-medium">Earnings Season Filter</Label>
                <p className="text-xs text-muted-foreground">Focus on earnings plays</p>
              </div>
              <Switch defaultChecked={false} />
            </div>
          </div>
        </div>

        {/* Active Filters Summary */}
        <div className="mt-6 pt-4 border-t border-border">
          <h4 className="text-sm font-medium mb-3">Active Filters</h4>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="border-primary/50 text-primary">
              Price ≤ ${filters.maxPrice[0]}
            </Badge>
            <Badge variant="outline" className="border-bullish/50 text-bullish">
              Gap ≥ {filters.minGapUp[0]}%
            </Badge>
            <Badge variant="outline" className="border-ai-glow/50 text-ai-glow">
              Rel Vol ≥ {filters.minRelativeVolume[0]}x
            </Badge>
            <Badge variant="outline" className="border-neutral/50 text-neutral">
              Float ≤ {filters.maxFloat[0]}M
            </Badge>
            {filters.hasNewsCatalyst && (
              <Badge variant="outline" className="border-accent/50 text-accent">
                News Catalyst
              </Badge>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};