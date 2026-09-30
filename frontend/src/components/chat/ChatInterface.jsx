import { useState, useRef, useEffect } from 'react'
import { askQuestion } from '../../services/api'
import useDocumentStore from '../../store/useDocumentStore'

const SUGGESTIONS = [
  'What are the key obligations of each party?',
  'Are there any termination clauses?',
  'What is the governing law of this agreement?',
  'Explain the confidentiality terms.',
]

export default function ChatInterface() {
  const [messages, setMessages] = useState([])
  const [input, setInput]       = useState('')
  const [loading, setLoading]   = useState(false)
  const bottomRef               = useRef(null)
  const { documentId, documentName } = useDocumentStore()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async (question) => {
    const q = question || input.trim()
    if (!q || loading) return

    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: q }])
    setLoading(true)

    try {
      const res = await askQuestion(q, documentId)
      setMessages(prev => [...prev, { role: 'ai', text: res.data.result }])
    } catch {
      setMessages(prev => [...prev, {
        role: 'ai', text: 'Something went wrong. Please try again.', error: true
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fade-in" style={{
      display:       'flex',
      flexDirection: 'column',
      height:        '100%',
      maxWidth:      '780px',
      margin:        '0 auto',
    }}>

      {/* Header */}
      <div style={{ marginBottom: '24px', flexShrink: 0 }}>
        <div className="section-eyebrow">
          Document Q&A
        </div>
        <h2 className="section-title" style={{ fontSize: '2.2rem', marginBottom: '6px' }}>
          Ask Your Document
        </h2>
        {documentName && (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem',
            fontFamily: 'var(--font-mono)', marginTop: '6px' }}>
            📄 {documentName}
          </p>
        )}
      </div>

      {/* Messages */}
      <div style={{
        flex:       1,
        overflowY:  'auto',
        display:    'flex',
        flexDirection: 'column',
        gap:        '16px',
        paddingBottom: '16px',
        minHeight:  0,
      }}>

        {/* Empty state */}
        {messages.length === 0 && (
          <div style={{ paddingTop: '20px' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem',
              marginBottom: '16px' }}>
              {documentId
                ? 'Ask anything about your document, or a general legal question:'
                : 'No document uploaded — ask any general legal question:'}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => send(s)} style={{
                  padding:     '11px 16px',
                  background:  'var(--bg-card)',
                  border:      '1px solid var(--border)',
                  borderRadius:'8px',
                  color:       'var(--text-secondary)',
                  cursor:      'pointer',
                  textAlign:   'left',
                  fontSize:    '0.88rem',
                  transition:  'var(--transition)',
                }}
                  onMouseOver={e => {
                    e.currentTarget.style.borderColor = 'var(--gold)'
                    e.currentTarget.style.color = 'var(--text-primary)'
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.borderColor = 'var(--border)'
                    e.currentTarget.style.color = 'var(--text-secondary)'
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message bubbles */}
        {messages.map((msg, i) => (
          <div key={i} style={{
            display:       'flex',
            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
          }}>
            <div style={{
              maxWidth:     '80%',
              padding:      '14px 18px',
              borderRadius: msg.role === 'user'
                ? '16px 16px 4px 16px'
                : '16px 16px 16px 4px',
              background:   msg.role === 'user'
                ? 'var(--gold-dim)'
                : 'var(--bg-card)',
              border:       `1px solid ${
                msg.role === 'user'
                  ? 'rgba(201,168,76,0.3)'
                  : msg.error
                  ? 'rgba(224,85,85,0.3)'
                  : 'var(--border)'
              }`,
              color:        msg.error ? 'var(--risk-high)' : 'var(--text-primary)',
              fontSize:     '0.9rem',
              lineHeight:   1.7,
              whiteSpace:   'pre-wrap',
            }}>
              {msg.role === 'ai' && (
                <div style={{ fontSize: '10px', color: 'var(--gold)',
                  fontFamily: 'var(--font-mono)', marginBottom: '8px',
                  letterSpacing: '2px' }}>
                  LEXAI
                </div>
              )}
              {msg.text}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{
              padding: '14px 20px', background: 'var(--bg-card)',
              border: '1px solid var(--border)', borderRadius: '16px 16px 16px 4px',
              display: 'flex', gap: '5px', alignItems: 'center'
            }}>
              {[0,1,2].map(i => (
                <div key={i} style={{
                  width: '7px', height: '7px', borderRadius: '50%',
                  background: 'var(--gold)',
                  animation: 'pulse 1.2s ease-in-out infinite',
                  animationDelay: `${i * 0.2}s`
                }}/>
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{
        flexShrink:  0,
        display:     'flex',
        gap:         '10px',
        paddingTop:  '16px',
        borderTop:   '1px solid var(--border)',
      }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
          placeholder={documentId
            ? 'Ask about your document or any legal question...'
            : 'Ask any legal question...'}
          disabled={loading}
          style={{
            flex:        1,
            padding:     '13px 18px',
            background:  'var(--bg-card)',
            border:      '1px solid var(--border-light)',
            borderRadius:'10px',
            color:       'var(--text-primary)',
            fontFamily:  'var(--font-body)',
            fontSize:    '0.9rem',
            outline:     'none',
            transition:  'border-color 0.2s',
          }}
          onFocus={e  => e.target.style.borderColor = 'var(--gold)'}
          onBlur={e   => e.target.style.borderColor = 'var(--border-light)'}
        />
        <button
          onClick={() => send()}
          disabled={loading || !input.trim()}
          style={{
            padding:     '13px 22px',
            background:  loading || !input.trim() ? 'var(--bg-hover)' : 'var(--gold)',
            border:      'none',
            borderRadius:'10px',
            color:       loading || !input.trim() ? 'var(--text-muted)' : '#0f0f0f',
            cursor:      loading || !input.trim() ? 'not-allowed' : 'pointer',
            fontWeight:  600,
            fontSize:    '1rem',
            transition:  'var(--transition)',
          }}
        >
          →
        </button>
      </div>
    </div>
  )
}