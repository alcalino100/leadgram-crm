import { NextResponse } from 'next/server'
import { dispatchExternalWebhook } from '@/lib/webhookDispatcher'

export async function POST() {
  try {
    const testPayload = {
      test: true,
      sender: 'LeadGram CRM',
      message: 'Ping de teste disparado do painel do CRM para o webhook.site!',
      lead_simulado: {
        id: 'lead-test-001',
        nome: 'Rodrigo Albuquerque (VIP)',
        origem: 'Meta Ads',
        utm_campaign: 'black_scale_crm',
        valor: 15000.0,
      },
    }

    const res = await dispatchExternalWebhook('crm.test_ping', testPayload)
    return NextResponse.json({ success: true, result: res })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
