'use client'

import { PagePlaceholder } from '@/components/shell/page-placeholder'

export default function RelatoriosPage() {
  return (
    <PagePlaceholder
      title="Relatórios & Business Intelligence"
      description="Dashboard de métricas de tráfego pago, funil de conversão, CPL e desempenho da equipe comercial."
      promptStep="Prompt 4"
      features={[
        'Cards de KPI: Novos Leads, CPL, Taxa de Qualificação, Vendas, Receita e ROI',
        'Gráfico Recharts de novos leads por dia e por canal de tráfego',
        'Gráfico de funil de conversão por estágio do pipeline',
        'Tempo médio de primeira resposta por atendente e por bot',
        'Filtros por período pré-definido (Hoje, 7d, 30d, Personalizado)'
      ]}
    />
  )
}
