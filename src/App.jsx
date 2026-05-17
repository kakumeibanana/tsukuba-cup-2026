import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import ScrollAnimator from './components/ScrollAnimator.jsx'
import Home from './pages/Home.jsx'
import Matches from './pages/Matches.jsx'
import Standings from './pages/Standings.jsx'
import Teams from './pages/Teams.jsx'
import TeamDetail from './pages/TeamDetail.jsx'
import About from './pages/About.jsx'
import AdminLayout from './pages/admin/AdminLayout.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* 管理画面（ヘッダー・フッターなし） */}
          <Route path="/admin/*" element={<AdminLayout />} />

          {/* 公開ページ */}
          <Route path="*" element={
            <>
              <ScrollAnimator />
              <Header />
              <Routes>
                <Route path="/"          element={<Home />} />
                <Route path="/matches"   element={<Matches />} />
                <Route path="/standings" element={<Standings />} />
                <Route path="/teams"     element={<Teams />} />
                <Route path="/teams/:id" element={<TeamDetail />} />
                <Route path="/about"     element={<About />} />
              </Routes>
              <Footer />
            </>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
