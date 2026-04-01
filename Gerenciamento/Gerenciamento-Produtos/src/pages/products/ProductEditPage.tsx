import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { imageUrlFromPath } from '../../config/env'
import { useReferenceLists } from '../../hooks/useReferenceLists'
import { productService } from '../../services/productService'
import { imageService } from '../../services/imageService'
import { ApiError } from '../../services/api'
import { AlertBanner } from '../../components/ui/AlertBanner'
import { Button } from '../../components/ui/Button'
import { Spinner } from '../../components/ui/Spinner'
import { ConfirmModal } from '../../components/ui/ConfirmModal'
import { toast } from 'react-toastify'
import { ImageUploader } from '../../components/ui/ImageUploader'
import type { ProductDetail } from '../../types/product'
import type { ProductImageRow } from '../../types/image'

type FormState = {
  titulo: string
  descricao: string
  id_categoria: string
  id_marca: string
  id_modelo: string
  id_veiculo: string
  ano: string
  codigo: string
  data_entrada: string
  anuncio_ml: string
  valor_original: string
  valor_ml: string
  valor_venda: string
  destaque: boolean
}

function productToForm(p: ProductDetail): FormState {
  return {
    titulo: p.titulo ?? '',
    descricao: p.descricao ?? '',
    id_categoria: String(p.id_categoria),
    id_marca: String(p.id_marca),
    id_modelo: String(p.id_modelo),
    id_veiculo: String(p.id_veiculo),
    ano: String(p.ano ?? ''),
    codigo: p.codigo ?? '',
    data_entrada: p.data_entrada ? String(p.data_entrada) : '',
    anuncio_ml: p.anuncio_ml ?? '',
    valor_original: String(p.valor_original ?? ''),
    valor_ml: p.valor_ml != null ? String(p.valor_ml) : '',
    valor_venda: p.valor_venda != null ? String(p.valor_venda) : '',
    destaque: Boolean(p.destaque),
  }
}

