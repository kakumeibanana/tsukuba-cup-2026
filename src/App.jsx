import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import ScrollAnimator from './components/ScrollAnimator.jsx'
import Home from './pages/Home.jsx'
import Matches from './pages/Matches.jsx'
import Standings from './pages/Standings.jsx'
import Teams from './pages/Teams.jsx'
import TeamDetail from './pages/TeamDetail.jsx'
import About from './pages/About.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <ScrollAnimator />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/standings" element={<Standings />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/teams/:id" element={<TeamDetail />} />
        <Route path="/about" element={<About />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}
