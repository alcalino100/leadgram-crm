import { create } from 'zustand'
import { 
  Organization, 
  Lead, 
  LeadStageId, 
  User, 
  LeadEvent, 
  Tag, 
  Conversation, 
  Message, 
  ConversationStatus, 
  MessageType,
  PaymentTransaction,
  PaymentGatewayProvider,
  Campaign,
  Bot,
  PipelineStage,
} from '@/types'
import { calculateLeadScore } from '@/lib/qualification'

// Tags especializadas para Nicho Adulto / Criadoras / VIP
export const defaultAdultTags: Tag[] = [
  { id: 'tag-1', name: '🔥 Quente VIP', color: '#ec4899', organization_id: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d' },
  { id: 'tag-2', name: '💎 Comprou Pack', color: '#a855f7', organization_id: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d' },
  { id: 'tag-3', name: '⚡ PIX Gerado', color: '#f59e0b', organization_id: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d' },
  { id: 'tag-4', name: '🔞 Prévia Vista', color: '#22d3ee', organization_id: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d' },
  { id: 'tag-5', name: '👑 Assinante Mensal', color: '#10b981', organization_id: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d' },
  { id: 'tag-6', name: '❄️ Lead Frio', color: '#71717a', organization_id: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d' },
]

// Estágios Iniciais do Pipeline
export const defaultPipelineStages: PipelineStage[] = [
  { id: 'novo', name: 'Novo Contato (Entrou no Bot)', sort_order: 1, color: '#22d3ee' },
  { id: 'contato_feito', name: 'Menu / Prévia Enviada', sort_order: 2, color: '#38bdf8' },
  { id: 'qualificado', name: 'Interessado no VIP', sort_order: 3, color: '#f59e0b' },
  { id: 'proposta_enviada', name: 'PIX Gerado (Aguardando)', sort_order: 4, color: '#a855f7' },
  { id: 'follow_up', name: 'Follow-up (Recuperação)', sort_order: 5, color: '#ec4899' },
  { id: 'ganho', name: 'VIP Ativo (Acesso Liberado)', sort_order: 6, color: '#10b981' },
  { id: 'perdido', name: 'Desistência / Churn', sort_order: 7, color: '#ef4444' },
]

// Os 2 Usuários Editáveis
export const defaultUsers: User[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'Guilherme Garcia',
    email: 'gui@leadgram.com',
    role: 'owner',
    created_at: new Date().toISOString(),
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    name: 'Operador 2 (Atendente VIP)',
    email: 'atendimento@leadgram.com',
    role: 'agent',
    created_at: new Date().toISOString(),
  },
]

interface AppState {
  currentOrganization: Organization | null
  organizations: Organization[]
  currentUser: User | null
  users: User[]
  bots: Bot[]
  pipelineStages: PipelineStage[]
  leads: Lead[]
  leadEvents: LeadEvent[]
  availableTags: Tag[]
  campaigns: Campaign[]
  conversations: Conversation[]
  messages: Record<string, Message[]>
  automations: any[]
  activeConversationId: string | null
  selectedLeadId: string | null
  isLeadDrawerOpen: boolean
  isSidebarOpen: boolean
  isLoadingOrg: boolean
  isSyncing: boolean

  // Data Sync
  fetchInitialData: () => Promise<void>

  // Actions
  setCurrentOrganization: (org: Organization) => void
  setSelectedLeadId: (id: string | null) => void
  setActiveConversationId: (id: string | null) => void
  openLeadDrawer: (id: string) => void
  closeLeadDrawer: () => void
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void

  // Pipeline Stages Management (Req 5)
  addStage: (stage: { name: string; color?: string; id?: string }) => Promise<PipelineStage | null>
  updateStage: (stage: { id: string; name?: string; color?: string; sort_order?: number }) => Promise<PipelineStage | null>
  deleteStage: (id: string) => Promise<{ success: boolean; error?: string }>

  // Users Management (Req 3 - 2 Usuários Editáveis)
  updateUser: (user: Partial<User> & { id: string }) => Promise<User | null>

  // Automations Management (Req 2 - Várias & Salvas)
  saveAutomation: (automation: any) => Promise<any>
  deleteAutomation: (id: string) => Promise<boolean>

  // Lead Mutations
  updateLeadStage: (leadId: string, stage: LeadStageId) => Promise<void>
  assignLead: (leadId: string, userId: string) => Promise<void>
  toggleLeadTag: (leadId: string, tag: Tag) => Promise<void>
  updateLeadNotes: (leadId: string, notes: string) => Promise<void>
  addLead: (lead: Omit<Lead, 'id' | 'created_at' | 'updated_at' | 'score' | 'score_badge'>) => Promise<Lead>
  deleteLead: (leadId: string) => Promise<boolean>

  // Conversation & Messaging Mutations
  updateConversationStatus: (conversationId: string, status: ConversationStatus) => void
  sendTextMessage: (conversationId: string, text: string) => Promise<void>
  sendMediaMessage: (
    conversationId: string, 
    type: MessageType, 
    mediaUrl: string, 
    mediaName?: string, 
    mediaDuration?: number, 
    caption?: string
  ) => void
  generatePaymentLink: (
    conversationId: string, 
    leadId: string, 
    amount: number, 
    description: string, 
    provider: PaymentGatewayProvider
  ) => PaymentTransaction
  addCampaign: (campaign: Omit<Campaign, 'id' | 'created_at'>) => void
}

export const useAppStore = create<AppState>((set, get) => ({
  currentOrganization: {
    id: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    name: 'Agência VIP Digital',
    slug: 'vip-digital',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  organizations: [
    {
      id: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
      name: 'Agência VIP Digital',
      slug: 'vip-digital',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  currentUser: defaultUsers[0],
  users: defaultUsers,
  bots: [], // REAL: Inicia vazio (0) se nenhum bot conectado
  pipelineStages: defaultPipelineStages,
  leads: [], // REAL: Inicia vazio (0) se nenhum lead cadastrado
  leadEvents: [],
  availableTags: defaultAdultTags,
  campaigns: [],
  conversations: [],
  messages: {},
  automations: [],
  activeConversationId: null,
  selectedLeadId: null,
  isLeadDrawerOpen: false,
  isSidebarOpen: false,
  isLoadingOrg: false,
  isSyncing: false,

  // Sincronização Geral com Supabase
  fetchInitialData: async () => {
    set({ isSyncing: true })
    try {
      // 1. Leads
      const leadsRes = await fetch('/api/crm/leads').then((r) => (r.ok ? r.json() : { leads: [] }))
      if (leadsRes?.leads) {
        set({ leads: leadsRes.leads })
      }

      // 2. Estágios do Pipeline
      const stagesRes = await fetch('/api/crm/stages').then((r) => (r.ok ? r.json() : { stages: [] }))
      if (stagesRes?.stages && stagesRes.stages.length > 0) {
        set({ pipelineStages: stagesRes.stages })
      }

      // 3. Bots (0 se não houver bots)
      const botsRes = await fetch('/api/crm/bots').then((r) => (r.ok ? r.json() : { bots: [] }))
      if (botsRes?.bots) {
        set({ bots: botsRes.bots })
      }

      // 4. Usuários (os 2 usuários da equipe)
      const usersRes = await fetch('/api/crm/users').then((r) => (r.ok ? r.json() : { users: [] }))
      if (usersRes?.users && usersRes.users.length > 0) {
        set({
          users: usersRes.users,
          currentUser: usersRes.users[0] || get().currentUser,
        })
      }

      // 5. Automações
      const autoRes = await fetch('/api/crm/automations').then((r) => (r.ok ? r.json() : { automations: [] }))
      if (autoRes?.automations) {
        set({ automations: autoRes.automations })
      }

      // 6. Conversas
      const convRes = await fetch('/api/crm/conversations').then((r) => (r.ok ? r.json() : { conversations: [] }))
      if (convRes?.conversations) {
        set({
          conversations: convRes.conversations,
          activeConversationId: convRes.conversations[0]?.id || null,
        })
      }
    } catch (err) {
      console.warn('[Data Sync Error]:', err)
    } finally {
      set({ isSyncing: false })
    }
  },

  setCurrentOrganization: (org) => {
    set({ isLoadingOrg: true })
    setTimeout(() => {
      set({ currentOrganization: org, isLoadingOrg: false })
    }, 300)
  },

  setSelectedLeadId: (id) => set({ selectedLeadId: id }),
  
  setActiveConversationId: (id) => set({ activeConversationId: id }),

  openLeadDrawer: (id) => set({ selectedLeadId: id, isLeadDrawerOpen: true }),
  
  closeLeadDrawer: () => set({ isLeadDrawerOpen: false }),

  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),

  // Estágios de Pipeline: Adicionar (Req 5)
  addStage: async (stageData) => {
    try {
      const res = await fetch('/api/crm/stages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stageData),
      })
      const data = await res.json()
      if (data.stage) {
        set((state) => ({
          pipelineStages: [...state.pipelineStages, data.stage].sort(
            (a, b) => (a.sort_order || 0) - (b.sort_order || 0)
          ),
        }))
        return data.stage
      }
      return null
    } catch {
      return null
    }
  },

  // Estágios de Pipeline: Editar (Req 5)
  updateStage: async (stageData) => {
    try {
      const res = await fetch('/api/crm/stages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stageData),
      })
      const data = await res.json()
      if (data.stage) {
        set((state) => ({
          pipelineStages: state.pipelineStages.map((s) => (s.id === stageData.id ? data.stage : s)),
        }))
        return data.stage
      }
      return null
    } catch {
      return null
    }
  },

  // Estágios de Pipeline: Excluir (Req 5)
  deleteStage: async (id) => {
    try {
      const res = await fetch(`/api/crm/stages?id=${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) {
        return { success: false, error: data.error || 'Erro ao excluir estágio' }
      }
      set((state) => ({
        pipelineStages: state.pipelineStages.filter((s) => s.id !== id),
      }))
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  },

  // Usuários: Editar Perfil / Informações (Req 3)
  updateUser: async (userData) => {
    try {
      const res = await fetch('/api/crm/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      })
      const data = await res.json()
      if (data.user) {
        set((state) => ({
          users: state.users.map((u) => (u.id === userData.id ? data.user : u)),
          currentUser: state.currentUser?.id === userData.id ? data.user : state.currentUser,
        }))
        return data.user
      }
      return null
    } catch {
      return null
    }
  },

  // Automações: Salvar e Manter Salvo (Req 2)
  saveAutomation: async (autoData) => {
    try {
      const method = autoData.id && !autoData.id.startsWith('new-') ? 'PUT' : 'POST'
      const res = await fetch('/api/crm/automations', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(autoData),
      })
      const data = await res.json()
      if (data.automation) {
        set((state) => {
          const exists = state.automations.some((a) => a.id === data.automation.id)
          const nextAutos = exists
            ? state.automations.map((a) => (a.id === data.automation.id ? data.automation : a))
            : [data.automation, ...state.automations]
          return { automations: nextAutos }
        })
        return data.automation
      }
      return null
    } catch {
      return null
    }
  },

  // Automações: Excluir (Req 2)
  deleteAutomation: async (id) => {
    try {
      const res = await fetch(`/api/crm/automations?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        set((state) => ({
          automations: state.automations.filter((a) => a.id !== id),
        }))
        return true
      }
      return false
    } catch {
      return false
    }
  },

  // Lead Mutations
  updateLeadStage: async (leadId, stage) => {
    const state = get()
    const lead = state.leads.find((l) => l.id === leadId)
    if (!lead) return

    const previousStage = lead.stage
    const { total, badge } = calculateLeadScore({ ...lead, stage })

    const updatedLeads = state.leads.map((l) =>
      l.id === leadId
        ? {
            ...l,
            stage,
            score: total,
            score_badge: badge,
            updated_at: new Date().toISOString(),
          }
        : l
    )

    const newEvent: LeadEvent = {
      id: `evt-${Date.now()}`,
      lead_id: leadId,
      organization_id: lead.organization_id,
      type: 'stage_change',
      title: `Estágio alterado para ${stage}`,
      description: `Lead movido de "${previousStage}" para "${stage}". Score recalculado para ${total} pts.`,
      user_id: state.currentUser?.id,
      created_at: new Date().toISOString(),
    }

    set({
      leads: updatedLeads,
      leadEvents: [newEvent, ...state.leadEvents],
    })

    // Persistir em segundo plano no Supabase
    fetch('/api/crm/leads', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: leadId, stage, score: total, score_badge: badge }),
    }).catch(() => {})
  },

  assignLead: async (leadId, userId) => {
    const state = get()
    const targetUser = state.users.find((u) => u.id === userId)
    const updatedLeads = state.leads.map((l) =>
      l.id === leadId
        ? {
            ...l,
            assigned_to: userId,
            assigned_user: targetUser,
            updated_at: new Date().toISOString(),
          }
        : l
    )

    const newEvent: LeadEvent = {
      id: `evt-${Date.now()}`,
      lead_id: leadId,
      organization_id: state.currentOrganization?.id || 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
      type: 'assignment_changed',
      title: `Responsável atribuído`,
      description: `Lead atribuído a ${targetUser?.name || 'outro atendente'}.`,
      user_id: state.currentUser?.id,
      created_at: new Date().toISOString(),
    }

    set({
      leads: updatedLeads,
      leadEvents: [newEvent, ...state.leadEvents],
    })

    fetch('/api/crm/leads', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: leadId, assigned_to: userId }),
    }).catch(() => {})
  },

  toggleLeadTag: async (leadId, tag) => {
    const state = get()
    const lead = state.leads.find((l) => l.id === leadId)
    if (!lead) return

    const hasTag = lead.tags?.some((t) => t.id === tag.id)
    const nextTags = hasTag
      ? lead.tags?.filter((t) => t.id !== tag.id) || []
      : [...(lead.tags || []), tag]

    const { total, badge } = calculateLeadScore({ ...lead, tags: nextTags })

    const updatedLeads = state.leads.map((l) =>
      l.id === leadId
        ? {
            ...l,
            tags: nextTags,
            score: total,
            score_badge: badge,
            updated_at: new Date().toISOString(),
          }
        : l
    )

    set({ leads: updatedLeads })
  },

  updateLeadNotes: async (leadId, notes) => {
    const state = get()
    const updatedLeads = state.leads.map((l) =>
      l.id === leadId ? { ...l, notes, updated_at: new Date().toISOString() } : l
    )

    set({ leads: updatedLeads })

    fetch('/api/crm/leads', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: leadId, notes }),
    }).catch(() => {})
  },

  addLead: async (leadData) => {
    const state = get()
    const { total, badge } = calculateLeadScore({
      ...leadData,
      stage: leadData.stage || 'novo',
    })

    try {
      const res = await fetch('/api/crm/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...leadData,
          score: total,
          score_badge: badge,
        }),
      })
      const data = await res.json()
      const newLead = data.lead || {
        ...leadData,
        id: `lead-${Date.now()}`,
        score: total,
        score_badge: badge,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      set({ leads: [newLead, ...state.leads] })
      return newLead
    } catch {
      const fallbackLead: Lead = {
        ...leadData,
        id: `lead-${Date.now()}`,
        score: total,
        score_badge: badge,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      set({ leads: [fallbackLead, ...state.leads] })
      return fallbackLead
    }
  },

  deleteLead: async (leadId) => {
    try {
      await fetch(`/api/crm/leads?id=${leadId}`, { method: 'DELETE' })
      set((state) => ({ leads: state.leads.filter((l) => l.id !== leadId) }))
      return true
    } catch {
      return false
    }
  },

  // Conversas & Mensagens
  updateConversationStatus: (conversationId, status) => {
    const state = get()
    const updatedConversations = state.conversations.map((c) =>
      c.id === conversationId ? { ...c, status, updated_at: new Date().toISOString() } : c
    )
    set({ conversations: updatedConversations })
  },

  sendTextMessage: async (conversationId, text) => {
    const state = get()
    const conversation = state.conversations.find((c) => c.id === conversationId)
    if (!conversation) return

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      conversation_id: conversationId,
      lead_id: conversation.lead_id,
      sender_type: 'agent',
      message_type: 'text',
      text,
      created_at: new Date().toISOString(),
    }

    const currentList = state.messages[conversationId] || []
    set({
      messages: { ...state.messages, [conversationId]: [...currentList, newMessage] },
      conversations: state.conversations.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              last_message: text,
              last_message_at: new Date().toISOString(),
              status: 'in_human_service' as ConversationStatus,
            }
          : c
      ),
    })

    // Enviar para Supabase e Telegram
    fetch('/api/crm/conversations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        conversation_id: conversationId,
        lead_id: conversation.lead_id,
        text,
        sender_type: 'agent',
        telegram_chat_id: conversation.lead?.telegram_chat_id,
      }),
    }).catch(() => {})
  },

  sendMediaMessage: (conversationId, type, mediaUrl, mediaName, mediaDuration, caption) => {
    const state = get()
    const conversation = state.conversations.find((c) => c.id === conversationId)
    if (!conversation) return

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      conversation_id: conversationId,
      lead_id: conversation.lead_id,
      sender_type: 'agent',
      message_type: type,
      media_url: mediaUrl,
      media_name: mediaName,
      media_duration: mediaDuration,
      caption,
      created_at: new Date().toISOString(),
    }

    const currentList = state.messages[conversationId] || []
    set({
      messages: { ...state.messages, [conversationId]: [...currentList, newMessage] },
      conversations: state.conversations.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              last_message: caption || `[${type.toUpperCase()}]`,
              last_message_at: new Date().toISOString(),
            }
          : c
      ),
    })
  },

  generatePaymentLink: (conversationId, leadId, amount, description, provider) => {
    const state = get()
    const conversation = state.conversations.find((c) => c.id === conversationId)

    const transaction: PaymentTransaction = {
      id: `tx-${Date.now()}`,
      organization_id: state.currentOrganization?.id || 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
      lead_id: leadId,
      amount,
      status: 'pending',
      method: 'pix',
      provider,
      description,
      pix_copy_paste: '00020126870014br.gov.bcb.pix2565qrcode.fyhub.com.br/qr/v3/at/sample',
      created_at: new Date().toISOString(),
    }

    if (conversation) {
      const newMessage: Message = {
        id: `msg-pix-${Date.now()}`,
        conversation_id: conversationId,
        lead_id: leadId,
        sender_type: 'agent',
        message_type: 'payment_pix',
        text: `💰 Cobrança PIX Gerada: R$ ${amount.toFixed(2)} - ${description}`,
        metadata: {
          amount,
          description,
          provider,
          pix_copy_paste: transaction.pix_copy_paste,
        },
        created_at: new Date().toISOString(),
      }

      const currentList = state.messages[conversationId] || []
      set({
        messages: { ...state.messages, [conversationId]: [...currentList, newMessage] },
      })
    }

    return transaction
  },

  addCampaign: (campaignData) => {
    const newCamp: Campaign = {
      ...campaignData,
      id: `camp-${Date.now()}`,
      created_at: new Date().toISOString(),
    }
    set((state) => ({ campaigns: [newCamp, ...state.campaigns] }))
  },
}))
