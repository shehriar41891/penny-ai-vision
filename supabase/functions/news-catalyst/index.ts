import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  publishedAt: string;
  symbols: string[];
  sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  url: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    const ALPHA_VANTAGE_KEY = Deno.env.get('ALPHA_VANTAGE_API_KEY')
    
    if (!ALPHA_VANTAGE_KEY) {
      throw new Error('Alpha Vantage API key not configured')
    }

    // Fetch real news from Alpha Vantage
    let realNews: NewsItem[] = [];
    
    try {
      const newsResponse = await fetch(
        `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&topics=technology,earnings&sort=LATEST&limit=50&apikey=${ALPHA_VANTAGE_KEY}`
      );
      const newsData = await newsResponse.json();
      
      if (newsData.feed) {
        realNews = newsData.feed.slice(0, 10).map((article: any, index: number) => ({
          id: `news-${index}`,
          title: article.title,
          summary: article.summary || article.title.substring(0, 150) + '...',
          source: article.source,
          publishedAt: article.time_published,
          symbols: article.ticker_sentiment?.map((t: any) => t.ticker) || [],
          sentiment: article.overall_sentiment_label?.toUpperCase() || 'NEUTRAL',
          impact: article.overall_sentiment_score > 0.1 ? 'HIGH' : 
                 article.overall_sentiment_score > 0.05 ? 'MEDIUM' : 'LOW',
          url: article.url
        }));
      }
    } catch (error) {
      console.error('Error fetching real news:', error);
    }
    
    // Mock news data - fallback
    const mockNews: NewsItem[] = [
      {
        id: '1',
        title: 'AI Chip Demand Surges as Tech Giants Expand Infrastructure',
        summary: 'Major technology companies are increasing their AI chip orders, driving unprecedented demand in the semiconductor sector.',
        source: 'MarketWatch',
        publishedAt: new Date(Date.now() - 3600000).toISOString(),
        symbols: ['SOXL', 'TECL'],
        sentiment: 'POSITIVE',
        impact: 'HIGH',
        url: 'https://marketwatch.com/ai-chip-demand'
      },
      {
        id: '2',
        title: 'Federal Reserve Signals Dovish Stance on Interest Rates',
        summary: 'Fed officials hint at potential rate cuts, boosting market sentiment across all sectors.',
        source: 'Reuters',
        publishedAt: new Date(Date.now() - 7200000).toISOString(),
        symbols: ['TQQQ', 'SPXL', 'UDOW'],
        sentiment: 'POSITIVE',
        impact: 'HIGH',
        url: 'https://reuters.com/fed-dovish-stance'
      },
      {
        id: '3',
        title: 'Breakthrough Cancer Treatment Shows Promise in Phase 3 Trial',
        summary: 'Revolutionary immunotherapy treatment demonstrates 78% success rate in late-stage clinical trials.',
        source: 'BioPharma Dive',
        publishedAt: new Date(Date.now() - 10800000).toISOString(),
        symbols: ['LABU', 'CURE'],
        sentiment: 'POSITIVE',
        impact: 'HIGH',
        url: 'https://biopharma-dive.com/cancer-breakthrough'
      },
      {
        id: '4',
        title: 'China Announces $1.2 Trillion Economic Stimulus Package',
        summary: 'Beijing unveils comprehensive stimulus measures to boost domestic consumption and manufacturing.',
        source: 'Financial Times',
        publishedAt: new Date(Date.now() - 14400000).toISOString(),
        symbols: ['YINN'],
        sentiment: 'POSITIVE',
        impact: 'HIGH',
        url: 'https://ft.com/china-stimulus'
      },
      {
        id: '5',
        title: 'Oil Prices Rally on Middle East Supply Concerns',
        summary: 'Geopolitical tensions raise concerns about oil supply disruptions, driving energy sector gains.',
        source: 'Bloomberg',
        publishedAt: new Date(Date.now() - 18000000).toISOString(),
        symbols: ['ERX'],
        sentiment: 'POSITIVE',
        impact: 'MEDIUM',
        url: 'https://bloomberg.com/oil-supply-concerns'
      }
    ];

    return new Response(
      JSON.stringify({
        success: true,
        data: realNews.length > 0 ? realNews : mockNews,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})

/* 
TODO: Replace mock data with real news API calls:

const fetchRealNews = async () => {
  const response = await fetch(
    `https://newsapi.org/v2/everything?q=stocks&apiKey=${NEWS_API_KEY}&sortBy=publishedAt&pageSize=20`
  );
  const data = await response.json();
  return data.articles;
};
*/