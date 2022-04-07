import { lazy } from 'react'
import SuspenseComp from '@/components/SuspenseComp'
const Login = lazy(() => import('@/pages/Login'))

export default SLogin

function SLogin() {
  return (
    <SuspenseComp>
      <Login />
    </SuspenseComp>
  )
}