export default function ProductEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const productId = Number(id)

  const { categories, marks, models, vehicles, loading: refLoading } = useReferenceLists()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [initial, setInitial] = useState<FormState | null>(null)
  const [form, setForm] = useState<FormState | null>(null)
  const [saving, setSaving] = useState(false)

  const [images, setImages] = useState<ProductImageRow[]>([])
  const [imgLoading, setImgLoading] = useState(false)
  const [uploadFiles, setUploadFiles] = useState<File[]>([])
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean
    img: ProductImageRow | null
    action: 'activate' | 'deactivate'
    loading: boolean
  }>({ isOpen: false, img: null, action: 'activate', loading: false })

  const loadProduct = useCallback(async () => {
    if (!Number.isFinite(productId) || productId < 1) {
      setError('ID inválido')
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const { product: p } = await productService.getById(productId)
      const f = productToForm(p)
      setInitial(f)
      setForm(f)
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Erro ao carregar produto')
    } finally {
      setLoading(false)
    }
  }, [productId])

  const loadImages = useCallback(async () => {
    if (!Number.isFinite(productId) || productId < 1) return
    setImgLoading(true)
    try {
      const list = await imageService.listByProduct(productId)
      setImages(list)
    } catch {
      setImages([])
    } finally {
      setImgLoading(false)
    }
  }, [productId])

  useEffect(() => {
    void loadProduct()
  }, [loadProduct])

  useEffect(() => {
    void loadImages()
  }, [loadImages])

  const patch = useMemo(() => {
    if (!initial || !form) return {}
    const out: Record<string, string | number | boolean | null> = {}
    const num = (s: string) => Number(s)
    if (form.titulo !== initial.titulo) out.titulo = form.titulo
    if (form.descricao !== initial.descricao) out.descricao = form.descricao
    if (form.id_categoria !== initial.id_categoria) out.id_categoria = num(form.id_categoria)
    if (form.id_marca !== initial.id_marca) out.id_marca = num(form.id_marca)
    if (form.id_modelo !== initial.id_modelo) out.id_modelo = num(form.id_modelo)
    if (form.id_veiculo !== initial.id_veiculo) out.id_veiculo = num(form.id_veiculo)
    if (form.ano !== initial.ano) out.ano = num(form.ano)
    if (form.codigo !== initial.codigo) out.codigo = form.codigo
    if (form.data_entrada !== initial.data_entrada) out.data_entrada = form.data_entrada
    if (form.anuncio_ml !== initial.anuncio_ml) out.anuncio_ml = form.anuncio_ml
    if (form.valor_original !== initial.valor_original) out.valor_original = form.valor_original
    if (form.valor_ml !== initial.valor_ml)
      out.valor_ml = form.valor_ml.trim() === '' ? null : form.valor_ml
    if (form.valor_venda !== initial.valor_venda)
      out.valor_venda = form.valor_venda.trim() === '' ? null : form.valor_venda
    if (form.destaque !== initial.destaque) out.destaque = form.destaque
    return out
  }, [initial, form])

  const saveProduct = async () => {
    if (!form || Object.keys(patch).length === 0) return
    setSaving(true)
    setError(null)
    try {
      await productService.update(productId, patch)
      await loadProduct()
      toast.success('Produto atualizado com sucesso!')
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : 'Erro ao atualizar')
    } finally {
      setSaving(false)
    }
  }

  const uploadNewImages = async () => {
    if (uploadFiles.length === 0) return
    setSaving(true)
    setError(null)
    try {
      await imageService.upload(productId, uploadFiles)
      setUploadFiles([])
      await loadImages()
      toast.success('Novas imagens enviadas com sucesso!')
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : 'Erro no upload')
    } finally {
      setSaving(false)
    }
  }

  const handleConfirmAction = async () => {
    const { action, img } = confirmModal
    if (!img) return
    setConfirmModal((prev) => ({ ...prev, loading: true }))
    try {
      if (action === 'activate') {
        await imageService.activate(img.id)
        toast.success('Imagem ativada com sucesso!')
      } else {
        await imageService.deactivate(img.id)
        toast.success('Imagem desativada com sucesso!')
      }
      await loadImages()
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : 'Erro na imagem')
    } finally {
      setConfirmModal({ isOpen: false, img: null, action: 'activate', loading: false })
    }
  }

  const activeCategories = categories.filter((c) => !c.delete_logic)
  const activeMarks = marks.filter((m) => !m.delete_logic)
  const activeModels = models.filter((m) => !m.delete_logic)
  const activeVehicles = vehicles.filter((v) => !v.delete_logic)

  if (loading) {
    return <Spinner label="Carregando produto…" />
  }

  if (!form) {
    return error ? (
      <>
        <AlertBanner variant="error">{error}</AlertBanner>
        <Button variant="secondary" onClick={() => navigate('/produtos')}>
          Voltar
        </Button>
      </>
    ) : null
  }

  return (
    <>
      <h1 className="ui-page-title">Editar produto</h1>
      <p className="ui-page-desc">#{productId} — alterações parciais só ao salvar.</p>

      {error ? (
        <AlertBanner variant="error" onDismiss={() => setError(null)}>
          {error}
        </AlertBanner>
      ) : null}

      <div className="ui-card">
        <h3 style={{ margin: '0 0 1rem', fontSize: '1rem' }}>Dados</h3>
        {refLoading ? (
          <Spinner />
        ) : (
          <>
            <div className="ui-field">
              <label htmlFor="e-titulo">Título</label>
              <input
                id="e-titulo"
                className="ui-input"
                value={form.titulo}
                onChange={(e) => setForm({ ...form, titulo: e.target.value })}
              />
            </div>
            <div className="ui-field">
              <label htmlFor="e-desc">Descrição</label>
              <textarea
                id="e-desc"
                className="ui-textarea"
                value={form.descricao}
                onChange={(e) => setForm({ ...form, descricao: e.target.value })}
              />
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                gap: '0.75rem',
              }}
            >
              <div className="ui-field" style={{ marginBottom: 0 }}>
                <label htmlFor="e-cat">Categoria</label>
                <select
                  id="e-cat"
                  className="ui-select"
                  value={form.id_categoria}
                  onChange={(e) => setForm({ ...form, id_categoria: e.target.value })}
                >
                  {activeCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nome_categoria}
                    </option>
                  ))}
                </select>
              </div>
              <div className="ui-field" style={{ marginBottom: 0 }}>
                <label htmlFor="e-marca">Marca</label>
                <select
                  id="e-marca"
                  className="ui-select"
                  value={form.id_marca}
                  onChange={(e) => setForm({ ...form, id_marca: e.target.value })}
                >
                  {activeMarks.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.marca}
                    </option>
                  ))}
                </select>
              </div>
              <div className="ui-field" style={{ marginBottom: 0 }}>
                <label htmlFor="e-mod">Modelo</label>
                <select
                  id="e-mod"
                  className="ui-select"
                  value={form.id_modelo}
                  onChange={(e) => setForm({ ...form, id_modelo: e.target.value })}
                >
                  {activeModels.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.modelo}
                    </option>
                  ))}
                </select>
              </div>
              <div className="ui-field" style={{ marginBottom: 0 }}>
                <label htmlFor="e-vei">Veículo</label>
                <select
                  id="e-vei"
                  className="ui-select"
                  value={form.id_veiculo}
                  onChange={(e) => setForm({ ...form, id_veiculo: e.target.value })}
                >
                  {activeVehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.veiculo}
                    </option>
                  ))}
                </select>
              </div>
              <div className="ui-field" style={{ marginBottom: 0 }}>
                <label htmlFor="e-ano">Ano</label>
                <input
                  id="e-ano"
                  className="ui-input"
                  type="number"
                  value={form.ano}
                  onChange={(e) => setForm({ ...form, ano: e.target.value })}
                />
              </div>
              <div className="ui-field" style={{ marginBottom: 0 }}>
                <label htmlFor="e-cod">Código</label>
                <input
                  id="e-cod"
                  className="ui-input"
                  value={form.codigo}
                  onChange={(e) => setForm({ ...form, codigo: e.target.value })}
                />
              </div>
              <div className="ui-field" style={{ marginBottom: 0 }}>
                <label htmlFor="e-de">Data entrada</label>
                <input
                  id="e-de"
                  className="ui-input"
                  value={form.data_entrada}
                  onChange={(e) => setForm({ ...form, data_entrada: e.target.value })}
                />
              </div>
              <div className="ui-field" style={{ marginBottom: 0 }}>
                <label htmlFor="e-ml">Anúncio ML</label>
                <input
                  id="e-ml"
                  className="ui-input"
                  value={form.anuncio_ml}
                  onChange={(e) => setForm({ ...form, anuncio_ml: e.target.value })}
                />
              </div>
              <div className="ui-field" style={{ marginBottom: 0 }}>
                <label htmlFor="e-vo">Valor original</label>
                <input
                  id="e-vo"
                  className="ui-input"
                  value={form.valor_original}
                  onChange={(e) => setForm({ ...form, valor_original: e.target.value })}
                />
              </div>
              <div className="ui-field" style={{ marginBottom: 0 }}>
                <label htmlFor="e-vml">Valor ML</label>
                <input
                  id="e-vml"
                  className="ui-input"
                  value={form.valor_ml}
                  onChange={(e) => setForm({ ...form, valor_ml: e.target.value })}
                />
              </div>
              <div className="ui-field" style={{ marginBottom: 0 }}>
                <label htmlFor="e-vv">Valor venda</label>
                <input
                  id="e-vv"
                  className="ui-input"
                  value={form.valor_venda}
                  onChange={(e) => setForm({ ...form, valor_venda: e.target.value })}
                />
              </div>
            </div>
            <div className="ui-field">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={form.destaque}
                  onChange={(e) => setForm({ ...form, destaque: e.target.checked })}
                />
                Destaque
              </label>
            </div>
            <div className="ui-toolbar">
              <Button
                variant="primary"
                disabled={saving || Object.keys(patch).length === 0}
                onClick={() => void saveProduct()}
              >
                {saving ? 'Salvando…' : 'Salvar alterações'}
              </Button>
              <Button variant="secondary" onClick={() => navigate('/produtos')}>
                Voltar à lista
              </Button>
            </div>
          </>
        )}
      </div>

      <div className="ui-card">
        <h3 style={{ margin: '0 0 1rem', fontSize: '1rem' }}>Imagens</h3>
        {imgLoading ? (
          <Spinner label="Carregando imagens…" />
        ) : (
          <div className="ui-table-wrap">
            <table className="ui-table">
              <thead>
                <tr>
                  <th>Preview</th>
                  <th>Caminho</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {images.map((img) => (
                  <tr key={img.id}>
                    <td>
                      <img
                        className="ui-thumb"
                        src={imageUrlFromPath(img.caminho_image)}
                        alt=""
                        loading="lazy"
                      />
                    </td>
                    <td style={{ fontSize: '0.8rem', wordBreak: 'break-all' }}>
                      {img.caminho_image}
                    </td>
                    <td>
                      {img.delete_logic ? (
                        <span className="ui-badge ui-badge--off">Inativa</span>
                      ) : (
                        <span className="ui-badge ui-badge--ok">Ativa</span>
                      )}
                    </td>
                    <td>
                      {img.delete_logic ? (
                        <Button variant="secondary" onClick={() => setConfirmModal({ isOpen: true, action: 'activate', img, loading: false })}>
                          Ativar
                        </Button>
                      ) : (
                        <Button variant="danger" onClick={() => setConfirmModal({ isOpen: true, action: 'deactivate', img, loading: false })}>
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
        <div className="ui-field" style={{ marginTop: '1rem' }}>
          <label>Adicionar novas imagens</label>
          <ImageUploader
            files={uploadFiles}
            onChange={setUploadFiles}
          />
        </div>
        <Button
          variant="secondary"
          disabled={uploadFiles.length === 0 || saving}
          onClick={() => void uploadNewImages()}
        >
          Enviar novas imagens
        </Button>
      </div>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        loading={confirmModal.loading}
        title={confirmModal.action === 'activate' ? 'Ativar Imagem' : 'Desativar Imagem'}
        message={`Deseja realmente ${confirmModal.action === 'activate' ? 'ativar' : 'desativar'} esta imagem?`}
        onConfirm={handleConfirmAction}
        onCancel={() => setConfirmModal({ isOpen: false, img: null, action: 'activate', loading: false })}
      />
    </>
  )
}
