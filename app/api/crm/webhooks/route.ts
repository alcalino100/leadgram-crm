import { NextRequest, NextResponse } from 'next/server'
import {
  getConfiguredWebhooks,
  saveWebhookEndpoint,
  deleteWebhookEndpoint,
  dispatchExternalWebhook,
} from '@/lib/webhookDispatcher'

export async function GET() {
  const webhooks = getConfiguredWebhooks()
  return NextResponse.json({ webhooks })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { action, name, url, events, active } = body

    // Se for teste imediato
    if (action === 'test') {
      const targetUrl = url || 'https://webhook.site/2137c6fe-7a92-43c9-bdbd-8bcb8d8d33db'
      const testEvent = 'crm.test_ping'
      const testPayload = {
        message: 'Teste de conexão de webhook disparado com sucesso pelo LeadGram CRM!',
        origin: 'LeadGram CRM - Nicho Adulto / Telegram',
        timestamp: new Date().toISOString(),
      }

      try {
        const res = await fetch(targetUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'LeadGram-CRM-Webhook/1.0',
            'X-LeadGram-Event': testEvent,
          },
          body: JSON.stringify({
            event: testEvent,
            timestamp: new Date().toISOString(),
            payload: testPayload,
          }),
        })

        return NextResponse.json({
          success: res.ok,
          status: res.status,
          message: res.ok ? 'Webhook respondeu com sucesso!' : `Erro: HTTP ${res.status}`,
        })
      } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 400 })
      }
    }

    if (!name || !url) {
      return NextResponse.json({ error: 'Nome e URL do webhook são obrigatórios' }, { status: 400 })
    }

    const saved = saveWebhookEndpoint({
      name,
      url,
      events: events || ['all'],
      active: active !== undefined ? active : true,
    })

    return NextResponse.json({ success: true, webhook: saved }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, name, url, events, active } = body

    if (!id) {
      return NextResponse.json({ error: 'ID do webhook é obrigatório' }, { status: 400 })
    }

    const saved = saveWebhookEndpoint({
      id,
      name,
      url,
      events,
      active,
    })

    return NextResponse.json({ success: true, webhook: saved })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID do webhook é obrigatório' }, { status: 400 })
    }

    const deleted = deleteWebhookEndpoint(id)
    return NextResponse.json({ success: deleted, deleted_id: id })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
