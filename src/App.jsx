import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { SessionProvider } from './context/SessionContext'
import Home from './pages/Home'
import SessionPage from './pages/SessionPage'
import HistoryPage from './pages/HistoryPage'
import SessionReviewPage from './pages/SessionReviewPage'
import CongratsPage from './pages/CongratsPage'

export default function App() {
  return (
    <BrowserRouter>
      <SessionProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/session" element={<SessionPage />} />
          <Route path="/congrats" element={<CongratsPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/history/:id" element={<SessionReviewPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </SessionProvider>
    </BrowserRouter>
  )
}
