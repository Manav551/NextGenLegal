import { useState } from 'react'
import { draftDocument } from '../../services/api'

const DOC_TYPES = ['NDA', 'Employment Contract', 'Service Agreement',
  'Freelance Contract', 'Partnership Agreement', 'Lease Agreement', 'Custom']

const JURISDICTIONS = ['India', 'United States', 'United Kingdom',
  'European Union', 'Canada', 'Australia', 'General']

export default function DraftingPanel() {
  const [docType,       setDocType]       = useState('NDA')
  const [instructions,  setInstructions]  = useState('')
  const [jurisdiction,  setJurisdiction]  = useState('India')
  const [draft,         setDraft]         = useState('')
  const [loading,       setLoading]       = useState(false)
  const [error,         setError]         = useState(null)

  const selectStyle = {
    padding:     '10px 14px',
    background:  'var(--bg-card)',
    border:      '1px solid var(--border-light)',
    borderRadius:'8px',
    color:       'var(--text-primary)',
    fontFamily:  'var(--font-body)',
    fontSize:    '0.88rem',
    outline:     'none',
    cursor:      'pointer',
    width:       '100%',
  }

  const handleDraft = async () => {
    if (!instructions.trim()) return
    setLoading(true)
    setError(null)
    setDraft('')
    try {
      const res = await draftDocument(docType, instructions, jurisdiction)
      setDraft(res.data.result)
    } catch (err) {
      setError(err.response?.data?.detail || 'Drafting failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fade-in" style={{ maxWidth: '780px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div className="section-eyebrow">
          Legal Drafting
        </div>
        <h2 className="section-title" style={{ fontSize: '2.15rem' }}>
          Draft a Legal Document
        </h2>
        <p className="section-subtitle" style={{ fontSize: '1rem' }}>
          Describe what you need and our AI will generate a complete, properly formatted legal document.
        </p>
      </div>

      {/* Form */}
      <div className="card" style={{ marginBottom: '24px', display: 'flex',
        flexDirection: 'column', gap: '18px' }}>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)', letterSpacing: '1px',
              textTransform: 'uppercase', marginBottom: '8px' }}>
              Document Type
            </label>
            <select value={docType} onChange={e => setDocType(e.target.value)} style={selectStyle}>
              {DOC_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)', letterSpacing: '1px',
              textTransform: 'uppercase', marginBottom: '8px' }}>
              Jurisdiction
            </label>
            <select value={jurisdiction} onChange={e => setJurisdiction(e.target.value)}
              style={selectStyle}>
              {JURISDICTIONS.map(j => <option key={j} value={j}>{j}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)', letterSpacing: '1px',
            textTransform: 'uppercase', marginBottom: '8px' }}>
            Instructions
          </label>
          <textarea
            value={instructions}
            onChange={e => setInstructions(e.target.value)}
            placeholder="e.g. Between Acme Corp (disclosing party) and John Doe (receiving party). Duration: 2 years. Covers software architecture and client data."
            rows={4}
            style={{
              width:       '100%',
              padding:     '12px 16px',
              background:  'var(--bg-secondary)',
              border:      '1px solid var(--border-light)',
              borderRadius:'8px',
              color:       'var(--text-primary)',
              fontFamily:  'var(--font-body)',
              fontSize:    '0.9rem',
              resize:      'vertical',
              outline:     'none',
              lineHeight:  1.6,
            }}
            onFocus={e => e.target.style.borderColor = 'var(--gold)'}
            onBlur={e  => e.target.style.borderColor = 'var(--border-light)'}
          />
        </div>

        <button
          onClick={handleDraft}
          disabled={loading || !instructions.trim()}
          style={{
            padding:     '12px',
            background:  loading || !instructions.trim() ? 'var(--bg-hover)' : 'var(--gold)',
            border:      'none',
            borderRadius:'8px',
            color:       loading || !instructions.trim() ? 'var(--text-muted)' : '#0f0f0f',
            cursor:      loading || !instructions.trim() ? 'not-allowed' : 'pointer',
            fontWeight:  600,
            fontSize:    '0.95rem',
            transition:  'var(--transition)',
          }}
        >
          {loading ? 'Drafting document...' : '✦ Generate Draft'}
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '48px',
          color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '12px' }} className="pulse">✦</div>
          Structuring clauses · Formatting document · Reviewing legality...
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ padding: '14px 18px', background: 'rgba(224,85,85,0.1)',
          border: '1px solid rgba(224,85,85,0.3)', borderRadius: '8px',
          color: 'var(--risk-high)', fontSize: '0.88rem', marginBottom: '16px' }}>
          ⚠ {error}
        </div>
      )}

      {/* Draft output */}
      {draft && (
        <div className="fade-in">
          <div style={{ display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ fontSize: '10px', color: 'var(--gold)',
              fontFamily: 'var(--font-mono)', letterSpacing: '3px' }}>
              DRAFT · {docType.toUpperCase()} · {jurisdiction.toUpperCase()}
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(draft)}
              style={{
                padding:     '6px 14px',
                background:  'transparent',
                border:      '1px solid var(--border-light)',
                borderRadius:'6px',
                color:       'var(--text-secondary)',
                cursor:      'pointer',
                fontSize:    '0.78rem',
                fontFamily:  'var(--font-mono)',
              }}
            >
              Copy
            </button>
          </div>
          <div className="surface" style={{
            padding:    '28px',
            borderRadius:'12px',
            whiteSpace: 'pre-wrap',
            lineHeight: 1.9,
            fontSize:   '0.88rem',
            fontFamily: 'var(--font-mono)',
            color:      'var(--text-primary)',
            maxHeight:  '600px',
            overflowY:  'auto',
          }}>
            {draft}
          </div>
        </div>
      )}
    </div>
  )
}