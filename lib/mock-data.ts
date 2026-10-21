import { 
  Organization, 
  User, 
  PipelineStage, 
  Lead, 
  Campaign, 
  LeadSource, 
  Tag, 
  Conversation, 
  Message, 
  Bot,
  Automation
} from '@/types'

export const mockOrganizations: Organization[] = [
  {
    id: 'org-agency-alpha',
    name: 'GrowthScale Agência',
    slug: 'growthscale',
    logo_url: '',
    created_at: new Date(Date.now() - 90 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'org-agency-beta',
    name: 'Vektor Mídia & Tráfego',
    slug: 'vektor',
    logo_url: '',
    created_at: new Date(Date.now() - 45 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  }
]

export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Guilherme Silva',
    email: 'gui@growthscale.com.br',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&auto=format&fit=crop&q=80',
    role: 'owner',
    created_at: new Date().toISOString()
  },
  {
    id: 'user-2',
    name: 'Beatriz Ramos',
    email: 'beatriz@growthscale.com.br',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&auto=format&fit=crop&q=80',
    role: 'admin',
    created_at: new Date().toISOString()
  },
  {
    id: 'user-3',
    name: 'Carlos Mendes',
    email: 'carlos@growthscale.com.br',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&auto=format&fit=crop&q=80',
    role: 'agent',
    created_at: new Date().toISOString()
  }
]

export const mockBots: Bot[] = [
  {
    id: 'bot-1',
    organization_id: 'org-agency-alpha',
    name: 'Atendente IA Principal',
    username: '@growthscale_lead_bot',
    token_masked: '739281••••••••••••••••••••••••••••••••',
    persona: 'Consultor comercial sênior focado em qualificação B2B e agendamento de reuniões.',
    status: 'active',
    webhook_url: 'https://crm.growthscale.com.br/api/telegram/bot-1/webhook',
    last_activity_at: new Date(Date.now() - 4 * 60000).toISOString(),
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'bot-2',
    organization_id: 'org-agency-alpha',
    name: 'Triagem Meta Ads',
    username: '@growthscale_promo_bot',
    token_masked: '618294••••••••••••••••••••••••••••••••',
    persona: 'Bot rápido de boas-vindas para campanhas de topo de funil.',
    status: 'active',
    webhook_url: 'https://crm.growthscale.com.br/api/telegram/bot-2/webhook',
    last_activity_at: new Date(Date.now() - 15 * 60000).toISOString(),
    created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  }
]

export const mockPipelineStages: PipelineStage[] = [
  { id: 'novo', name: 'Novo', order: 1, color: 'border-blue-500/50 text-blue-400' },
  { id: 'contato_feito', name: 'Contato Feito', order: 2, color: 'border-cyan-500/50 text-cyan-400' },
  { id: 'qualificado', name: 'Qualificado', order: 3, color: 'border-amber-500/50 text-amber-400' },
  { id: 'proposta_enviada', name: 'Proposta Enviada', order: 4, color: 'border-purple-500/50 text-purple-400' },
  { id: 'follow_up', name: 'Follow-up', order: 5, color: 'border-orange-500/50 text-orange-400' },
  { id: 'ganho', name: 'Ganho', order: 6, color: 'border-emerald-500/50 text-emerald-400' },
  { id: 'perdido', name: 'Perdido', order: 7, color: 'border-rose-500/50 text-rose-400' },
]

