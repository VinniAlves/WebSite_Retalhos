import { getApiBase } from '../config/env'

export class ApiError extends Error {
  status: number
  body: unknown

  constructor(message: string, status: number, body: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}

async function parseJsonSafe(res: Response): Promise<unknown> {
  const text = await res.text()
  if (!text) return null
  try {
    return JSON.parse(text) as unknown
  } catch {
    return text
  }
}

export async function apiJson<T>(
  path: string,
  init?: RequestInit & { json?: unknown }
): Promise<T> {
  const base = getApiBase()
  const url = `${base}${path.startsWith('/') ? '' : '/'}${path}`
  const token = localStorage.getItem('@Auth:token')
  const headers: HeadersInit = {
    Accept: 'application/json',
    ...(init?.json !== undefined ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((init?.headers as Record<string, string>) || {}),
  }
  const { json, ...rest } = init || {}
  const res = await fetch(url, {
    ...rest,
    headers,
    body: json !== undefined ? JSON.stringify(json) : rest.body,
  })
  const data = await parseJsonSafe(res)
  if (!res.ok) {
    if (res.status === 401 && !path.includes('auth')) {
      localStorage.removeItem('@Auth:token')
      window.location.href = '/login'
    }
    const msg =
      typeof data === 'object' && data !== null && 'error' in data
        ? String((data as { error: unknown }).error)
        : typeof data === 'object' && data !== null && 'message' in data
          ? String((data as { message: unknown }).message)
          : res.statusText
    throw new ApiError(msg || 'Erro na requisição', res.status, data)
  }
  return data as T
}

export async function apiFormData<T>(
  path: string,
  formData: FormData,
  method = 'POST'
): Promise<T> {
  const base = getApiBase()
  const url = `${base}${path.startsWith('/') ? '' : '/'}${path}`
  const token = localStorage.getItem('@Auth:token')
  const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {}
  const res = await fetch(url, { method, headers, body: formData })
  const data = await parseJsonSafe(res)
  if (!res.ok) {
    if (res.status === 401 && !path.includes('auth')) {
      localStorage.removeItem('@Auth:token')
      window.location.href = '/login'
    }
    const msg =
      typeof data === 'object' && data !== null && 'error' in data
        ? String((data as { error: unknown }).error)
        : typeof data === 'object' && data !== null && 'message' in data
          ? String((data as { message: unknown }).message)
          : res.statusText
    throw new ApiError(msg || 'Erro no envio', res.status, data)
  }
  return data as T
}
