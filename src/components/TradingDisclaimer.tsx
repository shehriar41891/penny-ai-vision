import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export const TradingDisclaimer = () => {
  const [dismissed, setDismissed] = useState(() => {
    return localStorage.getItem('trading-disclaimer-dismissed') === 'true';
  });

  const handleDismiss = () => {
    localStorage.setItem('trading-disclaimer-dismissed', 'true');
    setDismissed(true);
  };

  if (dismissed) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-2xl w-full border-red-500/50 bg-red-50/90 dark:bg-red-950/90">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-300">
              <AlertTriangle className="w-6 h-6" />
              TRADING RISK DISCLAIMER
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleDismiss}
              className="text-red-700 dark:text-red-300"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-red-800 dark:text-red-200">
          <Alert className="border-red-300 bg-red-100/50 dark:border-red-700 dark:bg-red-900/50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="font-semibold">
              TRADING INVOLVES SUBSTANTIAL RISK OF LOSS
            </AlertDescription>
          </Alert>
          
          <div className="space-y-3 text-sm">
            <p>
              <strong>This application is for educational and informational purposes only.</strong> 
              Past performance is not indicative of future results.
            </p>
            
            <ul className="list-disc pl-6 space-y-1">
              <li>AI analysis and recommendations are not financial advice</li>
              <li>Data may be delayed up to 20 minutes</li>
              <li>Always conduct your own research before making trades</li>
              <li>Never risk more than you can afford to lose</li>
              <li>Leveraged ETFs (3x) carry extreme volatility risk</li>
              <li>Consider consulting a licensed financial advisor</li>
            </ul>
            
            <p className="font-semibold">
              By using this application, you acknowledge that you understand these risks 
              and that any trading decisions are made at your own discretion and risk.
            </p>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button 
              onClick={handleDismiss}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              I Understand the Risks
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};