export const mockTags: Tag[] = [
  { id: 'tag-vip', organization_id: 'org-agency-alpha', name: 'Lead VIP', color: 'bg-magenta-500/10 text-pink-400 border-pink-500/30' },
  { id: 'tag-urgente', organization_id: 'org-agency-alpha', name: 'Urgente', color: 'bg-red-500/10 text-red-400 border-red-500/30' },
  { id: 'tag-orcamento-alto', organization_id: 'org-agency-alpha', name: 'Budget > 20k', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
  { id: 'tag-b2b', organization_id: 'org-agency-alpha', name: 'B2B SaaS', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
  { id: 'tag-infoproduto', organization_id: 'org-agency-alpha', name: 'Infoproduto', color: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
]

export const mockLeadSources: LeadSource[] = [
  { id: 'src-meta', name: 'Meta Ads', platform: 'meta' },
  { id: 'src-google', name: 'Google Ads', platform: 'google' },
  { id: 'src-tiktok', name: 'TikTok Ads', platform: 'tiktok' },
  { id: 'src-organic', name: 'Orgânico', platform: 'organic' },
  { id: 'src-referral', name: 'Indicação', platform: 'referral' }
]

export const mockCampaigns: Campaign[] = [
  {
    id: 'camp-1',
    organization_id: 'org-agency-alpha',
    name: '[Meta] Scale Conversão Topo - Video Criativo 03',
    platform: 'meta',
    objective: 'Geração de Cadastros Telegram',
    ad_set: 'Interesses Empreendedorismo + B2B',
    creative: 'Video_Explicativo_Vsl_v3',
    budget: 4500,
    cost: 3820,
    status: 'active',
    utms: {
      utm_source: 'meta',
      utm_medium: 'cpc',
      utm_campaign: 'black_scale_crm',
      utm_content: 'video_v3_case',
      utm_term: 'leads_telegram'
    },
    created_at: new Date(Date.now() - 20 * 86400000).toISOString()
  },
  {
    id: 'camp-2',
    organization_id: 'org-agency-alpha',
    name: '[Google] Search Fundo de Funil - CRM Telegram',
    platform: 'google',
    objective: 'Pesquisa Palavras-chave Exatas',
    ad_set: 'Palavra-chave CRM Telegram',
    creative: 'Anuncio_Responsivo_01',
    budget: 3000,
    cost: 2150,
    status: 'active',
    utms: {
      utm_source: 'google',
      utm_medium: 'cpc',
      utm_campaign: 'google_search_crm_bot',
      utm_content: 'headline_gestao_leads',
      utm_term: 'melhor_crm_telegram'
    },
    created_at: new Date(Date.now() - 15 * 86400000).toISOString()
  }
]

export const mockLeads: Lead[] = [
  {
    id: 'lead-1',
    organization_id: 'org-agency-alpha',
    name: 'Rodrigo Albuquerque',
    phone: '+55 11 98844-2211',
    email: 'rodrigo@alphaventures.com.br',
    telegram_chat_id: '94827163',
    telegram_username: '@rodrigo_alpha',
    source_id: 'src-meta',
    source: mockLeadSources[0],
    campaign_id: 'camp-1',
    campaign: mockCampaigns[0],
    stage: 'qualificado',
    score: 95,
    score_badge: 'vip',
    assigned_to: 'user-1',
    assigned_user: mockUsers[0],
    estimated_value: 38000,
    utms: mockCampaigns[0].utms,
    tags: [mockTags[0], mockTags[2], mockTags[3]],
    notes: 'Possui 3 times de tráfego gastando R$ 80k/mês em Meta Ads. Deseja unificar todo o fluxo de leads no Telegram com CRM e webhook.',
    last_interaction_at: new Date(Date.now() - 12 * 60000).toISOString(),
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'lead-2',
    organization_id: 'org-agency-alpha',
    name: 'Fernanda Martins',
    phone: '+55 21 97722-1144',
    email: 'fernanda@educaonline.com',
    telegram_chat_id: '81726354',
    telegram_username: '@fer_martins',
    source_id: 'src-google',
    source: mockLeadSources[1],
    campaign_id: 'camp-2',
    campaign: mockCampaigns[1],
    stage: 'proposta_enviada',
    score: 82,
    score_badge: 'quente',
    assigned_to: 'user-2',
    assigned_user: mockUsers[1],
    estimated_value: 15000,
    utms: mockCampaigns[1].utms,
    tags: [mockTags[4]],
    notes: 'Lançamento de produto digital na próxima quinzena. Precisa de automação de boas vindas e distribuição para atendentes.',
    last_interaction_at: new Date(Date.now() - 45 * 60000).toISOString(),
    created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'lead-3',
    organization_id: 'org-agency-alpha',
    name: 'Mateus Silveira',
    phone: '+55 31 99123-4567',
    email: 'mateus@logisticabrasil.com',
    telegram_chat_id: '72635491',
    telegram_username: '@mateus_silv',
    source_id: 'src-meta',
    source: mockLeadSources[0],
    campaign_id: 'camp-1',
    campaign: mockCampaigns[0],
    stage: 'novo',
    score: 65,
    score_badge: 'morno',
    assigned_to: 'user-3',
    assigned_user: mockUsers[2],
    estimated_value: 9000,
    utms: mockCampaigns[0].utms,
    tags: [mockTags[1]],
    notes: 'Acabou de clicar no anúncio e iniciou a conversa com o bot no Telegram.',
    last_interaction_at: new Date(Date.now() - 3 * 60000).toISOString(),
    created_at: new Date(Date.now() - 10 * 60000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'lead-4',
    organization_id: 'org-agency-alpha',
    name: 'Camila Duarte',
    phone: '+55 41 98455-9080',
    email: 'camila@clinicaestetica.com',
    telegram_chat_id: '63548291',
    telegram_username: '@camila_duarte_est',
    source_id: 'src-meta',
    source: mockLeadSources[0],
    stage: 'contato_feito',
    score: 48,
    score_badge: 'morno',
    assigned_to: 'user-3',
    assigned_user: mockUsers[2],
    estimated_value: 6500,
    tags: [],
    notes: 'Respondeu às perguntas iniciais do bot. Aguardando retorno da proposta básica.',
    last_interaction_at: new Date(Date.now() - 180 * 60000).toISOString(),
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'lead-5',
    organization_id: 'org-agency-alpha',
    name: 'Thiago Nogueira',
    phone: '+55 19 99311-5522',
    email: 'thiago@consultingtech.com.br',
    telegram_chat_id: '52637489',
    telegram_username: '@thiago_nog',
    source_id: 'src-google',
    source: mockLeadSources[1],
    campaign_id: 'camp-2',
    campaign: mockCampaigns[1],
    stage: 'ganho',
    score: 98,
    score_badge: 'vip',
    assigned_to: 'user-1',
    assigned_user: mockUsers[0],
    estimated_value: 45000,
    utms: mockCampaigns[1].utms,
    tags: [mockTags[0], mockTags[2]],
    notes: 'Contrato assinado para implementação e gestão de tráfego + bot.',
    last_interaction_at: new Date(Date.now() - 360 * 60000).toISOString(),
    created_at: new Date(Date.now() - 12 * 86400000).toISOString(),
    updated_at: new Date().toISOString()
  }
]

export const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    organization_id: 'org-agency-alpha',
    bot_id: 'bot-1',
    bot: mockBots[0],
    lead_id: 'lead-1',
    lead: mockLeads[0],
    status: 'in_human_service',
    assigned_to: 'user-1',
    assigned_user: mockUsers[0],
    last_message: 'Excelente Rodrigo, agendei a apresentação para amanhã às 15h.',
    last_message_at: new Date(Date.now() - 12 * 60000).toISOString(),
    unread_count: 0,
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'conv-2',
    organization_id: 'org-agency-alpha',
    bot_id: 'bot-1',
    bot: mockBots[0],
    lead_id: 'lead-3',
    lead: mockLeads[2],
    status: 'waiting_human',
    assigned_to: 'user-3',
    assigned_user: mockUsers[2],
    last_message: 'Gostaria de saber o valor para um plano corporativo.',
    last_message_at: new Date(Date.now() - 3 * 60000).toISOString(),
    unread_count: 2,
    created_at: new Date(Date.now() - 10 * 60000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'conv-3',
    organization_id: 'org-agency-alpha',
    bot_id: 'bot-2',
    bot: mockBots[1],
    lead_id: 'lead-4',
    lead: mockLeads[3],
    status: 'bot_active',
    assigned_to: 'user-3',
    assigned_user: mockUsers[2],
    last_message: 'Qual é a quantidade média de leads que você recebe por dia?',
    last_message_at: new Date(Date.now() - 180 * 60000).toISOString(),
    unread_count: 0,
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    updated_at: new Date().toISOString()
  }
]

export const mockMessages: Record<string, Message[]> = {
  'conv-1': [
    {
      id: 'msg-1',
      conversation_id: 'conv-1',
      lead_id: 'lead-1',
      sender_type: 'bot',
      message_type: 'text',
      text: 'Olá Rodrigo! Seja bem-vindo à GrowthScale. Vi que você veio pelo anúncio de Gestão de Tráfego & Leads no Telegram. Para direcionar você ao consultor certo, qual é o seu investimento mensal atual em anúncios?',
      created_at: new Date(Date.now() - 120 * 60000).toISOString()
    },
    {
      id: 'msg-2',
      conversation_id: 'conv-1',
      lead_id: 'lead-1',
      sender_type: 'lead',
      message_type: 'text',
      text: 'Olá! Hoje investimos por volta de 80 mil por mês entre Meta e Google. Nosso maior gargalo é que os leads demoram para ser atendidos no WhatsApp e queremos migrar a operação pro Telegram.',
      created_at: new Date(Date.now() - 95 * 60000).toISOString()
    },
    {
      id: 'msg-3',
      conversation_id: 'conv-1',
      lead_id: 'lead-1',
      sender_type: 'bot',
      message_type: 'text',
      text: 'Perfeito! Transferindo você agora para um de nossos sócios especialistas.',
      created_at: new Date(Date.now() - 94 * 60000).toISOString()
    },
    {
      id: 'msg-4',
      conversation_id: 'conv-1',
      lead_id: 'lead-1',
      sender_type: 'agent',
      message_type: 'text',
      text: 'Fala Rodrigo, Guilherme aqui! Vi seus dados e o volume de vocês. Com a nossa solução o lead cai no CRM em menos de 1 segundo após clicar no anúncio e clicar no Start.',
      created_at: new Date(Date.now() - 30 * 60000).toISOString()
    },
    {
      id: 'msg-5',
      conversation_id: 'conv-1',
      lead_id: 'lead-1',
      sender_type: 'lead',
      message_type: 'text',
      text: 'Sensacional Guilherme. Consegue me mostrar uma demo prática amanhã?',
      created_at: new Date(Date.now() - 20 * 60000).toISOString()
    },
    {
      id: 'msg-6',
      conversation_id: 'conv-1',
      lead_id: 'lead-1',
      sender_type: 'agent',
      message_type: 'text',
      text: 'Excelente Rodrigo, agendei a apresentação para amanhã às 15h.',
      created_at: new Date(Date.now() - 12 * 60000).toISOString()
    }
  ]
}

export const mockAutomations: Automation[] = [
  {
    id: 'aut-1',
    organization_id: 'org-agency-alpha',
    name: 'Qualificação Instantânea Meta Ads VIP',
    trigger: 'new_lead',
    condition: { utm_source: 'meta', budget_min: 20000 },
    action: 'apply_tag',
    action_config: { tag_id: 'tag-vip', notify_slack: true },
    active: true,
    last_executed_at: new Date(Date.now() - 10 * 60000).toISOString(),
    created_at: new Date(Date.now() - 30 * 86400000).toISOString()
  },
  {
    id: 'aut-2',
    organization_id: 'org-agency-alpha',
    name: 'Distribuição Round-Robin de Atendentes',
    trigger: 'stage_changed',
    condition: { target_stage: 'contato_feito' },
    action: 'assign_agent',
    action_config: { mode: 'round_robin', user_ids: ['user-1', 'user-2', 'user-3'] },
    active: true,
    last_executed_at: new Date(Date.now() - 60 * 60000).toISOString(),
    created_at: new Date(Date.now() - 25 * 86400000).toISOString()
  }
]
