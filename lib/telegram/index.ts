// Telegram Bot API helpers & types
// Full implementation will be attached in Prompt 5

export interface TelegramWebhookUpdate {
  update_id: number
  message?: {
    message_id: number
    from?: {
      id: number
      is_bot: boolean
      first_name: string
      last_name?: string
      username?: string
      language_code?: string
    }
    chat: {
      id: number
      first_name?: string
      last_name?: string
      username?: string
      type: 'private' | 'group' | 'supergroup' | 'channel'
    }
    date: number
    text?: string
    caption?: string
    photo?: Array<{ file_id: string; file_unique_id: string; width: number; height: number }>
    video?: { file_id: string; file_unique_id: string; duration: number }
    document?: { file_id: string; file_unique_id: string; file_name?: string; mime_type?: string }
    voice?: { file_id: string; duration: number }
    location?: { latitude: number; longitude: number }
  }
}
