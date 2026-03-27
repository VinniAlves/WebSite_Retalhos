import type { ReactNode } from 'react'
import './ui.css'

export function AlertBanner({
  variant = 'error',
  children,
  onDismiss,
}: {
  variant?: 'error' | 'success' | 'info'
  children: ReactNode
  onDismiss?: () => void
}) {
  return (
    <div className={`ui-alert ui-alert--${variant}`} role="alert">
      <span className="ui-alert__text">{children}</span>
      {onDismiss ? (
        <button type="button" className="ui-alert__dismiss" onClick={onDismiss}>
          Fechar
        </button>
      ) : null}
    </div>
  )
}
