const trimSlash = (s: string) => s.replace(/\/+$/, '')

export function getApiBase(): string {
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
