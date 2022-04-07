import { lazy } from 'react'
import SuspenseComp from '@/components/SuspenseComp'
const Notfound = lazy(() => import('@/pages/Notfound'))

export default SNotfound

function SNotfound() {
  return (
    <SuspenseComp>
      <Notfound />
    </SuspenseComp>
  )
}
