import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET() {
  try {
    const supabase = createAdminClient()

    // 1. Total Leads
    const { count: totalLeads } = await supabase
      .from('leads')
      .select('id', { count: 'exact', head: true })

    // 2. Leads Hoje
    const startOfToday = new Date()
    startOfToday.setHours(0, 0, 0, 0)
    const { count: leadsToday } = await supabase
      .from('leads')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', startOfToday.toISOString())

    // 3. Leads Quentes / VIP
    const { count: hotLeads } = await supabase
      .from('leads')
      .select('id', { count: 'exact', head: true })
      .in('score_badge', ['quente', 'vip'])

    // 4. Bots Conectados (REAL: 0 se não houver bot)
    const { count: totalBots } = await supabase
      .from('bots')
      .select('id', { count: 'exact', head: true })

    // 5. Total de Conversas
    const { count: totalConversations } = await supabase
      .from('conversations')
      .select('id', { count: 'exact', head: true })

    // 6. Faturamento Ganho (PIX confirmado)
    const { data: wonLeads } = await supabase
      .from('leads')
      .select('estimated_value')
      .eq('stage', 'ganho')

    const totalWonRevenue = (wonLeads || []).reduce((acc, l) => acc + (Number(l.estimated_value) || 0), 0)

    // 7. Contagem por Estágio
    const { data: stages } = await supabase
      .from('pipeline_stages')
      .select('*')
      .order('sort_order', { ascending: true })

    const { data: allLeads } = await supabase
      .from('leads')
      .select('id, stage, estimated_value')

    const stageBreakdown = (stages || []).map((st) => {
      const stageLeads = (allLeads || []).filter((l) => l.stage === st.id)
      return {
        id: st.id,
        name: st.name,
        color: st.color,
        sort_order: st.sort_order,
        count: stageLeads.length,
        value: stageLeads.reduce((acc, l) => acc + (Number(l.estimated_value) || 0), 0),
      }
    })

    return NextResponse.json({
      totalLeads: totalLeads || 0,
      leadsToday: leadsToday || 0,
      hotLeads: hotLeads || 0,
      totalBots: totalBots || 0,
      totalConversations: totalConversations || 0,
      totalWonRevenue,
      stageBreakdown,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
