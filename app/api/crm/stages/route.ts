import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET() {
  try {
    const supabase = createAdminClient()
    const { data: stages, error } = await supabase
      .from('pipeline_stages')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ stages: stages || [] })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createAdminClient()
    const body = await req.json()
    const { id, name, sort_order, color = '#22d3ee' } = body

    if (!name) {
      return NextResponse.json({ error: 'Nome do estágio é obrigatório' }, { status: 400 })
    }

    const stageId = id || name.toLowerCase().replace(/[^a-z0-9]/g, '_')

    // Obter maior sort_order se não especificado
    let order = sort_order
    if (order === undefined) {
      const { data: maxStage } = await supabase
        .from('pipeline_stages')
        .select('sort_order')
        .order('sort_order', { ascending: false })
        .limit(1)
        .single()
      order = (maxStage?.sort_order || 0) + 1
    }

    const { data, error } = await supabase
      .from('pipeline_stages')
      .insert({
        id: stageId,
        name,
        sort_order: order,
        color,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, stage: data }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const supabase = createAdminClient()
    const body = await req.json()
    const { id, name, color, sort_order } = body

    if (!id) {
      return NextResponse.json({ error: 'ID do estágio é obrigatório' }, { status: 400 })
    }

    const updates: Record<string, any> = {}
    if (name !== undefined) updates.name = name
    if (color !== undefined) updates.color = color
    if (sort_order !== undefined) updates.sort_order = sort_order

    const { data, error } = await supabase
      .from('pipeline_stages')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, stage: data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const supabase = createAdminClient()
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID do estágio é obrigatório' }, { status: 400 })
    }

    // Verificar se há leads vinculados a este estágio
    const { count } = await supabase
      .from('leads')
      .select('id', { count: 'exact', head: true })
      .eq('stage', id)

    if (count && count > 0) {
      return NextResponse.json(
        { error: `Não é possível excluir este estágio pois existem ${count} lead(s) nele. Mova os leads antes de excluir.` },
        { status: 400 }
      )
    }

    const { error } = await supabase.from('pipeline_stages').delete().eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, deleted_id: id })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
