import { useState, useRef, useEffect } from 'react'

interface ImageUploaderProps {
  files: File[]
  onChange: (files: File[]) => void
  maxFiles?: number
}

export function ImageUploader({ files, onChange, maxFiles = 10 }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  
  const [previews, setPreviews] = useState<string[]>([])

  useEffect(() => {
    // Generate previews when files change
    const newPreviews = files.map((file) => URL.createObjectURL(file))
    setPreviews(newPreviews)

    // Cleanup object URLs on unmount or when files change
    return () => {
      newPreviews.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [files])

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files))
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files))
    }
  }

  const handleFiles = (newFiles: File[]) => {
    // Filter only images
    const imageFiles = newFiles.filter((file) => file.type.startsWith('image/'))
    
    // Check max files limit
    const combinedFiles = [...files, ...imageFiles]
    if (combinedFiles.length > maxFiles) {
      alert(`Você pode enviar no máximo ${maxFiles} imagens.`)
      onChange(combinedFiles.slice(0, maxFiles))
    } else {
      onChange(combinedFiles)
    }
  }

  const removeFile = (index: number) => {
    const newFiles = [...files]
    newFiles.splice(index, 1)
    onChange(newFiles)
  }

  return (
    <div className="ui-image-uploader">
      <div
        className={`ui-dropzone ${isDragging ? 'ui-dropzone--active' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        style={{
          border: `2px dashed ${isDragging ? '#3b82f6' : 'rgba(255, 255, 255, 0.2)'}`,
          backgroundColor: isDragging ? 'rgba(59, 130, 246, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
          padding: '2rem',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s',
          marginTop: '0.5rem',
          marginBottom: '1rem'
        }}
      >
        <input
          type="file"
          ref={inputRef}
          style={{ display: 'none' }}
          accept="image/*"
          multiple
          onChange={handleFileInput}
        />
        <div style={{ color: '#e8edf4', fontSize: '1.2rem', marginBottom: '0.5rem' }}>
          Arraste e solte suas imagens aqui
        </div>
        <div style={{ color: '#999', fontSize: '0.9rem' }}>
          ou clique para selecionar arquivos
        </div>
      </div>

      {files.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          {previews.map((previewUrl, index) => (
            <div
              key={previewUrl}
              style={{
                position: 'relative',
                width: '120px',
                height: '120px',
                borderRadius: '8px',
                overflow: 'hidden',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backgroundColor: 'rgba(0,0,0,0.2)'
              }}
            >
              <img
                src={previewUrl}
                alt={`Preview ${index}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  removeFile(index)
                }}
                title="Remover imagem"
                style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  backgroundColor: 'rgba(220, 38, 38, 0.9)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  lineHeight: 1
                }}
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
