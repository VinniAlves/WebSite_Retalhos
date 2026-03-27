import './ui.css'

export function Spinner({ label }: { label?: string }) {
  return (
    <div className="ui-spinner-wrap" role="status">
      <span className="ui-spinner" aria-hidden />
      {label ? <span className="ui-spinner__label">{label}</span> : null}
    </div>
  )
}
