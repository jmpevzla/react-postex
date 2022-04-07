import { lazy } from 'react'
import SuspenseComp from '@/components/SuspenseComp'
const Home = lazy(() => import('@/pages/Home'))

export default SHome

function SHome() {
  return (
    <SuspenseComp>
      <Home />
    </SuspenseComp>
  )
}
