import useDocumentStore from '../../store/useDocumentStore'

const TABS = [
  { id: 'upload',   icon: '↑', label: 'Upload Document' },
  { id: 'qa',       icon: '◎', label: 'Document Q&A'    },
  { id: 'summary',  icon: '≡', label: 'Summarize'       },
  { id: 'risk',     icon: '⚠', label: 'Risk Analysis'   },
  { id: 'drafting', icon: '✦', label: 'Legal Drafting'  },  // moved to bottom
]

export default function Sidebar() {
  const { activeTab, setActiveTab } = useDocumentStore()

  return (
    <aside style={{
      width:         'var(--sidebar-width)',
      background:    'var(--bg-secondary)',
      borderRight:   '1px solid var(--border)',
      display:       'flex',
      flexDirection: 'column',
      padding:       '20px 12px',
      gap:           '4px',
      flexShrink:    0,
    }}>

      <div style={{ padding: '8px 12px 16px', fontSize: '0.7rem',
        letterSpacing: '3px', color: 'var(--text-muted)',
        textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
        Features
      </div>

      {TABS.map(tab => {
        const isActive = activeTab === tab.id

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display:     'flex',
              alignItems:  'center',
              gap:         '12px',
              padding:     '11px 14px',
              borderRadius:'8px',
              border:      'none',
              background:  isActive ? 'var(--gold-dim)' : 'transparent',
              color:       isActive  ? 'var(--gold)' : 'var(--text-secondary)',
              cursor:      'pointer',
              textAlign:   'left',
              width:       '100%',
              transition:  'var(--transition)',
              borderLeft:  isActive ? '2px solid var(--gold)' : '2px solid transparent',
            }}
            onMouseOver={e => { if (!isActive) e.currentTarget.style.background = 'var(--bg-hover)' }}
            onMouseOut={e  => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
          >
            <span style={{ fontSize: '16px', width: '20px',
              textAlign: 'center', flexShrink: 0 }}>
              {tab.icon}
            </span>
            <span style={{ fontSize: '0.88rem', fontWeight: isActive ? 500 : 400 }}>
              {tab.label}
            </span>
          </button>
        )
      })}

      {/* Bottom info */}
      <div style={{ marginTop: 'auto', padding: '16px 14px 8px',
        borderTop: '1px solid var(--border)' }}>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)',
          fontFamily: 'var(--font-mono)', lineHeight: 2 }}>
          <div>Model: llama-3.3-70b</div>
          <div>RAG: FAISS · MiniLM</div>
          <div style={{ color: 'var(--risk-low)' }}>● Backend connected</div>
        </div>
      </div>
    </aside>
  )
}