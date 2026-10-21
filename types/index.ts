export type Role = 'owner' | 'admin' | 'member' | 'agent'

export interface Organization {
  id: string
  name: string
  slug: string
  logo_url?: string
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  email: string
  name: string
  avatar_url?: string
  role?: Role
  created_at: string
}

export interface OrganizationMember {
  id: string
  organization_id: string
  user_id: string
  role: Role
  user?: User
  created_at: string
}

export type BotStatus = 'active' | 'paused' | 'error' | 'disconnected'

export interface Bot {
  id: string
  organization_id: string
  name: string
  username: string
  token_masked?: string
  persona?: string
  status: BotStatus
  webhook_url?: string
  last_activity_at?: string
  error_message?: string
  created_at: string
  updated_at: string
}

export type LeadStageId = 
  | 'novo'
  | 'contato_feito'
  | 'qualificado'
  | 'proposta_enviada'
  | 'follow_up'
  | 'ganho'
  | 'perdido'
  | string

export interface PipelineStage {
  id: string
  name: string
  order?: number
  sort_order?: number
  color: string
}

export type ScoreBadge = 'frio' | 'morno' | 'quente' | 'vip'

export interface UTMParams {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_content?: string
  utm_term?: string
  telegram_start?: string
}

export interface Tag {
  id: string
  organization_id: string
  name: string
  color: string
}

export interface Lead {
  id: string
  organization_id: string
  name: string
  phone?: string
  email?: string
  telegram_chat_id?: string | number
  telegram_username?: string
  source_id?: string
  source?: LeadSource
  campaign_id?: string
  campaign?: Campaign
  stage: LeadStageId
  score: number // 0-100
  score_badge: ScoreBadge
  assigned_to?: string
  assigned_user?: User
  estimated_value?: number
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_content?: string
  utm_term?: string
  utms?: UTMParams
  tags?: Tag[]
  notes?: string
  last_interaction_at?: string
  created_at: string
  updated_at: string
}

export interface LeadSource {
  id: string
  name: string
  icon?: string
  platform: 'meta' | 'google' | 'tiktok' | 'organic' | 'referral' | 'other'
}

export interface Campaign {
  id: string
  organization_id: string
  name: string
  platform: 'meta' | 'google' | 'tiktok' | 'organic' | 'referral' | 'other'
  objective?: string
  ad_set?: string
  creative?: string
  budget?: number
  cost?: number
  status: 'active' | 'paused' | 'archived'
  utms?: UTMParams
  created_at: string
}

export type ConversationStatus = 'bot_active' | 'waiting_human' | 'in_human_service' | 'closed'

export interface Conversation {
  id: string
  organization_id: string
  bot_id: string
  bot?: Bot
  lead_id: string
  lead?: Lead
  status: ConversationStatus
  assigned_to?: string
  assigned_user?: User
  last_message?: string
  last_message_at?: string
  unread_count?: number
  created_at: string
  updated_at: string
}

export type MessageType = 
  | 'text' 
  | 'photo' 
  | 'video' 
  | 'audio' 
  | 'document' 
  | 'location'
  | 'payment_request'
  | 'payment_pix'

export type MessageSender = 'lead' | 'bot' | 'agent'

export interface MessageButton {
  text: string
  url?: string
  callback_data?: string
}

export interface Message {
  id: string
  conversation_id: string
  lead_id: string
  sender_type: MessageSender
  message_type: MessageType
  text?: string
  media_url?: string
  media_name?: string
  media_duration?: number // em segundos para áudios/vídeos
  caption?: string
  buttons?: MessageButton[]
  payment?: PaymentTransaction
  telegram_message_id?: number
  metadata?: Record<string, any>
  created_at: string
}

export interface Task {
  id: string
  organization_id: string
  lead_id?: string
  lead?: Lead
  assigned_to: string
  assigned_user?: User
  title: string
  description?: string
  due_date: string
  completed: boolean
  created_at: string
}

export interface LeadEvent {
  id: string
  lead_id: string
  organization_id: string
  type: 
    | 'stage_change' 
    | 'score_update' 
    | 'message_sent' 
    | 'message_received' 
    | 'tag_added' 
    | 'tag_removed' 
    | 'note_added' 
    | 'task_created' 
    | 'assignment_changed'
    | 'payment_generated'
    | 'payment_received'
  title: string
  description?: string
  user_id?: string
  created_at: string
}

// ==========================================
// GATEWAYS DE PAGAMENTO (Firebot, Pix, Stripe, Asaas)
// ==========================================
export type PaymentGatewayProvider = 'firebot' | 'asaas' | 'mercadopago' | 'stripe' | 'custom_pix'
export type PaymentStatus = 'pending' | 'paid' | 'expired' | 'failed' | 'refunded'
export type PaymentMethod = 'pix' | 'credit_card' | 'boleto'

export interface PaymentTransaction {
  id: string
  organization_id: string
  lead_id: string
  amount: number
  status: PaymentStatus
  method: PaymentMethod
  provider: PaymentGatewayProvider
  description: string
  saleId?: string
  pix_copy_paste?: string
  pix_qr_code_url?: string
  checkout_url?: string
  paid_at?: string
  created_at: string
}

// ==========================================
// AUTOMAÇÕES & N8N-STYLE FLOW BUILDER
// ==========================================
export type FlowNodeType = 
  | 'trigger_meta_lead'
  | 'trigger_telegram_message'
  | 'trigger_keyword'
  | 'trigger_pix_paid'
  | 'trigger_webhook'
  | 'action_telegram_text'
  | 'action_telegram_audio'
  | 'action_telegram_photo'
  | 'action_telegram_video'
  | 'action_telegram_document'
  | 'action_generate_pix'
  | 'action_delay'
  | 'action_condition'
  | 'action_change_stage'
  | 'action_assign_agent'
  | 'action_apply_tag'
  | 'action_external_webhook'

export interface AutomationFlow {
  id: string
  organization_id: string
  name: string
  description?: string
  active: boolean
  nodes: any[] // React Flow nodes
  edges: any[] // React Flow edges
  last_executed_at?: string
  execution_count?: number
  created_at: string
  updated_at: string
}

export type AutomationTrigger = 
  | 'new_lead' 
  | 'message_received' 
  | 'keyword_match' 
  | 'tag_applied' 
  | 'lead_unanswered' 
  | 'stage_changed' 
  | 'webhook_received'
  | 'payment_received'

export type AutomationAction = 
  | 'apply_tag' 
  | 'change_stage' 
  | 'assign_agent' 
  | 'send_telegram_message' 
  | 'send_telegram_audio'
  | 'send_telegram_media'
  | 'generate_pix'
  | 'create_task' 
  | 'call_external_webhook'

export interface Automation {
  id: string
  organization_id: string
  name: string
  trigger: AutomationTrigger
  condition?: Record<string, any>
  action: AutomationAction
  action_config?: Record<string, any>
  active: boolean
  last_executed_at?: string
  created_at: string
}

export interface WebhookEvent {
  id: string
  organization_id: string
  bot_id?: string
  direction: 'inbound' | 'outbound'
  event_type: string
  status_code: number
  payload: Record<string, any>
  response_body?: Record<string, any>
  error_message?: string
  created_at: string
}
