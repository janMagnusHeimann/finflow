import { createClient } from '@/lib/supabase/server'
import { NewsClient } from '@/components/news/news-client'

export default async function NewsPage() {
  const supabase = await createClient()
  
  // Fetch news from database
  const { data: news } = await supabase
    .from('market_news')
    .select('*')
    .order('published_at', { ascending: false })
    .limit(50)

  return <NewsClient initialNews={news || []} />
}