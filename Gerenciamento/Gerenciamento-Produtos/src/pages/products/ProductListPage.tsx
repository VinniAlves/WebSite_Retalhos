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
import type { ProductListRow } from '../../types/product'

function parseNumList(s: string): number[] {
  if (!s.trim()) return []
  return s
    .split(',')
    .map((x) => Number(x.trim()))
    .filter((n) => !Number.isNaN(n))
}

function MultiIdField({
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
  return (
    <div className="ui-field" style={{ marginBottom: 0 }}>
      <label>{label}</label>
      <input
        className="ui-input"
        placeholder="IDs separados por vírgula (ex: 1, 2)"
        value={value.length ? value.join(', ') : ''}
        onChange={(e) => onChange(parseNumList(e.target.value))}
      />
      <select
        className="ui-select"
        multiple
        size={4}
        value={value.map(String)}
        onChange={(e) => {
          const selected = Array.from(e.target.selectedOptions).map((o) => Number(o.value))
          onChange(selected)
        }}
        aria-label={label}
      >
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {optionLabel(o)}
            {o.inactive ? ' (inativo)' : ''}
          </option>
        ))}
      </select>
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
  const [actionError, setActionError] = useState<string | null>(null)

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
  }, [load])

  const onDeactivate = async (row: ProductListRow) => {
    if (!window.confirm(`Desativar o produto "${row.titulo || row.codigo}"?`)) return
    setActionError(null)
    try {
      await productService.deactivate(row.id)
      await load()
    } catch (e) {
      setActionError(e instanceof ApiError ? e.message : 'Erro ao desativar')
    }
  }

  const onActivate = async (row: ProductListRow) => {
    setActionError(null)
    try {
      await productService.activate(row.id)
      await load()
    } catch (e) {
      setActionError(e instanceof ApiError ? e.message : 'Erro ao ativar')
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

      {(error || actionError) && (
        <AlertBanner
          variant="error"
          onDismiss={() => {
            setError(null)
            setActionError(null)
          }}
        >
          {error || actionError}
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
            onChange={(e) => {
              setSearchText(e.target.value)
              setPage(1)
            }}
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
              onChange={(e) => {
                setDestaque(e.target.value)
                setPage(1)
              }}
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
              onChange={(e) => {
                setMinPrice(e.target.value)
                setPage(1)
              }}
              placeholder="1000.00"
            />
          </div>
          <div className="ui-field" style={{ marginBottom: 0 }}>
            <label htmlFor="maxp">Preço máx.</label>
            <input
              id="maxp"
              className="ui-input"
              value={maxPrice}
              onChange={(e) => {
                setMaxPrice(e.target.value)
                setPage(1)
              }}
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
            <MultiIdField
              label="Categorias (IDs)"
              value={categoria}
              onChange={(v) => {
                setCategoria(v)
                setPage(1)
              }}
              options={categories.map((c) => ({
                id: c.id,
                inactive: Boolean(c.delete_logic),
              }))}
              optionLabel={(o) => {
                const c = categories.find((x) => x.id === o.id)
                return c ? c.nome_categoria : String(o.id)
              }}
            />
            <MultiIdField
              label="Marcas (IDs)"
              value={marca}
              onChange={(v) => {
                setMarca(v)
                setPage(1)
              }}
              options={marks.map((m) => ({ id: m.id, inactive: Boolean(m.delete_logic) }))}
              optionLabel={(o) => {
                const m = marks.find((x) => x.id === o.id)
                return m ? m.marca : String(o.id)
              }}
            />
            <MultiIdField
              label="Modelos (IDs)"
              value={modelo}
              onChange={(v) => {
                setModelo(v)
                setPage(1)
              }}
              options={models.map((m) => ({ id: m.id, inactive: Boolean(m.delete_logic) }))}
              optionLabel={(o) => {
                const m = models.find((x) => x.id === o.id)
                return m ? m.modelo : String(o.id)
              }}
            />
            <MultiIdField
              label="Veículos (IDs)"
              value={veiculo}
              onChange={(v) => {
                setVeiculo(v)
                setPage(1)
              }}
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
                  <th>Destaque</th>
                  <th>Status</th>
                  <th>Relações</th>
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
                      <td>{row.destaque ? 'Sim' : 'Não'}</td>
                      <td>
                        {inactive ? (
                          <span className="ui-badge ui-badge--off">Inativo</span>
                        ) : (
                          <span className="ui-badge ui-badge--ok">Ativo</span>
                        )}
                      </td>
                      <td style={{ fontSize: '0.8rem', maxWidth: 200 }}>
                        {row.nome_categoria} · {row.marca} · {row.modelo} · {row.veiculo}
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
                          <Button variant="secondary" type="button" onClick={() => onActivate(row)}>
                            Ativar
                          </Button>
                        ) : (
                          <Button variant="danger" type="button" onClick={() => onDeactivate(row)}>
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
    </>
  )
}
