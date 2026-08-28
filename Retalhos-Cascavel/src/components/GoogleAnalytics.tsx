import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { initGA, trackPageView } from '../utils/analytics'

export function GoogleAnalytics() {
  const location = useLocation()

  useEffect(() => {
    initGA()
  }, [])

  useEffect(() => {
    const fullPath = location.pathname + location.search
    trackPageView(fullPath)
  }, [location])

  return null
}

export default GoogleAnalytics
