import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Home      from './pages/Home'
import NotFound  from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route path="/"          element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="*"          element={<NotFound />} />
    </Routes>
  )
}