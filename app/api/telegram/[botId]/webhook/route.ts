import { NextRequest, NextResponse } from 'next/server'
import { sendMessage, answerCallbackQuery } from '@/lib/telegramService'
import { dispatchExternalWebhook } from '@/lib/webhookDispatcher'
import { createAdminClient } from '@/lib/supabase/admin'

// In-memory set for idempotency check (update_id deduplication)
const processedUpdateIds = new Set<number>()

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ botId: string }> }
) {
  const { botId } = await params

  try {
    // 1. Secret Token Header Validation (opcional)
    const secretTokenHeader = req.headers.get('x-telegram-bot-api-secret-token')
    const expectedSecret = process.env.TELEGRAM_WEBHOOK_SECRET

    if (expectedSecret && secretTokenHeader && secretTokenHeader !== expectedSecret) {
      return NextResponse.json({ error: 'Unauthorized secret token' }, { status: 401 })
    }

    const payload = await req.json()
    const updateId = payload.update_id

    // 2. Idempotency Check: evitar processar updates repetidos
    if (updateId && processedUpdateIds.has(updateId)) {
      return NextResponse.json({ ok: true, deduplicated: true }, { status: 200 })
    }
    if (updateId) {
      processedUpdateIds.add(updateId)
      // Keep set size bounded
      if (processedUpdateIds.size > 5000) {
        const [first] = processedUpdateIds
        processedUpdateIds.delete(first)
      }
    }

    // 3. Extract Message, Callback Query (Botões Inline) & Chat Info
    const callbackQuery = payload.callback_query
    const isButtonClick = Boolean(callbackQuery)
    const message = callbackQuery ? callbackQuery.message : (payload.message || payload.edited_message)
    if (!message && !callbackQuery) {
      return NextResponse.json({ ok: true, ignored: true }, { status: 200 })
    }

    const chatId = callbackQuery?.message?.chat?.id || message?.chat?.id
    const from = callbackQuery ? callbackQuery.from : (message?.from || {})
    const buttonData = callbackQuery?.data
    const text = isButtonClick
      ? (buttonData || 'Clicou no botão')
      : (message?.text || message?.caption || '')
    const telegramUsername = from.username ? `@${from.username}` : undefined
    const leadName = [from.first_name, from.last_name].filter(Boolean).join(' ') || telegramUsername || `Lead ${chatId}`

    // 4. Parse Deep Link UTM Parameters from /start <payload>
    let utmSource = 'telegram'
    let utmCampaign = 'direto'
    let utmContent = ''

    if (text.startsWith('/start')) {
      const parts = text.split(' ')
      if (parts.length > 1) {
        const startParam = parts[1]
        // Decodificar formato: utmSource__utmCampaign__utmContent
        const utmTokens = startParam.split('__')
        if (utmTokens[0]) utmSource = utmTokens[0]
        if (utmTokens[1]) utmCampaign = utmTokens[1]
        if (utmTokens[2]) utmContent = utmTokens[2]
      }
    }

    // 5. Automated Bot Response (se configurado com TELEGRAM_BOT_TOKEN)
    const botToken = process.env.TELEGRAM_BOT_TOKEN
    if (botToken) {
      // Se clicou em botão, responder imediatamente a callback query no Telegram
      if (callbackQuery?.id) {
        await answerCallbackQuery(botToken, callbackQuery.id, `Opção selecionada!`)
      }

      if (text.startsWith('/start')) {
        // Boas-vindas imediata
        await sendMessage(
          botToken,
          chatId,
          `👋 Olá ${from.first_name || 'amigo(a)'}! Bem-vindo ao atendimento comercial da nossa agência.\n\nRecebemos seu contato com sucesso. Em instantes nosso time ou consultor IA dará continuidade ao seu atendimento!`
        )
      }
    }

    // 6. Enviar cópia do evento para o Webhook Externo (webhook.site)
    await dispatchExternalWebhook(isButtonClick ? 'telegram.button_click' : 'telegram.lead_message', {
      chat_id: chatId,
      lead_name: leadName,
      username: telegramUsername,
      text: isButtonClick ? `👉 Clicou: "${text}"` : text,
      button_clicked: isButtonClick ? text : undefined,
      utm_source: utmSource,
      utm_campaign: utmCampaign,
      utm_content: utmContent,
    })

    // 6.5 Sincronizar com Supabase Oficial
    try {
      const supabase = createAdminClient()
      if (chatId) {
        let leadId: string | undefined
        const { data: existingLead } = await supabase
          .from('leads')
          .select('id, organization_id')
          .eq('telegram_chat_id', chatId)
          .maybeSingle()

        if (existingLead) {
          leadId = existingLead.id
          await supabase
            .from('leads')
            .update({
              name: leadName,
              telegram_username: telegramUsername,
              last_interaction_at: new Date().toISOString(),
              ...(utmSource !== 'telegram' ? { utm_source: utmSource, utm_campaign: utmCampaign, utm_content: utmContent } : {}),
            })
            .eq('id', existingLead.id)
        } else {
          const { data: org } = await supabase.from('organizations').select('id').limit(1).single()
          const orgId = org?.id || 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d'

          const { data: newLead } = await supabase
            .from('leads')
            .insert({
              organization_id: orgId,
              name: leadName,
              telegram_chat_id: chatId,
              telegram_username: telegramUsername,
              stage: 'novo',
              score: utmSource !== 'telegram' ? 60 : 30,
              score_badge: utmSource !== 'telegram' ? 'morno' : 'frio',
              utm_source: utmSource,
              utm_campaign: utmCampaign,
              utm_content: utmContent,
              last_interaction_at: new Date().toISOString(),
            })
            .select('id')
            .single()

          if (newLead) leadId = newLead.id
        }

        if (leadId) {
          let { data: conv } = await supabase
            .from('conversations')
            .select('id')
            .eq('lead_id', leadId)
            .maybeSingle()

          if (!conv) {
            const { data: org } = await supabase.from('organizations').select('id').limit(1).single()
            const orgId = org?.id || 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d'
            const { data: newConv } = await supabase
              .from('conversations')
              .insert({
                organization_id: orgId,
                lead_id: leadId,
                status: 'bot_active',
                last_message: text,
                unread_count: 1,
              })
              .select('id')
              .single()
            conv = newConv
          } else {
            await supabase
              .from('conversations')
              .update({
                last_message: text,
                last_message_at: new Date().toISOString(),
              })
              .eq('id', conv.id)
          }

          if (conv) {
            await supabase.from('messages').insert({
              conversation_id: conv.id,
              lead_id: leadId,
              sender_type: 'lead',
              message_type: 'text',
              text: text,
              telegram_message_id: message.message_id || null,
            })
          }
        }
      }
    } catch (dbErr) {
      console.error('[Supabase Telegram Sync Error]:', dbErr)
    }

    // 7. Fast 200 OK to Telegram (idempotent, immediate)
    return NextResponse.json(
      {
        ok: true,
        received_at: new Date().toISOString(),
        lead: {
          chat_id: chatId,
          name: leadName,
          username: telegramUsername,
          utm_source: utmSource,
          utm_campaign: utmCampaign,
          utm_content: utmContent,
        },
      },
      { status: 200 }
    )
  } catch (error: any) {
    // Log error internally and still return 200 to prevent Telegram spam retry loops
    console.error('[Telegram Webhook Error]:', error)
    return NextResponse.json({ ok: false, error: error.message }, { status: 200 })
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'online',
    service: 'LeadGram Telegram Webhook Service',
    timestamp: new Date().toISOString(),
  })
}
