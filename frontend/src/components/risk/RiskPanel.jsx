import { useState } from 'react'
import { analyzeRisk } from '../../services/api'
import useDocumentStore from '../../store/useDocumentStore'

export default function RiskPanel() {
  const [result,  setResult]  = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)
  const { documentId, documentName, setActiveTab } = useDocumentStore()

  const handleAnalyze = async () => {
    setLoading(true)
    setError(null)
    setResult('')
    try {
      const res = await analyzeRisk(documentId)
      setResult(res.data.result)
    } catch (err) {
      setError(err.response?.data?.detail || 'Risk analysis failed.')
    } finally {
      setLoading(false)
    }
  }

  const renderResult = (text) => {
    return text.split('\n').map((line, i) => {
      let color = 'var(--text-primary)'
      let bg    = 'transparent'
      if (line.includes('🔴'))                   { color = 'var(--risk-high)';   bg = 'rgba(224,85,85,0.07)'  }
      else if (line.includes('🟡'))              { color = 'var(--risk-medium)'; bg = 'rgba(224,154,48,0.07)' }
      else if (line.includes('🟢'))              { color = 'var(--risk-low)';    bg = 'rgba(76,175,130,0.07)' }
      else if (line.includes('OVERALL RISK SCORE')) { color = 'var(--gold)'; bg = 'var(--gold-dim)' }
      return (
        <div key={i} style={{
          padding: bg !== 'transparent' ? '6px 12px' : '2px 0',
          background: bg, borderRadius: '4px', color,
          fontFamily: 'var(--font-mono)', fontSize: '0.85rem', lineHeight: 1.8,
        }}>
          {line || '\u00A0'}
        </div>
      )
    })
  }

  // No document uploaded state
  if (!documentId) {
    return (
      <div className="fade-in" style={{ maxWidth: '780px', margin: '0 auto', paddingTop: '40px' }}>
        <div className="section-eyebrow">
          Risk Analysis
        </div>
        <h2 className="section-title" style={{ fontSize: '2.15rem', marginBottom: '24px' }}>
          Clause Risk Scanner
        </h2>
        <div style={{
          padding:      '40px',
          background:   'var(--bg-card)',
          border:       '1px dashed var(--border-light)',
          borderRadius: '12px',
          textAlign:    'center',
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '16px' }}>⚠</div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.8 }}>
            Upload a document first to scan for risky clauses,<br/>
            unfair terms, and legal red flags with severity ratings.
          </p>
          <button
            onClick={() => setActiveTab('upload')}
            style={{
              padding:     '10px 28px',
              background:  'var(--risk-high)',
              border:      'none',
              borderRadius:'8px',
              color:       '#fff',
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
          Risk Analysis
        </div>
        <h2 className="section-title" style={{ fontSize: '2.15rem' }}>
          Clause Risk Scanner
        </h2>
        <p className="section-subtitle" style={{ fontSize: '1rem' }}>
          Automatically detect risky, unfair, or unusual clauses with severity ratings and recommendations.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {[
          { color: 'var(--risk-high)',   label: 'High Risk'   },
          { color: 'var(--risk-medium)', label: 'Medium Risk' },
          { color: 'var(--risk-low)',    label: 'Notable'     },
        ].map(({ color, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: color }}/>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{label}</span>
          </div>
        ))}
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
        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)',
          fontFamily: 'var(--font-mono)' }}>
          📄 {documentName}
        </div>
        <button
          onClick={handleAnalyze}
          disabled={loading}
          style={{
            padding:     '10px 28px',
            background:  loading ? 'var(--bg-hover)' : 'var(--risk-high)',
            border:      'none',
            borderRadius:'8px',
            color:       loading ? 'var(--text-muted)' : '#fff',
            cursor:      loading ? 'not-allowed' : 'pointer',
            fontWeight:  600,
            fontSize:    '0.9rem',
            transition:  'var(--transition)',
          }}
        >
          {loading ? 'Scanning...' : '⚠ Scan for Risks'}
        </button>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '48px',
          color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '12px' }} className="pulse">⚠</div>
          Scanning clauses · Identifying risks · Generating recommendations...
        </div>
      )}

      {error && (
        <div style={{ padding: '14px 18px', background: 'rgba(224,85,85,0.1)',
          border: '1px solid rgba(224,85,85,0.3)', borderRadius: '8px',
          color: 'var(--risk-high)', fontSize: '0.88rem', marginBottom: '16px' }}>
          ⚠ {error}
        </div>
      )}

      {result && (
        <div className="fade-in surface" style={{
          padding: '24px', background: 'var(--bg-card)',
          borderRadius: '12px',
        }}>
          <div style={{ fontSize: '10px', color: 'var(--gold)', fontFamily: 'var(--font-mono)',
            letterSpacing: '3px', marginBottom: '16px' }}>
            RISK REPORT · LLAMA 3.3 · 70B
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {renderResult(result)}
          </div>
        </div>
      )}
    </div>
  )
}