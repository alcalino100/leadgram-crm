import { NextRequest, NextResponse } from 'next/server'
import { sendMessage } from '@/lib/telegramService'
import { dispatchExternalWebhook } from '@/lib/webhookDispatcher'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { event, data } = body

    console.log(`[Firebot Webhook Received] Evento: ${event}`, data)

    // Tratar evento de venda aprovada/paga via PIX
    if (event === 'venda.paga' || event === 'payment.paid' || data?.status === 'PAID') {
      const transactionId = data?.transactionId || data?.id
      const amount = data?.amount
      const customer = data?.customer
      const telegramChatId = data?.metadata?.telegram_chat_id || data?.telegram_chat_id

      console.log(`[Firebot PIX Aprovado] Transação: ${transactionId}, Valor: R$ ${amount}`)

      // Se soubermos o chat_id do Telegram, envia mensagem comemorativa imediata
      const botToken = process.env.TELEGRAM_BOT_TOKEN
      if (botToken && telegramChatId) {
        const formattedAmount = amount
          ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount)
          : 'o valor'

        await sendMessage(
          botToken,
          telegramChatId,
          `🎉 *Pagamento PIX Confirmado com Sucesso!*\n\nSeu pagamento de *${formattedAmount}* foi processado instantaneamente pela Firebot.\n\nSeu acesso e contrato já foram liberados em nosso sistema! Qualquer dúvida, nossa equipe está à disposição por aqui.`
        )
      }

      // Disparar evento para o Webhook Externo (webhook.site)
      await dispatchExternalWebhook('firebot.payment_confirmed', {
        transactionId,
        amount,
        customer,
        telegramChatId,
        status: 'PAID',
      })

      return NextResponse.json(
        {
          success: true,
          action: 'lead_moved_to_won',
          transactionId,
          processed_at: new Date().toISOString(),
        },
        { status: 200 }
      )
    }

    // Retornar 200 para eventos informativos (saques, etc)
    return NextResponse.json({ success: true, event }, { status: 200 })
  } catch (error: any) {
    console.error('[Firebot Webhook Error]:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 200 })
  }
}

export async function GET() {
  return NextResponse.json({
    service: 'Firebot Webhook Endpoint',
    status: 'online',
    timestamp: new Date().toISOString(),
  })
}
