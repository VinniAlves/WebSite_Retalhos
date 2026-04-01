import { Button } from './Button'
import { Spinner } from './Spinner'

export function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  loading = false,
}: {
  isOpen: boolean
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
  loading?: boolean
}) {
  if (!isOpen) return null

  return (
    <div className="ui-modal-backdrop" role="presentation">
      <div
        className="ui-modal"
        role="dialog"
        aria-modal
        style={{ maxWidth: 400 }}
      >
        <h2 className="ui-modal__title">{title}</h2>
        <p style={{ margin: '0 0 1.5rem', opacity: 0.85 }}>{message}</p>
        
        <div className="ui-modal__actions" style={{ justifyContent: 'flex-end', gap: '0.75rem' }}>
          <Button variant="secondary" onClick={onCancel} disabled={loading}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={onConfirm} disabled={loading}>
            {loading ? <Spinner label="Carregando…" /> : 'Confirmar'}
          </Button>
        </div>
      </div>
    </div>
  )
}
