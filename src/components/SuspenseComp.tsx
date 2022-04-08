import React, { Suspense } from "react";
import Loading from '@/pages/Loading'

export default SuspenseComp

function SuspenseComp({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<Loading />}>
      { children }
    </Suspense>
  )
}