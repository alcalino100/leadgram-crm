// ========================================================
// Webhook Dispatcher Multi-Destination
// Envia eventos do CRM / Telegram / Firebot para todos os Webhooks ativos
// ========================================================

import { createAdminClient } from '@/lib/supabase/admin'

export interface WebhookEndpoint {
  id: string
  name: string
  url: string
  events: string[] // ['all'] ou ['telegram.lead_message', 'firebot.payment_confirmed', ...]
  active: boolean
  created_at: string
}

// Lista persistida em memória / fallback inicial
let configuredEndpoints: WebhookEndpoint[] = [
  {
    id: 'wh-default-1',
    name: 'Webhook.site Principal (Monitoramento)',
    url: process.env.EXTERNAL_WEBHOOK_URL || 'https://webhook.site/2137c6fe-7a92-43c9-bdbd-8bcb8d8d33db',
    events: ['all'],
    active: true,
    created_at: new Date().toISOString(),
  },
]

export function getConfiguredWebhooks(): WebhookEndpoint[] {
  return configuredEndpoints
}

export function saveWebhookEndpoint(endpoint: Omit<WebhookEndpoint, 'id' | 'created_at'> & { id?: string }): WebhookEndpoint {
  if (endpoint.id) {
    const index = configuredEndpoints.findIndex((w) => w.id === endpoint.id)
    if (index >= 0) {
      configuredEndpoints[index] = {
        ...configuredEndpoints[index],
        ...endpoint,
      }
      return configuredEndpoints[index]
    }
  }

  const newEp: WebhookEndpoint = {
    id: endpoint.id || `wh-${Date.now()}`,
    name: endpoint.name,
    url: endpoint.url,
    events: endpoint.events || ['all'],
    active: endpoint.active !== undefined ? endpoint.active : true,
    created_at: new Date().toISOString(),
  }

  configuredEndpoints.push(newEp)
  return newEp
}

export function deleteWebhookEndpoint(id: string): boolean {
  const initialLength = configuredEndpoints.length
  configuredEndpoints = configuredEndpoints.filter((w) => w.id !== id)
  return configuredEndpoints.length < initialLength
}

export async function dispatchExternalWebhook(event: string, payload: Record<string, any>) {
  const activeEndpoints = configuredEndpoints.filter((ep) => {
    if (!ep.active) return false
    if (ep.events.includes('all')) return true
    return ep.events.includes(event)
  })

  // Se nenhum estiver na lista mas tiver env
  if (activeEndpoints.length === 0 && process.env.EXTERNAL_WEBHOOK_URL) {
    activeEndpoints.push({
      id: 'env-fallback',
      name: 'Env Fallback',
      url: process.env.EXTERNAL_WEBHOOK_URL,
      events: ['all'],
      active: true,
      created_at: new Date().toISOString(),
    })
  }

  const results = await Promise.allSettled(
    activeEndpoints.map(async (ep) => {
      try {
        const res = await fetch(ep.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'LeadGram-CRM-Webhook/1.0',
            'X-LeadGram-Event': event,
          },
          body: JSON.stringify({
            event,
            endpoint_name: ep.name,
            timestamp: new Date().toISOString(),
            payload,
          }),
        })

        // Logar em webhook_events no Supabase se possível
        try {
          const supabase = createAdminClient()
          const { data: org } = await supabase.from('organizations').select('id').limit(1).single()
          if (org) {
            await supabase.from('webhook_events').insert({
              organization_id: org.id,
              direction: 'outbound',
              event_type: event,
              status_code: res.status,
              payload: { destination: ep.url, name: ep.name, payload },
              response_body: { ok: res.ok, status: res.status },
            })
          }
        } catch {}

        return { id: ep.id, name: ep.name, success: res.ok, status: res.status }
      } catch (err: any) {
        console.error(`[Webhook Dispatch Error to ${ep.url}]:`, err.message)
        return { id: ep.id, name: ep.name, success: false, error: err.message }
      }
    })
  )

  return results
}
