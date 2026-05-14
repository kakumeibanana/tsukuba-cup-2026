import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import AlertBanner from './components/AlertBanner.jsx'
import TodayMatch from './components/TodayMatch.jsx'
import UpcomingSchedule from './components/UpcomingSchedule.jsx'
import RecentResults from './components/RecentResults.jsx'
import NewsList from './components/NewsList.jsx'
import GroupRanking from './components/GroupRanking.jsx'
import TopScorers from './components/TopScorers.jsx'
import AboutCard from './components/AboutCard.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  return (
    <>
      <div className="page">
        <Header />
        <Hero />
        <div className="body-grid">
          <div className="col">
            <AlertBanner />
            <TodayMatch />
            <UpcomingSchedule />
            <RecentResults />
            <NewsList />
          </div>
          <div className="col" id="ranking">
            <GroupRanking />
            <TopScorers />
            <AboutCard />
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
