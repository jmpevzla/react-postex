import { lazy } from 'react'
import SuspenseComp from '@/components/SuspenseComp'
const Register = lazy(() => import('@/pages/Register'))

export default SRegister

function SRegister() {
  return (
    <SuspenseComp>
      <Register />
    </SuspenseComp>
  )
}
