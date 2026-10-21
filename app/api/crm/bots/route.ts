import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET() {
  try {
    const supabase = createAdminClient()
    const { data: bots, error } = await supabase
      .from('bots')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ bots: bots || [] })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createAdminClient()
    const body = await req.json()
    const { name, username, token, persona } = body

    if (!name || !username || !token) {
      return NextResponse.json({ error: 'Nome, username e token são obrigatórios' }, { status: 400 })
    }

    // Obter id da organização
    const { data: org } = await supabase.from('organizations').select('id').limit(1).single()
    const orgId = org?.id || 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d'

    // Formatar username
    const cleanUsername = username.replace(/^@/, '')
    const cleanToken = token.trim()

    // 1. Tentar validar o token direto no Telegram
    let telegramBotInfo: any = null
    try {
      const res = await fetch(`https://api.telegram.org/bot${cleanToken}/getMe`)
      const tgData = await res.json()
      if (tgData.ok) {
        telegramBotInfo = tgData.result
      }
    } catch (tgErr) {
      console.warn('[Telegram Token Check Warning]:', tgErr)
    }

    // 2. Salvar no Supabase
    const { data: newBot, error } = await supabase
      .from('bots')
      .insert({
        organization_id: orgId,
        name,
        username: cleanUsername,
        token: cleanToken,
        persona: persona || 'Atendente VIP focado em conversão e envio de prévias e PIX',
        status: 'active',
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // 3. Apontar o Webhook do Telegram para a nossa API na Vercel
    const webhookUrl = `https://leadgram-crm.vercel.app/api/telegram/${newBot.id}/webhook`
    try {
      await fetch(`https://api.telegram.org/bot${cleanToken}/setWebhook?url=${encodeURIComponent(webhookUrl)}`)
      // Atualizar webhook_url no Supabase
      await supabase.from('bots').update({ webhook_url: webhookUrl }).eq('id', newBot.id)
      newBot.webhook_url = webhookUrl
    } catch (setErr) {
      console.warn('[Set Webhook Error]:', setErr)
    }

    return NextResponse.json({ success: true, bot: newBot, telegram_info: telegramBotInfo }, { status: 201 })
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
      return NextResponse.json({ error: 'ID do bot é obrigatório' }, { status: 400 })
    }

    // Buscar bot para remover webhook do Telegram se houver token
    const { data: bot } = await supabase.from('bots').select('token').eq('id', id).single()
    if (bot?.token && !bot.token.includes('PENDING')) {
      try {
        await fetch(`https://api.telegram.org/bot${bot.token}/deleteWebhook`)
      } catch (delHookErr) {
        console.warn('[Delete Webhook Warning]:', delHookErr)
      }
    }

    const { error } = await supabase.from('bots').delete().eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, deleted_id: id })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const supabase = createAdminClient()
    const body = await req.json()
    const { id, status, name, persona } = body

    if (!id) {
      return NextResponse.json({ error: 'ID do bot é obrigatório' }, { status: 400 })
    }

    const updates: Record<string, any> = { updated_at: new Date().toISOString() }
    if (status !== undefined) updates.status = status
    if (name !== undefined) updates.name = name
    if (persona !== undefined) updates.persona = persona

    const { data, error } = await supabase
      .from('bots')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, bot: data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
