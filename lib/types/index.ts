export type { Database } from './database'

export interface FinanceEntry {
  id: string
  type: 'income' | 'expense' | 'subscription' | 'rent'
  category: string
  amount: number
  date: string
  description?: string
  recurring: boolean
}

export interface Goal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  deadline?: string
}

export interface NewsItem {
  id: string
  title: string
  snippet?: string
  source: string
  url: string
  publishedAt: string
  topic: string
}

export interface User {
  id: string
  email: string
  name?: string
}

export const EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Education',
  'Travel',
  'Personal Care',
  'Other',
] as const

export const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Investments',
  'Business',
  'Rental',
  'Other',
] as const

export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number]
export type IncomeCategory = typeof INCOME_CATEGORIES[number]