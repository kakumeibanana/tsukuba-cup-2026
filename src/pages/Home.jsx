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
          <div className="anim-up"><TodayStatus /></div>
          <div className="anim-up anim-d1"><UpcomingSchedule /></div>
          <div className="anim-up anim-d2"><RecentResults /></div>
        </div>
        <div className="col" id="ranking">
          <div className="anim-up anim-d1"><NewsList /></div>
          <div className="anim-up anim-d2"><GroupRanking /></div>
          <div className="anim-up anim-d3"><AboutCard /></div>
        </div>
      </div>
    </main>
  )
}
