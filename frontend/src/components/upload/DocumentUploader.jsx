import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useNavigate } from 'react-router-dom'
import { uploadDocument } from '../../services/api'
import useDocumentStore from '../../store/useDocumentStore'

export default function DocumentUploader() {
  const [uploading, setUploading] = useState(false)
  const [error, setError]         = useState(null)
  const { setDocument, setActiveTab } = useDocumentStore()
  const navigate = useNavigate()

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0]
    if (!file) return

    setUploading(true)
    setError(null)

    try {
      const res = await uploadDocument(file)
      setDocument(res.data)
      setActiveTab('qa')        // auto-switch to Q&A after upload
    } catch (err) {
      setError(err.response?.data?.detail || 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf':                                          ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
    disabled: uploading,
  })

  return (
    <div className="fade-in" style={{ maxWidth: '620px', margin: '0 auto', paddingTop: '40px' }}>

      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div className="section-eyebrow">
          Step 1
        </div>
        <h2 className="section-title" style={{ fontSize: '2.25rem' }}>
          Upload Your Document
        </h2>
        <p className="section-subtitle" style={{ fontSize: '1.03rem' }}>
          Upload a PDF or DOCX file. It will be parsed, indexed, and ready for analysis instantly.
        </p>
      </div>

      {/* Drop Zone */}
      <div
        {...getRootProps()}
        style={{
          border:        `2px dashed ${isDragActive ? 'var(--gold)' : 'var(--border-light)'}`,
          borderRadius:  '16px',
          padding:       '60px 40px',
          textAlign:     'center',
          cursor:        uploading ? 'not-allowed' : 'pointer',
          background:    isDragActive ? 'var(--gold-dim)' : 'linear-gradient(180deg, rgba(255,255,255,0.02), transparent 35%), var(--bg-card)',
          transition:    'all 0.2s ease',
          outline:       'none',
        }}
      >
        <input {...getInputProps()} />

        {uploading ? (
          <div>
            <div style={{ fontSize: '2.5rem', marginBottom: '16px' }} className="pulse">⚖</div>
            <p style={{ color: 'var(--gold)', fontFamily: 'var(--font-mono)',
              fontSize: '0.9rem' }}>Parsing & indexing document...</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '8px' }}>
              Extracting text · Building RAG index · Preparing AI
            </p>
          </div>
        ) : isDragActive ? (
          <div>
            <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>📂</div>
            <p style={{ color: 'var(--gold)', fontSize: '1rem' }}>Drop to upload</p>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>📄</div>
            <p style={{ color: 'var(--text-primary)', fontSize: '1rem',
              marginBottom: '8px', fontWeight: 500 }}>
              Drag & drop your document here
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem',
              marginBottom: '20px' }}>
              or click to browse files
            </p>
            <span style={{
              padding:      '8px 20px',
              border:       '1px solid var(--border-light)',
              borderRadius: '100px',
              fontSize:     '0.78rem',
              color:        'var(--text-secondary)',
              fontFamily:   'var(--font-mono)',
            }}>
              PDF · DOCX · Max 20MB
            </span>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div style={{
          marginTop:    '16px',
          padding:      '14px 18px',
          background:   'rgba(224, 85, 85, 0.1)',
          border:       '1px solid rgba(224, 85, 85, 0.3)',
          borderRadius: '8px',
          color:        'var(--risk-high)',
          fontSize:     '0.88rem',
        }}>
          ⚠ {error}
        </div>
      )}

      {/* Info cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px',
        marginTop: '32px' }}>
        {[
          { icon: '◎', title: 'Document Q&A',    desc: 'Ask anything about your document' },
          { icon: '≡', title: 'Summarization',   desc: 'Instant structured legal summary'  },
          { icon: '✦', title: 'Legal Drafting',  desc: 'Generate new legal documents'      },
          { icon: '⚠', title: 'Risk Analysis',   desc: 'Scan for risky clauses'            },
        ].map(f => (
          <div key={f.title} className="surface" style={{
            padding:      '16px',
            borderRadius: '10px',
          }}>
            <div style={{ color: 'var(--gold)', marginBottom: '6px', fontSize: '18px' }}>
              {f.icon}
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 500, marginBottom: '4px' }}>
              {f.title}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {f.desc}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}