import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendMessage } from '@/lib/telegramService'

export async function GET() {
  try {
    const supabase = createAdminClient()

    const { data: conversations, error } = await supabase
      .from('conversations')
      .select('*, leads(*), messages(*)')
      .order('last_message_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ conversations: conversations || [] })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createAdminClient()
    const { conversation_id, lead_id, text, sender_type = 'agent', telegram_chat_id } = await req.json()

    if (!conversation_id || !text) {
      return NextResponse.json({ error: 'conversation_id e text são obrigatórios' }, { status: 400 })
    }

    // 1. Inserir mensagem no Supabase
    const { data: message, error } = await supabase
      .from('messages')
      .insert({
        conversation_id,
        lead_id,
        sender_type,
        message_type: 'text',
        text,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // 2. Atualizar última mensagem da conversa
    await supabase
      .from('conversations')
      .update({
        last_message: text,
        last_message_at: new Date().toISOString(),
      })
      .eq('id', conversation_id)

    // 3. Se tivermos token do Telegram e chat_id, despachar no Telegram real
    const botToken = process.env.TELEGRAM_BOT_TOKEN
    if (botToken && telegram_chat_id) {
      await sendMessage(botToken, telegram_chat_id, text)
    }

    return NextResponse.json({ success: true, message }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
