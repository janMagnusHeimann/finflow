import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardClient } from '@/components/dashboard/dashboard-client'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  // Fetch user's financial data
  const [financesResult, goalsResult] = await Promise.all([
    supabase
      .from('personal_finances')
      .select('*')
      .order('date', { ascending: false }),
    supabase
      .from('goals')
      .select('*')
      .order('created_at', { ascending: false })
  ])

  return (
    <DashboardClient 
      initialFinances={financesResult.data || []}
      initialGoals={goalsResult.data || []}
      user={user}
    />
  )
}