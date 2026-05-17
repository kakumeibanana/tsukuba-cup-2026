import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import PublicLayout from './components/PublicLayout.jsx'
import Home from './pages/Home.jsx'
import Matches from './pages/Matches.jsx'
import Standings from './pages/Standings.jsx'
import Teams from './pages/Teams.jsx'
import TeamDetail from './pages/TeamDetail.jsx'
import About from './pages/About.jsx'
import AdminLayout from './pages/admin/AdminLayout.jsx'
import AdminMatches from './pages/admin/AdminMatches.jsx'
import AdminNews from './pages/admin/AdminNews.jsx'
import AdminTeams from './pages/admin/AdminTeams.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* 管理画面 */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="matches" replace />} />
            <Route path="matches" element={<AdminMatches />} />
            <Route path="news"    element={<AdminNews />} />
            <Route path="teams"   element={<AdminTeams />} />
          </Route>

          {/* 公開ページ */}
          <Route element={<PublicLayout />}>
            <Route path="/"          element={<Home />} />
            <Route path="/matches"   element={<Matches />} />
            <Route path="/standings" element={<Standings />} />
            <Route path="/teams"     element={<Teams />} />
            <Route path="/teams/:id" element={<TeamDetail />} />
            <Route path="/about"     element={<About />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
