import { NextRequest, NextResponse } from 'next/server'
import { createFirebotPix } from '@/lib/firebotService'
import { sendMessage } from '@/lib/telegramService'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { 
      amount, 
      description, 
      customer, 
      telegramChatId, 
      leadName,
      leadId 
    } = body

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'O valor da cobrança deve ser maior que zero.' },
        { status: 400 }
      )
    }

    // 1. Chamar a API oficial da Firebot
    const firebotRes = await createFirebotPix({
      amount: Number(amount),
      description: description || `Pagamento - ${leadName || 'Cliente'}`,
      customer: {
        name: customer?.name || leadName || 'Cliente Telegram',
        email: customer?.email || 'lead@email.com',
        cpf: customer?.cpf || '12345678900',
        phone: customer?.phone || '11999998888',
      },
      qrStyle: 'plain',
    })

    if (!firebotRes.success || !firebotRes.pixCopiaECola) {
      return NextResponse.json(
        { success: false, error: firebotRes.message || firebotRes.error || 'Erro na Firebot' },
        { status: 500 }
      )
    }

    // 2. Se houver telegramChatId configurado e TELEGRAM_BOT_TOKEN, enviar no Telegram
    const botToken = process.env.TELEGRAM_BOT_TOKEN
    if (botToken && telegramChatId) {
      const formattedAmount = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(amount)

      const textMsg = 
`💳 *Cobrança PIX Gerada com Sucesso!*

📌 *Item:* ${description || 'Serviço'}
💰 *Valor:* ${formattedAmount}
🆔 *ID Transação:* \`${firebotRes.transactionId}\`

Copie o código abaixo e cole no seu banco (Pix Copia e Cola):
\`\`\`
${firebotRes.pixCopiaECola}
\`\`\`
_O pagamento é compensado na hora e seu acesso é liberado instantaneamente!_`

      await sendMessage(botToken, telegramChatId, textMsg, {
        parse_mode: 'Markdown',
      })
    }

    return NextResponse.json({
      success: true,
      transactionId: firebotRes.transactionId,
      saleId: firebotRes.saleId,
      pixCopiaECola: firebotRes.pixCopiaECola,
      qrCodeUrl: firebotRes.qrCodeUrl,
      amount: firebotRes.amount || amount,
      status: 'pending',
    })
  } catch (error: any) {
    console.error('[Firebot Pix API Route Error]:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Erro interno ao gerar Pix Firebot' },
      { status: 500 }
    )
  }
}
