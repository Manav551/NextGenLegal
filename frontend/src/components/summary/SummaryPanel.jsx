import { useState } from 'react'
import { summarizeDocument } from '../../services/api'
import useDocumentStore from '../../store/useDocumentStore'

export default function SummaryPanel() {
  const [summary, setSummary] = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)
  const { documentId, documentName, wordCount, pageCount, setActiveTab } = useDocumentStore()

  const handleSummarize = async () => {
    setLoading(true)
    setError(null)
    setSummary('')
    try {
      const res = await summarizeDocument(documentId)
      setSummary(res.data.result)
    } catch (err) {
      setError(err.response?.data?.detail || 'Summarization failed.')
    } finally {
      setLoading(false)
    }
  }

  // No document uploaded state
  if (!documentId) {
    return (
      <div className="fade-in" style={{ maxWidth: '780px', margin: '0 auto', paddingTop: '40px' }}>
        <div className="section-eyebrow">
          Summarization
        </div>
        <h2 className="section-title" style={{ fontSize: '2.15rem', marginBottom: '24px' }}>
          Document Summary
        </h2>
        <div style={{
          padding:      '40px',
          background:   'var(--bg-card)',
          border:       '1px dashed var(--border-light)',
          borderRadius: '12px',
          textAlign:    'center',
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '16px' }}>≡</div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.8 }}>
            Upload a document first to generate a structured legal summary<br/>
            covering parties, obligations, key clauses, and risk areas.
          </p>
          <button
            onClick={() => setActiveTab('upload')}
            style={{
              padding:     '10px 28px',
              background:  'var(--gold)',
              border:      'none',
              borderRadius:'8px',
              color:       '#0f0f0f',
              cursor:      'pointer',
              fontWeight:  600,
              fontSize:    '0.9rem',
            }}
          >
            ↑ Upload a Document
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fade-in" style={{ maxWidth: '780px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px' }}>
        <div className="section-eyebrow">
          Summarization
        </div>
        <h2 className="section-title" style={{ fontSize: '2.15rem' }}>
          Document Summary
        </h2>
        <p className="section-subtitle" style={{ fontSize: '1rem' }}>
          Generate a structured legal summary covering parties, obligations, key clauses, and risks.
        </p>
      </div>

      <div style={{
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'space-between',
        padding:        '16px 20px',
        background:     'var(--bg-card)',
        border:         '1px solid var(--border)',
        borderRadius:   '10px',
        marginBottom:   '24px',
        flexWrap:       'wrap',
        gap:            '12px',
      }}>
        <div>
          <div style={{ fontSize: '0.88rem', fontWeight: 500, marginBottom: '4px' }}>
            {documentName}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)' }}>
            {wordCount?.toLocaleString()} words · {pageCount} pages
          </div>
        </div>
        <button
          onClick={handleSummarize}
          disabled={loading}
          style={{
            padding:     '10px 28px',
            background:  loading ? 'var(--bg-hover)' : 'var(--gold)',
            border:      'none',
            borderRadius:'8px',
            color:       loading ? 'var(--text-muted)' : '#0f0f0f',
            cursor:      loading ? 'not-allowed' : 'pointer',
            fontWeight:  600,
            fontSize:    '0.9rem',
            transition:  'var(--transition)',
          }}
        >
          {loading ? 'Analyzing...' : '≡ Generate Summary'}
        </button>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '48px',
          color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '12px' }} className="pulse">⚖</div>
          Reading document · Identifying key clauses · Drafting summary...
        </div>
      )}

      {error && (
        <div style={{ padding: '14px 18px', background: 'rgba(224,85,85,0.1)',
          border: '1px solid rgba(224,85,85,0.3)', borderRadius: '8px',
          color: 'var(--risk-high)', fontSize: '0.88rem' }}>
          ⚠ {error}
        </div>
      )}

      {summary && (
        <div className="fade-in surface" style={{
          padding:      '28px',
          borderRadius: '12px',
          whiteSpace:   'pre-wrap',
          lineHeight:   1.9,
          fontSize:     '0.92rem',
        }}>
          <div style={{ fontSize: '10px', color: 'var(--gold)', fontFamily: 'var(--font-mono)',
            letterSpacing: '3px', marginBottom: '16px' }}>
            SUMMARY · LLAMA 3.3 · 70B
          </div>
          {summary}
        </div>
      )}
    </div>
  )
}