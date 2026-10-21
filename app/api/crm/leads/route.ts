import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(req: NextRequest) {
  try {
    const supabase = createAdminClient()
    const { searchParams } = new URL(req.url)
    const stage = searchParams.get('stage')
    const search = searchParams.get('search')

    let query = supabase
      .from('leads')
      .select('*, pipeline_stages(*)')
      .order('created_at', { ascending: false })

    if (stage && stage !== 'all') {
      query = query.eq('stage', stage)
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%,telegram_username.ilike.%${search}%`)
    }

    const { data: leads, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ leads: leads || [] })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createAdminClient()
    const body = await req.json()

    // Obter primeira organização se não fornecida
    if (!body.organization_id) {
      const { data: org } = await supabase.from('organizations').select('id').limit(1).single()
      body.organization_id = org?.id || 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d'
    }

    const { data, error } = await supabase
      .from('leads')
      .insert(body)
      .select('*, pipeline_stages(*)')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ lead: data }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
