import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useReferenceLists } from '../../hooks/useReferenceLists'
import { productService } from '../../services/productService'
import { imageService } from '../../services/imageService'
import { ApiError } from '../../services/api'
import { AlertBanner } from '../../components/ui/AlertBanner'
import { Button } from '../../components/ui/Button'
import { Spinner } from '../../components/ui/Spinner'
import { toast } from 'react-toastify'
import { ImageUploader } from '../../components/ui/ImageUploader'

export default function ProductWizardPage() {
  const navigate = useNavigate()
  const { categories, marks, models, vehicles, loading: refLoading, error: refError } =
    useReferenceLists()

  const [step, setStep] = useState<1 | 2>(1)
  const [createdId, setCreatedId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const [titulo, setTitulo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [id_categoria, setIdCategoria] = useState('')
  const [id_marca, setIdMarca] = useState('')
  const [id_modelo, setIdModelo] = useState('')
  const [id_veiculo, setIdVeiculo] = useState('')
  const [ano, setAno] = useState(String(new Date().getFullYear()))
  const [codigo, setCodigo] = useState('')
  const [data_entrada, setDataEntrada] = useState('')
  const [anuncio_ml, setAnuncioMl] = useState('')
  const [valor_original, setValorOriginal] = useState('')
  const [destaque, setDestaque] = useState(false)

  const [files, setFiles] = useState<File[]>([])

  const activeCategories = categories.filter((c) => !c.delete_logic)
  const activeMarks = marks.filter((m) => !m.delete_logic)
  const activeModels = models.filter((m) => !m.delete_logic)
  const activeVehicles = vehicles.filter((v) => !v.delete_logic)

  const submitStep1 = async () => {
    setSaving(true)
    setError(null)
    try {
      const payload = {
        id_categoria: Number(id_categoria),
        id_marca: Number(id_marca),
        id_modelo: Number(id_modelo),
        id_veiculo: Number(id_veiculo),
        titulo,
        descricao,
        ano: Number(ano),
        codigo,
        data_entrada,
        anuncio_ml,
        valor_original,
        valor_ml: null,
        destaque,
      }

      if (createdId) {
        await productService.update(createdId, payload)
        setStep(2)
        toast.success('Produto atualizado com sucesso!')
      } else {
        const res = await productService.create({
          ...payload,
          data_venda: null,
        })
        setCreatedId(res.id)
        setStep(2)
        toast.success('Produto criado com sucesso!')
      }
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : 'Erro ao salvar produto')
    } finally {
      setSaving(false)
    }
  }

  const submitStep2 = async () => {
    if (createdId == null) return
    setSaving(true)
    setError(null)
    try {
      if (files.length > 0) {
        await imageService.upload(createdId, files)
        toast.success('Imagens enviadas com sucesso!')
      }
      navigate('/produtos')
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : 'Erro ao enviar imagens')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <h1 className="ui-page-title">Novo produto</h1>
      <p className="ui-page-desc">
        Etapa {step} de 2 — {step === 1 ? 'dados cadastrais' : 'imagens'}
      </p>

      <div className="ui-card" style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <span
            className={`ui-badge ${step === 1 ? 'ui-badge--ok' : ''}`}
            style={step === 1 ? {} : { opacity: 0.5 }}
          >
            1 · Dados
          </span>
          <span
            className={`ui-badge ${step === 2 ? 'ui-badge--ok' : ''}`}
            style={step === 2 ? {} : { opacity: 0.5 }}
          >
            2 · Imagens
          </span>
        </div>
      </div>

      {(error || refError) && (
        <AlertBanner variant="error" onDismiss={() => setError(null)}>
          {error || refError}
        </AlertBanner>
      )}

      {refLoading ? (
        <Spinner />
      ) : step === 1 ? (
        <div className="ui-card">
          <div className="ui-field">
            <label htmlFor="w-titulo">Título *</label>
            <input
              id="w-titulo"
              className="ui-input"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
          </div>
          <div className="ui-field">
            <label htmlFor="w-desc">Descrição</label>
            <textarea
              id="w-desc"
              className="ui-textarea"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
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
              <label htmlFor="w-cat">Categoria *</label>
              <select
                id="w-cat"
                className="ui-select"
                value={id_categoria}
                onChange={(e) => setIdCategoria(e.target.value)}
              >
                <option value="">Selecione</option>
                {activeCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome_categoria}
                  </option>
                ))}
              </select>
            </div>
            <div className="ui-field" style={{ marginBottom: 0 }}>
              <label htmlFor="w-marca">Marca *</label>
              <select
                id="w-marca"
                className="ui-select"
                value={id_marca}
                onChange={(e) => setIdMarca(e.target.value)}
              >
                <option value="">Selecione</option>
                {activeMarks.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.marca}
                  </option>
                ))}
              </select>
            </div>
            <div className="ui-field" style={{ marginBottom: 0 }}>
              <label htmlFor="w-mod">Modelo *</label>
              <select
                id="w-mod"
                className="ui-select"
                value={id_modelo}
                onChange={(e) => setIdModelo(e.target.value)}
              >
                <option value="">Selecione</option>
                {activeModels.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.modelo}
                  </option>
                ))}
              </select>
            </div>
            <div className="ui-field" style={{ marginBottom: 0 }}>
              <label htmlFor="w-vei">Veículo *</label>
              <select
                id="w-vei"
                className="ui-select"
                value={id_veiculo}
                onChange={(e) => setIdVeiculo(e.target.value)}
              >
                <option value="">Selecione</option>
                {activeVehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.veiculo}
                  </option>
                ))}
              </select>
            </div>
            <div className="ui-field" style={{ marginBottom: 0 }}>
              <label htmlFor="w-ano">Ano</label>
              <input
                id="w-ano"
                className="ui-input"
                type="number"
                value={ano}
                onChange={(e) => setAno(e.target.value)}
              />
            </div>
            <div className="ui-field" style={{ marginBottom: 0 }}>
              <label htmlFor="w-cod">Código</label>
              <input
                id="w-cod"
                className="ui-input"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
              />
            </div>
            <div className="ui-field" style={{ marginBottom: 0 }}>
              <label htmlFor="w-de">Data entrada (DD-MM-AAAA)</label>
              <input
                id="w-de"
                className="ui-input"
                placeholder="10-10-2026"
                value={data_entrada}
                onChange={(e) => setDataEntrada(e.target.value)}
              />
            </div>
            <div className="ui-field" style={{ marginBottom: 0 }}>
              <label htmlFor="w-ml">Anúncio ML (URL)</label>
              <input
                id="w-ml"
                className="ui-input"
                value={anuncio_ml}
                onChange={(e) => setAnuncioMl(e.target.value)}
              />
            </div>
            <div className="ui-field" style={{ marginBottom: 0 }}>
              <label htmlFor="w-val">Valor original</label>
              <input
                id="w-val"
                className="ui-input"
                placeholder="150.00"
                value={valor_original}
                onChange={(e) => setValorOriginal(e.target.value)}
              />
            </div>
          </div>
          <div className="ui-field">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                checked={destaque}
                onChange={(e) => setDestaque(e.target.checked)}
              />
              Destaque
            </label>
          </div>
          <div className="ui-toolbar">
            <Button variant="secondary" onClick={() => navigate('/produtos')} disabled={saving}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              disabled={
                saving ||
                !id_categoria ||
                !id_marca ||
                !id_modelo ||
                !id_veiculo ||
                !titulo.trim()
              }
              onClick={() => void submitStep1()}
            >
              {saving ? 'Salvando…' : 'Salvar e continuar'}
            </Button>
          </div>
        </div>
      ) : (
        <div className="ui-card">
          <p style={{ marginTop: 0, opacity: 0.85 }}>
            Produto #{createdId}. Envie uma ou mais imagens (ou pule para finalizar sem imagens).
          </p>
          <div className="ui-field">
            <label>Imagens</label>
            <ImageUploader
              files={files}
              onChange={setFiles}
            />
          </div>
          <div className="ui-toolbar">
            <Button variant="secondary" onClick={() => setStep(1)} disabled={saving}>
              Voltar
            </Button>
            <Button variant="primary" onClick={() => void submitStep2()} disabled={saving}>
              {saving ? 'Enviando…' : 'Concluir'}
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
