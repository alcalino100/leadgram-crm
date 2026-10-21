import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// Templates padrão para nicho adulto caso o banco esteja vazio
const defaultAdultAutomations = [
  {
    name: '🔥 Boas-Vindas + Prévia VIP (Áudio & Teaser)',
    trigger: 'telegram.start',
    action: 'send_media_sequence',
    active: true,
    action_config: {
      nodes: [
        {
          id: '1',
          type: 'triggerNode',
          position: { x: 250, y: 50 },
          data: { label: 'Novo Lead /start', event: 'telegram.start', description: 'Entrou pelo link de anúncio' },
        },
        {
          id: '2',
          type: 'audioNode',
          position: { x: 250, y: 180 },
          data: {
            title: 'Áudio de Boas-Vindas',
            duration: '0:18',
            caption: 'Oi amor! Que bom que você veio... preparei algo bem especial pra você hoje ❤️',
          },
        },
        {
          id: '3',
          type: 'mediaNode',
          position: { x: 250, y: 320 },
          data: {
            title: 'Teaser Exclusivo',
            mediaType: 'photo',
            url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500',
            caption: 'Prévia do conteúdo liberado de hoje... clica abaixo pra ver tudo sem censura 🔥',
          },
        },
        {
          id: '4',
          type: 'messageNode',
          position: { x: 250, y: 470 },
          data: {
            template: 'Escolha seu acesso:\n\n1️⃣ Acesso VIP Mensal - R$ 49,90\n2️⃣ Pack Completo 150 Mídias - R$ 34,90\n3️⃣ Chamada de Vídeo Privada - R$ 120,00\n\nQual você quer liberar agora?',
          },
        },
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2', animated: true },
        { id: 'e2-3', source: '2', target: '3', animated: true },
        { id: 'e3-4', source: '3', target: '4', animated: true },
      ],
    },
  },
  {
    name: '💰 Cobrança PIX Automática - Firebot',
    trigger: 'lead.wants_pix',
    action: 'generate_firebot_pix',
    active: true,
    action_config: {
      nodes: [
        {
          id: '1',
          type: 'triggerNode',
          position: { x: 250, y: 50 },
          data: { label: 'Solicitou PIX', event: 'lead.wants_pix', description: 'Cliente selecionou plano VIP' },
        },
        {
          id: '2',
          type: 'firebotPixNode',
          position: { x: 250, y: 200 },
          data: {
            amount: 49.9,
            description: 'Acesso Canal VIP Mensal',
            autoSendTelegram: true,
          },
        },
        {
          id: '3',
          type: 'actionNode',
          position: { x: 250, y: 350 },
          data: { actionType: 'update_stage', value: 'pix_gerado', label: 'Mover para PIX Gerado' },
        },
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2', animated: true },
        { id: 'e2-3', source: '2', target: '3', animated: true },
      ],
    },
  },
  {
    name: '⏳ Follow-up 15 Minutos (Recuperação de PIX)',
    trigger: 'pix.pending_15m',
    action: 'send_recovery_voice',
    active: true,
    action_config: {
      nodes: [
        {
          id: '1',
          type: 'triggerNode',
          position: { x: 250, y: 50 },
          data: { label: 'PIX Pendente 15 min', event: 'pix.pending_15m', description: 'Cliente gerou mas não pagou' },
        },
        {
          id: '2',
          type: 'delayNode',
          position: { x: 250, y: 190 },
          data: { duration: 15, unit: 'minutes' },
        },
        {
          id: '3',
          type: 'audioNode',
          position: { x: 250, y: 330 },
          data: {
            title: 'Áudio Recuperação',
            duration: '0:14',
            caption: 'Amor, vi que você ainda não confirmou seu PIX... aconteceu alguma coisa? Tô te esperando lá no VIP!',
          },
        },
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2', animated: true },
        { id: 'e2-3', source: '2', target: '3', animated: true },
      ],
    },
  },
  {
    name: '🎉 Liberação Automática do Canal VIP',
    trigger: 'firebot.venda.paga',
    action: 'grant_access',
    active: true,
    action_config: {
      nodes: [
        {
          id: '1',
          type: 'triggerNode',
          position: { x: 250, y: 50 },
          data: { label: 'PIX Pago (Firebot)', event: 'firebot.venda.paga', description: 'Baixa confirmada' },
        },
        {
          id: '2',
          type: 'actionNode',
          position: { x: 250, y: 190 },
          data: { actionType: 'update_stage', value: 'ganho', label: 'Mover para VIP Ativo' },
        },
        {
          id: '3',
          type: 'messageNode',
          position: { x: 250, y: 330 },
          data: {
            template: '🎉 Pagamento confirmado com sucesso, meu bem!\n\nAqui está o seu link de acesso exclusivo e vitalício ao meu Canal VIP:\n👉 https://t.me/+vip_exclusivo_link\n\nEntra lá agora que já tem conteúdo novo te esperando! 🔥',
          },
        },
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2', animated: true },
        { id: 'e2-3', source: '2', target: '3', animated: true },
      ],
    },
  },
]

export async function GET() {
  try {
    const supabase = createAdminClient()
    const { data: automations, error } = await supabase
      .from('automations')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Se a tabela estiver vazia, seedar com os templates padrão
    if (!automations || automations.length === 0) {
      const { data: org } = await supabase.from('organizations').select('id').limit(1).single()
      const orgId = org?.id || 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d'

      const seeded = []
      for (const tpl of defaultAdultAutomations) {
        const { data } = await supabase
          .from('automations')
          .insert({
            organization_id: orgId,
            name: tpl.name,
            trigger: tpl.trigger,
            action: tpl.action,
            active: tpl.active,
            action_config: tpl.action_config,
          })
          .select()
          .single()
        if (data) seeded.push(data)
      }

      return NextResponse.json({ automations: seeded })
    }

    return NextResponse.json({ automations })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createAdminClient()
    const body = await req.json()
    const { name, trigger = 'telegram.start', action = 'custom_flow', action_config = {}, active = true } = body

    if (!name) {
      return NextResponse.json({ error: 'Nome da automação é obrigatório' }, { status: 400 })
    }

    const { data: org } = await supabase.from('organizations').select('id').limit(1).single()
    const orgId = org?.id || 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d'

    const { data, error } = await supabase
      .from('automations')
      .insert({
        organization_id: orgId,
        name,
        trigger,
        action,
        action_config,
        active,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, automation: data }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const supabase = createAdminClient()
    const body = await req.json()
    const { id, name, trigger, action, action_config, active } = body

    if (!id) {
      return NextResponse.json({ error: 'ID da automação é obrigatório' }, { status: 400 })
    }

    const updates: Record<string, any> = { updated_at: new Date().toISOString() }
    if (name !== undefined) updates.name = name
    if (trigger !== undefined) updates.trigger = trigger
    if (action !== undefined) updates.action = action
    if (action_config !== undefined) updates.action_config = action_config
    if (active !== undefined) updates.active = active

    const { data, error } = await supabase
      .from('automations')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, automation: data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const supabase = createAdminClient()
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID da automação é obrigatório' }, { status: 400 })
    }

    const { error } = await supabase.from('automations').delete().eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, deleted_id: id })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
