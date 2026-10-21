import { Lead, ScoreBadge } from '@/types'

export interface QualificationBreakdown {
  paidSourceScore: number
  telegramScore: number
  pipelineScore: number
  tagsScore: number
  utmScore: number
  total: number
  badge: ScoreBadge
}

export function calculateLeadScore(lead: Partial<Lead>): QualificationBreakdown {
  let paidSourceScore = 0
  let telegramScore = 0
  let pipelineScore = 0
  let tagsScore = 0
  let utmScore = 0

  // 1. Origem de tráfego (até 25 pontos)
  if (lead.source?.platform === 'meta' || lead.source?.platform === 'google') {
    paidSourceScore = 20
  } else if (lead.source?.platform === 'tiktok') {
    paidSourceScore = 15
  } else if (lead.source?.platform === 'referral') {
    paidSourceScore = 25
  } else {
    paidSourceScore = 10
  }

  // 2. Parâmetros de campanha & UTMs (até 15 pontos)
  if (lead.utms?.utm_campaign || lead.campaign_id) {
    utmScore += 10
  }
  if (lead.utms?.utm_content || lead.utms?.utm_term) {
    utmScore += 5
  }

  // 3. Interações & Presença no Telegram (até 20 pontos)
  if (lead.telegram_chat_id) {
    telegramScore += 10
  }
  if (lead.telegram_username) {
    telegramScore += 10
  }

  // 4. Tags qualificadoras (até 25 pontos)
  if (lead.tags && lead.tags.length > 0) {
    for (const tag of lead.tags) {
      if (tag.id === 'tag-vip') tagsScore += 15
      else if (tag.id === 'tag-orcamento-alto') tagsScore += 15
      else if (tag.id === 'tag-urgente') tagsScore += 10
      else if (tag.id === 'tag-b2b') tagsScore += 5
      else tagsScore += 3
    }
  }
  tagsScore = Math.min(tagsScore, 25)

  // 5. Estágio atual do pipeline (até 20 pontos)
  switch (lead.stage) {
    case 'ganho':
      pipelineScore = 20
      break
    case 'proposta_enviada':
      pipelineScore = 18
      break
    case 'qualificado':
      pipelineScore = 15
      break
    case 'follow_up':
      pipelineScore = 12
      break
    case 'contato_feito':
      pipelineScore = 8
      break
    case 'novo':
      pipelineScore = 5
      break
    case 'perdido':
      pipelineScore = 0
      break
    default:
      pipelineScore = 5
  }

  const rawTotal = paidSourceScore + telegramScore + pipelineScore + tagsScore + utmScore
  const total = Math.min(Math.max(rawTotal, 0), 100)

  // Badge classification
  let badge: ScoreBadge = 'frio'
  if (total >= 90) {
    badge = 'vip'
  } else if (total >= 70) {
    badge = 'quente'
  } else if (total >= 40) {
    badge = 'morno'
  } else {
    badge = 'frio'
  }

  return {
    paidSourceScore,
    telegramScore,
    pipelineScore,
    tagsScore,
    utmScore,
    total,
    badge
  }
}
