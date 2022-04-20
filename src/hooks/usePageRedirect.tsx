import { useEffect, useState } from "react"
import { useLocation } from "wouter"

export default usePageRedirect

function usePageRedirect(url: string, time: number = 5000) {
  const [, setLocation] = useLocation()
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const step = 10000 * 0.11 / time

    const timeout = setTimeout(() => {
      setLocation(url)
    }, time)

    const interval = setInterval(() => {
      setProgress((value) => value + step)
    }, 1000)

    return () => {
      clearTimeout(timeout)
      clearInterval(interval)
    }
  }, [])

  return [progress]
}