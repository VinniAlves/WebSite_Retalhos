import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import './AdminLayout.css'

const nav = [
  { to: '/produtos', label: 'Produtos' },
  { to: '/categorias', label: 'Categorias' },
  { to: '/marcas', label: 'Marcas' },
  { to: '/modelos', label: 'Modelos' },
  { to: '/veiculos', label: 'Veículos' },
]

export default function AdminLayout() {
  const [open, setOpen] = useState(false)

  return (
    <div className="admin-shell">
      <button
        type="button"
        className="admin-nav-toggle"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        Menu
      </button>
      <aside className={`admin-sidebar ${open ? 'admin-sidebar--open' : ''}`}>
        <div className="admin-brand">
          <span className="admin-brand__title">Retalhos Cascavel</span>
          <span className="admin-brand__sub">Gerenciamento</span>
        </div>
        <nav className="admin-nav">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `admin-nav__link${isActive ? ' admin-nav__link--active' : ''}`
              }
              onClick={() => setOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="admin-main">
        <Outlet />
      </div>
    </div>
  )
}
