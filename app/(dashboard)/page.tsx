'use client'

import * as React from 'react'
import Link from 'next/link'
import { 
  Users, 
  MessageSquare, 
  DollarSign, 
  ArrowUpRight, 
  Bot, 
  Flame, 
  Sparkles, 
  Lock, 
  CheckCircle2, 
  Zap, 
  ShieldCheck, 
  Plus,
  Play
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAppStore } from '@/lib/store'

export default function DashboardOverviewPage() {
  const { currentOrganization, leads, bots } = useAppStore()

  // Métricas 100% Reais
  const totalLeads = leads.length
  const hotLeads = leads.filter((l) => l.score_badge === 'quente' || l.score_badge === 'vip').length
  const wonLeads = leads.filter((l) => l.stage === 'ganho' || l.stage === 'vip_ativo')
  const totalWonRevenue = wonLeads.reduce((acc, l) => acc + (Number(l.estimated_value) || 0), 0)
  const totalNegotiation = leads.reduce((acc, l) => acc + (Number(l.estimated_value) || 0), 0)
  const connectedBotsCount = bots.length

  return (
    <div className="space-y-6">
      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-zinc-100">Visão Geral do CRM</h1>
            <Badge variant="outline" className="font-mono-code text-[10px] text-pink-400 border-pink-500/30">
              {currentOrganization?.name || 'Agência VIP Digital'}
            </Badge>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Métricas em tempo real de tráfego pago, prévias e conversões PIX no Telegram
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/pipeline" className="flex items-center gap-1.5">
              <span>Pipeline VIP</span>
              <ArrowUpRight className="h-3.5 w-3.5 text-zinc-400" />
            </Link>
          </Button>

          <Button asChild size="sm" className="bg-pink-600 hover:bg-pink-500 text-white font-semibold">
            <Link href="/inbox" className="flex items-center gap-1.5">
              <MessageSquare className="h-3.5 w-3.5" />
              <span>Abrir Inbox</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid - Dados 100% Reais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Contatos / Leads */}
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 relative overflow-hidden group hover:border-zinc-700/80 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Total de Contatos</span>
            <div className="p-1.5 rounded-lg bg-pink-500/10 text-pink-400">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-zinc-100 font-mono-code">{totalLeads}</span>
            <span className="text-[11px] font-medium text-zinc-500">
              {totalLeads > 0 ? 'contatos no banco' : 'Nenhum contato ainda'}
            </span>
          </div>
          <p className="text-[10px] text-zinc-500 mt-1">Meta Ads, Google Ads & Tráfego Direto</p>
        </div>

        {/* Interessados Quentes / VIPs */}
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 relative overflow-hidden group hover:border-zinc-700/80 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Interessados VIP & Quentes</span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Flame className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-amber-400 font-mono-code">{hotLeads}</span>
            <span className="text-[11px] font-medium text-zinc-500">Score &gt; 80</span>
          </div>
          <p className="text-[10px] text-zinc-500 mt-1">Pediram prévia ou solicitaram PIX</p>
        </div>

        {/* Faturamento Confirmado */}
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 relative overflow-hidden group hover:border-zinc-700/80 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Faturamento Confirmado</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-emerald-400 font-mono-code">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalWonRevenue)}
            </span>
          </div>
          <p className="text-[10px] text-zinc-500 mt-1">
            {wonLeads.length > 0 ? `${wonLeads.length} assinatura(s) / pack(s) pagos` : 'R$ 0,00 via PIX Firebot'}
          </p>
        </div>

        {/* Bots Conectados (REAL: 0 se não houver bots) */}
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 relative overflow-hidden group hover:border-zinc-700/80 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Bots Telegram Ativos</span>
            <div className={`p-1.5 rounded-lg ${connectedBotsCount > 0 ? 'bg-cyan-500/10 text-cyan-400' : 'bg-zinc-800 text-zinc-500'}`}>
              <Bot className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className={`text-2xl font-bold tracking-tight font-mono-code ${connectedBotsCount > 0 ? 'text-cyan-400' : 'text-zinc-500'}`}>
              {connectedBotsCount}
            </span>
            <span className="text-[11px] font-medium text-zinc-500">
              {connectedBotsCount > 0 ? 'Conectado(s)' : 'Nenhum bot conectado'}
            </span>
          </div>
          <p className="text-[10px] text-zinc-500 mt-1">
            {connectedBotsCount > 0 ? 'Disparando prévias e PIX' : 'Clique em Bots para conectar seu token'}
          </p>
        </div>
      </div>

      {/* Main Grid: Últimos Contatos Captados & Ações Rápidas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Tabela de Contatos Recentes */}
        <div className="lg:col-span-2 rounded-xl border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-xs overflow-hidden">
          <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-zinc-200">Últimos Contatos Recebidos</h2>
              <p className="text-[11px] text-zinc-400">Entradas automáticas via tráfego e Telegram</p>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/leads" className="text-xs text-pink-400 hover:text-pink-300">
                Ver todos ({totalLeads}) →
              </Link>
            </Button>
          </div>

          {leads.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center justify-center">
              <div className="h-12 w-12 rounded-full bg-zinc-800/80 flex items-center justify-center text-zinc-500 mb-3">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-medium text-zinc-300">Nenhum contato registrado ainda</h3>
              <p className="text-xs text-zinc-500 max-w-sm mt-1">
                Seus anúncios e bots do Telegram alimentarão essa lista automaticamente quando os clientes enviarem mensagem.
              </p>
              <div className="mt-4 flex gap-2">
                <Button asChild size="sm" variant="outline" className="text-xs">
                  <Link href="/bots">Conectar Bot Telegram</Link>
                </Button>
                <Button asChild size="sm" className="bg-pink-600 hover:bg-pink-500 text-xs">
                  <Link href="/leads">Criar Lead Manual</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-zinc-800/60 overflow-x-auto">
              {leads.slice(0, 5).map((lead) => (
                <div key={lead.id} className="p-4 flex items-center justify-between hover:bg-zinc-800/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-pink-500/10 border border-pink-500/20 flex items-center justify-center font-bold text-xs text-pink-400">
                      {lead.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-zinc-200">{lead.name}</span>
                        {lead.telegram_username && (
                          <span className="text-[11px] font-mono-code text-zinc-500">{lead.telegram_username}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] text-zinc-400">
                          {lead.utm_source ? `Origem: ${lead.utm_source}` : 'Direto Telegram'}
                        </span>
                        <span className="text-zinc-600">•</span>
                        <span className="text-[11px] text-pink-400 capitalize">{lead.stage.replace('_', ' ')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-mono-code font-bold text-zinc-200">
                      {lead.estimated_value ? `R$ ${lead.estimated_value}` : 'Sem valor'}
                    </span>
                    <p className="text-[10px] text-zinc-500">Score {lead.score || 0} pts</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Col: Painel de Ações e Integrações */}
        <div className="space-y-4">
          {/* Status do Gateway PIX */}
          <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <span className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-emerald-400" /> Gateway Firebot PIX
              </span>
              <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                Live & Ativo
              </Badge>
            </div>
            <div className="mt-3 space-y-2">
              <p className="text-xs text-zinc-400">
                Geração de PIX Copia e Cola e QR Code funcionando em tempo real.
              </p>
              <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/60 font-mono-code text-[11px] text-zinc-400 flex items-center justify-between">
                <span>Webhook Baixa:</span>
                <span className="text-emerald-400 font-semibold">/api/firebot/webhook</span>
              </div>
            </div>
          </div>

          {/* Atalhos Rápidos */}
          <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 space-y-3">
            <h3 className="text-xs font-semibold text-zinc-200">Operações Rápidas</h3>
            <div className="grid grid-cols-1 gap-2">
              <Button asChild variant="outline" size="sm" className="justify-start text-xs border-zinc-800 hover:bg-zinc-800">
                <Link href="/automacoes" className="flex items-center gap-2">
                  <Play className="h-3.5 w-3.5 text-pink-400" />
                  <span>Gerenciar Fluxos de Automação</span>
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="justify-start text-xs border-zinc-800 hover:bg-zinc-800">
                <Link href="/campanhas" className="flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Gerar Link Telegram com UTM</span>
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="justify-start text-xs border-zinc-800 hover:bg-zinc-800">
                <Link href="/webhooks" className="flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
                  <span>Configurar Conexões Webhook</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
