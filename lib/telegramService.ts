// ========================================================
// Telegram Bot API Service
// Métodos de envio, webhook e utilitários de servidor
// ========================================================

const TELEGRAM_API_BASE = 'https://api.telegram.org'

export interface TelegramApiResponse<T = any> {
  ok: boolean
  result?: T
  description?: string
  error_code?: number
}

export interface SendMessageOptions {
  parse_mode?: 'HTML' | 'Markdown' | 'MarkdownV2'
  reply_markup?: {
    inline_keyboard?: Array<Array<{ text: string; url?: string; callback_data?: string }>>
  }
}

/**
 * Valida o bot token e obtém os dados do bot (getMe)
 */
export async function getMe(botToken: string): Promise<TelegramApiResponse> {
  try {
    const res = await fetch(`${TELEGRAM_API_BASE}/bot${botToken}/getMe`)
    return await res.json()
  } catch (error: any) {
    return { ok: false, description: error.message || 'Erro ao conectar à API do Telegram' }
  }
}

/**
 * Configura o webhook do bot no Telegram
 */
export async function setWebhook(
  botToken: string,
  webhookUrl: string,
  secretToken?: string
): Promise<TelegramApiResponse> {
  try {
    const body: Record<string, any> = {
      url: webhookUrl,
      allowed_updates: ['message', 'edited_message', 'callback_query'],
    }
    if (secretToken) {
      body.secret_token = secretToken
    }

    const res = await fetch(`${TELEGRAM_API_BASE}/bot${botToken}/setWebhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    return await res.json()
  } catch (error: any) {
    return { ok: false, description: error.message }
  }
}

/**
 * Remove o webhook
 */
export async function deleteWebhook(botToken: string): Promise<TelegramApiResponse> {
  try {
    const res = await fetch(`${TELEGRAM_API_BASE}/bot${botToken}/deleteWebhook`)
    return await res.json()
  } catch (error: any) {
    return { ok: false, description: error.message }
  }
}

/**
 * Envia mensagem de texto no Telegram
 */
export async function sendMessage(
  botToken: string,
  chatId: string | number,
  text: string,
  options?: SendMessageOptions
): Promise<TelegramApiResponse> {
  try {
    const res = await fetch(`${TELEGRAM_API_BASE}/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        ...options,
      }),
    })
    return await res.json()
  } catch (error: any) {
    return { ok: false, description: error.message }
  }
}

/**
 * Envia foto com legenda
 */
export async function sendPhoto(
  botToken: string,
  chatId: string | number,
  photoUrl: string,
  caption?: string,
  options?: SendMessageOptions
): Promise<TelegramApiResponse> {
  try {
    const res = await fetch(`${TELEGRAM_API_BASE}/bot${botToken}/sendPhoto`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        photo: photoUrl,
        caption,
        ...options,
      }),
    })
    return await res.json()
  } catch (error: any) {
    return { ok: false, description: error.message }
  }
}

/**
 * Envia áudio de voz (.ogg / voz simulada)
 */
export async function sendVoice(
  botToken: string,
  chatId: string | number,
  voiceUrl: string,
  caption?: string,
  options?: SendMessageOptions
): Promise<TelegramApiResponse> {
  try {
    const res = await fetch(`${TELEGRAM_API_BASE}/bot${botToken}/sendVoice`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        voice: voiceUrl,
        caption,
        ...options,
      }),
    })
    return await res.json()
  } catch (error: any) {
    return { ok: false, description: error.message }
  }
}

/**
 * Envia documento PDF / arquivo
 */
export async function sendDocument(
  botToken: string,
  chatId: string | number,
  documentUrl: string,
  caption?: string,
  options?: SendMessageOptions
): Promise<TelegramApiResponse> {
  try {
    const res = await fetch(`${TELEGRAM_API_BASE}/bot${botToken}/sendDocument`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        document: documentUrl,
        caption,
        ...options,
      }),
    })
    return await res.json()
  } catch (error: any) {
    return { ok: false, description: error.message }
  }
}
