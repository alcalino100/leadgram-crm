import { NextRequest, NextResponse } from 'next/server'
import { sendMessage } from '@/lib/telegramService'

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

    // 3. Extract Message & Chat Info
    const message = payload.message || payload.edited_message
    if (!message) {
      return NextResponse.json({ ok: true, ignored: true }, { status: 200 })
    }

    const chatId = message.chat?.id
    const from = message.from || {}
    const text = message.text || message.caption || ''
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
    if (botToken && text.startsWith('/start')) {
      // Boas-vindas imediata
      await sendMessage(
        botToken,
        chatId,
        `👋 Olá ${from.first_name || 'amigo(a)'}! Bem-vindo ao atendimento comercial da nossa agência.\n\nRecebemos seu contato com sucesso. Em instantes nosso time ou consultor IA dará continuidade ao seu atendimento!`
      )
    }

    // 6. Fast 200 OK to Telegram (idempotent, immediate)
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
