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
  Campaign
} from '@/types'
import { 
  mockOrganizations, 
  mockLeads, 
  mockUsers, 
  mockTags, 
  mockConversations, 
  mockMessages,
  mockCampaigns
} from '@/lib/mock-data'
import { calculateLeadScore } from '@/lib/qualification'

const initialEvents: LeadEvent[] = [
  {
    id: 'evt-1',
    lead_id: 'lead-1',
    organization_id: 'org-agency-alpha',
    type: 'message_received',
    title: 'Mensagem recebida via Telegram Bot',
    description: 'Lead iniciou conversa e informou orçamento mensal de R$ 80k.',
    created_at: new Date(Date.now() - 95 * 60000).toISOString()
  },
  {
    id: 'evt-2',
    lead_id: 'lead-1',
    organization_id: 'org-agency-alpha',
    type: 'tag_added',
    title: 'Tag Lead VIP aplicada automaticamente',
    description: 'Score atingiu 95 pontos através de parâmetros Meta Ads e Ticket alto.',
    created_at: new Date(Date.now() - 90 * 60000).toISOString()
  },
  {
    id: 'evt-3',
    lead_id: 'lead-1',
    organization_id: 'org-agency-alpha',
    type: 'stage_change',
    title: 'Estágio alterado para Qualificado',
    description: 'Atendente Guilherme Silva assumiu a conversa e moveu o lead.',
    created_at: new Date(Date.now() - 30 * 60000).toISOString()
  },
  {
    id: 'evt-4',
    lead_id: 'lead-2',
    organization_id: 'org-agency-alpha',
    type: 'stage_change',
    title: 'Estágio alterado para Proposta Enviada',
    description: 'Proposta comercial de R$ 15.000 enviada via Telegram.',
    created_at: new Date(Date.now() - 45 * 60000).toISOString()
  }
]

interface AppState {
  currentOrganization: Organization | null
  organizations: Organization[]
  currentUser: User | null
  leads: Lead[]
  leadEvents: LeadEvent[]
  availableTags: Tag[]
  campaigns: Campaign[]
  conversations: Conversation[]
  messages: Record<string, Message[]>
  activeConversationId: string | null
  selectedLeadId: string | null
  isLeadDrawerOpen: boolean
  isSidebarOpen: boolean
  isLoadingOrg: boolean
  
  // Actions
  setCurrentOrganization: (org: Organization) => void
  setSelectedLeadId: (id: string | null) => void
  setActiveConversationId: (id: string | null) => void
  openLeadDrawer: (id: string) => void
  closeLeadDrawer: () => void
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  
  // Lead Mutations
  updateLeadStage: (leadId: string, stage: LeadStageId) => void
  assignLead: (leadId: string, userId: string) => void
  toggleLeadTag: (leadId: string, tag: Tag) => void
  updateLeadNotes: (leadId: string, notes: string) => void
  addLead: (lead: Omit<Lead, 'id' | 'created_at' | 'updated_at' | 'score' | 'score_badge'>) => Lead

  // Conversation & Messaging Mutations (Prompt 3)
  updateConversationStatus: (conversationId: string, status: ConversationStatus) => void
  sendTextMessage: (conversationId: string, text: string) => void
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
  currentOrganization: mockOrganizations[0],
  organizations: mockOrganizations,
  currentUser: mockUsers[0],
  leads: mockLeads,
  leadEvents: initialEvents,
  availableTags: mockTags,
  campaigns: mockCampaigns,
  conversations: mockConversations,
  messages: mockMessages,
  activeConversationId: 'conv-1',
  selectedLeadId: null,
  isLeadDrawerOpen: false,
  isSidebarOpen: false,
  isLoadingOrg: false,

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

  updateLeadStage: (leadId, stage) => {
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

    const stageNames: Record<LeadStageId, string> = {
      novo: 'Novo',
      contato_feito: 'Contato Feito',
      qualificado: 'Qualificado',
      proposta_enviada: 'Proposta Enviada',
      follow_up: 'Follow-up',
      ganho: 'Ganho',
      perdido: 'Perdido',
    }

    const newEvent: LeadEvent = {
      id: `evt-${Date.now()}`,
      lead_id: leadId,
      organization_id: lead.organization_id,
      type: 'stage_change',
      title: `Estágio alterado para ${stageNames[stage]}`,
      description: `Lead movido de "${stageNames[previousStage]}" para "${stageNames[stage]}". Score recalculado para ${total} pts.`,
      user_id: state.currentUser?.id,
      created_at: new Date().toISOString(),
    }

    set({
      leads: updatedLeads,
      leadEvents: [newEvent, ...state.leadEvents],
    })
  },

  assignLead: (leadId, userId) => {
    const state = get()
    const targetUser = mockUsers.find((u) => u.id === userId)
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
      organization_id: state.currentOrganization?.id || 'org-agency-alpha',
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
  },

  toggleLeadTag: (leadId, tag) => {
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

    const newEvent: LeadEvent = {
      id: `evt-${Date.now()}`,
      lead_id: leadId,
      organization_id: lead.organization_id,
      type: hasTag ? 'tag_removed' : 'tag_added',
      title: hasTag ? `Tag removida: ${tag.name}` : `Tag adicionada: ${tag.name}`,
      description: `Score ajustado para ${total} pts.`,
      user_id: state.currentUser?.id,
      created_at: new Date().toISOString(),
    }

    set({
      leads: updatedLeads,
      leadEvents: [newEvent, ...state.leadEvents],
    })
  },

