'use client'

import * as React from 'react'
import { Link2, Copy, Check, Sparkles, QrCode, ExternalLink, Bot } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

export function UtmLinkGenerator() {
  const [platform, setPlatform] = React.useState('meta')
  const [botUsername, setBotUsername] = React.useState('growthscale_lead_bot')
  const [utmSource, setUtmSource] = React.useState('meta')
  const [utmMedium, setUtmMedium] = React.useState('cpc')
  const [utmCampaign, setUtmCampaign] = React.useState('black_scale_crm')
  const [utmContent, setUtmContent] = React.useState('video_v3_case')
  const [utmTerm, setUtmTerm] = React.useState('leads_telegram')
  const [landingUrl, setLandingUrl] = React.useState('https://agencia.com.br/lp')
  const [copiedType, setCopiedType] = React.useState<string | null>(null)

  // Auto-sync source when platform changes
  const handlePlatformChange = (p: string) => {
    setPlatform(p)
    if (p === 'meta') {
      setUtmSource('meta')
      setUtmMedium('cpc')
    } else if (p === 'google') {
      setUtmSource('google')
      setUtmMedium('cpc')
    } else if (p === 'tiktok') {
      setUtmSource('tiktok')
      setUtmMedium('cpc')
    } else if (p === 'organic') {
      setUtmSource('instagram_bio')
      setUtmMedium('organic')
    } else if (p === 'referral') {
      setUtmSource('indicacao')
      setUtmMedium('partner')
    }
  }

  // Telegram deep link payload: maximum 64 chars, base64 or encoded
  const telegramStartPayload = `${utmSource}__${utmCampaign}__${utmContent}`.replace(/[^a-zA-Z0-9_]/g, '_').substring(0, 64)
  const cleanBot = botUsername.replace('@', '').trim()

  const generatedTelegramLink = `https://t.me/${cleanBot}?start=${telegramStartPayload}`

  const generatedLandingLink = `${landingUrl}?utm_source=${encodeURIComponent(utmSource)}&utm_medium=${encodeURIComponent(
    utmMedium
  )}&utm_campaign=${encodeURIComponent(utmCampaign)}&utm_content=${encodeURIComponent(
    utmContent
  )}&utm_term=${encodeURIComponent(utmTerm)}&telegram_start=${telegramStartPayload}`

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopiedType(type)
    toast.success('Link copiado com sucesso!', {
      description: 'Pronto para ser colado no Gerenciador de Anúncios.',
    })
    setTimeout(() => setCopiedType(null), 2500)
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-800">
        <div>
          <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
            <span className="p-1 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Link2 className="h-4 w-4" />
            </span>
            Gerador de Links de Captação & Parâmetros Telegram
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Crie links parametrizados que transmitem os dados do anúncio diretamente para o bot do Telegram via parâmetro <code className="text-cyan-400 font-mono-code">?start=...</code>
          </p>
        </div>

        <Badge variant="outline" className="font-mono-code text-[10px] text-cyan-400 border-cyan-500/30">
          Atribuição 100% Rastreada
        </Badge>
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Platform Selector */}
        <div className="space-y-1">
          <label className="text-[10px] font-semibold uppercase text-zinc-400">Canal / Plataforma</label>
          <select
            value={platform}
            onChange={(e) => handlePlatformChange(e.target.value)}
            className="w-full h-8 rounded-md bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 px-2 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          >
            <option value="meta">Meta Ads (Instagram / Facebook)</option>
            <option value="google">Google Ads (Search / Display / YT)</option>
            <option value="tiktok">TikTok Ads</option>
            <option value="organic">Orgânico / Link da Bio</option>
            <option value="referral">Indicação / Parcerias</option>
          </select>
        </div>

        {/* Telegram Bot Handle */}
        <div className="space-y-1">
          <label className="text-[10px] font-semibold uppercase text-zinc-400">Bot Telegram</label>
          <Input
            value={botUsername}
            onChange={(e) => setBotUsername(e.target.value)}
            placeholder="@seu_bot"
            className="font-mono-code text-xs"
          />
        </div>

        {/* UTM Source */}
        <div className="space-y-1">
          <label className="text-[10px] font-semibold uppercase text-zinc-400">utm_source</label>
          <Input
            value={utmSource}
            onChange={(e) => setUtmSource(e.target.value)}
            placeholder="meta"
            className="font-mono-code text-xs"
          />
        </div>

        {/* UTM Medium */}
        <div className="space-y-1">
          <label className="text-[10px] font-semibold uppercase text-zinc-400">utm_medium</label>
          <Input
            value={utmMedium}
            onChange={(e) => setUtmMedium(e.target.value)}
            placeholder="cpc"
            className="font-mono-code text-xs"
          />
        </div>

        {/* UTM Campaign */}
        <div className="space-y-1 sm:col-span-2">
          <label className="text-[10px] font-semibold uppercase text-zinc-400">utm_campaign (Nome da Campanha)</label>
          <Input
            value={utmCampaign}
            onChange={(e) => setUtmCampaign(e.target.value)}
            placeholder="escala_topo_funil"
            className="font-mono-code text-xs"
          />
        </div>

        {/* UTM Content (Criativo) */}
        <div className="space-y-1">
          <label className="text-[10px] font-semibold uppercase text-zinc-400">utm_content (Criativo / VSL)</label>
          <Input
            value={utmContent}
            onChange={(e) => setUtmContent(e.target.value)}
            placeholder="video_v1"
            className="font-mono-code text-xs"
          />
        </div>

        {/* UTM Term (Público / Keyword) */}
        <div className="space-y-1">
          <label className="text-[10px] font-semibold uppercase text-zinc-400">utm_term (Público / Keyword)</label>
          <Input
            value={utmTerm}
            onChange={(e) => setUtmTerm(e.target.value)}
            placeholder="interesses_b2b"
            className="font-mono-code text-xs"
          />
        </div>
      </div>

      {/* Output Links Section */}
      <div className="space-y-3 pt-3 border-t border-zinc-800">
        {/* 1. Direct Telegram Bot Deep Link */}
        <div className="p-3.5 rounded-lg bg-zinc-950 border border-cyan-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-cyan-400 flex items-center gap-1.5">
              <Bot className="h-4 w-4" /> Link Direto para Anúncio no Telegram (Recomendado)
            </span>
            <span className="text-[10px] font-mono-code text-zinc-400">
              Payload: <code className="text-cyan-300">{telegramStartPayload}</code>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <input
              readOnly
              value={generatedTelegramLink}
              className="flex-1 bg-zinc-900 border border-zinc-800 rounded-md px-3 py-1.5 text-xs font-mono-code text-zinc-200 focus:outline-none"
            />
            <Button
              size="sm"
              onClick={() => copyToClipboard(generatedTelegramLink, 'telegram')}
              className="bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-semibold gap-1.5 shrink-0 h-8"
            >
              {copiedType === 'telegram' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedType === 'telegram' ? 'Copiado!' : 'Copiar Link'}</span>
            </Button>
          </div>
          <p className="text-[10px] text-zinc-400">
            Cole este link como destino do anúncio no Meta Ads ou Google. O usuário clica e cai direto com os parâmetros prontos.
          </p>
        </div>

        {/* 2. Landing Page UTM Link */}
        <div className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              <ExternalLink className="h-4 w-4 text-zinc-400" /> Link de Landing Page com UTMs Completas
            </span>
          </div>

          <div className="flex items-center gap-2">
            <input
              readOnly
              value={generatedLandingLink}
              className="flex-1 bg-zinc-900 border border-zinc-800 rounded-md px-3 py-1.5 text-xs font-mono-code text-zinc-400 focus:outline-none truncate"
            />
            <Button
              size="sm"
              variant="outline"
              onClick={() => copyToClipboard(generatedLandingLink, 'landing')}
              className="gap-1.5 shrink-0 h-8"
            >
              {copiedType === 'landing' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedType === 'landing' ? 'Copiado!' : 'Copiar'}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
