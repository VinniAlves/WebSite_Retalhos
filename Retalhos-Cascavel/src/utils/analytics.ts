import { getGAMeasurementId } from '../config/env'

let isInitialized = false

export function initGA(idOverride?: string): boolean {
  if (typeof window === 'undefined') return false

  const measurementId = idOverride || getGAMeasurementId()
  if (!measurementId) {
    return false
  }

  if (isInitialized) {
    return true
  }


  window.dataLayer = window.dataLayer || []
  if (!window.gtag) {
    window.gtag = function () {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer?.push(arguments)
    }
  }


  const scriptId = 'google-analytics-gtag'
  if (!document.getElementById(scriptId)) {
    const script = document.createElement('script')
    script.id = scriptId
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`
    document.head.appendChild(script)
  }

  window.gtag('js', new Date())
  window.gtag('config', measurementId, {
    send_page_view: false,
  })

  isInitialized = true
  return true
}


export function trackPageView(path: string, title?: string) {
  const measurementId = getGAMeasurementId()
  if (!measurementId || !window.gtag) return

  window.gtag('config', measurementId, {
    page_path: path,
    page_title: title || document.title,
  })
}

/**
 * @param eventName Nome do evento (ex: 'click_whatsapp', 'view_product', 'search')
 * @param params Parâmetros adicionais do evento
 */
export function trackEvent(eventName: string, params?: Record<string, any>) {
  if (!window.gtag) return
  window.gtag('event', eventName, params || {})
}
