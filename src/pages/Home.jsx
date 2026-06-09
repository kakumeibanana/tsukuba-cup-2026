import HeroGallery from '../components/HeroGallery.jsx'
import Hero from '../components/Hero.jsx'
import TodayStatus from '../components/TodayStatus.jsx'
import UpcomingSchedule from '../components/UpcomingSchedule.jsx'
import RecentResults from '../components/RecentResults.jsx'
import GroupRanking from '../components/GroupRanking.jsx'
import NewsList from '../components/NewsList.jsx'
import AboutCard from '../components/AboutCard.jsx'

export default function Home() {
  return (
    <>
      <HeroGallery />
      <main className="page">
        <Hero />
        <div className="anim-up"><TodayStatus /></div>
        <div className="anim-up anim-d1"><RecentResults /></div>
        <div className="anim-up anim-d2"><GroupRanking /></div>
        <div className="anim-up anim-d3"><UpcomingSchedule /></div>
        <div className="anim-up anim-d4"><NewsList /></div>
        <div className="anim-up anim-d5"><AboutCard /></div>
      </main>
    </>
  )
}
