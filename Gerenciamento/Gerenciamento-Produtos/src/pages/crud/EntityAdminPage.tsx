import { useCallback, useEffect, useMemo, useState } from 'react'
import { AlertBanner } from '../../components/ui/AlertBanner'
import { Button } from '../../components/ui/Button'
import { Spinner } from '../../components/ui/Spinner'
import { ConfirmModal } from '../../components/ui/ConfirmModal'
import { ApiError } from '../../services/api'
import { toast } from 'react-toastify'

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
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean
    id: number | null
    action: 'activate' | 'deactivate'
    loading: boolean
  }>({ isOpen: false, id: null, action: 'activate', loading: false })

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
      if (modal === 'create') {
        await config.create(form)
        toast.success(`${config.title} criado com sucesso!`)
      } else if (modal === 'edit' && editing) {
        await config.update(editing.id, form)
        toast.success(`${config.title} atualizado com sucesso!`)
      }
      closeModal()
      await refresh()
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : 'Não foi possível salvar')
    } finally {
      setSaving(false)
    }
  }

  const handleConfirmAction = async () => {
    const { action, id } = confirmModal
    if (id === null) return
    setConfirmModal((prev) => ({ ...prev, loading: true }))
    try {
      if (action === 'activate') {
        await config.activate(id)
        toast.success('Registro ativado com sucesso!')
      } else {
        await config.deactivate(id)
        toast.success('Registro desativado com sucesso!')
      }
      await refresh()
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : `Erro ao ${action === 'activate' ? 'ativar' : 'desativar'}`)
    } finally {
      setConfirmModal({ isOpen: false, id: null, action: 'activate', loading: false })
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
                        <Button variant="secondary" onClick={() => setConfirmModal({ isOpen: true, action: 'activate', id: row.id, loading: false })}>
                          Ativar
                        </Button>
                      ) : (
                        <Button variant="danger" onClick={() => setConfirmModal({ isOpen: true, action: 'deactivate', id: row.id, loading: false })}>
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
        <div className="ui-modal-backdrop" role="presentation">
          <div
            className="ui-modal"
            role="dialog"
            aria-modal
            aria-labelledby="entity-modal-title"
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

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        loading={confirmModal.loading}
        title={confirmModal.action === 'activate' ? 'Ativar Registro' : 'Desativar Registro'}
        message={`Deseja realmente ${confirmModal.action === 'activate' ? 'ativar' : 'desativar'} este registro?`}
        onConfirm={handleConfirmAction}
        onCancel={() => setConfirmModal({ isOpen: false, id: null, action: 'activate', loading: false })}
      />
    </>
  )
}
