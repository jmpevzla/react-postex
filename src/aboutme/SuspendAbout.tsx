import { lazy, Suspense } from 'react'
const AboutMe = lazy(() => import('@/aboutme/AboutMe'))

function SuspendAbout() {
  return (
    <Suspense fallback={<div>loading...</div>}>
      <AboutMe />
    </Suspense>    
  )
}

export default SuspendAbout