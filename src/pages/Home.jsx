import Hero from '../components/Hero.jsx'
import AlertBanner from '../components/AlertBanner.jsx'
import TodayMatch from '../components/TodayMatch.jsx'
import UpcomingSchedule from '../components/UpcomingSchedule.jsx'
import RecentResults from '../components/RecentResults.jsx'
import NewsList from '../components/NewsList.jsx'
import GroupRanking from '../components/GroupRanking.jsx'
import TopScorers from '../components/TopScorers.jsx'
import AboutCard from '../components/AboutCard.jsx'

export default function Home() {
  return (
    <main className="page">
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
    </main>
  )
}
