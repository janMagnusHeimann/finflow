import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase Admin client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    // Fetch news from Finnhub API
    const finnhubKey = Deno.env.get('FINNHUB_API_KEY')
    
    if (finnhubKey) {
      const response = await fetch(
        `https://finnhub.io/api/v1/news?category=general&token=${finnhubKey}`
      )
      
      if (response.ok) {
        const newsData = await response.json()
        
        // Transform and insert news into database
        const newsItems = newsData.slice(0, 20).map((item: any) => ({
          title: item.headline,
          snippet: item.summary,
          source: item.source,
          url: item.url,
          published_at: new Date(item.datetime * 1000).toISOString(),
          topic: item.category === 'crypto' ? 'crypto' : 'stocks',
        }))

        // Upsert news to avoid duplicates
        const { error } = await supabaseAdmin
          .from('market_news')
          .upsert(newsItems, {
            onConflict: 'url',
            ignoreDuplicates: true,
          })

        if (error && error.code !== '23505') {
          throw error
        }

        // Clean up old news (keep last 100 items)
        const { data: oldNews } = await supabaseAdmin
          .from('market_news')
          .select('id')
          .order('published_at', { ascending: false })
          .range(100, 1000)

        if (oldNews && oldNews.length > 0) {
          const idsToDelete = oldNews.map(item => item.id)
          await supabaseAdmin
            .from('market_news')
            .delete()
            .in('id', idsToDelete)
        }

        return new Response(
          JSON.stringify({
            success: true,
            message: `Updated ${newsItems.length} news items`,
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        )
      }
    }

    // Fallback: Insert sample news if no API key
    const sampleNews = [
      {
        title: 'Markets Rally on Positive Economic Data',
        snippet: 'Global markets posted gains as economic indicators exceeded expectations.',
        source: 'Financial Times',
        url: 'https://ft.com/sample-1',
        published_at: new Date().toISOString(),
        topic: 'stocks',
      },
      {
        title: 'Bitcoin Reaches New Milestone',
        snippet: 'Cryptocurrency markets see renewed interest from institutional investors.',
        source: 'CoinDesk',
        url: 'https://coindesk.com/sample-1',
        published_at: new Date().toISOString(),
        topic: 'crypto',
      },
    ]

    await supabaseAdmin.from('market_news').upsert(sampleNews, {
      onConflict: 'url',
      ignoreDuplicates: true,
    })

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Updated with sample news (no API key configured)',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})