import { Outlet } from 'react-router-dom'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import ScrollAnimator from './ScrollAnimator.jsx'

export default function PublicLayout() {
  return (
    <>
      <ScrollAnimator />
      <Header />
      <Outlet />
      <Footer />
    </>
  )
}
