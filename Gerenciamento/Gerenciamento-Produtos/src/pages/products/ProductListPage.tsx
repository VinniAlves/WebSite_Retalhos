import { useCallback, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { imageUrlFromPath } from '../../config/env'
import { useProducts } from '../../hooks/useProducts'
import { productService } from '../../services/productService'
import { ApiError } from '../../services/api'
import { useReferenceLists } from '../../hooks/useReferenceLists'
import { AlertBanner } from '../../components/ui/AlertBanner'
import { Button } from '../../components/ui/Button'
import { Spinner } from '../../components/ui/Spinner'
import { ConfirmModal } from '../../components/ui/ConfirmModal'
import { toast } from 'react-toastify'
import type { ProductListRow } from '../../types/product'

import { useRef } from 'react'

function MultiSelectField({
  label,
  value,
  onChange,
  options,
  optionLabel,
}: {
  label: string
  value: number[]
  onChange: (v: number[]) => void
  options: { id: number; inactive?: boolean }[]
  optionLabel: (o: { id: number }) => string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedNames = value
    .map((id) => {
      const opt = options.find((o) => o.id === id)
      return opt ? optionLabel(opt) : String(id)
    })
    .join(', ')

  const filteredOptions = options
    .filter((o) => optionLabel(o).toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const aSelected = value.includes(a.id)
      const bSelected = value.includes(b.id)
      if (aSelected && !bSelected) return -1
      if (!aSelected && bSelected) return 1
      return 0
    })

  return (
    <div className="ui-field" style={{ marginBottom: 0, position: 'relative' }} ref={containerRef}>
      <label>{label}</label>
      <input
        className="ui-input"
        placeholder={value.length === 0 ? 'Selecione...' : ''}
        value={isOpen ? search : selectedNames}
        onChange={(e) => setSearch(e.target.value)}
        onFocus={() => {
          setIsOpen(true)
          setSearch('')
        }}
        onClick={() => setIsOpen(true)}
      />
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 10,
            background: '#1a2332',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 8,
            maxHeight: 200,
            overflowY: 'auto',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
            marginTop: 4,
          }}
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((o) => {
              const isSelected = value.includes(o.id)
              return (
                <div
                  key={o.id}
                  onClick={() => {
                    if (isSelected) {
                      onChange(value.filter((v) => v !== o.id))
                    } else {
                      onChange([...value, o.id])
                    }
                  }}
                  style={{
                    padding: '8px 12px',
                    cursor: 'pointer',
                    backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.9rem',
                    color: '#e8edf4'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    readOnly
                    style={{ margin: 0, cursor: 'pointer' }}
                  />
                  <span>
                    {optionLabel(o)} {o.inactive ? <span style={{ opacity: 0.5 }}>(inativo)</span> : ''}
                  </span>
                </div>
              )
            })
          ) : (
            <div style={{ padding: '8px 12px', color: '#999', fontSize: '0.9rem' }}>
              Nenhum item encontrado
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function ProductListPage() {
  const location = useLocation()
  const { data, loading, error, fetchFilter, fetchSearch, setError } = useProducts()
  const { categories, marks, models, vehicles, loading: refLoading } = useReferenceLists()

  const [flash, setFlash] = useState<string | null>(
    (location.state as { flash?: string } | null)?.flash ?? null
  )
  const [searchText, setSearchText] = useState('')
  const [page, setPage] = useState(1)
  const [categoria, setCategoria] = useState<number[]>([])
  const [marca, setMarca] = useState<number[]>([])
  const [modelo, setModelo] = useState<number[]>([])
  const [veiculo, setVeiculo] = useState<number[]>([])
  const [destaque, setDestaque] = useState<string>('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [trigger, setTrigger] = useState(0)
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean
    row: ProductListRow | null
    action: 'activate' | 'deactivate'
    loading: boolean
  }>({ isOpen: false, row: null, action: 'activate', loading: false })

  const load = useCallback(async () => {
    const p = page
    if (searchText.trim()) {
      await fetchSearch({ search: searchText.trim(), page: p })
    } else {
      const body: Parameters<typeof fetchFilter>[0] = {
        page: p,
        categoria: categoria.length ? categoria : undefined,
        marca: marca.length ? marca : undefined,
        modelo: modelo.length ? modelo : undefined,
        veiculo: veiculo.length ? veiculo : undefined,
      }
      if (destaque === 'true') body.destaque = true
      if (destaque === 'false') body.destaque = false
      if (minPrice.trim() !== '') body.minPrice = Number(minPrice.replace(',', '.'))
      if (maxPrice.trim() !== '') body.maxPrice = Number(maxPrice.replace(',', '.'))
      await fetchFilter(body)
    }
  }, [
    page,
    searchText,
    categoria,
    marca,
    modelo,
    veiculo,
    destaque,
    minPrice,
    maxPrice,
    fetchFilter,
    fetchSearch,
  ])

  useEffect(() => {
    void load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, trigger])

  const handleConfirmAction = async () => {
    const { action, row } = confirmModal
    if (!row) return
    setConfirmModal((prev) => ({ ...prev, loading: true }))
    try {
      if (action === 'activate') {
        await productService.activate(row.id)
        toast.success(`Produto "${row.titulo || row.codigo}" ativado com sucesso!`)
      } else {
        await productService.deactivate(row.id)
        toast.success(`Produto "${row.titulo || row.codigo}" desativado com sucesso!`)
      }
      await load()
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : `Erro ao ${action === 'activate' ? 'ativar' : 'desativar'}`)
    } finally {
      setConfirmModal({ isOpen: false, row: null, action: 'activate', loading: false })
    }
  }

  const products = data?.products ?? []
  const pagination = data?.pagination

  return (
    <>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: '1rem' }}>
        <div style={{ flex: '1 1 200px' }}>
          <h1 className="ui-page-title">Produtos</h1>
          <p className="ui-page-desc">Listagem, filtros e busca.</p>
        </div>
        <Link
          to="/produtos/novo"
          className="ui-btn ui-btn--primary"
          style={{ alignSelf: 'center', textDecoration: 'none' }}
        >
          Novo produto
        </Link>
      </div>

      {flash ? (
        <AlertBanner variant="success" onDismiss={() => setFlash(null)}>
          {flash}
        </AlertBanner>
      ) : null}

      {error && (
        <AlertBanner variant="error" onDismiss={() => setError(null)}>
          {error}
        </AlertBanner>
      )}

      <div className="ui-card">
        <h3 style={{ margin: '0 0 0.75rem', fontSize: '1rem' }}>Busca e filtros</h3>
        <div className="ui-field" style={{ maxWidth: 400 }}>
          <label htmlFor="prod-search">Busca por texto</label>
          <input
            id="prod-search"
            className="ui-input"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Título, código, marca, modelo…"
          />
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '1rem',
            marginTop: '1rem',
          }}
        >
          <div className="ui-field" style={{ marginBottom: 0 }}>
            <label htmlFor="destaque">Destaque</label>
            <select
              id="destaque"
              className="ui-select"
              value={destaque}
              onChange={(e) => setDestaque(e.target.value)}
              
            >
              <option value="">Todos</option>
              <option value="true">Sim</option>
              <option value="false">Não</option>
            </select>
          </div>
          <div className="ui-field" style={{ marginBottom: 0 }}>
            <label htmlFor="minp">Preço mín.</label>
            <input
              id="minp"
              className="ui-input"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="1000.00"
            />
          </div>
          <div className="ui-field" style={{ marginBottom: 0 }}>
            <label htmlFor="maxp">Preço máx.</label>
            <input
              id="maxp"
              className="ui-input"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="5000.00"
            />
          </div>
        </div>

        {!refLoading ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '1rem',
              marginTop: '1.25rem',
            }}
          >
            <MultiSelectField
              label="Categorias"
              value={categoria}
              onChange={setCategoria}
              options={categories.map((c) => ({
                id: c.id,
                inactive: Boolean(c.delete_logic),
              }))}
              optionLabel={(o) => {
                const c = categories.find((x) => x.id === o.id)
                return c ? c.nome_categoria : String(o.id)
              }}
            />
            <MultiSelectField
              label="Marcas"
              value={marca}
              onChange={setMarca}
              options={marks.map((m) => ({ id: m.id, inactive: Boolean(m.delete_logic) }))}
              optionLabel={(o) => {
                const m = marks.find((x) => x.id === o.id)
                return m ? m.marca : String(o.id)
              }}
            />
            <MultiSelectField
              label="Modelos"
              value={modelo}
              onChange={setModelo}
              options={models.map((m) => ({ id: m.id, inactive: Boolean(m.delete_logic) }))}
              optionLabel={(o) => {
                const m = models.find((x) => x.id === o.id)
                return m ? m.modelo : String(o.id)
              }}
            />
            <MultiSelectField
              label="Veículos"
              value={veiculo}
              onChange={setVeiculo}
              options={vehicles.map((v) => ({ id: v.id, inactive: Boolean(v.delete_logic) }))}
              optionLabel={(o) => {
                const v = vehicles.find((x) => x.id === o.id)
                return v ? v.veiculo : String(o.id)
              }}
            />
          </div>
        ) : (
          <p style={{ opacity: 0.7, marginTop: '1rem' }}>Carregando listas…</p>
        )}

        <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <Button
            variant="secondary"
            onClick={() => {
              setSearchText('')
              setCategoria([])
              setMarca([])
              setModelo([])
              setVeiculo([])
              setDestaque('')
              setMinPrice('')
              setMaxPrice('')
              if (page !== 1) setPage(1)
              else setTrigger((t) => t + 1)
            }}
          >
            Limpar Filtros
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              if (page !== 1) setPage(1)
              else setTrigger((t) => t + 1)
            }}
          >
            Buscar
          </Button>
        </div>
      </div>

      {loading && !data ? (
        <Spinner label="Carregando produtos…" />
      ) : (
        <div className="ui-card" style={{ marginTop: '1rem' }}>
          <div className="ui-table-wrap">
            <table className="ui-table">
              <thead>
                <tr>
                  <th style={{ width: 56 }} />
                  <th>Título</th>
                  <th>Código</th>
                  <th>Preço</th>
                  <th>Marca</th>
                  <th>Categoria</th>
                  <th>Modelo</th>
                  <th>Veículo</th>
                  <th>Destaque</th>
                  <th>Status</th>
                  <th style={{ width: 240 }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {products.map((row) => {
                  const thumb = row.imagens?.[0]
                  const inactive = row.delete_logic === true
                  return (
                    <tr key={row.id}>
                      <td>
                        {thumb ? (
                          <img
                            className="ui-thumb"
                            src={imageUrlFromPath(thumb)}
                            alt=""
                            loading="lazy"
                          />
                        ) : (
                          <div className="ui-thumb" />
                        )}
                      </td>
                      <td>{row.titulo || '—'}</td>
                      <td>{row.codigo}</td>
                      <td>{row.valor_original}</td>
                      
                      <td>{row.marca}</td>
                      <td>{row.nome_categoria}</td>
                      <td>{row.modelo}</td>
                      <td>{row.veiculo}</td>
                      <td>{row.destaque ? 'Sim' : 'Não'}</td>
                      <td>
                        {inactive ? (
                          <span className="ui-badge ui-badge--off">Inativo</span>
                        ) : (
                          <span className="ui-badge ui-badge--ok">Ativo</span>
                        )}
                      </td>
                      
                      <td>
                        <Link
                          to={`/produtos/${row.id}/editar`}
                          className="ui-btn ui-btn--ghost"
                          style={{ textDecoration: 'none', display: 'inline-flex' }}
                        >
                          Editar
                        </Link>
                        {inactive ? (
                          <Button 
                            variant="secondary" 
                            type="button" 
                            onClick={() => setConfirmModal({ isOpen: true, action: 'activate', row, loading: false })}
                          >
                            Ativar
                          </Button>
                        ) : (
                          <Button 
                            variant="danger" 
                            type="button" 
                            onClick={() => setConfirmModal({ isOpen: true, action: 'deactivate', row, loading: false })}
                          >
                            Desativar
                          </Button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {pagination && pagination.totalPages > 1 ? (
            <div className="ui-toolbar" style={{ marginTop: '1rem', marginBottom: 0 }}>
              <Button
                variant="secondary"
                disabled={page <= 1 || loading}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Anterior
              </Button>
              <span style={{ fontSize: '0.875rem', opacity: 0.85 }}>
                Página {pagination.currentPage} de {pagination.totalPages} ({pagination.totalItems}{' '}
                itens)
              </span>
              <Button
                variant="secondary"
                disabled={page >= pagination.totalPages || loading}
                onClick={() => setPage((p) => p + 1)}
              >
                Próxima
              </Button>
            </div>
          ) : null}
        </div>
      )}

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        loading={confirmModal.loading}
        title={confirmModal.action === 'activate' ? 'Ativar Produto' : 'Desativar Produto'}
        message={
          confirmModal.action === 'activate'
            ? `Deseja realmente ativar o produto "${confirmModal.row?.titulo || confirmModal.row?.codigo}"?`
            : `Deseja realmente desativar o produto "${confirmModal.row?.titulo || confirmModal.row?.codigo}"?`
        }
        onConfirm={handleConfirmAction}
        onCancel={() => setConfirmModal({ isOpen: false, row: null, action: 'activate', loading: false })}
      />
    </>
  )
}
