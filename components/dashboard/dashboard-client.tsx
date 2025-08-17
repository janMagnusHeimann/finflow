'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FinanceForm } from '@/components/finance-form'
import { SpendingChart } from '@/components/charts/spending-chart'
import { TrendChart } from '@/components/charts/trend-chart'
import { GoalsList } from '@/components/goals-list'
import { RecentTransactions } from '@/components/recent-transactions'
import { formatCurrency } from '@/lib/utils/format'
import { DollarSign, TrendingUp, TrendingDown, Target } from 'lucide-react'
import type { User } from '@supabase/supabase-js'

interface DashboardClientProps {
  initialFinances: any[]
  initialGoals: any[]
  user: User
}

export function DashboardClient({ 
  initialFinances, 
  initialGoals,
  user 
}: DashboardClientProps) {
  const [finances, setFinances] = useState(initialFinances)
  const [goals, setGoals] = useState(initialGoals)

  // Calculate totals
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  
  const monthlyFinances = finances.filter(f => {
    const date = new Date(f.date)
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear
  })

  const totalIncome = monthlyFinances
    .filter(f => f.type === 'income')
    .reduce((sum, f) => sum + Number(f.amount), 0)

  const totalExpenses = monthlyFinances
    .filter(f => f.type !== 'income')
    .reduce((sum, f) => sum + Number(f.amount), 0)

  const balance = totalIncome - totalExpenses

  const handleFinanceAdded = (newFinance: any) => {
    setFinances(prev => [newFinance, ...prev])
  }

  const handleGoalAdded = (newGoal: any) => {
    setGoals(prev => [newGoal, ...prev])
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user.email}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Balance
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(balance)}
            </div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Income
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalIncome)}
            </div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Expenses
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalExpenses)}
            </div>
            <p className="text-xs text-muted-foreground">
              -8% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Goals
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{goals.length}</div>
            <p className="text-xs text-muted-foreground">
              In progress
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Forms and Transactions */}
        <div className="space-y-6 lg:col-span-2">
          <FinanceForm userId={user.id} onFinanceAdded={handleFinanceAdded} />
          <RecentTransactions transactions={finances.slice(0, 10)} />
        </div>

        {/* Right Column - Charts and Goals */}
        <div className="space-y-6">
          <SpendingChart finances={monthlyFinances} />
          <TrendChart finances={finances} />
          <GoalsList 
            goals={goals} 
            userId={user.id}
            onGoalAdded={handleGoalAdded}
          />
        </div>
      </div>
    </div>
  )
}