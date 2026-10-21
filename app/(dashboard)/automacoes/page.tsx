'use client'

import { PagePlaceholder } from '@/components/shell/page-placeholder'

export default function AutomacoesPage() {
  return (
    <PagePlaceholder
      title="Automações de Tráfego & Telegram"
      description="Gatilhos e regras de distribuição, qualificação automática, aplicação de tags e alertas comerciais."
      promptStep="Prompt 5"
      features={[
        'Gatilhos: novo lead, mensagem recebida, palavra-chave, tag aplicada, sem resposta',
        'Ações: aplicar tag, mudar estágio, atribuir atendente, enviar mensagem Telegram, chamar webhook',
        'Histórico e logs de execuções das regras automáticas',
        'Distribuição em rodízio (Round-Robin) entre atendentes da equipe',
        'Integração nativa com n8n, Make e webhooks externos'
      ]}
    />
  )
}
