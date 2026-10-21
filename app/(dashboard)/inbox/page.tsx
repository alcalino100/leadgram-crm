'use client'

import { PagePlaceholder } from '@/components/shell/page-placeholder'

export default function InboxPage() {
  return (
    <PagePlaceholder
      title="Inbox Telegram & Atendimento Humano"
      description="Interface em 3 colunas para acompanhamento das conversas do bot, intervenção humana em tempo real e visualização de contexto do lead."
      promptStep="Prompt 3"
      features={[
        'Layout 3 colunas: Lista de conversas, Chat timeline e Contexto do lead',
        'Alternância entre bot ativo e atendimento humano com 1 clique',
        'Suporte a texto, fotos, vídeos, áudios e documentos do Telegram',
        'Filtros por status, bot, responsável e leads quentes',
        'Painel lateral com dados do lead, score, UTMs da campanha e notas',
        'Arquitetura preparada para Supabase Realtime'
      ]}
    />
  )
}
