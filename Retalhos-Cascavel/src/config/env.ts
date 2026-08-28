const trimSlash = (s: string) => s.replace(/\/+$/, '')

export function getApiBase(): string {
  // Se estiver no domínio de produção, força a URL de produção
  if (
    window.location.hostname === 'retalhoscascavel.com.br' ||
    window.location.hostname === 'www.retalhoscascavel.com.br' ||
    window.location.hostname === 'app.retalhoscascavel.com.br'
  ) {
    return 'https://retalhoscascavel.com.br/api/retalhos.cascavel'
  }

  if (import.meta.env.PROD) {
    return 'https://retalhoscascavel.com.br/api/retalhos.cascavel'
  }

  const raw = import.meta.env.VITE_API_BASE_URL?.trim() || 'http://localhost:8080/retalhos.cascavel'

  return trimSlash(raw)
}

export function imageUrlFromPath(caminho_image: string): string {
  if (!caminho_image) return ''
  if (caminho_image.startsWith('http')) return caminho_image
  return `${getApiBase()}${caminho_image.startsWith('/') ? '' : '/'}${caminho_image}`
}

export function getGAMeasurementId(): string {
  const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim()
  return gaId || 'G-56MJNN0GL0'
}


