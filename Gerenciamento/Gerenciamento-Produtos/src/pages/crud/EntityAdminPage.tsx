import { useCallback, useEffect, useMemo, useState } from 'react'
import { AlertBanner } from '../../components/ui/AlertBanner'
import { Button } from '../../components/ui/Button'
import { Spinner } from '../../components/ui/Spinner'
import { ApiError } from '../../services/api'

export interface CrudFieldDef {
  name: string
  label: string
  type?: 'text' | 'textarea'
}

export interface EntityCrudConfig<T extends { id: number; delete_logic?: boolean | null }> {
  title: string
  description: string
  fields: CrudFieldDef[]
  load: () => Promise<T[]>
  rowLabel: (row: T) => string
  rowSearchText: (row: T) => string
  create: (values: Record<string, string>) => Promise<unknown>
  update: (id: number, values: Record<string, string>) => Promise<unknown>
  activate: (id: number) => Promise<unknown>
  deactivate: (id: number) => Promise<unknown>
}

function isInactive(row: { delete_logic?: boolean | null }) {
  return row.delete_logic === true
}

export default function EntityAdminPage<T extends { id: number; delete_logic?: boolean | null }>({
  config,
}: {
  config: EntityCrudConfig<T>
}) {
  const [rows, setRows] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState<'create' | 'edit' | null>(null)
  const [editing, setEditing] = useState<T | null>(null)
  const [form, setForm] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await config.load()
      setRows(data)
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Falha ao carregar lista')
    } finally {
      setLoading(false)
    }
  }, [config])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return rows
    return rows.filter((r) => config.rowSearchText(r).toLowerCase().includes(q))
  }, [rows, search, config])

  const openCreate = () => {
    const init: Record<string, string> = {}
    config.fields.forEach((f) => {
      init[f.name] = ''
    })
    setForm(init)
    setModal('create')
  }

  const openEdit = (row: T) => {
    const init: Record<string, string> = {}
    config.fields.forEach((f) => {
      init[f.name] = String((row as unknown as Record<string, unknown>)[f.name] ?? '')
    })
    setForm(init)
    setEditing(row)
    setModal('edit')
  }

  const closeModal = () => {
    setModal(null)
    setEditing(null)
  }

  const submit = async () => {
    setSaving(true)
    setError(null)
    try {
      if (modal === 'create') await config.create(form)
      else if (modal === 'edit' && editing) await config.update(editing.id, form)
      closeModal()
      await refresh()
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Não foi possível salvar')
    } finally {
      setSaving(false)
    }
  }

  const onActivate = async (id: number) => {
    try {
      await config.activate(id)
      await refresh()
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Erro ao ativar')
    }
  }

  const onDeactivate = async (id: number) => {
    if (!window.confirm('Desativar este registro?')) return
    try {
      await config.deactivate(id)
      await refresh()
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Erro ao desativar')
    }
  }

  return (
    <>
      <h1 className="ui-page-title">{config.title}</h1>
      <p className="ui-page-desc">{config.description}</p>

      {error ? (
        <AlertBanner variant="error" onDismiss={() => setError(null)}>
          {error}
        </AlertBanner>
      ) : null}

      <div className="ui-card">
        <div className="ui-toolbar">
          <input
            className="ui-input"
            style={{ maxWidth: 280 }}
            placeholder="Filtrar na lista…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Filtrar"
          />
          <Button variant="primary" onClick={openCreate}>
            Novo
          </Button>
        </div>

        {loading ? (
          <Spinner label="Carregando…" />
        ) : (
          <div className="ui-table-wrap">
            <table className="ui-table">
              <thead>
                <tr>
                  <th>Nome / identificação</th>
                  <th>Status</th>
                  <th style={{ width: 220 }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr key={row.id}>
                    <td>{config.rowLabel(row)}</td>
                    <td>
                      {isInactive(row) ? (
                          <span className="ui-badge ui-badge--off">Inativo</span>
                        ) : (
                          <span className="ui-badge ui-badge--ok">Ativo</span>
                        )}
                      </td>
                      <td>
                        <Button variant="ghost" onClick={() => openEdit(row)}>
                          Editar
                        </Button>
                        {isInactive(row) ? (
                        <Button variant="secondary" onClick={() => onActivate(row.id)}>
                          Ativar
                        </Button>
                      ) : (
                        <Button variant="danger" onClick={() => onDeactivate(row.id)}>
                          Desativar
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal ? (
        <div className="ui-modal-backdrop" role="presentation" onClick={closeModal}>
          <div
            className="ui-modal"
            role="dialog"
            aria-modal
            aria-labelledby="entity-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="entity-modal-title" className="ui-modal__title">
              {modal === 'create' ? 'Novo registro' : 'Editar registro'}
            </h2>
            {config.fields.map((f) => (
              <div key={f.name} className="ui-field">
                <label htmlFor={`f-${f.name}`}>{f.label}</label>
                {f.type === 'textarea' ? (
                  <textarea
                    id={`f-${f.name}`}
                    className="ui-textarea"
                    value={form[f.name] ?? ''}
                    onChange={(e) => setForm((prev) => ({ ...prev, [f.name]: e.target.value }))}
                  />
                ) : (
                  <input
                    id={`f-${f.name}`}
                    className="ui-input"
                    value={form[f.name] ?? ''}
                    onChange={(e) => setForm((prev) => ({ ...prev, [f.name]: e.target.value }))}
                  />
                )}
              </div>
            ))}
            <div className="ui-modal__actions">
              <Button variant="secondary" onClick={closeModal} disabled={saving}>
                Cancelar
              </Button>
              <Button variant="primary" onClick={() => void submit()} disabled={saving}>
                {saving ? 'Salvando…' : 'Salvar'}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
