import type { ButtonHTMLAttributes } from 'react'
import './ui.css'

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost'

export function Button({
  variant = 'primary',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      type="button"
      className={`ui-btn ui-btn--${variant} ${className}`.trim()}
      {...props}
    />
  )
}
