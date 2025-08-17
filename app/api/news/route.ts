import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Mock news data for demonstration
// In production, this would fetch from Finnhub or other APIs
const MOCK_NEWS = [
  {
    title: 'Fed Signals Potential Rate Cut in 2025',
    snippet: 'Federal Reserve officials hinted at possible interest rate adjustments in the coming year as inflation shows signs of cooling.',
    source: 'Financial Times',
    url: 'https://ft.com',
    topic: 'stocks',
  },
  {
    title: 'Bitcoin Surges Past $100,000 Milestone',
    snippet: 'The worlds largest cryptocurrency reaches new all-time high amid institutional adoption and regulatory clarity.',
    source: 'CoinDesk',
    url: 'https://coindesk.com',
    topic: 'crypto',
  },
  {
    title: 'Apple Announces Record Q4 Earnings',
    snippet: 'Tech giant beats analyst expectations with strong iPhone sales and services revenue growth.',
    source: 'CNBC',
    url: 'https://cnbc.com',
    topic: 'stocks',
  },
  {
    title: 'Ethereum 3.0 Roadmap Unveiled',
    snippet: 'Ethereum Foundation reveals ambitious plans for network scalability and sustainability improvements.',
    source: 'The Block',
    url: 'https://theblock.co',
    topic: 'crypto',
  },
  {
    title: 'Global Markets Rally on Economic Data',
    snippet: 'Major indices post gains as unemployment falls and consumer spending exceeds forecasts.',
    source: 'Bloomberg',
    url: 'https://bloomberg.com',
    topic: 'stocks',
  },
]

export async function POST() {
  try {
    const supabase = await createClient()
    
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // In production, this would:
    // 1. Fetch from Finnhub API using process.env.FINNHUB_API_KEY
    // 2. Process and filter the news
    // 3. Insert unique items into the database
    
    // For now, we'll insert mock data
    const newsWithTimestamps = MOCK_NEWS.map(item => ({
      ...item,
      published_at: new Date(Date.now() - Math.random() * 86400000).toISOString(), // Random time in last 24h
    }))

    // Insert news into database (upsert to avoid duplicates)
    const { data: insertedNews, error } = await supabase
      .from('market_news')
      .upsert(newsWithTimestamps, { 
        onConflict: 'title',
        ignoreDuplicates: true 
      })
      .select()

    if (error && error.code !== '23505') { // Ignore duplicate key errors
      console.error('Error inserting news:', error)
      return NextResponse.json(
        { error: 'Failed to update news' },
        { status: 500 }
      )
    }

    // Fetch all news to return
    const { data: allNews } = await supabase
      .from('market_news')
      .select('*')
      .order('published_at', { ascending: false })
      .limit(50)

    return NextResponse.json({ 
      success: true,
      news: allNews || [],
      message: 'News refreshed successfully'
    })

  } catch (error) {
    console.error('Error in news refresh:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Optional: GET endpoint to fetch news without refreshing
export async function GET() {
  try {
    const supabase = await createClient()
    
    const { data: news } = await supabase
      .from('market_news')
      .select('*')
      .order('published_at', { ascending: false })
      .limit(50)

    return NextResponse.json({ news: news || [] })
  } catch (error) {
    console.error('Error fetching news:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}