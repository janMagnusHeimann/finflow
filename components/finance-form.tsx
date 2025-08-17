'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, type RecurringFrequency, type RecurringUnit } from '@/lib/types'
import toast from 'react-hot-toast'
import { Plus, Loader2, CalendarDays } from 'lucide-react'
import { addDays, addWeeks, addMonths, addYears } from 'date-fns'

interface FinanceFormProps {
  userId: string
  onFinanceAdded: (finance: any) => void
}

export function FinanceForm({ userId, onFinanceAdded }: FinanceFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [type, setType] = useState<'income' | 'expense' | 'subscription' | 'rent'>('expense')
  const [category, setCategory] = useState('')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [recurring, setRecurring] = useState(false)
  const [recurringFrequency, setRecurringFrequency] = useState<RecurringFrequency>('monthly')
  const [recurringInterval, setRecurringInterval] = useState('1')
  const [recurringUnit, setRecurringUnit] = useState<RecurringUnit>('months')

  const supabase = createClient()

  const calculateNextDate = (startDate: string): Date | null => {
    if (!recurring) return null
    
    const start = new Date(startDate)
    const interval = parseInt(recurringInterval) || 1

    switch (recurringFrequency) {
      case 'daily':
        return addDays(start, 1)
      case 'weekly':
        return addWeeks(start, 1)
      case 'monthly':
        return addMonths(start, 1)
      case 'yearly':
        return addYears(start, 1)
      case 'custom':
        switch (recurringUnit) {
          case 'days':
            return addDays(start, interval)
          case 'weeks':
            return addWeeks(start, interval)
          case 'months':
            return addMonths(start, interval)
          case 'years':
            return addYears(start, interval)
          default:
            return null
        }
      default:
        return null
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const nextDate = calculateNextDate(date)
      
      const { data, error } = await supabase
        .from('personal_finances')
        .insert({
          user_id: userId,
          type,
          category,
          amount: parseFloat(amount),
          description,
          date,
          recurring,
          recurring_frequency: recurring ? recurringFrequency : null,
          recurring_interval: recurring && recurringFrequency === 'custom' ? parseInt(recurringInterval) : 1,
          recurring_unit: recurring && recurringFrequency === 'custom' ? recurringUnit : 'months',
          next_date: nextDate ? nextDate.toISOString() : null,
        })
        .select()
        .single()

      if (error) {
        toast.error(error.message)
      } else {
        toast.success('Transaction added successfully!')
        onFinanceAdded(data)
        // Reset form
        setAmount('')
        setDescription('')
        setCategory('')
        setRecurring(false)
        setRecurringFrequency('monthly')
        setRecurringInterval('1')
        setRecurringUnit('months')
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  const getRecurrenceText = () => {
    if (!recurring) return ''
    
    if (recurringFrequency === 'custom') {
      const intervalNum = parseInt(recurringInterval) || 1
      if (intervalNum === 1) {
        return `Every ${recurringUnit.slice(0, -1)}`
      }
      return `Every ${recurringInterval} ${recurringUnit}`
    }
    
    return recurringFrequency.charAt(0).toUpperCase() + recurringFrequency.slice(1)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Transaction</CardTitle>
        <CardDescription>
          Record your income and expenses
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select value={type} onValueChange={(value: any) => setType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="subscription">Subscription</SelectItem>
                  <SelectItem value="rent">Rent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Input
              id="description"
              placeholder="Add a note..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-4 rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="recurring" className="text-sm font-medium">
                  Recurring Transaction
                </Label>
              </div>
              <Switch
                id="recurring"
                checked={recurring}
                onCheckedChange={setRecurring}
              />
            </div>

            {recurring && (
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequency</Label>
                  <Select 
                    value={recurringFrequency} 
                    onValueChange={(value: RecurringFrequency) => setRecurringFrequency(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {recurringFrequency === 'custom' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="interval">Every</Label>
                      <Input
                        id="interval"
                        type="number"
                        min="1"
                        value={recurringInterval}
                        onChange={(e) => setRecurringInterval(e.target.value)}
                        placeholder="1"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="unit">Unit</Label>
                      <Select 
                        value={recurringUnit} 
                        onValueChange={(value: RecurringUnit) => setRecurringUnit(value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="days">Days</SelectItem>
                          <SelectItem value="weeks">Weeks</SelectItem>
                          <SelectItem value="months">Months</SelectItem>
                          <SelectItem value="years">Years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {getRecurrenceText() && (
                  <div className="rounded-md bg-muted p-3">
                    <p className="text-sm text-muted-foreground">
                      This transaction will repeat: <span className="font-medium text-foreground">{getRecurrenceText()}</span>
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Add Transaction
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}