import { lazy } from 'react'
import SuspenseComp from '@/components/SuspenseComp'
const About = lazy(() => import('@/pages/About'))

export default SAbout

function SAbout() {
  return (
    <SuspenseComp>
      <About />
    </SuspenseComp>
  )
}
