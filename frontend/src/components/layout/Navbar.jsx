import { useNavigate } from 'react-router-dom'
import useDocumentStore from '../../store/useDocumentStore'

export default function Navbar() {
  const navigate = useNavigate()
  const { documentName, clearDocument } = useDocumentStore()

  return (
    <nav style={{
      height:          'var(--navbar-height)',
      background:      'var(--bg-secondary)',
      borderBottom:    '1px solid var(--border)',
      display:         'flex',
      alignItems:      'center',
      justifyContent:  'space-between',
      padding:         '0 28px',
      position:        'sticky',
      top:             0,
      zIndex:          100,
    }}>

      {/* Logo */}
      <div
        onClick={() => navigate('/')}
        style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
      >
        <div style={{
          width: '30px', height: '30px',
          background: 'var(--gold)',
          borderRadius: '6px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-display)', fontWeight: 700,
          color: '#0f0f0f', fontSize: '16px'
        }}>L</div>
        <span style={{
          fontFamily:  'var(--font-display)',
          fontWeight:  600,
          fontSize:    '1.1rem',
          color:       'var(--text-primary)',
          letterSpacing: '0.02em'
        }}>
          NextGenLegal
        </span>
      </div>

      {/* Active document pill */}
      {documentName && (
        <div style={{
          display:      'flex',
          alignItems:   'center',
          gap:          '10px',
          background:   'var(--bg-card)',
          border:       '1px solid var(--border-light)',
          borderRadius: '100px',
          padding:      '5px 14px 5px 10px',
          maxWidth:     '340px',
        }}>
          <div style={{
            width: '7px', height: '7px',
            borderRadius: '50%',
            background: 'var(--risk-low)',
            flexShrink: 0
          }}/>
          <span style={{
            fontSize:     '0.78rem',
            color:        'var(--text-secondary)',
            fontFamily:   'var(--font-mono)',
            overflow:     'hidden',
            textOverflow: 'ellipsis',
            whiteSpace:   'nowrap',
          }}>
            {documentName}
          </span>
          <button
            onClick={clearDocument}
            style={{
              background: 'none', border: 'none',
              color: 'var(--text-muted)', cursor: 'pointer',
              fontSize: '14px', lineHeight: 1, padding: '0 0 0 4px',
              flexShrink: 0
            }}
            title="Remove document"
          >✕</button>
        </div>
      )}

      {/* Right side */}
      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)',
        fontFamily: 'var(--font-mono)' }}>
        Llama 3.3 · 70B
      </div>
    </nav>
  )
}