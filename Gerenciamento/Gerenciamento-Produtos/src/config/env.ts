const trimSlash = (s: string) => s.replace(/\/+$/, '')

export function getApiBase(): string {
  const raw =
    import.meta.env.VITE_API_BASE_URL?.trim() ||
    (import.meta.env.DEV ? '' : 'http://localhost:8080/retalhos.cascavel')
  if (!raw) {
    return trimSlash(`${window.location.origin}/retalhos.cascavel`)
  }
  return trimSlash(raw)
}

export function imageUrlFromPath(caminho_image: string): string {
  if (!caminho_image) return ''
  if (caminho_image.startsWith('http')) return caminho_image
  return `${getApiBase()}${caminho_image.startsWith('/') ? '' : '/'}${caminho_image}`
}
