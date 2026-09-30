import Navbar   from '../components/layout/Navbar'
import Sidebar  from '../components/layout/Sidebar'
import useDocumentStore from '../store/useDocumentStore'

// Panel imports — we'll fill these in next phase
import DocumentUploader from '../components/upload/DocumentUploader'
import ChatInterface    from '../components/chat/ChatInterface'
import SummaryPanel     from '../components/summary/SummaryPanel'
import DraftingPanel    from '../components/drafting/DraftingPanel'
import RiskPanel        from '../components/risk/RiskPanel'

export default function Dashboard() {
  const { activeTab } = useDocumentStore()

  const renderPanel = () => {
    switch (activeTab) {
      case 'upload':   return <DocumentUploader />
      case 'qa':       return <ChatInterface />
      case 'summary':  return <SummaryPanel />
      case 'drafting': return <DraftingPanel />
      case 'risk':     return <RiskPanel />
      default:         return <DocumentUploader />
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Navbar />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar />
        <main style={{
          flex:       1,
          overflow:   'auto',
          padding:    '32px',
          background: 'var(--bg-primary)',
        }}>
          {renderPanel()}
        </main>
      </div>
    </div>
  )
}