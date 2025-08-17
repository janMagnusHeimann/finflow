'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatDate } from '@/lib/utils/format'
import { ExternalLink, RefreshCw, TrendingUp, Bitcoin, Globe } from 'lucide-react'
import toast from 'react-hot-toast'

interface NewsClientProps {
  initialNews: any[]
}

export function NewsClient({ initialNews }: NewsClientProps) {
  const [news, setNews] = useState(initialNews)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [filter, setFilter] = useState('all')

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      const response = await fetch('/api/news', { method: 'POST' })
      if (response.ok) {
        const { news: updatedNews } = await response.json()
        setNews(updatedNews)
        toast.success('News updated successfully!')
      } else {
        toast.error('Failed to refresh news')
      }
    } catch (error) {
      toast.error('An error occurred while refreshing news')
    } finally {
      setIsRefreshing(false)
    }
  }

  const filteredNews = filter === 'all' 
    ? news 
    : news.filter(item => item.topic === filter)

  const getTopicIcon = (topic: string) => {
    switch (topic) {
      case 'stocks':
        return <TrendingUp className="h-4 w-4" />
      case 'crypto':
        return <Bitcoin className="h-4 w-4" />
      default:
        return <Globe className="h-4 w-4" />
    }
  }

  const getTopicColor = (topic: string) => {
    switch (topic) {
      case 'stocks':
        return 'bg-blue-500'
      case 'crypto':
        return 'bg-orange-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Market News</h1>
          <p className="text-muted-foreground">
            Stay updated with the latest financial news
          </p>
        </div>
        <Button 
          onClick={handleRefresh} 
          disabled={isRefreshing}
          variant="outline"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="all" onClick={() => setFilter('all')}>
            All News
          </TabsTrigger>
          <TabsTrigger value="stocks" onClick={() => setFilter('stocks')}>
            Stocks
          </TabsTrigger>
          <TabsTrigger value="crypto" onClick={() => setFilter('crypto')}>
            Crypto
          </TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="space-y-4">
          {filteredNews.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <p className="text-center text-muted-foreground">
                  No news available. Click refresh to fetch the latest updates.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredNews.map((item) => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <Badge 
                        variant="secondary" 
                        className={`${getTopicColor(item.topic)} text-white`}
                      >
                        <span className="flex items-center gap-1">
                          {getTopicIcon(item.topic)}
                          {item.topic}
                        </span>
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(item.published_at)}
                      </span>
                    </div>
                    <CardTitle className="line-clamp-2 text-lg">
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {item.snippet && (
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                        {item.snippet}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {item.source}
                      </span>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm text-primary hover:underline"
                      >
                        Read more
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}