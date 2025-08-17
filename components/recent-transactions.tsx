'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { formatCurrency, formatDate } from '@/lib/utils/format'
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  RefreshCw, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Pause, 
  Play,
  Calendar
} from 'lucide-react'
import { TransactionEditDialog } from '@/components/transaction-edit-dialog'
import { createClient } from '@/lib/supabase/client'
import { useCurrency } from '@/lib/contexts/currency-context'
import toast from 'react-hot-toast'

interface RecentTransactionsProps {
  transactions: any[]
  onTransactionUpdate?: (updatedTransaction: any) => void
  onTransactionDelete?: (transactionId: string) => void
}

export function RecentTransactions({ 
  transactions, 
  onTransactionUpdate,
  onTransactionDelete 
}: RecentTransactionsProps) {
  const [editingTransaction, setEditingTransaction] = useState<any | null>(null)
  const [deletingTransaction, setDeletingTransaction] = useState<any | null>(null)
  const [pausingTransaction, setPausingTransaction] = useState<any | null>(null)
  const { currency, locale } = useCurrency()
  const supabase = createClient()

  const getRecurrenceText = (transaction: any) => {
    if (!transaction.recurring) return null
    
    if (transaction.recurring_frequency === 'custom') {
      const interval = transaction.recurring_interval || 1
      const unit = transaction.recurring_unit || 'months'
      if (interval === 1) {
        return `Every ${unit.slice(0, -1)}`
      }
      return `Every ${interval} ${unit}`
    }
    
    return transaction.recurring_frequency || 'Monthly'
  }

  const handleEdit = (transaction: any) => {
    setEditingTransaction(transaction)
  }

  const handleDelete = async () => {
    if (!deletingTransaction) return

    try {
      const { error } = await supabase
        .from('personal_finances')
        .delete()
        .eq('id', deletingTransaction.id)

      if (error) {
        toast.error(error.message)
      } else {
        toast.success('Transaction deleted successfully')
        if (onTransactionDelete) {
          onTransactionDelete(deletingTransaction.id)
        }
        setDeletingTransaction(null)
      }
    } catch (error) {
      toast.error('Failed to delete transaction')
    }
  }

  const handlePauseToggle = async (transaction: any) => {
    const isPaused = transaction.is_paused
    
    try {
      const { data, error } = await supabase
        .from('personal_finances')
        .update({
          is_paused: !isPaused,
          paused_until: null // Clear any temporary pause
        })
        .eq('id', transaction.id)
        .select()
        .single()

      if (error) {
        toast.error(error.message)
      } else {
        toast.success(`Transaction ${isPaused ? 'resumed' : 'paused'} successfully`)
        if (onTransactionUpdate) {
          onTransactionUpdate(data)
        }
      }
    } catch (error) {
      toast.error('Failed to update transaction')
    }
  }

  const handlePauseUntil = async () => {
    if (!pausingTransaction) return

    // For simplicity, we'll pause for 30 days
    const pauseUntilDate = new Date()
    pauseUntilDate.setDate(pauseUntilDate.getDate() + 30)

    try {
      const { data, error } = await supabase
        .from('personal_finances')
        .update({
          is_paused: true,
          paused_until: pauseUntilDate.toISOString()
        })
        .eq('id', pausingTransaction.id)
        .select()
        .single()

      if (error) {
        toast.error(error.message)
      } else {
        toast.success('Transaction paused for 30 days')
        if (onTransactionUpdate) {
          onTransactionUpdate(data)
        }
        setPausingTransaction(null)
      }
    } catch (error) {
      toast.error('Failed to pause transaction')
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>
            Your latest financial activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                No transactions yet
              </p>
            ) : (
              transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between space-x-4 group"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div className={`p-2 rounded-full ${
                      transaction.type === 'income' 
                        ? 'bg-green-100 dark:bg-green-900' 
                        : 'bg-red-100 dark:bg-red-900'
                    }`}>
                      {transaction.type === 'income' ? (
                        <ArrowUpRight className="h-4 w-4 text-green-600 dark:text-green-400" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-red-600 dark:text-red-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{transaction.category}</p>
                        {transaction.recurring && (
                          <>
                            <Badge 
                              variant={transaction.is_paused ? "outline" : "secondary"} 
                              className="text-xs px-2 py-0"
                            >
                              <RefreshCw className="h-3 w-3 mr-1" />
                              {getRecurrenceText(transaction)}
                            </Badge>
                            {transaction.is_paused && (
                              <Badge variant="outline" className="text-xs px-2 py-0">
                                <Pause className="h-3 w-3 mr-1" />
                                Paused
                              </Badge>
                            )}
                          </>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {transaction.description || transaction.type}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <p className={`text-sm font-medium ${
                        transaction.type === 'income' 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}
                        {formatCurrency(Math.abs(Number(transaction.amount)), currency.code, locale)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(transaction.date)}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(transaction)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        {transaction.recurring && (
                          <>
                            <DropdownMenuItem onClick={() => handlePauseToggle(transaction)}>
                              {transaction.is_paused ? (
                                <>
                                  <Play className="mr-2 h-4 w-4" />
                                  Resume
                                </>
                              ) : (
                                <>
                                  <Pause className="mr-2 h-4 w-4" />
                                  Pause
                                </>
                              )}
                            </DropdownMenuItem>
                            {!transaction.is_paused && (
                              <DropdownMenuItem onClick={() => setPausingTransaction(transaction)}>
                                <Calendar className="mr-2 h-4 w-4" />
                                Pause for 30 days
                              </DropdownMenuItem>
                            )}
                          </>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => setDeletingTransaction(transaction)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      {editingTransaction && (
        <TransactionEditDialog
          transaction={editingTransaction}
          open={!!editingTransaction}
          onOpenChange={(open) => !open && setEditingTransaction(null)}
          onUpdate={(updated) => {
            if (onTransactionUpdate) {
              onTransactionUpdate(updated)
            }
            setEditingTransaction(null)
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingTransaction} onOpenChange={(open) => !open && setDeletingTransaction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Transaction</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this transaction? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {deletingTransaction && (
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Category:</span> {deletingTransaction.category}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Amount:</span> {formatCurrency(deletingTransaction.amount, currency.code, locale)}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Date:</span> {formatDate(deletingTransaction.date)}
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingTransaction(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete Transaction
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Pause Until Dialog */}
      <Dialog open={!!pausingTransaction} onOpenChange={(open) => !open && setPausingTransaction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pause Recurring Transaction</DialogTitle>
            <DialogDescription>
              This transaction will be paused for 30 days. It will automatically resume after that period.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPausingTransaction(null)}>
              Cancel
            </Button>
            <Button onClick={handlePauseUntil}>
              Pause for 30 Days
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}