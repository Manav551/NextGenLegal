import { useNavigate } from 'react-router-dom'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
      <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--gold)', fontSize: '4rem' }}>404</div>
      <p style={{ color: 'var(--text-secondary)' }}>Page not found.</p>
      <button onClick={() => navigate('/')} style={{
        padding: '10px 24px', background: 'transparent',
        border: '1px solid var(--border-light)', color: 'var(--text-primary)',
        borderRadius: '8px', cursor: 'pointer', fontFamily: 'var(--font-body)'
      }}>Go Home</button>
    </div>
  )
}