import { lazy } from 'react'
import SuspenseComp from '@/components/SuspenseComp'
const Unauthorizated = lazy(() => import('@/pages/Unauthorizated'))

export default SUnauthorizated

function SUnauthorizated() {
  return (
    <SuspenseComp>
      <Unauthorizated />
    </SuspenseComp>
  )
}