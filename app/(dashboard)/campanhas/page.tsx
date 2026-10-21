'use client'

import { PagePlaceholder } from '@/components/shell/page-placeholder'

export default function CampanhasPage() {
  return (
    <PagePlaceholder
      title="Campanhas de Tráfego & Atribuição UTM"
      description="Rastreamento de campanhas Meta Ads, Google Ads e TikTok Ads com gerador automático de links de captação parametrizados para o Telegram."
      promptStep="Prompt 4"
      features={[
        'Tabela de campanhas com cálculo de CPL, leads qualificados e ROI',
        'Gerador de links de captação com utm_source, medium, campaign, content, term e telegram_start',
        'Botão copiar link gerado e QR Code de acesso direto',
        'Atribuição precisa do primeiro e último toque do anúncio',
        'Comparativo de conversão por criativo e público'
      ]}
    />
  )
}
