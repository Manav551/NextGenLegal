import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      background: 'radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.08) 0%, transparent 60%)',
    }}>

      <div style={{ textAlign: 'center', maxWidth: '600px' }} className="fade-in">

        <div className="section-eyebrow" style={{ letterSpacing: '4px', marginBottom: '24px' }}>
          AI-Powered Legal Platform
        </div>

        <h1 className="section-title" style={{ fontSize: 'clamp(2.8rem, 6vw, 4.3rem)', marginBottom: '20px' }}>
          Your Legal Documents,<br />
          <span className="gold">Intelligently Analyzed</span>
        </h1>

        <p className="section-subtitle" style={{ fontSize: '1.12rem', marginBottom: '40px', marginInline: 'auto' }}>
          Upload contracts, NDAs, and legal documents. Get instant summaries,
          Q&A, risk analysis, and AI-drafted documents — powered by Llama 3.3.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/dashboard')} style={{
            padding: '14px 36px', background: 'var(--gold)',
            color: '#0f0f0f', border: 'none', borderRadius: '8px',
            fontFamily: 'var(--font-body)', fontWeight: 600,
            fontSize: '1rem', cursor: 'pointer', transition: 'var(--transition)',
          }}
            onMouseOver={e => e.target.style.background = 'var(--gold-light)'}
            onMouseOut={e  => e.target.style.background = 'var(--gold)'}
          >
            Open Dashboard →
          </button>
        </div>

        {/* Feature pills */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center',
          flexWrap: 'wrap', marginTop: '60px' }}>
          {['Document Q&A', 'Summarization', 'Legal Drafting', 'Risk Analysis'].map(f => (
            <span key={f} style={{
              padding: '6px 16px', border: '1px solid var(--border-light)',
              borderRadius: '100px', fontSize: '0.8rem', color: 'var(--text-secondary)',
              fontFamily: 'var(--font-mono)'
            }}>{f}</span>
          ))}
        </div>
      </div>
    </div>
  )
}