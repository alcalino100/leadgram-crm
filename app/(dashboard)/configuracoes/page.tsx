'use client'

import { PagePlaceholder } from '@/components/shell/page-placeholder'

export default function ConfiguracoesPage() {
  return (
    <PagePlaceholder
      title="Configurações da Agência"
      description="Gerenciamento de membros da equipe, bots Telegram, webhooks e parâmetros de qualificação de leads."
      promptStep="Configurações"
      features={[
        'Membros e permissões (Owner, Admin, Member, Agent)',
        'Conexão de bots Telegram e tokens de API',
        'Configuração de regras de cálculo de Lead Score (0 a 100)',
        'Webhooks de entrada e saída com chaves secretas',
        'Personalização de estágios do pipeline e tags'
      ]}
    />
  )
}
