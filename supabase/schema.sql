-- ========================================================
-- LeadGram CRM - Schema Inicial PostgreSQL (Supabase)
-- Multi-tenant para Agências de Tráfego Pago & Telegram
-- ========================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ORGANIZATIONS (Agências / Contas Multi-tenant)
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    logo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. USERS & MEMBERS
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    role VARCHAR(50) DEFAULT 'member', -- owner, admin, member, agent
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.organization_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'member',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(organization_id, user_id)
);

-- 3. BOTS (Telegram Bot API)
CREATE TABLE IF NOT EXISTS public.bots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    username VARCHAR(100) NOT NULL,
    token TEXT NOT NULL, -- armazenado de forma segura no servidor
    persona TEXT,
    status VARCHAR(50) DEFAULT 'active', -- active, paused, error, disconnected
    webhook_url TEXT,
    last_activity_at TIMESTAMPTZ,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. LEAD SOURCES
CREATE TABLE IF NOT EXISTS public.lead_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    platform VARCHAR(50) NOT NULL, -- meta, google, tiktok, organic, referral, other
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CAMPAIGNS & TRAFFIC ATTRIBUTION
CREATE TABLE IF NOT EXISTS public.campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    platform VARCHAR(50) NOT NULL, -- meta, google, tiktok, etc.
    objective VARCHAR(150),
    ad_set VARCHAR(255),
    creative VARCHAR(255),
    budget NUMERIC(12,2) DEFAULT 0,
    cost NUMERIC(12,2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'active',
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(150),
    utm_content VARCHAR(150),
    utm_term VARCHAR(150),
    telegram_start VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. PIPELINE STAGES
CREATE TABLE IF NOT EXISTS public.pipeline_stages (
    id VARCHAR(50) PRIMARY KEY, -- novo, contato_feito, qualificado, proposta_enviada, follow_up, ganho, perdido
    name VARCHAR(100) NOT NULL,
    sort_order INT NOT NULL,
    color VARCHAR(50) DEFAULT '#22d3ee'
);

-- 7. LEADS
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    email VARCHAR(255),
    telegram_chat_id BIGINT,
    telegram_username VARCHAR(100),
    source_id UUID REFERENCES public.lead_sources(id),
    campaign_id UUID REFERENCES public.campaigns(id),
    stage VARCHAR(50) NOT NULL DEFAULT 'novo' REFERENCES public.pipeline_stages(id),
    score INT DEFAULT 0 CHECK (score >= 0 AND score <= 100),
    score_badge VARCHAR(20) DEFAULT 'frio', -- frio, morno, quente, vip
    assigned_to UUID REFERENCES public.users(id),
    estimated_value NUMERIC(12,2) DEFAULT 0,
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(150),
    utm_content VARCHAR(150),
    utm_term VARCHAR(150),
    telegram_start VARCHAR(100),
    notes TEXT,
    last_interaction_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. TAGS & LEAD_TAGS
CREATE TABLE IF NOT EXISTS public.tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    color VARCHAR(50) DEFAULT '#22d3ee',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.lead_tags (
    lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
    PRIMARY KEY(lead_id, tag_id)
);

-- 9. CONVERSATIONS & MESSAGES
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    bot_id UUID REFERENCES public.bots(id) ON DELETE SET NULL,
    lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'bot_active', -- bot_active, waiting_human, in_human_service, closed
    assigned_to UUID REFERENCES public.users(id),
    last_message TEXT,
    last_message_at TIMESTAMPTZ DEFAULT NOW(),
    unread_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
    sender_type VARCHAR(20) NOT NULL, -- lead, bot, agent
    message_type VARCHAR(20) DEFAULT 'text', -- text, photo, video, audio, document, location
    text TEXT,
    media_url TEXT,
    caption TEXT,
    telegram_message_id BIGINT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. TASKS & FOLLOW-UPS
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
    assigned_to UUID NOT NULL REFERENCES public.users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date TIMESTAMPTZ NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. LEAD EVENTS (Histórico & Auditoria)
CREATE TABLE IF NOT EXISTS public.lead_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    user_id UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. WEBHOOK EVENTS & LOGS
CREATE TABLE IF NOT EXISTS public.webhook_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    bot_id UUID REFERENCES public.bots(id),
    direction VARCHAR(20) NOT NULL, -- inbound, outbound
    event_type VARCHAR(100) NOT NULL,
    status_code INT NOT NULL,
    payload JSONB NOT NULL,
    response_body JSONB,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. AUTOMATIONS
CREATE TABLE IF NOT EXISTS public.automations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    trigger VARCHAR(100) NOT NULL,
    condition JSONB DEFAULT '{}'::jsonb,
    action VARCHAR(100) NOT NULL,
    action_config JSONB DEFAULT '{}'::jsonb,
    active BOOLEAN DEFAULT TRUE,
    last_executed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) on key tables
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automations ENABLE ROW LEVEL SECURITY;

-- Indexing for high-speed queries by organization_id & telegram_chat_id
CREATE INDEX IF NOT EXISTS idx_leads_organization ON public.leads(organization_id);
CREATE INDEX IF NOT EXISTS idx_leads_telegram_chat ON public.leads(telegram_chat_id);
CREATE INDEX IF NOT EXISTS idx_conversations_org ON public.conversations(organization_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id);
