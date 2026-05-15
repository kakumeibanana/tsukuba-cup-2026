import Hero from '../components/Hero.jsx'
import TodayStatus from '../components/TodayStatus.jsx'
import UpcomingSchedule from '../components/UpcomingSchedule.jsx'
import RecentResults from '../components/RecentResults.jsx'
import GroupRanking from '../components/GroupRanking.jsx'
import NewsList from '../components/NewsList.jsx'
import AboutCard from '../components/AboutCard.jsx'

export default function Home() {
  return (
    <main className="page">
      <Hero />
      <div className="body-grid">
        <div className="col">
          <TodayStatus />
          <UpcomingSchedule />
          <RecentResults />
        </div>
        <div className="col" id="ranking">
          <GroupRanking />
          <NewsList />
          <AboutCard />
        </div>
      </div>
    </main>
  )
}
