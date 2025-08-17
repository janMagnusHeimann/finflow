'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns'

interface TrendChartProps {
  finances: any[]
}

export function TrendChart({ finances }: TrendChartProps) {
  // Get data for the last 30 days
  const today = new Date()
  const start = startOfMonth(today)
  const end = endOfMonth(today)
  const days = eachDayOfInterval({ start, end })

  const data = days.map(day => {
    const dayStr = format(day, 'yyyy-MM-dd')
    const dayFinances = finances.filter(f => 
      format(new Date(f.date), 'yyyy-MM-dd') === dayStr
    )

    const income = dayFinances
      .filter(f => f.type === 'income')
      .reduce((sum, f) => sum + Number(f.amount), 0)

    const expenses = dayFinances
      .filter(f => f.type !== 'income')
      .reduce((sum, f) => sum + Number(f.amount), 0)

    return {
      date: format(day, 'MMM dd'),
      income,
      expenses,
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Trend</CardTitle>
        <CardDescription>
          Income vs Expenses over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="income" 
              stroke="#10b981" 
              name="Income"
              strokeWidth={2}
            />
            <Line 
              type="monotone" 
              dataKey="expenses" 
              stroke="#ef4444" 
              name="Expenses"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}