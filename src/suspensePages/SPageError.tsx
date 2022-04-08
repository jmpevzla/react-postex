import { lazy } from 'react'
import SuspenseComp from '@/components/SuspenseComp'
const PageError = lazy(() => import('@/pages/PageError'))

export default SPageError

function SPageError(props: { error: string }) {
  return (
    <SuspenseComp>
      <PageError {...props} />
    </SuspenseComp>
  )
}