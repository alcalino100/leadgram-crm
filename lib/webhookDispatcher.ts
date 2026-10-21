// ========================================================
// Webhook Dispatcher
// Envia eventos do CRM / Telegram / Firebot para o Webhook configurado
// ========================================================

const DEFAULT_WEBHOOK_URL = 'https://webhook.site/2137c6fe-7a92-43c9-bdbd-8bcb8d8d33db'

export async function dispatchExternalWebhook(event: string, payload: Record<string, any>) {
  const webhookUrl = process.env.EXTERNAL_WEBHOOK_URL || DEFAULT_WEBHOOK_URL

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'LeadGram-CRM-Webhook/1.0',
        'X-LeadGram-Event': event,
      },
      body: JSON.stringify({
        event,
        timestamp: new Date().toISOString(),
        payload,
      }),
    })

    return { success: res.ok, status: res.status }
  } catch (error: any) {
    console.error(`[Webhook Dispatch Error] Event ${event}:`, error.message)
    return { success: false, error: error.message }
  }
}
