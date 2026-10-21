import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 })
    }

    // Limite de 25MB
    if (file.size > 25 * 1024 * 1024) {
      return NextResponse.json({ error: 'Arquivo excede o limite de 25MB' }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Garantir que o bucket 'media' existe
    const { data: buckets } = await supabase.storage.listBuckets()
    if (!buckets?.some((b) => b.name === 'media')) {
      await supabase.storage.createBucket('media', { public: true })
    }

    // Sanitizar nome do arquivo e criar path único
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const filePath = `uploads/${Date.now()}_${cleanFileName}`

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(filePath, buffer, {
        contentType: file.type || 'image/jpeg',
        upsert: true,
      })

    if (uploadError) {
      console.error('[Upload Storage Error]:', uploadError)
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    const { data: publicData } = supabase.storage.from('media').getPublicUrl(filePath)

    return NextResponse.json({
      success: true,
      url: publicData.publicUrl,
      fileName: file.name,
      fileSize: file.size,
      contentType: file.type,
    })
  } catch (error: any) {
    console.error('[Upload API Error]:', error)
    return NextResponse.json({ error: error.message || 'Erro ao processar upload' }, { status: 500 })
  }
}