  updateLeadNotes: (leadId, notes) => {
    const state = get()
    const updatedLeads = state.leads.map((l) =>
      l.id === leadId
        ? { ...l, notes, updated_at: new Date().toISOString() }
        : l
    )

    const newEvent: LeadEvent = {
      id: `evt-${Date.now()}`,
      lead_id: leadId,
      organization_id: state.currentOrganization?.id || 'org-agency-alpha',
      type: 'note_added',
      title: 'Nota interna atualizada',
      description: notes.length > 50 ? `${notes.substring(0, 50)}...` : notes,
      user_id: state.currentUser?.id,
      created_at: new Date().toISOString(),
    }

    set({
      leads: updatedLeads,
      leadEvents: [newEvent, ...state.leadEvents],
    })
  },

  addLead: (leadData) => {
    const state = get()
    const { total, badge } = calculateLeadScore({
      ...leadData,
      stage: leadData.stage || 'novo',
    })

    const newLead: Lead = {
      ...leadData,
      id: `lead-${Date.now()}`,
      score: total,
      score_badge: badge,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const newEvent: LeadEvent = {
      id: `evt-${Date.now()}`,
      lead_id: newLead.id,
      organization_id: newLead.organization_id,
      type: 'message_received',
      title: 'Lead cadastrado no CRM',
      description: `Origem: ${newLead.source?.name || 'Tráfego'}. Score inicial: ${total} pts.`,
      user_id: state.currentUser?.id,
      created_at: new Date().toISOString(),
    }

    set({
      leads: [newLead, ...state.leads],
      leadEvents: [newEvent, ...state.leadEvents],
    })

    return newLead
  },

  // Prompt 3: Inbox Telegram actions
  updateConversationStatus: (conversationId, status) => {
    const state = get()
    const updatedConversations = state.conversations.map((c) =>
      c.id === conversationId
        ? {
            ...c,
            status,
            updated_at: new Date().toISOString(),
          }
        : c
    )
    set({ conversations: updatedConversations })
  },

  sendTextMessage: (conversationId, text) => {
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
    const updatedMessages = {
      ...state.messages,
      [conversationId]: [...currentList, newMessage],
    }

    const updatedConversations = state.conversations.map((c) =>
      c.id === conversationId
        ? {
            ...c,
            last_message: text,
            last_message_at: new Date().toISOString(),
            status: 'in_human_service' as ConversationStatus,
          }
        : c
    )

    set({
      messages: updatedMessages,
      conversations: updatedConversations,
    })
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
      text: caption || `Envio de ${type}`,
      created_at: new Date().toISOString(),
    }

    const currentList = state.messages[conversationId] || []
    const updatedMessages = {
      ...state.messages,
      [conversationId]: [...currentList, newMessage],
    }

    const updatedConversations = state.conversations.map((c) =>
      c.id === conversationId
        ? {
            ...c,
            last_message: caption || `[${type.toUpperCase()}]`,
            last_message_at: new Date().toISOString(),
          }
        : c
    )

    set({
      messages: updatedMessages,
      conversations: updatedConversations,
    })
  },

  generatePaymentLink: (conversationId, leadId, amount, description, provider) => {
    const state = get()
    const payment: PaymentTransaction = {
      id: `pay-${Date.now()}`,
      organization_id: state.currentOrganization?.id || 'org-agency-alpha',
      lead_id: leadId,
      amount,
      status: 'pending',
      method: 'pix',
      provider,
      description,
      pix_copy_paste: `00020126580014br.gov.bcb.pix0136${Date.now()}5204000053039865405${amount.toFixed(2)}5802BR5925GrowthScale Agencia6009Sao Paulo62070503***6304E2CA`,
      checkout_url: `https://checkout.growthscale.com.br/pay/${Date.now()}`,
      created_at: new Date().toISOString(),
    }

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      conversation_id: conversationId,
      lead_id: leadId,
      sender_type: 'agent',
      message_type: 'payment_request',
      text: `Cobrança Pix gerada: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount)}`,
      payment,
      buttons: [
        { text: '🔑 Copiar Código Pix', callback_data: 'copy_pix' },
        { text: '💳 Abrir Checkout Cartão/Boleto', url: payment.checkout_url }
      ],
      created_at: new Date().toISOString(),
    }

    const currentList = state.messages[conversationId] || []
    const updatedMessages = {
      ...state.messages,
      [conversationId]: [...currentList, newMessage],
    }

    // Register event
    const newEvent: LeadEvent = {
      id: `evt-${Date.now()}`,
      lead_id: leadId,
      organization_id: state.currentOrganization?.id || 'org-agency-alpha',
      type: 'payment_generated',
      title: 'Cobrança Pix Gerada no Telegram',
      description: `Valor: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount)} (${provider.toUpperCase()})`,
      user_id: state.currentUser?.id,
      created_at: new Date().toISOString(),
    }

    set({
      messages: updatedMessages,
      leadEvents: [newEvent, ...state.leadEvents],
    })

    return payment
  },

  addCampaign: (campaignData) => {
    const newCampaign: Campaign = {
      ...campaignData,
      id: `camp-${Date.now()}`,
      created_at: new Date().toISOString(),
    }
    set((state) => ({
      campaigns: [newCampaign, ...state.campaigns],
    }))
  }
}))
