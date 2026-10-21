// ========================================================
// Firebot API Service (https://firebotbr.com/docs)
// Integração Oficial de Pagamentos PIX & Telegram Chat
// ========================================================

const FIREBOT_API_BASE = process.env.FIREBOT_API_BASE || 'https://firebotbr.com/api/v1'
const FIREBOT_KEY = process.env.FIREBOT_PRIVATE_KEY || 'fire_sk_live_7e4b8474d68219d5c7011d3f16eb52ea38aba187'

export interface FirebotCustomer {
  name: string
  email: string
  cpf?: string
  phone?: string
}

export interface CreatePixParams {
  amount: number
  description: string
  customer: FirebotCustomer
  storeUrl?: string
  productType?: 'DIGITAL' | 'PHYSICAL'
  qrStyle?: 'default' | 'plain' | 'custom'
}

export interface FirebotPixResponse {
  success: boolean
  transactionId?: string
  saleId?: string
  acquirer?: string
  amount?: number
  pixCopiaECola?: string
  qrCodeUrl?: string
  status?: string
  createdAt?: string
  message?: string
  error?: string
}

/**
 * Cria cobrança PIX instantânea na Firebot
 */
export async function createFirebotPix(params: CreatePixParams): Promise<FirebotPixResponse> {
  try {
    // Sanitizar CPF para apenas dígitos (mínimo 11 caracteres)
    let cleanCpf = (params.customer.cpf || '12345678900').replace(/\D/g, '')
    if (cleanCpf.length !== 11 && cleanCpf.length !== 14) {
      cleanCpf = '12345678900'
    }

    // Sanitizar telefone celular
    let cleanPhone = (params.customer.phone || '11999998888').replace(/\D/g, '')
    if (cleanPhone.length < 10) {
      cleanPhone = '11999998888'
    }

    const payload = {
      amount: Number(params.amount.toFixed(2)),
      productType: params.productType || 'DIGITAL',
      description: params.description,
      storeUrl: params.storeUrl || 'https://crm.growthscale.com.br/checkout',
      customer: {
        name: params.customer.name || 'Cliente Telegram',
        email: params.customer.email || 'lead@email.com',
        cpf: cleanCpf,
        phone: cleanPhone,
      },
      qrStyle: params.qrStyle || 'plain',
    }

    const res = await fetch(`${FIREBOT_API_BASE}/pix/create`, {
      method: 'POST',
      headers: {
        'x-api-key': FIREBOT_KEY,
        'content-type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const data = await res.json()
    return data
  } catch (error: any) {
    console.error('[Firebot createPix Error]:', error)
    return {
      success: false,
      error: error.message || 'Erro ao conectar à API da Firebot',
    }
  }
}

/**
 * Consulta o status de uma transação PIX na Firebot pelo ID
 */
export async function getFirebotPixStatus(transactionId: string): Promise<any> {
  try {
    const res = await fetch(`${FIREBOT_API_BASE}/pix/${transactionId}`, {
      headers: {
        'x-api-key': FIREBOT_KEY,
        accept: 'application/json',
      },
    })
    return await res.json()
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

/**
 * Consulta os dados da conta Firebot
 */
export async function getFirebotAccount(): Promise<any> {
  try {
    const res = await fetch(`${FIREBOT_API_BASE}/account`, {
      headers: {
        'x-api-key': FIREBOT_KEY,
        accept: 'application/json',
      },
    })
    return await res.json()
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

/**
 * Consulta o saldo da conta Firebot
 */
export async function getFirebotBalance(): Promise<any> {
  try {
    const res = await fetch(`${FIREBOT_API_BASE}/balance`, {
      headers: {
        'x-api-key': FIREBOT_KEY,
        accept: 'application/json',
      },
    })
    return await res.json()
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
